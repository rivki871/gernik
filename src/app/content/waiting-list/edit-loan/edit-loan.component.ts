import { Component, Inject, Optional } from '@angular/core';
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
      isWaiting: []
    });
    this.editLoanForm.patchValue(this.data.details);
  }

  save() {
    if (this.editLoanForm.valid) {
      const params = { ...this.editLoanForm.getRawValue() }
      var reload = false;
      this.service.UpdateWaitingClient(params.no, params).subscribe(res => {
        if (res = params.no) {
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