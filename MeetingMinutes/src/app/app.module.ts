import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './view/dashboard/dashboard.module';
import { MainNavComponent } from './view/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';

import { LoginModule } from './view/login/login.module';
import { Routes, RouterModule } from '@angular/router';
import { MeetingDetailsModule } from './view/meeting-details/meeting-details.module';
import { ActionDialogComponent } from './view/action-dialog/action-dialog.component';
import { MatNativeDateModule, MatInputModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { DecisionDialogComponent } from './view/decision-dialog/decision-dialog.component';
import { QuickMeetingModule } from './view/quick-meeting/quick-meeting.module';
import { NewMeetingModule } from './view/new-meeting/new-meeting.module';
import { MeetingSummaryModule } from './view/meeting-summary/meeting-summary.module';
import { ActionItemsModule } from './view/action-items/action-items.module';
import { SingleActionItemModule } from './view/single-action-item/single-action-item.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DecisionListModule } from './view/decision-list/decision-list.module';
import { SingleDecisionModule } from './view/single-decision/single-decision.module';
import { ProfileModule } from './view/profile/profile.module';
import { RegistrationModule } from './view/registration/registration.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ManageUsersModule } from './view/manage-users/manage-users.module';
import { CreatePollComponent } from './view/create-poll/create-poll.component';
import { RespondPollComponent } from './view/respond-poll/respond-poll.component';
import { NgChatModule } from 'ng-chat';
import { ChatComponent } from './view/chat/chat.component';
import { ChatModule } from './view/chat/chat.module';
import { VideoChatModule } from './view/video-chat/video-chat.module';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './view/reset-password/reset-password.component';
import { SchedulerComponent } from './view/scheduler/scheduler.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SearchDialogComponent } from './view/search-dialog/search-dialog.component';
import { AnalysisModule } from './view/analysis/analysis.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ChartsModule } from 'ng2-charts';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
// import {PasswordValidators} from 'ngx-validators';
import { ValidatorsModule } from "ngx-validators";

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { VideoConferenceComponent } from './view/video-conference/video-conference.component';
import { VideoConferenceModule } from './view/video-conference/video-conference.module';
// import { CallEndDialogComponent } from './view/call-end-dialog/call-end-dialog.component';
import {MatTableModule} from '@angular/material/table';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};


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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },
  {
    path:'reset-password',
    component:ResetPasswordComponent
  },
  {
    path:'videoRoom',
    component: VideoConferenceComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ActionDialogComponent,
    DecisionDialogComponent,
    CreatePollComponent,
    RespondPollComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SchedulerComponent,
    SearchDialogComponent,
    // CallEndDialogComponent,
    // VideoConferenceComponent,
    
  ],
  entryComponents: [ActionDialogComponent, DecisionDialogComponent, CreatePollComponent, RespondPollComponent, SchedulerComponent, SearchDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    RouterModule.forRoot(routes, { enableTracing: true }),
    LoginModule,
    RegistrationModule,
    DashboardModule,
    VideoConferenceModule,
    MeetingDetailsModule,
    QuickMeetingModule,
    ActionItemsModule,
    DecisionListModule,
    NewMeetingModule,
    MeetingSummaryModule,
    SingleActionItemModule,
    SingleDecisionModule,
    ProfileModule,
    VideoChatModule,
    ManageUsersModule,
    ChatModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // PasswordValidators,
    MatInputModule,
    MatRadioModule,
    MatFabMenuModule,
    MatMenuModule,
    HttpClientModule,
    NotifierModule.withConfig(customNotifierOptions),
    NgChatModule,
    ScheduleModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AnalysisModule,
    ChartsModule,
    ValidatorsModule,
    MatTableModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      responsive: true
    })
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
