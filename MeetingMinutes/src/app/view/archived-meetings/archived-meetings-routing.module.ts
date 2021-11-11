import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainNavComponent } from './../main-nav/main-nav.component'
import { AuthGuard } from 'src/app/auth.guard';
import { ArchivedMeetingsComponent } from './archived-meetings.component';

const routes: Routes = [
  { path: 'archivedMeetings', component: MainNavComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: ArchivedMeetingsComponent}
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivedMeetingsRoutingModule { }
