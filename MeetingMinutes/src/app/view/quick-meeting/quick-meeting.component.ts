import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { UserService } from 'src/app/controllers/user.service';
import { Meetings } from 'src/app/models/meetings.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quick-meeting',
  templateUrl: './quick-meeting.component.html',
  styleUrls: ['./quick-meeting.component.css'],
  providers: [MeetingService, UserService]
})
export class QuickMeetingComponent implements OnInit {

  collapsedA = true;
  collapsedB = false;
  collapsedC = false;

  users: User[];

  contacts = [];
  displayName = [];
  meeting = new Meetings;
  currentUser: User;
  showMessage = false;
  field: any;
  otherUsers: any;
  otherMails: Array<any> = [];
  addMoreUser: boolean = false;

  constructor(private meetingService: MeetingService,
    private userService: UserService,
    private route: Router) { }

  ngOnInit() {
    // document.getElementById('ribbonA').style.background = '#e74c3c';
    // document.getElementById('headerA').style.color = '#e74c3c';
    // this.currentUser = this.userService.currentUserValue;


    this.refresh();

  }

  // openExapnsion(val: any) {
  //   switch (val) {
  //     case 'A': this.collapsedA = !this.collapsedA;
  //       this.collapsedB = false;
  //       this.collapsedC = false;
  //       if (this.collapsedA) {
  //         document.getElementById('ribbonA').style.background = '#e74c3c';
  //         document.getElementById('headerA').style.color = '#e74c3c';
  //         document.getElementById('ribbonB').style.background = '#21759a';
  //         document.getElementById('headerB').style.color = '#21759a';
  //         document.getElementById('ribbonC').style.background = '#21759a';
  //         document.getElementById('headerC').style.color = '#21759a';
  //       } else {
  //         document.getElementById('ribbonA').style.background = '#21759a';
  //         document.getElementById('headerA').style.color = '#21759a';
  //       }
  //       break;
  //     case 'B': this.collapsedB = !this.collapsedB;
  //       this.collapsedA = false;
  //       this.collapsedC = false;
  //       if (this.collapsedB) {
  //         document.getElementById('ribbonB').style.background = '#e74c3c';
  //         document.getElementById('headerB').style.color = '#e74c3c';
  //         document.getElementById('ribbonA').style.background = '#21759a';
  //         document.getElementById('headerA').style.color = '#21759a';
  //       } else {
  //         document.getElementById('ribbonB').style.background = '#21759a';
  //         document.getElementById('headerB').style.color = '#21759a';
  //       }
  //       break;
  //     case 'C': this.collapsedC = !this.collapsedC;
  //       this.collapsedB = false;
  //       this.collapsedA = false;
  //       if (this.collapsedC) {
  //         document.getElementById('ribbonC').style.background = '#e74c3c';
  //         document.getElementById('headerC').style.color = '#e74c3c';
  //         document.getElementById('ribbonA').style.background = '#21759a';
  //         document.getElementById('headerA').style.color = '#21759a';
  //         document.getElementById('ribbonB').style.background = '#21759a';
  //         document.getElementById('headerB').style.color = '#21759a';
  //       } else {
  //         document.getElementById('ribbonC').style.background = '#21759a';
  //         document.getElementById('headerC').style.color = '#21759a';
  //       }
  //       break;
  //   }
  // }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    const data = await this.userService.getAllUsers().then(result => {
      this.users = result;
    })
  }

  getPosts(val: any) {
    if (this.contacts.indexOf(val) === -1) {
      this.contacts.push(val);
      var tempUser = this.users.find(({ Email }) => Email === val);
      if (this.displayName.indexOf(tempUser) === -1) {
        this.displayName.push(tempUser)
      }
    }
    else {
      alert("The user is already added");
    }
  }

  onCancelUser(val: any, email: any) {
    const index: number = this.contacts.indexOf(email);
    if (index !== -1) {
      this.contacts.splice(index, 1);
    }

    const index1: number = this.displayName.indexOf(val);
    if (index1 !== -1) {
      this.displayName.splice(index1, 1);
    }

  }

  addUsers() {
    this.addMoreUser = !this.addMoreUser;

    if (this.addMoreUser == false) {
      this.otherMails = [];
    }
    console.log(this.addMoreUser)
  }

  addMail(val: any) {
    if (this.otherMails.length > 0) {
      var count = 0;
      this.otherMails.forEach(mail => {
        if (mail == val) {
          count++;
        }
      });

      if (count == 0) {
        this.otherMails.push(val);
        this.otherUsers = '';
      }
      else {
        alert("This mail is already added!")
        this.otherUsers = '';
      }
    }
    else {
      this.otherMails.push(val);
      this.otherUsers = '';
    }
  }

  onCancelMail(value: any) {

    var index;
    this.otherMails.forEach((mail, i) => {
      if (mail == value) {
        index = i;
      }
    });

    this.otherMails.splice(index, 1);
  }

  async createMeeting(formData: NgForm) {

    var object = formData.value;
    var partipatents = [];
    var assignee = [];

    this.displayName.forEach(user => {
      partipatents.push(user.Email);
      assignee.push(user.LoginName);
    });

    var count = 0;
    partipatents.forEach(email => {
      if (email == this.currentUser.Email) {
        count++;
      }
    });

    if (count == 0) {
      partipatents.push(this.currentUser.Email)
    }

    if (this.otherMails.length > 0) {
      this.otherMails.forEach(mail => {
        partipatents.push(mail);
      });
    }

    object['Partipatents'] = partipatents;
    object['MeetingAssignedTo'] = assignee;

    var temp = Date.now();
    var temp1 = new Date(temp);
    temp1.setHours(temp1.getHours() + 1);

    object['MeetingDate'] = temp1
    object['MeetingTime'] = temp1.toLocaleString();
    object['Conclusion'] = "Add Your Conclusion Here!";
    object['reoccrence'] = 'Yes';
    object['Status'] = 0;
    object['HostUser'] = this.currentUser.LoginName;
    object['RoomKey'] = Math.floor(Math.random() * 0xFFFFFF);


    var mailObject = {};
    mailObject["subject"] = "Meeting Invitation",
    mailObject["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + object.Meeting_Subject;
    mailObject["MeetingSubject"] = object.Meeting_Subject;
    mailObject["MeetingDate"] = object.MeetingTime;
    mailObject["HostUser"] = object.HostUser;
    mailObject["MeetingDescription"] = object.Meeting_objective;
    mailObject["toname"] = this.currentUser.FirstName + " " + this.currentUser.LastName;


    await this.meetingService.postMeeting(this.meeting).then(async () => {
      alert("The meeting has been created successfully");

      for (var i = 0; i < partipatents.length; i++) {
        mailObject["toemail"] = partipatents[i];
        mailObject["Meeting_Location"] = "https://meetingminutes.checkboxtechnology.com/videoRoom/" + object.RoomKey;
        this.meetingService.sendMail(mailObject).then(result => {
          console.log("Message sent");
        })
      }
      this.route.navigate(['/dashboard/'])

    })

  }

  // async submitMeeting(meeting: any) {
  //   if (meeting.project_Name == null) {
  //     this.showMessage = true;
  //     this.field = 'Project Name';
  //   } else if (meeting.Meeting_Subject == null) {
  //     this.showMessage = true;
  //     this.field = 'Subject For Meeting'
  //   } else if (meeting.Meeting_objective == null) {
  //     this.showMessage = true;
  //     this.field = 'Project Description'
  //   } else if (meeting.Agenda == null) {
  //     this.showMessage = true;
  //     this.field = 'Meeting Agenda'
  //   }
  //   else {
  //     this.meeting.Partipatents = this.contacts;
  //     var temp = Date.now();
  //     var temp1 = new Date(temp);
  //     temp1.setHours(temp1.getHours() + 1);
  //     this.meeting.MeetingDate = temp1
  //     this.meeting.MeetingTime = temp1.toLocaleString();
  //     this.meeting.Conclusion = "Add Your Conclusion Here!";
  //     this.meeting.reoccrence = 'Yes';
  //     this.meeting.Status = 0;
  //     this.meeting.HostUser = this.currentUser.LoginName;
  //     this.meeting.RoomKey = Math.floor(Math.random() * 0xFFFFFF);
  //     console.log(this.meeting)
  //     var object = {};
  //     object["subject"] = "Meeting Invitation",
  //       object["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + this.meeting.Meeting_Subject;
  //     object["MeetingSubject"] = this.meeting.Meeting_Subject;
  //     object["MeetingDate"] = this.meeting.MeetingTime;
  //     object["HostUser"] = this.meeting.HostUser;

  //     await this.meetingService.postMeeting(this.meeting).then(async () => {
  //       alert("The meeting has been created successfully");
  //       this.route.navigateByUrl('/dashboard')
  //       console.log("success");
  //       object["toname"] = this.currentUser.FirstName + " " + this.currentUser.LastName;
  //       for (var i = 0; i < this.displayName.length; i++) {
  //         object["toemail"] = this.displayName[i].Email;
  //         var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
  //         object["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM" + this.meeting.RoomKey + "$" + temp.LoginName + "$" + this.meeting.MeetingID + "$1";
  //         await this.meetingService.sendMail(object).then(result => {
  //           console.log("Message sent");
  //         })
  //       }
  //     })
  //   }
  // }

}
