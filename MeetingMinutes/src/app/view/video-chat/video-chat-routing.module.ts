import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoChatComponent } from './video-chat.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'videoChat', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: VideoChatComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoChatRoutingModule { }