import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, viewChild } from '@angular/core';
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
import { EditLoanComponent } from '../waiting-list/edit-loan/edit-loan.component';
import { LoanHistoryComponent } from '../waiting-list/loan-history/loan-history.component';

@Component({
  selector: 'app-loans-list',
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css']
})

export class LoansListComponent implements OnInit, AfterViewInit {
  value = '';
  dataSource = new MatTableDataSource<client>();
  dataLoans: client[] = [];
  groupedLoans: { [key: string]: client[] } = {};
  displayedColumns: string[] = ['name', 'phone', 'address', 'payment', 'loanDate', 'remarks', 'bagColor', 'edit', 'end'];
  duplicateClients: { [key: string]: boolean } = {};
  tableFooterColumns: string[] = ['payment'];
  showEndLoan: boolean = false;
  total: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<MatInput>;

  constructor(private router: Router, public dialog: MatDialog,
    private loanService: AppService) { }

  ngOnInit() {
    this.loanService.getAllLoans().subscribe((x: any) => {
      this.dataLoans = x;
      // Group loans by client (name+phone+address)
      const clientMap = new Map<string, client[]>();
      const normalize = (s: any) => s ? String(s).trim().toLowerCase() : '';
      const normalizePhone = (p: any) => p ? String(p).replace(/\D+/g, '') : '';
      this.dataLoans.forEach(c => {
        const name = normalize(c.name);
        const phone = normalizePhone(c.phone);
        const address = normalize(c.address);
        const key = `${name}|${phone}|${address}`;
        if (!clientMap.has(key)) clientMap.set(key, []);
        clientMap.get(key)?.push(c);
      });
      // For each group, sort by loanDate descending and pick the latest
      const latestLoans: client[] = [];
      this.groupedLoans = {};
      clientMap.forEach((loans, key) => {
        loans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        latestLoans.push(loans[0]);
        this.groupedLoans[key] = loans;
      });
      this.dataSource.data = latestLoans;
      this.total = latestLoans.map(t => t.payment).reduce((acc, value) => acc + value, 0);
      // after data loaded, check for duplicate clients (same name+phone+address)
      console.log('loans-list: loaded dataLoans', this.dataLoans);
      this.checkForDuplicates();
      console.log('loans-list: duplicateClients after check', this.duplicateClients);
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
    this.inputElement.nativeElement.focus();
  }


  openDialog(type: number, element: waitingClient) {
    if (type === 1) {
      const dialogConfig1 = new MatDialogConfig();
      dialogConfig1.data = { details: element }
      this.dialog.open(EndLoanComponent, dialogConfig1);
      dialogConfig1.disableClose = true;
      dialogConfig1.autoFocus = true;
    } else if (type === 2) {
      const dialogConfig2 = new MatDialogConfig();
      dialogConfig2.data = { details: element, isLoan: true, formHeight: '365px' }
      this.dialog.open(EditLoanComponent, dialogConfig2);
      dialogConfig2.disableClose = true;
      dialogConfig2.autoFocus = true;
    }
  }

  getIconColor(bagColor: number): string {
    switch (bagColor) {
      case 1: return 'blue';
      case 2: return 'mediumorchid';
      case 3: return 'gray';
      default: return 'white';
    }
  }

  checkForDuplicates() {
    const clientMap = new Map<string, client[]>();

    const normalize = (s: any) => {
      if (s === null || s === undefined) return '';
      return String(s).trim().toLowerCase();
    };

    const normalizePhone = (p: any) => {
      if (p === null || p === undefined) return '';
      return String(p).replace(/\D+/g, '');
    };

    this.dataLoans.forEach(c => {
      const name = normalize(c.name);
      const phone = normalizePhone(c.phone);
      const address = normalize(c.address);
      const key = `${name}|${phone}|${address}`;
      if (!clientMap.has(key)) clientMap.set(key, []);
      clientMap.get(key)?.push(c);
    });

    // reset
    this.duplicateClients = {};

    const groups = Array.from(clientMap.entries()).map(([k, v]) => ({ key: k, count: v.length, clients: v }));
    console.log('loans-list - groups:', groups.map(g => ({ k: g.key, count: g.count })));

    groups.forEach(g => {
      if (g.count > 1) {
        console.log('Loans duplicate group detected:', g);
        g.clients.forEach(c => {
          this.duplicateClients[c.no] = true;
        });
      }
    });
  }

  showHistory(element: client) {
    // Find the group key for this client
    const normalize = (s: any) => s ? String(s).trim().toLowerCase() : '';
    const normalizePhone = (p: any) => p ? String(p).replace(/\D+/g, '') : '';
    const key = `${normalize(element.name)}|${normalizePhone(element.phone)}|${normalize(element.address)}`;
    const history = this.groupedLoans[key] || [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      name: element.name,
      phone: element.phone,
      address: element.address,
      history: history
    };
    this.dialog.open(LoanHistoryComponent, dialogConfig);
  }

}