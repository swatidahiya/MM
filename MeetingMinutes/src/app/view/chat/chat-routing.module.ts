import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';
import { ChatComponent } from './chat.component';

const routes: Routes = [
  { path: 'chat', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: ChatComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }