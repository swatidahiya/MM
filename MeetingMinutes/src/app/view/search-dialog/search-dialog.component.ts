import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from 'src/app/models/meetings.model';
import { Router } from '@angular/router';

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
    var string = this.data['value'].toLowerCase()
    var re = new RegExp(string, "g");
    console.log(re)

    this.meetings = [];
    var meetingName;
    var meetingId;
    var objective;
    var hostUser;

    const data = await this.meetingService.getMeetings().then(result => {
      if(result !== null) {
        result.forEach(meeting => {
          meetingName = meeting.Meeting_Subject.toLowerCase();
          meetingId = meeting.MeetingID.toString();
          objective = meeting.Meeting_objective.toLowerCase();
          hostUser = meeting.HostUser.toLowerCase();

          if(meetingName.search(re) == -1) {
            if(objective.search(re) == -1) {
              if(meetingId.search(re) == -1) {
                if(hostUser.search(re) == -1) {

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
    this.route.navigate(['/browse/'+ meetingID])
  }

}
