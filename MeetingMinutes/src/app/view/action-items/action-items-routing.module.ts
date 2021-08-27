import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionItemsComponent } from './action-items.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'actionItems', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: ActionItemsComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionItemsRoutingModule { }