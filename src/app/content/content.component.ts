import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {

  constructor(public router: Router) { }

  ngOnInit() {
    this.router.navigate(['content/waitingList']);
  }

  tabClick(tab: any) {
    if (tab.index === 1) {
      this.router.navigate(['content/loansList']);
    }

    else {
      this.router.navigate(['content/waitingList']);

    }
  }

}