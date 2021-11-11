import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchivedMeetingsRoutingModule } from './archived-meetings-routing.module';
import { ArchivedMeetingsComponent } from './archived-meetings.component';


@NgModule({
  imports: [
    CommonModule,
    ArchivedMeetingsRoutingModule
  ],
  exports: [
    ArchivedMeetingsComponent
  ],
  declarations: [
    ArchivedMeetingsComponent
  ],
  providers: [],
})
export class ArchivedMeetingsModule { }
