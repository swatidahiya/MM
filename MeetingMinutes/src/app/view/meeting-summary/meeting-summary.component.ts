import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from '../../models/meetings.model'
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-meeting-summary',
  templateUrl: './meeting-summary.component.html',
  styleUrls: ['./meeting-summary.component.css'],
  providers: [MeetingService, UserService]
})
export class MeetingSummaryComponent implements OnInit {

  meetings: Array<any> = [];
  todayDate = new Date();
  dataLoaded = false;
  currentUser: User;
  users: User[];
  participants = [];
  userMeetings: Meetings[];
  isToday: boolean[] = [false];

  viewTime: string[] = [""];
  meetingNameText: any;
  fullNameText: any;
  status0Text: boolean = false;
  status1Text: boolean = false;
  status2Text: boolean = false;
  checked: boolean;
  deviceDetectorInfo = null;

  mainValue: any;
  selectedMainValue: Array<any> = [];
  selectedStatus: Number;

  options: User[]
  // string[] = ['Anuj Kumar', 'Danish Ahmad', 'Ankur Garg', 'Mohit Sharma', 'Anil Garg'];
  contacts = [];
  @ViewChild('statusArea', { read: ElementRef, static: false }) statusArea: ElementRef;
  constructor(private meetingService: MeetingService,
    private _route: Router,
    private userService: UserService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    console.log("cureeeeeee", this.currentUser)
    // var data1 = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   console.log("check user result",result)
    if (this.currentUser) {
      if (this.currentUser.IsActive == true) {

        this.userService.getAllUsers().then(result => {
          this.options = result;
        })
        const data = this.meetingService.getMeetings().then(data => {
          data.sort((a: any, b: any) => {
            return b.MeetingID - a.MeetingID;
          });
          // this.meetings = data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].reoccrence === 'Yes' || data[i].reoccrence === null) {

              if (this.currentUser.Initials === 'sAdmin') {
                this.meetings.push(data[i]);
              }
              else {
                if (data[i].Partipatents !== null) {
                  this.participants = data[i].Partipatents;
                }
                var c = 0;
                for (var j = 0; j < this.participants.length; j++) {
                  if (this.currentUser.Email === this.participants[j]) {
                    c = j;
                  }
                }
                if (this.currentUser.LoginName === data[i].HostUser || this.currentUser.Email === this.participants[c]) {
                  this.meetings.push(data[i]);
                }
              }
            }
          }
          console.log(this.meetings);

          var date = new Date();

          for (var i = 0; i < this.meetings.length; i++) {
            const temp = new Date(this.meetings[i].MeetingDate);

            if (date.getDate() - temp.getDate() == 0) {
              if (date.getMonth() - temp.getMonth() == 0) {
                if (date.getFullYear() - temp.getFullYear() == 0) {
                  console.log("success");
                  this.isToday[i] = true;
                }
              }
            }
          }
          this.dataLoaded = true
        });
        this.refresh();

      } else {
        alert("Your account has been blocked. Please contact admin!");
        this._route.navigateByUrl('/login')
      }
    } else {
      alert("Your account has been deleted. Please contact admin!");
      this._route.navigateByUrl('/login')
    }


  }

  async refresh() {

  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  getPosts(val: any) {
    this.contacts = [];
    this.contacts.push(val);
  }


  getTicket(meetingID: any) {
    console.log(meetingID)
    this._route.navigate(['/browse/' + meetingID])
  }

  dueDate() {
    this.meetings.sort((a, b) => new Date(b.MeetingDate).getTime() - new Date(a.MeetingDate).getTime())
    console.log(this.meetings);
    this.refresh();
  }

  priority() {
    this.meetings.sort((a: any, b: any) => {
      return a.MeetingID - b.MeetingID;
    });
    this.refresh();
  }

  upcoming() {
    this.meetings.sort((a: any, b: any) => { return b.Status - a.Status; });
    console.log(this.meetings);
    this.refresh();

  }

  statusCheck(string: any, val: any) {
    switch (string) {
      case 'due': this.status0Text = val;

        break;
      case 'inProgress': this.status1Text = val;

        break;
      case 'completed': this.status2Text = val;
        break;
    }

    // this.selectedMainValue.push(this.mainValue)
  }

  async filterMeetings() {
    var object = {}

    if (this.meetingNameText !== undefined) {
      if(this.meetingNameText.length > 0) {
        object['meetingName'] = this.meetingNameText.toLowerCase();
      }
    }
    object['user'] = this.contacts[0];
    object['status'] = this.selectedStatus;

    if (this.selectedStatus != undefined || this.selectedStatus != null) {
      this.meetingService.filterMeetings(object).then(data => {
        this.meetings = [];
        if(data.length > 0) {
          for (var i = 0; i < data.length; i++) {

            if (data[i].reoccrence == 'Yes' || data[i].reoccrence == null) {
              if (this.currentUser.Initials == 'sAdmin') {
                this.meetings.push(data[i]);
              }
              else {
                if (data[i].Partipatents != null) {
  
                  this.participants = data[i].Partipatents.split(',');
                }
                var c = 0;
                for (var j = 0; j < this.participants.length; j++) {
                  if (this.currentUser.Email == this.participants[j]) {
                    c = j;
                  }
                }
                if (this.currentUser.LoginName == data[i].HostUser || this.currentUser.Email === this.participants[c]) {
                  this.meetings.push(data[i]);
                }
              }
            }
          }
        }
        else {
          console.log("no meeting found")
        }
        
        this.refresh();
      })
    }
    else {
      alert("Meeting status is mandatory.\nPlease select meeting status!!");
    }
  }

  resetFilter() {

    this.meetings = [];
    this.contacts = [];
    this.meetingNameText = "";
    this.fullNameText = "";
    this.mainValue = "";
    this.selectedStatus = undefined;

    this.currentUser = this.userService.currentUserValue;
    const data = this.meetingService.getMeetings().then(data => {
      data.sort((a: any, b: any) => {
        return b.MeetingID - a.MeetingID;
      });
      for (var i = 0; i < data.length; i++) {
        if (data[i].reoccrence == 'Yes' || data[i].reoccrence == null) {

          if (this.currentUser.Initials == 'sAdmin') {
            this.meetings.push(data[i]);
          }
          else {
            if (data[i].Partipatents !== null) {
              this.participants = data[i].Partipatents.split(',');
            }
            var c = 0;
            for (var j = 0; j < this.participants.length; j++) {
              if (this.currentUser.Email == this.participants[j]) {
                c = j;
              }
            }
            if (this.currentUser.LoginName === data[i].HostUser || this.currentUser.Email === this.participants[c]) {
              this.meetings.push(data[i]);
            }
          }
        }
      }

      this.dataLoaded = true
    });
    this.refresh();
  }

}
