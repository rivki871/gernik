import { WaitingListComponent } from './content/waiting-list/waiting-list.component';
import { ContentComponent } from './content/content.component';
import { LoansListComponent } from './content/loans-list/loans-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ChartComponent } from './content/chart/chart.component';


const routes: Routes = [
  {
    path: 'content', component: ContentComponent,
    children: [
      { path: 'waitingList', component: WaitingListComponent },
      { path: 'loansList', component: LoansListComponent },
      // { path: 'chart', component: ChartComponent }
    ]
  },
  { path: '**', redirectTo: 'content' },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
