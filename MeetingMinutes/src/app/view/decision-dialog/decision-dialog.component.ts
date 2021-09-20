import { Component, OnInit, Inject } from '@angular/core';
import { Decisions } from 'src/app/models/decisions.model';
import { DecisionService } from 'src/app/controllers/decision.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActionDailogData } from '../main-nav/main-nav.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from 'src/app/models/meetings.model';


@Component({
  selector: 'app-decision-dialog',
  templateUrl: './decision-dialog.component.html',
  styleUrls: ['./decision-dialog.component.css'],
  providers: [DecisionService,UserService,MeetingService]
})
export class DecisionDialogComponent implements OnInit {

  decision = new Decisions;
  meetingID: any;
  showMessage = false;
  meeting = new Meetings;
  field: any;
  options: User[];
  contacts = [];
  minDate: Date

  constructor(public dialogRef: MatDialogRef<DecisionDialogComponent>,
    private decisionService: DecisionService,
    private userService: UserService,
    private meetingService: MeetingService,
              private _route: ActivatedRoute,
              public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ActionDailogData) {
  }

  ngOnInit() {
    this.minDate = new Date();
    this.userService.getAllUsers().then(result => {
      this.options = result;
      
    })
    var matched = this.router.url.match(/browse\/([\d]*)/);
    const id = matched.pop();
     this.meetingService.getMeetingById(id).then(data => {
      this.meeting = data;
    })
  }

  getPosts(val : any) {
    this.contacts.push(val);
  }
  async sendData(decision: any) {
    if (decision.DecisionItem_Title == null) {
      this.showMessage = true;
      this.field = 'Decision Title';
    } 
    // else if (decision.project_Name == null) {
    //   this.showMessage = true;
    //   this.field = 'Project Name'
    // }
    else if (decision.DecisionDate == null) {
      this.showMessage = true;
      this.field = ' Valid Decision Date'
    }
    else if (decision.Priority == null) {
      this.showMessage = true;
      this.field = 'Priority'
    }
    else {
      this.decision.Status = 0;
      this.decision.DecisionAssignedTo= this.contacts.toString();
      this.decision.project_Name= this.meeting[0].project_Name;
      this.decision.MeetingID = this.data.meetingID;
      this.decision.DecisionTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      console.log(decision)
      await this.decisionService.postDecision(decision).then(data => {
        this.dialogRef.close();
        alert("The decision has been created")
      })
    }
  }

}
