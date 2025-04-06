import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { waitingClient } from './content/waitingClient';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  public url = "https://localhost:44376/api"

  constructor(private http: HttpClient) { }

  getAllLoans() {
    return this.http.get(this.url + '/Loans');
  }

  getAllWaitingClients() {
    return this.http.get(this.url + '/WaitingClients');
  }

  addWaitingClient(client: any) {
    return this.http.post(this.url + '/WaitingClients', client)
  }

  DeleteWaitingClient(no: number) {
    return this.http.delete(this.url + '/WaitingClients?no=' + no)
  }

  UpdateWaitingClient(no: number, client: waitingClient) {
    return this.http.put(this.url + '/WaitingClients?no=' + no, client)
  }

  ConfirmLoan(client: any) {
    return this.http.post(this.url + '/Loans' , client)
  }

  EndLoan(client: waitingClient) {
    return this.http.put(this.url + '/Loans' , client)
  }

}
