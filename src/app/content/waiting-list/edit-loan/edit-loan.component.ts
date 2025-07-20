import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { waitingClient } from 'app/content/waitingClient';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-loan',
  templateUrl: './edit-loan.component.html',
  styleUrl: './edit-loan.component.css'
})
export class EditLoanComponent {
  editLoanForm!: FormGroup;
  clientDetails!: waitingClient;
  @ViewChild('formElement') formElement!: ElementRef; // הנחה שיש לך אלמנט עם תבנית זו

  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<EditLoanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public service: AppService,
    public router: Router, public toast: ToastrService) {
    this.clientDetails = data;
    console.log(data);
  }
  ngOnInit() {
    this.editLoanForm = this.fb.group({
      no: [],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      insertDate: [''],
      remarks: [''],
      isWaiting: [],
      payment: [''],
    });
    this.editLoanForm.patchValue(this.data.details);
  }

  ngAfterViewInit() {
    const formHeight = this.data.formHeight;
    if (this.formElement) {
      this.formElement.nativeElement.style.height = formHeight;
    }
  }

  save() {
    if (this.editLoanForm.valid) {
      let params;
      if (!this.data.isLoan) {
        params = { ...this.editLoanForm.getRawValue() };
      }
      else {
        params = {
          no: this.editLoanForm.get('no')?.value,
          name: this.editLoanForm.get('name')?.value,
          phone: this.editLoanForm.get('phone')?.value,
          address: this.editLoanForm.get('address')?.value,
          insertDate: this.editLoanForm.get('insertDate')?.value,
          remarks: this.editLoanForm.get('remarks')?.value,
          loanDate: this.data.details.loanDate,
          isLoan: this.data.details.isLoan,
          securityCheck: this.data.details.securityCheck == 'לא', 0: 1,
          isWaiting: this.data.details.isWaiting,
          payment: this.editLoanForm.get('payment')?.value,
          bagColor: this.data.details.bagColor,
        };
      }
      var reload = false;
      this.service.UpdateWaitingClient(params.no, params).subscribe((res: any) => {
        if (res.no == params.no) {
          this.toast.success('!רשומה נערכה בהצלחה')
          reload = true;
        }
        else {
          this.toast.error('תקלה בעריכת רשומה')
        }
        if (reload) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}