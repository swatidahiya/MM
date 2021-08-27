import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysisComponent } from './analysis.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'analysis', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: AnalysisComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
