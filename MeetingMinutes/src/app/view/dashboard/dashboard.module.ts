import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module'
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge'; 
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatIconModule} from '@angular/material/icon';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material';
import { from } from 'rxjs';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    // AngularFontAwesomeModule,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatIconModule,
    ScrollingModule,
    MatTooltipModule,
    ChartsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      animationDuration: 500,
      responsive: true
    })
  ],
  exports: [
    DashboardComponent
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [],
})
export class DashboardModule { }