import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SingleActionItemComponent } from './single-action-item.component';
import { SingleActionItemRoutingModule } from './single-action-item-routing.module'
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
import { InPlaceEditorModule } from '@syncfusion/ej2-angular-inplace-editor';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    CommonModule,
    SingleActionItemRoutingModule,
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
    InPlaceEditorModule,
    ButtonModule,
    QuillModule.forRoot(),
  ],
  exports: [
    SingleActionItemComponent
  ],
  declarations: [
    SingleActionItemComponent
  ],
  providers: [],
})
export class SingleActionItemModule { }