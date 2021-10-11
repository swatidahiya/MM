import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/controllers/poll.service';
import { PollOption } from 'src/app/models/pollOption.model';
import { async } from '@angular/core/testing';
import { UserService } from 'src/app/controllers/user.service';

@Component({
  selector: 'app-respond-poll',
  templateUrl: './respond-poll.component.html',
  styleUrls: ['./respond-poll.component.css'],
  providers: [PollService, UserService]
})
export class RespondPollComponent implements OnInit {

  allPoll: Poll[];
  selectedValue: any;
  activePoll: any;
  dataLoad = false;
  questionLoad = false;
  showmsg = false;
  finalAnswer: any;
  pollOptionTemp: String[];
  voteCount: any;
  currentUser: any;

  constructor(private pollService: PollService, private userService: UserService) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    const data = await this.pollService.getAllPoll().then( async result => {
      // console.log(result)
      // for (var i = 0; i < result.length; i++) {
      //   var time = this.calculateDiff(result[i].Polldate)
      //   if (time >= 1) {
      //     // console.log(result[i].PollOptions.length)
      //     // console.log(time)
      //     // console.log("Inside time zone")
      //     // console.log(result[i]);
      //     for(var j = 0; j < result[i].PollOptions.length; j++) {
      //      await this.pollService.deletePollOptions(result[i].PollOptions[j].PollOptionID).then( success => {
      //         console.log("Options Deleted Successfully")
      //       })
      //     }
      //     await this.pollService.deletePoll(result[i].PollID).then(data => {
      //       console.log("sucess")
      //     })
      //   }
      // }
      this.allPoll = result;
      this.questionLoad = true;
      console.log(this.allPoll)
    })
  }

  calculateDiff(dateSent){
    let currentDate = new Date();
    console.log(currentDate)
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  selectOption() {
    console.log(this.selectedValue)
    this.activePoll = this.allPoll.find(({Question}) => Question === this.selectedValue);
    console.log("activePoll value")
    console.log(this.activePoll)
    if(this.activePoll != null){
      this.dataLoad = true;
    } 
    this.pollOptionTemp = this.activePoll.options;
    console.log(this.pollOptionTemp)
    console.log(this.pollOptionTemp[1])
    // console.log(this.pollOptionTemp[1].option);
  }

  addResponse(answer: any) {
  
    
      // for(var i=0; i<this.pollOptionTemp.length; i++)
      // {
      //   if(answer===this.pollOptionTemp[i].option){
      //     this.pollOptionTemp[i].voteCount++;
      //     // this.voteCount = this.pollOptionTemp[i].voteCount;
      //   }
      // }
      this.finalAnswer = answer;
      
      if(this.finalAnswer != null || this.voteCount != null){
        this.showmsg = true;
      }
     
     

    
  }

  submit() {
    let exists = false;
    for(var i=0; i< this.activePoll.answered.length; i++){
      if(this.currentUser.LoginName === this.activePoll.answered[i]){
        exists = true;
      }
    }
    if(exists === false){
      console.log("inside exists")
    var newPoll = this.activePoll;
    newPoll.options = this.pollOptionTemp;
    newPoll.answered = this.activePoll.answered || [];
    newPoll.answered.push(this.currentUser.LoginName);
    this.pollService.updatePoll(newPoll).then(data => {
      console.log("success update poll")
    })
    }else{
      alert("You have already responded")

    }
    // var object = {};
    // object["PollID"] = this.activePoll.PollID;
    // object["Answers"] = this.finalAnswer;
    // // object["Vote"] = 1;
    // if(this.pollOptionTemp.length === 0) {
    //   console.log("Print values");
    //   object["Vote"] = 1;
    //   const data = this.pollService.createPollOption(object).then(result => {
    //     console.log("Result success");
    //   })
    // } else {
    //   // console.log("Nothing Print")
    //   for(var i = 0 ; i < this.pollOptionTemp.length; i++) {
    //     console.log(this.finalAnswer);
    //     console.log(this.pollOptionTemp[i].Answers)
    //     if(this.finalAnswer === this.pollOptionTemp[i].Answers){
    //       object["Vote"] = this.pollOptionTemp[i].Vote + 1;
    //       object["PollOptionID"] = this.pollOptionTemp[i].PollOptionID;
    //       const data = this.pollService.updatePoll(this.pollOptionTemp[i].PollOptionID, object).then(data => {
    //         console.log("Success")
    //       })
    //       break;
    //     } else {
    //       object["Vote"] = 1;
    //       const data = this.pollService.createPollOption(object).then( result => {
    //         console.log("success");
    //       })
    //     }
    //   }
    //   console.log("After break")
    // }
  }
}
