import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingSummaryComponent } from './meeting-summary.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'meetingSummary', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: MeetingSummaryComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingSummaryRoutingModule { }