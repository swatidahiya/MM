import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { Meetings } from '../../models/meetings.model'
import { MeetingService } from 'src/app/controllers/meetings.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service'; //file path may change → 
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

// declare let Email: any;
import { CheckBoxSelectionService, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css'],
  providers: [MeetingService, UserService, CheckBoxSelectionService]
})
export class NewMeetingComponent implements OnInit {

  currentUser: User;
  recurrence: boolean = false;
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
  otherUsers: any;
  otherMails: Array<any> = [];
  addMoreUser: boolean = false;

  constructor(private _formBuilder: FormBuilder, private meetingService: MeetingService,
    private userService: UserService,
    private http: HttpClient,
    private route: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.minDate = new Date();
   
    this.refresh();
    // console.log("recurrence " + this.recurrenceBool)
  }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    const data = this.userService.getAllUsers().then(result => {
      this.options = result;
    })
  }

  get f() { return this.firstFormGroup.controls; }

  async createMeeting(formData: NgForm) {

    if (this.meeting.MeetingDate == undefined || this.meeting.MeetingDate == null) {
      alert("Meeting Subject & Date both are Required!!")
    }
    else {
      if (this.meeting.Meeting_Subject == undefined || this.meeting.Meeting_Subject == null) {
        alert("Meeting Subject is Required!!")
      }
      else {

        if (this.meeting.Meeting_Subject !== '') {
          var object = formData.value;
          var partipatents = [];
          var assignee = [];

          var temp = new Date(formData.value.MeetingDate);

          object.MeetingDate = temp;
          object['MeetingTime'] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

          object['Status'] = 0;
          object['HostUser'] = this.currentUser.LoginName;
          object['HostUserMail'] = this.currentUser.Email;
          object['RoomKey'] = Math.floor(Math.random() * 0xFFFFFF);
          object['Conclusion'] = "Add Your Conclusion Here!";
          console.log("i am printing here")
          console.log(this.recurrence);
          object['recurrence'] = this.recurrence;

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
          console.log("this is our meeting object")
          console.log(object);
          var mailObject = {};
          mailObject["subject"] = "Meeting Invitation",
            mailObject["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + object.Meeting_Subject;
          mailObject["MeetingSubject"] = object.Meeting_Subject;
          mailObject["MeetingDate"] = object.MeetingTime;
          mailObject["HostUser"] = object.HostUser;
          mailObject["MeetingDescription"] = object.Meeting_objective;
          mailObject["HostUserMail"] = object.HostUserMail;


          await this.meetingService.postMeeting(object).then(result => {
            console.log(result)
            this.displayName.push(this.currentUser)
            mailObject["toname"] = this.currentUser.FirstName + " " + this.currentUser.LastName;

            for (var i = 0; i < this.displayName.length; i++) {
              mailObject["toemail"] = this.displayName[i].Email;
              var temp = this.options.find(({ Email }) => Email === this.displayName[i].Email);
              mailObject["Meeting_Location"] = "https://mmv1.checkboxtechnology.com/videoRoom/" + object.RoomKey;

              this.meetingService.sendMail(mailObject).then(result => {
                console.log("Message sent");
              })
            }

            this.otherMails.forEach(mail => {
              mailObject["toemail"] = mail;
              mailObject["Meeting_Location"] = "https://mmv1.checkboxtechnology.com/videoRoom/" + object.RoomKey;
              this.meetingService.sendMail(mailObject).then(result => {
                console.log("other mail sent");
              })
            });

            var c = confirm("Meeting scheduled and mail sent successfully!\nDo you want add agenda?");
            if (c == true) {
              this.dialog.open(ActionDialogComponent, {
                width: '400px',
                data: { id: result.MeetingID, from: 1 }
              });
            }
            else {
              this.route.navigate(['/dashboard/'])
            }
          })
        }
        else {
          alert("Meeting Subject is Required!!!")
        }

      }
    }

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

  addUsers() {
    this.addMoreUser = !this.addMoreUser;

    if (this.addMoreUser == false) {
      this.otherMails = [];
    }
    console.log(this.addMoreUser)
  }

  addMail(val: any) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(val !== undefined) {
      if (val.match(mailformat)) {
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
        alert("Please enter valid mail.")
      }
    }
    else {
      alert("Please enter valid mail.")

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
