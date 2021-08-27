import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleDecisionComponent } from './single-decision.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'singleDecision/:id', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: SingleDecisionComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDecisionRoutingModule { }