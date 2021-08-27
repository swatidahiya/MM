import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DecisionListComponent } from './decision-list.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'decisionList', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: DecisionListComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecisionListRoutingModule { }