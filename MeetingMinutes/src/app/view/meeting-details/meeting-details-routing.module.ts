import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingDetailsComponent } from './meeting-details.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'browse/:id', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: MeetingDetailsComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingDetailsRoutingModule { }