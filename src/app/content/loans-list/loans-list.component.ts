import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { client } from '../client';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppService } from 'app/app.service';
import { EndLoanComponent } from './end-loan/end-loan.component';
import { waitingClient } from '../waitingClient';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-loans-list',
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css']
})

export class LoansListComponent implements OnInit, AfterViewInit {
  value = '';
  dataSource = new MatTableDataSource<client>();
  dataLoans: client[] = [];
  displayedColumns: string[] = ['name', 'phone', 'address', 'securityCheck', 'payment', 'loanDate', 'remarks', 'bagColor', 'end',];
  tableFooterColumns: string[] = ['payment'];
  showEndLoan: boolean = false;
  total: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private router: Router, public dialog: MatDialog,
    private loanService: AppService) { }

  ngOnInit() {
    this.loanService.getAllLoans().subscribe((x: any) => {
      this.dataLoans = x;
      this.dataSource.data = this.dataLoans;
      this.dataSource.data.forEach(element => {
        if (element.securityCheck) {
          element.securityCheck = 'כן'
        }
        else {
          element.securityCheck = 'לא'
        }
        this.total = this.dataSource.data.map(t => t.payment).reduce((acc, value) => acc + value, 0) //+'אלף ומשו שהעברנו עם כץ';
      });
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  openDialog(element: waitingClient) {
    const dialogConfig1 = new MatDialogConfig();
    dialogConfig1.data = { details: element }
    this.dialog.open(EndLoanComponent, dialogConfig1);
    dialogConfig1.disableClose = true;
    dialogConfig1.autoFocus = true;
  }

  getIconColor(bagColor: number): string {
    switch (bagColor) {
      case 1: return 'blue';
      case 2: return 'mediumorchid';
      case 3: return 'gray';
      default: return 'white';
    }
  }

}