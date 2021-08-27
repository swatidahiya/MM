import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActionItemsComponent } from './action-items.component';
import { ActionItemsRoutingModule } from './action-items-routing.module'
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
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ActionItemsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatInputModule
  ],
  exports: [
    ActionItemsComponent
  ],
  declarations: [
    ActionItemsComponent
  ],
  providers: [],
})
export class ActionItemsModule { }