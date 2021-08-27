import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoConferenceComponent } from './video-conference.component';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  { path: 'videoRoom/:id', component: MainNavComponent,
    children: [
        { path: '', component: VideoConferenceComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoConferenceRoutingModule { }