import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'app/app.service';
import { waitingClient } from '../waitingClient';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmLoanComponent } from './confirm-loan/confirm-loan.component';
import { EditLoanComponent } from './edit-loan/edit-loan.component';
import { DeleteLoanComponent } from './delete-loan/delete-loan.component';
import { LoanHistoryComponent } from './loan-history/loan-history.component';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.css'
})

export class WaitingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef;
  displayedColumns: string[] = ['name', 'phone', 'address', 'insertDate', 'remarks', 'loan', 'edit', 'delete'];
  duplicateClients: { [key: string]: boolean } = {};
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
        this.dataWaiting = res;
        console.log('waiting-list: loaded dataWaiting', this.dataWaiting);
        this.checkForDuplicates();
        console.log('waiting-list: duplicateClients after check', this.duplicateClients);
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
    this.inputElement.nativeElement.focus();
  }

  checkForDuplicates() {
    const clientMap = new Map<string, waitingClient[]>();

    // Helper to normalize fields for accurate duplicate detection
    const normalize = (s: any) => {
      if (s === null || s === undefined) return '';
      return String(s).trim().toLowerCase();
    };

    const normalizePhone = (p: any) => {
      if (p === null || p === undefined) return '';
      // keep only digits
      return String(p).replace(/\D+/g, '');
    };

    // Group clients by normalized identifying information
    this.dataWaiting.forEach(client => {
      const name = normalize(client.name);
      const phone = normalizePhone(client.phone);
      const address = normalize(client.address);
      const key = `${name}|${phone}|${address}`;
      if (!clientMap.has(key)) {
        clientMap.set(key, []);
      }
      clientMap.get(key)?.push(client);
    });

    // Clear previous results
    this.duplicateClients = {};

    // Mark clients that have duplicates and log detailed groups for debugging
    const groups = Array.from(clientMap.entries()).map(([k, v]) => ({ key: k, count: v.length, clients: v }));
    console.log('checkForDuplicates - groups:', groups.map(g => ({ k: g.key, count: g.count })));

    groups.forEach(g => {
      if (g.count > 1) {
        console.log('Duplicate group detected:', g);
        g.clients.forEach(client => {
          // use client.no as the map key so template can check duplicateClients[element.no]
          this.duplicateClients[client.no] = true;
        });
      }
    });
  }

  showHistory(element: waitingClient) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      name: element.name,
      phone: element.phone,
      address: element.address
    };
    this.dialog.open(LoanHistoryComponent, dialogConfig);
  }
}