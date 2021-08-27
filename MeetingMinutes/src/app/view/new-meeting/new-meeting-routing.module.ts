import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMeetingComponent } from './new-meeting.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'meeting', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: NewMeetingComponent}
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMeetingRoutingModule { }