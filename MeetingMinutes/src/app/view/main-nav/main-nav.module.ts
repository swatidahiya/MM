import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { NgChatModule } from 'ng-chat';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
// import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    MatBadgeModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule ,
    NgChatModule,
    MatFabMenuModule
  ],
  exports: [
    MainNavComponent,
  ],
  declarations: [
    MainNavComponent,
    // UserProfileComponent
  ]
})
export class LayoutModule { }