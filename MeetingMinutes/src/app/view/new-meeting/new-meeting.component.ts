import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  // options: string[] = ['Anuj Kumar', 'Danish Ahmad', 'Ankur Garg', 'Mohit Sharma', 'Anil Garg'];
  options: User[];
  contacts = [];
  displayName = [];
  // project_NameText: any;
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
    this.firstFormGroup = this._formBuilder.group({
      // 'project_Name': this.project_Name,
      project_Name: [null, Validators.required],
      Meeting_Subject: ['', Validators.required],
      Meeting_objective: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      Meeting_Location: ['', Validators.required],
      Agenda: ['', Validators.required],
      MeetingDate: ['', Validators.required],
      // MeetingTime: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      Partipatents: ['', Validators.required]
    });
    this.refresh();
    this.currentUser = this.userService.currentUserValue;
    var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
      console.log("-----result of check User")
      console.log(result)
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

    // this.refresh();
  }

  async refresh() {
    // this.currentUser = this.userService.currentUserValue;
    console.log("-----------------inside refresh of new meeting------------------")
    const data = this.userService.getAllUsers().then(result => {
      console.log("result!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      console.log(result)
      this.options = result;
      // console.log(this.options)
    })

  }

  get f() { return this.firstFormGroup.controls;}

  form1() {
    this.firstFormSubmit = true;

    if(this.firstFormGroup.invalid){
      return
    }

    this.meeting.project_Name = this.firstFormGroup.value.project_Name;
    this.meeting.Meeting_Subject = this.firstFormGroup.value.Meeting_Subject;
    this.meeting.Meeting_objective = this.firstFormGroup.value.Meeting_objective;
    this.meeting.Conclusion = "Add Your Conclusion Here!";
    this.meeting.reoccrence = 'Yes';
  }

  form2() {
    this.meeting.Meeting_Location = this.secondFormGroup.value.Meeting_Location;
    this.meeting.Agenda = this.secondFormGroup.value.Agenda;
    var temp = new Date(this.secondFormGroup.value.MeetingDate);
    // temp.setDate(temp.getDate() + 1);

    this.meeting.MeetingDate = temp;
    // this.meeting.MeetingTime = this.secondFormGroup.value.MeetingTime;
    console.log(this.meeting.MeetingDate)
    this.meeting.MeetingTime = temp.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    console.log(this.meeting.MeetingTime)
    // console.log(temp.getTimezoneOffset())
    this.meeting.Status = 0;
    this.meeting.HostUser = this.currentUser.LoginName;
    this.meeting.RoomKey = Math.floor(Math.random() * 0xFFFFFF);
    console.log(this.meeting.RoomKey)
  }

  async form3() {
    this.contacts.push(this.currentUser.Email);
    this.meeting.Partipatents = this.contacts.toString();
    console.log(this.meeting)
    var object = {};
    object["subject"] = "Meeting Invitation",
    object["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + this.meeting.project_Name;
    object["MeetingSubject"] = this.meeting.Meeting_Subject;
    object["MeetingDate"] = this.meeting.MeetingTime;
    object["HostUser"] = this.meeting.HostUser;
    // object["ShareLink"] = "http://meetingminutes.checkboxtechnology.com:8098/login";
   
    object["MeetingDescription"] = this.meeting.Agenda;
    await this.meetingService.postMeeting(this.meeting).then(async () => {
      console.log("success");
      this.displayName.push(this.currentUser)
      object["toname"] = this.currentUser.FirstName +" "+ this.currentUser.LastName
      for(var i = 0; i< this.displayName.length; i++) {
        // object["toname"] = this.displayName[i].FirstName;
        object["toemail"] = this.displayName[i].Email;
        var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
        // object["Meeting_Location"]="https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+temp.LoginName+"$"+this.meeting.MeetingID+"$1";
        object["Meeting_Location"] = "https://meetingminutes.checkboxtechnology.com/videoRoom/"+this.meeting.RoomKey;
        await this.meetingService.sendMail(object).then(result => {
          console.log("Message sent");
        })
      }
    })
  }

  getPosts(val: any) {
    // if(!this.contacts.includes(val)){
    // this.thirdFormGroup.value.Partipatents = val;
    // this.contacts.push(val);
    // var tempUser = this.options.find(({ Email }) => Email === val);
    // this.displayName.push(tempUser)
    // } else {
    //   alert("The user is already added");
    // }
    this.thirdFormGroup.value.Partipatents = val;
    if(this.contacts.indexOf(val) === -1) {
      this.contacts.push(val);
    // this.contacts.push(val);
    var tempUser = this.options.find(({ Email }) => Email === val);
    if(this.displayName.indexOf(tempUser) === -1) {
      this.displayName.push(tempUser)
    } 
  }
    else {
      alert("The user is already added");
     }
  }

  onCancelUser(val: any,  email: any) {
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

}
