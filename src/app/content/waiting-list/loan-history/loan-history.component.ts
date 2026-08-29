import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'app/app.service';
import { client } from '../../../content/client';

@Component({
  selector: 'app-loan-history',
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  getIconColor(bagColor: number): string {
    switch (bagColor) {
      case 1: return 'blue';
      case 2: return 'mediumorchid';
      case 3: return 'gray';
      default: return 'white';
    }
  }
  loans: client[] = [];
  displayedColumns: string[] = ['date', 'bagColor', 'payment', 'remarks'];

  constructor(
    private dialogRef: MatDialogRef<LoanHistoryComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { name: string, phone: string, address: string, history?: client[] },
    private appService: AppService
  ) {}

  ngOnInit() {
    // If history is passed in dialog data, use it. Otherwise, fallback to service.
    if (this.data.history && Array.isArray(this.data.history)) {
      this.loans = this.data.history;
    } else {
      this.appService.getLoanHistory(this.data.name, this.data.phone, this.data.address)
        .subscribe((res: client[]) => {
          this.loans = res;
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}