import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'app/app.service';
import { waitingClient } from '../waitingClient';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmLoanComponent } from './confirm-loan/confirm-loan.component';
import { EditLoanComponent } from './edit-loan/edit-loan.component';
import { DeleteLoanComponent } from './delete-loan/delete-loan.component';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.css'
})

export class WaitingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['name', 'phone', 'address', 'insertDate', 'remarks', 'loan', 'edit', 'delete'];
  dataWaiting: waitingClient[] = [];
  dataSource = new MatTableDataSource<waitingClient>(this.dataWaiting);
  value = '';
  deleteDialog: boolean = false;

  constructor(public dataServise: AppService, public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.dataServise.getAllWaitingClients().subscribe(
      (res: any) => {
        this.dataWaiting = res; // אם המערך של התוצאה של הקריאה
        this.dataSource = new MatTableDataSource<waitingClient>(this.dataWaiting);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  openDialog(type: number, element: waitingClient) {
    if (type === 1) {
      const dialogConfig1 = new MatDialogConfig();
      dialogConfig1.data = { details: element }
      this.dialog.open(ConfirmLoanComponent, dialogConfig1);
      dialogConfig1.disableClose = true;
      dialogConfig1.autoFocus = true;
    }
    if (type === 2) {
      const dialogConfig2 = new MatDialogConfig();
      dialogConfig2.data = { details: element }
      this.dialog.open(EditLoanComponent, dialogConfig2);
      dialogConfig2.disableClose = true;
      dialogConfig2.autoFocus = true;
    }
    if (type === 3) {
      const dialogConfig3 = new MatDialogConfig();
      dialogConfig3.data = { name: element.name, no: element.no }
      this.dialog.open(DeleteLoanComponent, dialogConfig3);
      this.deleteDialog = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}