import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageUsersComponent } from './manage-users.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'manageUsers', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: ManageUsersComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }