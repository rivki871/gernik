import { AfterViewChecked, Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { AppService } from 'app/app.service';
import { waitingClient } from 'app/content/waitingClient';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm-loan',
  templateUrl: './confirm-loan.component.html',
  styleUrl: './confirm-loan.component.css'
})

export class ConfirmLoanComponent {
  confirmLoanForm!: FormGroup;
  checked!: boolean;
  clientDetails!: waitingClient;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ConfirmLoanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public service: AppService,
    private dateAdapter: DateAdapter<Date>, public toastr: ToastrService) {
    this.clientDetails = data.details;
    this.dateAdapter.setLocale('he'); //dd/MM/yyyy
  }

  ngOnInit() {
    this.confirmLoanForm = this.fb.group({
      payment: ['20', Validators.required],
      securityCheck: [true, Validators.required],
      loanDate: [new Date(), Validators.required],
      bagColor: ['', Validators.required]
    });
  }

  save() {
    if (this.confirmLoanForm.invalid || this.confirmLoanForm.get('securityCheck')?.value !== true) {
      if (this.confirmLoanForm.get('securityCheck')?.value !== true) {
        this.toastr.error('חובה לאשר קבלת פיקדון');
      }
      if (!this.confirmLoanForm.get('bagColor')?.value) {
        this.toastr.error('חובה לבחור צבע מזוודה');
      }
    } else {
      this.clientDetails.loanDate = this.confirmLoanForm.get('loanDate')?.value;
      this.clientDetails.payment = this.confirmLoanForm.get('payment')?.value;
      this.clientDetails.securityCheck = this.confirmLoanForm.get('securityCheck')?.value;
      this.clientDetails.bagColor = this.confirmLoanForm.get('bagColor')?.value;

      this.service.ConfirmLoan(this.clientDetails).subscribe({
        next: (res: any) => {
          if (res.no === this.clientDetails.no) {
            this.toastr.success('!השאלה בוצעה בהצלחה');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            this.dialogRef.close();
          } else {
            this.toastr.error('תקלה בביצוע השאלה');
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.toastr.error('קיימת הלוואה עם צבע תיק זהה');
          } else {
            this.toastr.error('תקלה בביצוע השאלה: ' + error.message);
          }
        }
      });

      // סגור את הדיאלוג לאחר שהקריאה ל- subscribe הסתיימה
    }
  }

  close() {
    this.dialogRef.close();
  }

}