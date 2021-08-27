import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from 'ngx-validators';

import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration-routing.module'
import { MatDividerModule } from '@angular/material/divider';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import {PasswordValidators} from 'ngx-validators'


@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    FormsModule,
    ValidatorsModule,
    ReactiveFormsModule,
    MatDividerModule,
    AngularFontAwesomeModule,
    // PasswordValidators
  ],
  exports: [
    RegistrationComponent,
  ],
  declarations: [
    RegistrationComponent
  ],
  providers: [],
})
export class RegistrationModule { }