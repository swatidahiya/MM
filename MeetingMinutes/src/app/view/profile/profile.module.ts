import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module'
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
import { InPlaceEditorModule } from '@syncfusion/ej2-angular-inplace-editor';
import { NotifierOptions, NotifierModule } from 'angular-notifier';
import {MatTabsModule} from '@angular/material/tabs'; 

const customNotifierOptions: NotifierOptions = {
  position: {
      horizontal: {
          position: 'right',
          distance: 12
      },
      vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
      }
  },
  theme: 'material',
  behaviour: {
      autoHide: 5000,
      onClick: 'hide',
      onMouseover: 'pauseAutoHide',
      showDismissButton: true,
      stacking: 4
  },
  animations: {
      enabled: true,
      show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
      },
      hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
      },
      shift: {
          speed: 300,
          easing: 'ease'
      },
      overlap: 150
  }
};

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
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
    InPlaceEditorModule,
    MatTabsModule,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  exports: [
    ProfileComponent
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [],
})
export class ProfileModule { }