import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import { waitingClient } from '../waitingClient';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewLoanComponent } from '../waiting-list/new-loan/new-loan.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [trigger
    (
      'buttonRotation', [state('rotated', style({ transform: 'rotate(180deg)', })),
      transition('* => rotated', [animate('0.3s ease-out')]),]),]
})
export class HeaderComponent implements OnInit {
  dataWaiting: waitingClient[] = [];
  loaning: any;
  phone: any;
  address: any;
  array: waitingClient[] = [];
  loans: waitingClient[] = [];
  isRotated = false;

  constructor(public appService: AppService, public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit() {
    this.appService.getAllLoans().subscribe((res: any) => {
      this.dataWaiting = res;
      if (res !== null) {
        this.loans = this.dataWaiting.filter(b => b.isLoan)
      }
    })
  }

  rotateButton() {
    this.isRotated = !this.isRotated;
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(NewLoanComponent, dialogConfig);
  }

  goToStatistics() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    this.dialog.open(ChartComponent, dialogConfig);
  }
}