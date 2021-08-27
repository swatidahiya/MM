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
  projectNameText: any;
  fullNameText: any;
  status0Text: any;
  status1Text:any;
  status2Text:any
  checked: boolean;
  deviceDetectorInfo = null;

  mainValue: any;

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
    var data1 = this.userService.checkUser(this.currentUser.LoginName).then(result => {
      // console.log(result)
      if (result) {
        if (this.currentUser.IsActive === true) {

          this.userService.getAllUsers().then(result => {
            this.options = result;
      
          })
          // this.currentUser = this.userService.currentUserValue;
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
                    this.participants = data[i].Partipatents.split(',');
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
    });
    
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

  statusCheck(val: any) {
    switch (val) {
      case 'overdue': this.mainValue = 0;

        break;
      case 'inProgress': this.mainValue = 1;

        break;
      case 'completed': this.mainValue = 2;
        break;
    }
  }

  filterMeetings() {

    this.userService.getAllUsers().then(data => {
      for (var i = 0; i < data.length; i++) {
        if (data[i].DisplayName === this.fullNameText) {
          this.users = data[i].LoginName;
          break;
        }
      }
      // var a;
      // if (this.mainValue === 0 || this.mainValue === 1 || this.mainValue === 2) {
      //   a = this.mainValue;
      // }
      // else {
      //   a = -1;
      // }
      console.log(this.projectNameText);
      console.log(this.mainValue)
      console.log(this.users)

      this.meetingService.filterMeetings(this.projectNameText, this.users, this.mainValue).then(data => {
        // this.meetings = data;
        this.meetings = [];
        for (var i = 0; i < data.length; i++) {

          if (data[i].reoccrence === 'Yes' || data[i].reoccrence === null) {
            if (this.currentUser.Initials === 'sAdmin') {
              this.meetings.push(data[i]);
            }
            else {
              if (data[i].Partipatents !== null) {

                this.participants = data[i].Partipatents.split(',');
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
        this.refresh();
      })
    })
  }

  resetFilter() {

    this.meetings = [];
    this.projectNameText = "";
    this.fullNameText = "";
    this.mainValue = "";
    this.status0Text="";
    this.status1Text="";
    this.status2Text="";

    this.currentUser = this.userService.currentUserValue;
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
              this.participants = data[i].Partipatents.split(',');
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


      this.dataLoaded = true
    });
    this.refresh();
  }

}
