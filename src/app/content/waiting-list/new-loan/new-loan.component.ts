import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrl: './new-loan.component.css'
})
export class NewLoanComponent {
  newLoadForm!: FormGroup;
  namePattern = "^[א-ת ']{0,20}$";
  numberPattern = "^[0-9]{9,10}$";

  constructor(public dataServise: AppService, private fb: FormBuilder, private dialogRef: MatDialogRef<NewLoanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, private toastrService: ToastrService,

  ) { }

  ngOnInit() {
    this.newLoadForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.namePattern)]],
      phone: ["", [Validators.required, Validators.pattern(this.numberPattern)]],
      address: ["", Validators.required],
      remarks: [""],
      insertDate: [new Date()]
    });
  }

  save() {
    var reload = false;
    if (this.newLoadForm.valid) {
      this.dataServise.addWaitingClient(this.newLoadForm.value).subscribe(
        (res: any) => {
          if (res.isWaiting) {
            this.toastrService.success('!לקוח חדש נוסף בהצלחה');
            reload = true;
          }
          else {
            this.toastrService.error('תקלה בהוספת לקוח חדש')
          }
          if (reload) {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }
      );
      this.dialogRef.close();
    }
    else {
      this.toastrService.error('!חובה להזין שם, טלפון וכתובת')
    }
  }

  close() {
    this.dialogRef.close();
  }
}