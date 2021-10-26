import { Component, OnInit, Inject } from '@angular/core';
import { MeetingActions } from '../../models/actions.model';
import { ActionService } from '../../controllers/action.service'
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ActionDailogData } from '../main-nav/main-nav.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from 'src/app/models/meetings.model';


@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css'],
  providers: [ActionService, UserService, MeetingService]
})
export class ActionDialogComponent implements OnInit {


  action = new MeetingActions;
  meetingID: any;
  meeting = new Meetings;
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
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ActionDailogData) {
  }

  ngOnInit() {

    console.log("meeting id: ", this.data['id'])

    this.minDate = new Date();
    this.userService.getAllUsers().then(result => {
      this.options = result;
    })

    // var matched = this.router.url.match(/browse\/([\d]*)/);
    // const id = matched.pop();
    this.meetingService.getMeetingById(this.data['id']).then(data => {
      this.meeting = data[0];
      console.log(this.meeting)
    })
  }

  getPosts(val: any) {
    this.contacts.push(val);
  }

  async sendData(action: any) {
    if (action.ActionItem_Title == null) {
      this.showMessage = true;
      this.field = 'Action Title';
    }

    else if (action.ActionDate == null) {
      this.showMessage = true;
      this.field = ' Valid Action Date'
    }

    else if (action.Priority == null) {
      this.showMessage = true;
      this.field = 'Priority'
    }

    else {
      action.Status = 0;
      action.meetingName = this.meeting.Meeting_Subject;
      action.ActionAssignedTo = this.contacts.toString();
      action.MeetingID = this.data['id'];
      action.ActionDate = action.ActionDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      action.ActionTime = new Date().toUTCString()
      action.decision = '';
      await this.actionService.postAction(action).then(data => {

        if (this.data['from'] == 1) {
          var c = confirm("Agenda created successfully!\nDo you want add more agenda?");
          if (c == true) {
            this.dialogRef.close();
            this.dialog.open(ActionDialogComponent, {
              width: '400px',
              data: { id: this.data['id'], from: 1 }
            });
          }
          else {
            this.dialogRef.close();
            this.router.navigate(['/dashboard/'])
          }
        }
        else {
          alert("Agenda created successfully!")
          this.reloadComponent(this.data['id'])
          this.dialogRef.close();
        }
      })
    }
  }

  onClose() {
    if (this.data['from'] == 1) {
      this.dialogRef.close();
      this.router.navigate(['/dashboard/']);

    }
    else {
      this.dialogRef.close();
    }
  }

  reloadComponent(id: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/browse/' + id]);
  }

}
