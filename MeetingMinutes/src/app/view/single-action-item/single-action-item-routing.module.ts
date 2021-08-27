import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleActionItemComponent } from './single-action-item.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'singleActionItem/:id', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: SingleActionItemComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleActionItemRoutingModule { }