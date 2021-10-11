import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { Meetings } from '../../models/meetings.model'
import { MeetingService } from 'src/app/controllers/meetings.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service'; //file path may change → 
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
// declare let Email: any;

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
  providers: [MeetingService, UserService]
})
export class NewMeetingComponent implements OnInit {

  currentUser: User;

  meeting = new Meetings;

  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  thirdFormGroup: FormGroup;
  options: User[];
  contacts = [];
  displayName = [];
  showFirstMessage = "Please fill up all the fields";

  firstFormSubmit = false;
  seconFormSubmit = false;
  thirdFormSubmit = false;
  isLinear = true;
  minDate: Date;

  constructor(private _formBuilder: FormBuilder, private meetingService: MeetingService,
    private userService: UserService,
    private http: HttpClient,
    private route: Router) { }

  ngOnInit() {
    this.minDate = new Date();
    // this.firstFormGroup = this._formBuilder.group({
    //   project_Name: [null, Validators.required],
    //   Meeting_Subject: ['', Validators.required],
    //   Meeting_objective: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   Meeting_Location: ['', Validators.required],
    //   Agenda: ['', Validators.required],
    //   MeetingDate: ['', Validators.required],
    // });
    // this.thirdFormGroup = this._formBuilder.group({
    //   Partipatents: ['', Validators.required]
    // });
    this.refresh();

  }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    const data = this.userService.getAllUsers().then(result => {
      this.options = result;
    })

  }

  get f() { return this.firstFormGroup.controls; }

  // form1() {
  //   this.firstFormSubmit = true;

  //   if(this.firstFormGroup.invalid){
  //     return
  //   }

  //   this.meeting.project_Name = this.firstFormGroup.value.project_Name;
  //   this.meeting.Meeting_Subject = this.firstFormGroup.value.Meeting_Subject;
  //   this.meeting.Meeting_objective = this.firstFormGroup.value.Meeting_objective;
  //   this.meeting.Conclusion = "Add Your Conclusion Here!";
  //   this.meeting.reoccrence = 'Yes';
  // }

  // form2() {
  //   this.meeting.Meeting_Location = this.secondFormGroup.value.Meeting_Location;
  //   this.meeting.Agenda = this.secondFormGroup.value.Agenda;
  //   var temp = new Date(this.secondFormGroup.value.MeetingDate);

  //   this.meeting.MeetingDate = temp;
  //   this.meeting.MeetingTime = temp.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});

  //   this.meeting.Status = 0;
  //   this.meeting.HostUser = this.currentUser.LoginName;
  //   this.meeting.RoomKey = Math.floor(Math.random() * 0xFFFFFF);
  // }

  // async form3() {
  //   this.contacts.push(this.currentUser.Email);
  //   this.meeting.Partipatents = this.contacts.toString();
  //   var object = {};
  //   object["subject"] = "Meeting Invitation",
  //   object["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + this.meeting.project_Name;
  //   object["MeetingSubject"] = this.meeting.Meeting_Subject;
  //   object["MeetingDate"] = this.meeting.MeetingTime;
  //   object["HostUser"] = this.meeting.HostUser;

  //   object["MeetingDescription"] = this.meeting.Agenda;

  //   console.log(this.meeting)

  //   await this.meetingService.postMeeting(this.meeting).then(async () => {
  //     this.displayName.push(this.currentUser)
  //     object["toname"] = this.currentUser.FirstName +" "+ this.currentUser.LastName
  //     for(var i = 0; i< this.displayName.length; i++) {
  //       object["toemail"] = this.displayName[i].Email;
  //       var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
  //       object["Meeting_Location"] = "https://meetingminutes.checkboxtechnology.com/videoRoom/"+this.meeting.RoomKey;
  //       console.log(object)

  //       await this.meetingService.sendMail(object).then(result => {
  //         console.log("Message sent");
  //       })
  //     }
  //   })
  // }

  async createMeeting(formData: NgForm) {

    var object = formData.value;
    var partipatents = [];
    var assignee = [];

    var temp = new Date(formData.value.MeetingDate);

    object.MeetingDate = temp;
    object['MeetingTime'] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    object['Status'] = 0;
    object['HostUser'] = this.currentUser.LoginName;
    object['RoomKey'] = Math.floor(Math.random() * 0xFFFFFF);
    object['Conclusion'] = "Add Your Conclusion Here!";
    object['reoccrence'] = 'Yes';

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

    object['Partipatents'] = partipatents;
    object['MeetingAssignedTo'] = assignee;

    var mailObject = {};
    mailObject["subject"] = "Meeting Invitation",
    mailObject["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + object.Meeting_Subject;
    mailObject["MeetingSubject"] = object.Meeting_Subject;
    mailObject["MeetingDate"] = object.MeetingTime;
    mailObject["HostUser"] = object.HostUser;
    mailObject["MeetingDescription"] = object.Meeting_objective;


    await this.meetingService.postMeeting(object).then(result => {
      this.displayName.push(this.currentUser)
      mailObject["toname"] = this.currentUser.FirstName + " " + this.currentUser.LastName;

      for (var i = 0; i < this.displayName.length; i++) {
        mailObject["toemail"] = this.displayName[i].Email;
        var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
        mailObject["Meeting_Location"] = "https://meetingminutes.checkboxtechnology.com/videoRoom/" + object.RoomKey;

        this.meetingService.sendMail(mailObject).then(result => {
          console.log("Message sent");
        })
      }
      alert("Meeting scheduled successfully!")
      this.route.navigate(['/dashboard/'])

    })
  }


  getPosts(val: any) {
    if (this.contacts.indexOf(val) === -1) {
      this.contacts.push(val);
      var tempUser = this.options.find(({ Email }) => Email === val);
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

}
