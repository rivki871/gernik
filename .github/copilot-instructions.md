# Copilot instructions for Gernik (Angular) project

This document is meant to help a coding agent get started in the **Gernik** workspace.  It's a fairly small Angular application with a narrow domain (waiting‑list / loans management) and no existing tests.

---
## Big picture

* Single‑page Angular **18** application.  UI lives under `src/app`; there is no backend code in this repo.
* Core features: maintain a list of people waiting to borrow bags, confirm loans, view active loans and history.
* Communication with a REST API at `https://localhost:44376/api`.  Only two resources are used:
  * `GET/POST/PUT/DELETE /WaitingClients`
  * `GET/POST/PUT /Loans` (history is `GET /Loans/history?name=…&phone=…&address=…`).
* Routing is trivial: `ContentComponent` is the shell, with two child routes (`waitingList` and `loansList`).  Any path redirects to `content`.
* The project is not internationalised; most user‑facing strings are in Hebrew and the date adapter is set to `'he'` in forms.

---
## Directory layout & important files

```
src/app/
  app.module.ts           // imports Angular Material, declares all components
  app-routing.module.ts   // sets up the two routes and default redirect
  app.service.ts          // single HTTP service used everywhere
  messageTypes.enum.ts    // unused enum; probably intended for toast categories
  login/                  // empty login screen, not wired in
  content/
    header/               // small header component (calls getAllLoans)
    chart/                // Chart.js bar chart, currently commented out in routing
    loans-list/           // active‑loans table, end‑loan dialog
    waiting-list/         // waiting list table, confirm/edit/delete dialogs
      confirm-loan/        // reactive form, Toastr for feedback, calls ConfirmLoan()
      edit-loan/           // shared with loans-list (isLoan flag)
      delete-loan/         // simple yes/no dialog
      loan-history/        // shows history in dialog (history passed via data)

```

**Data models** are defined in `content/client.ts` and `content/waitingClient.ts`.  `client` is used for loans, `waitingClient` for entries that have not yet been confirmed.

---
## Conventions & patterns

* **Dialog opening**: components call a shared `openDialog(type: number, element)` method.
  * `type` values are hard‑coded: `1 = confirm/end loan`, `2 = edit`, `3 = delete`.
  * Pass data via `MatDialogConfig.data`; see `waiting-list.component.ts` and `loans-list.component.ts` for examples.
* **Duplicate detection**: both list components have nearly identical logic that normalises `name`, `phone` (digits only) and `address` and records duplicates in a map keyed by `client.no`.  If you implement similar features, copy the helper functions from either component.
* **Tables** use `MatTableDataSource<T>`; always attach `paginator` and `sort` in `ngAfterViewInit`.  The filter function trims and lowercases the input.  The input element is focused on init via `@ViewChild('input')`.
* **Styling** is plain CSS.  You will see Hebrew comments or strings; maintain RTL and font sizes manually as shown in `chart.component.ts`.
* **Forms** are reactive (`FormBuilder` / `FormGroup`).  Date fields set the locale to Hebrew: `dateAdapter.setLocale('he')`.
* **Feedback** uses `ngx-toastr` and occasionally `MatSnackBar`.  Toast messages are hard‑coded Hebrew strings; errors from the backend are surfaced directly.  Example: in `confirm-loan.component.ts` the `error` callback checks `error.status === 409` to display a specific message.
* After a successful mutation the UI typically calls `window.location.reload()` after showing a toast (2000 ms delay) rather than updating local state.  Follow this pattern for new dialogs unless there is a good reason to manage state manually.
* Logging: many components log to console (`console.log('waiting-list: …')`, `'loans-list: …'`).  Keep or extend these logs when debugging; they are helpful during development.
* The `AppService` URL is hard‑coded.  There is no Angular `environment.ts` file; if you need to make the base URL configurable add one but be aware other developers expect the literal string in `app.service.ts`.

---
## Development & build workflows

* Install dependencies: `npm install` (workspace root).
* Start dev server: `npm start` (runs `ng serve`).
* Build for production: `npm run build` (calls `ng build`).
* Tests: `npm test` is configured but there are currently no `.spec.ts` files; you can add Jasmine/Karma tests but none exist right now.
* There is no CI configuration in the repo; automated builds are not set up.
* To work with the API you must run the backend separately at `https://localhost:44376` (self‑signed certificate may require trusting in the browser).
* Debugging typically happens in the browser console; the code contains numerous `console.log` statements that you can leave or remove.

---
## When adding features or components

1. Generate using Angular CLI or manually create a folder under `src/app/content`.
2. Add the component to `AppModule.declarations` and import any Material modules you use.
3. If the component is a dialog, follow the existing pattern: receive `MAT_DIALOG_DATA`, manipulate a `FormGroup`, call a method on `AppService`, show toasts, and close with `dialogRef.close()`.
4. Update routing in `app-routing.module.ts` if you need a new top‑level view; nested views belong under `ContentComponent`.
5. Preserve Hebrew locale settings and any RTL styling.
6. When the component makes API calls, use the same observable patterns and error handling (subscribe with `next`/`error`).  Mutations should reload the page.
7. Add any new strings to the appropriate template; there is no translation file.

---
## Locale & language notes

* Text and comments are mostly Hebrew.  Keep the directionality (use `<div dir="rtl">` or appropriate CSS if you add markup).
* Date formatting relies on `he` locale (`MatDatepicker` and `DateAdapter` set accordingly).

---

> ⚠️ There are no existing integration or unit tests.  Before pushing production changes consider adding tests, especially for duplicate‑detection logic and API interactions.

Please review and let me know if any part of the codebase is unclear or if you need more specific guidance on particular components or workflows.