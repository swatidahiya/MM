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

  searchedMeetings: Meetings[];
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
    const data = await this.meetingService.searchMeetings(this.data.searchString).then( result => {
      console.log(result)
      this.searchString = this.data.searchString;
      this.searchedMeetings = result;
      if(this.searchedMeetings.length < 1){
        this.noData = true;
      }
      this.dataLoad = true;
    })
  }

  getMeeting(meetingID: any) {
    this.dialogRef.close()
    window.open(
      'browse/' + meetingID,
      '_blank'
    );
    // this.route.navigate(['/browse/'+ meetingID])
  }

}
