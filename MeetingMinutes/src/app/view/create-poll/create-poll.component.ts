import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/controllers/poll.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css'],
  providers: [PollService]
})
export class CreatePollComponent implements OnInit {


  poll = new Poll;
  meetingID: any;
  deviceDetectorInfo = null;
  minDate: Date;

  optionOne: any;
  optionTwo: any;
  showMessage = false;
  field:any;
  

  constructor(public dialogRef: MatDialogRef<CreatePollComponent>,
              private pollService: PollService,
              ) { }

  ngOnInit() {
    this.minDate = new Date();
  }
 
  async sendData(poll: any) {
    
    if (poll.Question == null) {
      this.showMessage = true;
      this.field = 'Question'
    }else if (poll.Polldate == null) {
      this.showMessage = true;
      this.field = 'Polldate'
    }else if (this.optionOne == null) {
      this.showMessage = true;
      this.field = 'Option 1';
    } else if (this.optionTwo == null) {
      this.showMessage = true;
      this.field = 'Option 2'
    }
    else {
      var arr= [];
      var obj1= {};
      var obj2 = {};
      obj1['option'] = this.optionOne;
      obj1['voteCount'] = 0;
      obj2['option'] = this.optionTwo;
      obj2['voteCount'] = 0;
      
      arr[0]= obj1;
      arr[1] = obj2;
      this.poll.options = arr;
      console.log(this.poll.options)
      // this.poll.options.push(this.optionTwo);
      this.poll.Active = true;
      var temp = new Date(this.poll.Polldate);
      temp.setDate(temp.getDate() + 1);
      this.poll.Polldate = temp;
      // console.log(this.poll.Polldate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      console.log(poll);
      await this.pollService.createPoll(poll).then(data => {
        this.dialogRef.close();
        alert("The poll has been created")
      });
    }
   
  }

}
