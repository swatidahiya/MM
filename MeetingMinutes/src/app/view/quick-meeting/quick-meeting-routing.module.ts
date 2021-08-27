import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickMeetingComponent } from './quick-meeting.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'quickMeeting', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: QuickMeetingComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickMeetingRoutingModule { }