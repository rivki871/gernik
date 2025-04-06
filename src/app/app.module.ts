import { HeaderComponent } from "./content/header/header.component";
import { NewLoanComponent } from "./content/waiting-list/new-loan/new-loan.component";
import { LoginComponent } from "./login/login.component";
import { LoansListComponent } from "./content/loans-list/loans-list.component";
import { AppComponent } from "./app.component";
import { WaitingListComponent } from "./content/waiting-list/waiting-list.component";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { MatPaginator } from "@angular/material/paginator";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { ContentComponent } from "./content/content.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmLoanComponent } from "./content/waiting-list/confirm-loan/confirm-loan.component";
import { DeleteLoanComponent } from "./content/waiting-list/delete-loan/delete-loan.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from "@angular/material/core";
import { EditLoanComponent } from "./content/waiting-list/edit-loan/edit-loan.component";
import { EndLoanComponent } from "./content/loans-list/end-loan/end-loan.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrModule } from 'ngx-toastr';
import { MatSortModule } from "@angular/material/sort";
// import { ChartComponent } from "./content/chart/chart.component";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from "./content/chart/chart.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LoansListComponent,
        NewLoanComponent,
        HeaderComponent,
        WaitingListComponent,
        ContentComponent,
        ConfirmLoanComponent,
        DeleteLoanComponent,
        EditLoanComponent,
        EndLoanComponent,
        ChartComponent
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [AppRoutingModule,
        MatPaginator,
        MatLabel,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatTooltipModule,
        NgxChartsModule,
        ToastrModule.forRoot({
                timeOut : 2000,
                positionClass :'toast-top-center',
                preventDuplicates: true,
                progressBar: true,
            }),
        MatSnackBarModule,
        MatDialogModule,
        DragDropModule,
        BrowserModule,
        MatTableModule,
        MatTabsModule,
        BrowserAnimationsModule,
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatSortModule 
    ],
    providers: [
        AppRoutingModule,
        provideHttpClient(withInterceptorsFromDi()),
        provideNativeDateAdapter(),
    ],

})
export class AppModule {
}