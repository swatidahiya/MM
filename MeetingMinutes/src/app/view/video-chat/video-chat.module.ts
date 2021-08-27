import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VideoChatComponent } from './video-chat.component';
import { VideoChatRoutingModule } from './video-chat-routing.module'
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ParticipantsComponent } from './participants/participants.component';
import { CameraComponent } from './camera/camera.component';
import { SettingsComponent } from './settings/settings.component';
import { DeviceSelectComponent } from './settings/device-select.component';
import { ActivityIndicatorComponent } from './activity-indicator/activity-indicator.component';
import { HttpClientModule } from '@angular/common/http';

import { VideoChatService } from '../../controllers/videochat.service';
import { DeviceService } from '../../controllers/device.service';
import { StorageService } from '../../controllers/storage.service';

@NgModule({
  imports: [
    CommonModule,
    VideoChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  exports: [
    VideoChatComponent
  ],
  declarations: [
    VideoChatComponent,
    HomeComponent,
    RoomsComponent,
    ParticipantsComponent,
    CameraComponent,
    SettingsComponent,
    DeviceSelectComponent,
    ActivityIndicatorComponent
  ],
  providers: [DeviceService, VideoChatService, StorageService],
})
export class VideoChatModule { }