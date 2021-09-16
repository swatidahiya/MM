import { Component, OnInit, Inject } from '@angular/core';
import { MeetingActions } from '../../models/actions.model';
import { ActionService } from '../../controllers/action.service'
import { ActivatedRoute,Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MainNavComponent, ActionDailogData } from '../main-nav/main-nav.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from 'src/app/models/meetings.model';


@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css'],
  providers: [ActionService,UserService,MeetingService]
})
export class ActionDialogComponent implements OnInit {


  action = new MeetingActions;
  meetingID: any;
  meeting= new Meetings;
  showMessage = false;
  field: any;
  options: User[];
  contacts = [];
  minDate: Date;

  constructor(public dialogRef: MatDialogRef<ActionDialogComponent>,
    private actionService: ActionService,
    
    private userService: UserService,
    private meetingService: MeetingService,
              private _route: ActivatedRoute,
              public router: Router,
              @Inject(MAT_DIALOG_DATA) public data: ActionDailogData) {
               }

  ngOnInit() {
    this.minDate = new Date();
    this.userService.getAllUsers().then(result => {
      console.log("all users")
      console.log(result)
      this.options = result; 
    })
    var matched = this.router.url.match(/browse\/([\d]*)/);
    const id = matched.pop();
    console.log("meeting id ================================" , id)
     this.meetingService.getMeetingById(id).then(data => {
       console.log(data)
      this.meeting = data;
      console.log("meeting data")
      console.log(this.meeting)
    })
  }

  getPosts(val : any) {
    this.contacts.push(val);
  }

  async sendData(action : any) {
    if(action.ActionItem_Title == null) {
      this.showMessage = true;
      this.field = 'Action Title';
    } 
    // else if (action.project_Name == null) {
    //   this.showMessage = true;
    //   this.field = 'Project Name'
    // }
     else if (action.ActionDate == null) {
      this.showMessage = true;
      this.field = ' Valid Action Date'
    }
     else if (action.Priority == null) {
      this.showMessage = true;
      this.field = 'Priority'
    }
     else {
    this.action.Status = 0;
    this.action.ActionAssignedTo=this.contacts.toString();
    this.action.MeetingID = this.data.meetingID;
    this.action.project_Name= this.meeting[0].project_Name;
    this.action.ActionDate = action.ActionDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    this.action.ActionTime = new Date().toUTCString()
    console.log(action)
    await this.actionService.postAction(action).then(data => {
      this.dialogRef.close();
      alert("The action has been created")
    })
  }
  }

}
