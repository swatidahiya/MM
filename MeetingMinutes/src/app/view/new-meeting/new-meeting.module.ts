import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewMeetingComponent } from './new-meeting.component';
import { NewMeetingRoutingModule } from './new-meeting-routing.module'
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge'; 
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'; 
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatNativeDateModule, MatInputModule } from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {MatCheckboxModule} from '@angular/material/checkbox';


import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    CommonModule,
    NewMeetingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    // AngularFontAwesomeModule,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    AmazingTimePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MultiSelectModule
    // IgxTimePickerModule
  ],
  exports: [
    NewMeetingComponent
  ],
  declarations: [
    NewMeetingComponent
  ],
  providers: [],
})
export class NewMeetingModule { }