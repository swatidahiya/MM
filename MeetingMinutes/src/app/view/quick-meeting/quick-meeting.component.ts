import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { UserService } from 'src/app/controllers/user.service';
import { Meetings } from 'src/app/models/meetings.model';
import { Router } from '@angular/router';

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

  options: User[];
  contacts = [];
  displayName = [];
  meeting = new Meetings;
  currentUser: User;
  showMessage = false;
  field: any;


  constructor(private meetingService: MeetingService,
    private userService: UserService,
    private route: Router) { }

  ngOnInit() {
    document.getElementById('ribbonA').style.background = '#e74c3c';
    document.getElementById('headerA').style.color = '#e74c3c';
    this.currentUser = this.userService.currentUserValue;
    var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
      // console.log(result)
      if (result) {
        if (this.currentUser.IsActive === true) {
          // console.log(this.userCheck())
          this.refresh();
        } else {
          alert("Your account has been blocked. Please contact admin!");
          this.route.navigateByUrl('/login')
        }
      } else {
        alert("Your account has been deleted. Please contact admin!");
        this.route.navigateByUrl('/login')
      }
    });
  }

  openExapnsion(val: any) {
    switch (val) {
      case 'A': this.collapsedA = !this.collapsedA;
        this.collapsedB = false;
        this.collapsedC = false;
        if (this.collapsedA) {
          document.getElementById('ribbonA').style.background = '#e74c3c';
          document.getElementById('headerA').style.color = '#e74c3c';
          document.getElementById('ribbonB').style.background = '#21759a';
          document.getElementById('headerB').style.color = '#21759a';
          document.getElementById('ribbonC').style.background = '#21759a';
          document.getElementById('headerC').style.color = '#21759a';
        } else {
          document.getElementById('ribbonA').style.background = '#21759a';
          document.getElementById('headerA').style.color = '#21759a';
        }
        break;
      case 'B': this.collapsedB = !this.collapsedB;
        this.collapsedA = false;
        this.collapsedC = false;
        if (this.collapsedB) {
          document.getElementById('ribbonB').style.background = '#e74c3c';
          document.getElementById('headerB').style.color = '#e74c3c';
          document.getElementById('ribbonA').style.background = '#21759a';
          document.getElementById('headerA').style.color = '#21759a';
        } else {
          document.getElementById('ribbonB').style.background = '#21759a';
          document.getElementById('headerB').style.color = '#21759a';
        }
        break;
      case 'C': this.collapsedC = !this.collapsedC;
        this.collapsedB = false;
        this.collapsedA = false;
        if (this.collapsedC) {
          document.getElementById('ribbonC').style.background = '#e74c3c';
          document.getElementById('headerC').style.color = '#e74c3c';
          document.getElementById('ribbonA').style.background = '#21759a';
          document.getElementById('headerA').style.color = '#21759a';
          document.getElementById('ribbonB').style.background = '#21759a';
          document.getElementById('headerB').style.color = '#21759a';
        } else {
          document.getElementById('ribbonC').style.background = '#21759a';
          document.getElementById('headerC').style.color = '#21759a';
        }
        break;
    }
  }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    const data = await this.userService.getAllUsers().then(result => {
      this.options = result;
    })
  }

  getPosts(val: any) {
    this.meeting.Partipatents = val;
    this.contacts.push(val);
    var tempUser = this.options.find(({ Email }) => Email === val);
    this.displayName.push(tempUser)
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

    console.log(this.contacts)
  }

  async submitMeeting(meeting: any) {
    if (meeting.project_Name == null) {
      this.showMessage = true;
      this.field = 'Project Name';
    } else if (meeting.Meeting_Subject == null) {
      this.showMessage = true;
      this.field = 'Subject For Meeting'
    } else if (meeting.Meeting_objective == null) {
      this.showMessage = true;
      this.field = 'Project Description'
    }else if (meeting.Agenda == null) {
      this.showMessage = true;
      this.field = 'Meeting Agenda'
    }
    else {
      this.meeting.Partipatents = this.contacts;
      var temp = Date.now();
      var temp1 = new Date(temp);
      temp1.setHours(temp1.getHours() + 1);
      this.meeting.MeetingDate = temp1
      this.meeting.MeetingTime = temp1.toLocaleString();
      this.meeting.Conclusion = "Add Your Conclusion Here!";
      this.meeting.reoccrence = 'Yes';
      this.meeting.Status = 0;
      this.meeting.HostUser = this.currentUser.LoginName;
      this.meeting.RoomKey = Math.floor(Math.random() * 0xFFFFFF);
      console.log(this.meeting)
      var object = {};
      object["subject"] = "Meeting Invitation",
        object["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + this.meeting.Meeting_Subject;
      object["MeetingSubject"] = this.meeting.Meeting_Subject;
      object["MeetingDate"] = this.meeting.MeetingTime;
      object["HostUser"] = this.meeting.HostUser;
      // object["ShareLink"] = "www.checkboxtechnology.com";
      // object["Meeting_Location"]="https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+this.currentUser.FirstName +" "+this.currentUser.LastName+"$"+this.meeting.MeetingID+"$1";
      // object["MeetingDescription"] = this.meeting.Agenda;
      await this.meetingService.postMeeting(this.meeting).then(async () => {
        alert("The meeting has been created successfully");
        this.route.navigateByUrl('/dashboard')
        console.log("success");
        object["toname"] = this.currentUser.FirstName +" "+this.currentUser.LastName;
        for (var i = 0; i < this.displayName.length; i++) {
          // object["toname"] = this.displayName[i].FirstName;
          object["toemail"] = this.displayName[i].Email;
          var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
          object["Meeting_Location"]="https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+temp.LoginName +"$"+this.meeting.MeetingID+"$1";
          await this.meetingService.sendMail(object).then(result => {
            console.log("Message sent");
          })
        }
      })
    }
  }

}
