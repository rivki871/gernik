import { Component, Inject, Optional, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-loan',
  templateUrl: './delete-loan.component.html',
  styleUrl: './delete-loan.component.css'
})
export class DeleteLoanComponent {
  deleteLoanForm!: FormGroup;
  name: string;
  no: number;

  constructor(private dialogRef: MatDialogRef<DeleteLoanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dataServise: AppService,
    public router: Router, public toaster: ToastrService) {
    console.log(data);
    this.name = data.name;
    this.no = data.no;
  }

  save() {
    this.dataServise.DeleteWaitingClient(this.data.no).subscribe(res => {
      var reload = false;
      if (res = this.data.no) {
        this.toaster.success('!לקוח נמחק בהצלחה')
        reload = true;
      }
      else {
        this.toaster.error('תקלה במחיקת לקוח')
      }
      if (reload) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
