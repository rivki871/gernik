import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'app/app.service';
import { waitingClient } from 'app/content/waitingClient';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-end-loan',
  templateUrl: './end-loan.component.html',
  styleUrl: './end-loan.component.css'
})
export class EndLoanComponent {
  endLoanForm!: FormGroup;
  clientDetails!: waitingClient;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EndLoanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public service: AppService,
    private dateAdapter: DateAdapter<Date>, public toaster: ToastrService) {
    this.dateAdapter.setLocale('he'); //dd/MM/yyyy
    this.clientDetails = data.details;
  }

  ngOnInit() {
    this.endLoanForm = this.fb.group({
      payment: ['20', Validators.required],
      securityCheck: [true, Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  save() {
    if (this.endLoanForm.valid) {
      var reload = false;
      this.clientDetails.loanDate = this.endLoanForm.get('date')?.value;
      this.clientDetails.payment = this.endLoanForm.get('payment')?.value;
      this.clientDetails.securityCheck = this.endLoanForm.get('securityCheck')?.value
      this.service.EndLoan(this.clientDetails).subscribe(res => {
        if (res = this.clientDetails.no) {
          this.toaster.success('!סיום השאלה בוצע בהצלחה')
          reload = true;
        }
        else {
          this.toaster.error('תקלה בביצוע סיום השאלה')
        }
        if (reload) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      this.dialogRef.close(this.endLoanForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
