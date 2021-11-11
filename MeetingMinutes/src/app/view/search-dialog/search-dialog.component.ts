import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from 'src/app/models/meetings.model';
import { Router } from '@angular/router';
import { invalid } from '@angular/compiler/src/render3/view/util';

export interface SearchDailogData {
  searchString: any;
}

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
  providers: [MeetingService]
})
export class SearchDialogComponent implements OnInit {

  meetings: Array<any> = [];
  dataLoad = false;
  searchString: any;
  noData = false;

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SearchDailogData,
    private meetingService: MeetingService,
    private route: Router) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    var string = this.data['value'].toLowerCase();
    var re = new RegExp(string.toString(), "g");

    let dateString = new Date(string);
    var milliseconds = dateString.getTime()
    var temp = milliseconds.toString()
    
    this.meetings = [];
    var meetingName;
    var meetingId;
    var objective;
    var hostUser;
    var meetingdate;

    const data = await this.meetingService.getMeetings().then(result => {
      if(result !== null) {
        result.forEach(meeting => {
          if(meeting.Meeting_Subject == undefined || meeting.Meeting_Subject == null) {
            meetingName = ' ';
          }
          else {
            meetingName = meeting.Meeting_Subject.toLowerCase();
          }

          if(meeting.Meeting_objective == undefined || meeting.Meeting_objective == null) {
            meetingName = ' ';
          }
          else {
            objective = meeting.Meeting_objective.toLowerCase();
          }
          
          meetingId = meeting.MeetingID.toString();
          hostUser = meeting.HostUser.toLowerCase();
          meetingdate = new Date(meeting.MeetingDate);

          meetingdate = meetingdate.toISOString().split('T')[0]
          var t  = new Date(meetingdate);
          var newDate = t.getTime()
          var temp2 = newDate.toString();
        

          if(meetingName.search(re) == -1) {
            if(objective.search(re) == -1) {
              if(meetingId.search(re) == -1) {
                if(hostUser.search(re) == -1) {
                  if(temp.substring(0, 5) == temp2.substring(0, 5)) {
                    this.meetings.push(meeting)
                  }
                }
                else {
                  this.meetings.push(meeting)
                }
              }
              else {
                this.meetings.push(meeting)
              }
            }
            else {
              this.meetings.push(meeting)
            }
          }
          else {
            this.meetings.push(meeting)
          }


        });
      }
      else {
        this.meetings = [];
      }

      this.dataLoad = true;

    })

    // const data = await this.meetingService.searchMeetings(this.data.searchString).then( result => {
    //   console.log(result)
    //   this.searchString = this.data.searchString;
    //   this.searchedMeetings = result;
    //   if(this.searchedMeetings.length < 1){
    //     this.noData = true;
    //   }
    //   this.dataLoad = true;
    // })
  }

  onMeeting(meetingID: any) {
    this.dialogRef.close()
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['/browse/' + meetingID])
  }

}
