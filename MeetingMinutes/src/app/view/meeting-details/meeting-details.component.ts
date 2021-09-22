import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { ActionService } from 'src/app/controllers/action.service';
import { DecisionService } from 'src/app/controllers/decision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meetings } from 'src/app/models/meetings.model';
import { MeetingActions } from 'src/app/models/actions.model';
import { Decisions } from 'src/app/models/decisions.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CommentService } from 'src/app/controllers/comment.service';
import { Comments } from 'src/app/models/comment.model';
import { MeetingNote } from 'src/app/models/meetingNote.model';
import { MeetingNoteService } from 'src/app/controllers/meetingNote.service';
import { MatSnackBar } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper'

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css'],
  providers: [MeetingService, UserService, CommentService, MeetingNoteService, ActionService, DecisionService]
})
export class MeetingDetailsComponent implements OnInit {

  comment: any;

  // allComments: Comments;

  public urlID: any;

  dataPage: any;
  activePage: any;
  collapsedA = false;
  collapsedB = false;
  time = new Date();
  meeting: Meetings;
  options: User[];
  actionItems: MeetingActions;
  decisions: Decisions;
  tempActionPage = false;
  tempDecisionPage = false;
  participants: string[];
  newParticipant = false;
  filesLoaded = false;
  allFiles = [];
  allComments: Comments[];
  tempAgenda: any;
  imageToShow: any;
  image : any;
  isImageLoading = true;

  downloadFile: any;

  tempMeetingDate: any;
  tempMeetingTime: any;
  fabIcon = false;

  timeToDisplay: any;

  currentUser: User;
  meetingNotes: any = {};
  mNotes: MeetingNote;
  mNote: MeetingNote;
  editMode = false;
  editHeader = false;
  editConclusion = false;
  editAgenda = false;

  dataLoaded = false;
  userVerified = false;

  isCompleted = false;
  isConclude = false;
  isHost = false;
  isShow = false;
  isAction = false;
  deviceDetectorInfo = null;
  minDate: Date;


  @ViewChild('commentArea', { read: ElementRef, static: false }) commentArea: ElementRef;
  @ViewChild('meetingNotes', { read: ElementRef, static: false }) meetingNote: ElementRef;
  @ViewChild('meetingText', { read: ElementRef, static: false }) meetingText: ElementRef;


  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() ConclusionOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() agendaFocus: EventEmitter<string> = new EventEmitter<string>();

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    pagination: true
  };

  public slides = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];
  
  constructor(private meetingService: MeetingService,
    private _route: ActivatedRoute,
    private route: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private commentService: CommentService,
    private meetingNoteService: MeetingNoteService,
    private actionService : ActionService,
    private decisionService : DecisionService,
    private deviceDetectorService: DeviceDetectorService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.minDate = new Date();
    this.dataPage = 'A';
    this.activePage = 'A';
    // document.getElementById('nav-home-tab').style.background = '#e74c3c';

    this.currentUser = this.userService.currentUserValue;
    this.refresh();
    // var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   // console.log(result)
    //   if (result) {
    //     if (this.currentUser.IsActive === true) {
    //       // console.log(this.userCheck())
    //       this.refresh();
    //     } else {
    //       alert("Your account has been blocked. Please contact admin!");
    //       this.route.navigateByUrl('/login')
    //     }
    //   } else {
    //     alert("Your account has been deleted. Please contact admin!");
    //     this.route.navigateByUrl('/login')
    //   }
    // });
  }

  async refresh() {
    this.urlID = this._route.snapshot.params['id'];

    // this.currentUser = this.userService.currentUserValue;
    const id = this._route.snapshot.params['id'];

    // const tempComment = await this.commentService.getAllComments().then(result => {
    //   this.allComments = result;
    //   console.log(this.allComments)
    // })

    const data = await this.meetingService.getMeetingById(id).then(data => {
      console.log("meeting data-----------------------------------------------")
      console.log(data)
      this.meeting = data[0];
      this.tempAgenda = this.meeting.Agenda;

      this.mNotes = this.meeting.Meeting_Notes;

      this.tempMeetingDate = this.meeting.MeetingDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      this.tempMeetingTime = this.meeting.MeetingTime;

      this.timeToDisplay = new Date(this.meeting.MeetingTime);
      console.log(this.timeToDisplay)

      if (this.meeting.Partipatents.length !== 0) {
        this.participants = this.meeting.Partipatents.split(',');
        console.log(this.meeting)
      }
      else{
        this.participants = []
        console.log(this.participants.length);
      }

      console.log(this.currentUser.LoginName)
      console.log(this.meeting.HostUser)
      if (this.currentUser.LoginName == this.meeting.HostUser) {
        this.userVerified = true;
      }

      if (this.currentUser.Initials === 'sAdmin' || this.currentUser.LoginName == this.meeting.HostUser) {
        if (this.meeting.Status === 2) {
          this.isCompleted = true;
          this.isShow = true;
          console.log("isCompleted")
        } else {
          this.isCompleted = false;
          this.isShow = false;
        }
      }

      if (this.currentUser.Initials === 'sAdmin' || this.currentUser.LoginName == this.meeting.HostUser) {
        if (this.meeting.Status === 0) {
          this.isHost = true;
          // console.log("isCompleted")
        } else {
          this.isHost = false;
        }
      }

      if (this.currentUser.Initials === 'sAdmin') {
        this.isAction = true;
      }

      if (this.meeting.Status === 2) {
        this.isConclude = true;
        console.log("isCompleted")
      } else {
        this.isConclude = false;
      }

      const actionData = this.actionService.getActionByMeetingId(this.meeting.MeetingID).then(result =>{
         console.log("actions#############################")
         console.log(result)
         if(result == null){
           this.tempActionPage = false;
         }
         else{
          // result.sort((a: any, b: any) => {
          //       return b.ActionItemID - a.ActionItemID;
          //     });
              this.actionItems = result;
              this.tempActionPage = true;
         }
      })

      const decisionData = this.decisionService.getDecisionByMeetingId(this.meeting.MeetingID).then(result =>{
        // console.log("actions#############################")
        console.log(result)
        if(result == null){
          this.tempDecisionPage = false;
        }
        else{
         // result.sort((a: any, b: any) => {
         //       return b.ActionItemID - a.ActionItemID;
         //     });
             this.decisions = result;
             this.tempDecisionPage = true;
        }
     })

      // if (data.Action_Item.length == 0) {
      //   console.log("ACtion items are null");
      //   this.tempActionPage = false;
      // } else {
      //   data.Action_Item.sort((a: any, b: any) => {
      //     return b.ActionItemID - a.ActionItemID;
      //   });
      //   this.actionItems = this.meeting.Action_Item;
      //   this.tempActionPage = true;
      // }

      // if (data.Decision_Item.length == 0) {
      //   this.tempDecisionPage = false;
      // } else {
      //   data.Decision_Item.sort((a: any, b: any) => {
      //     return b.DecisionItemID - a.DecisionItemID;
      //   })
      //   this.decisions = this.meeting.Decision_Item;
      //   console.log(this.decisions)
      //   this.tempDecisionPage = true;
      // }
      this.dataLoaded = true;
    })
    const data1 = this.userService.getAllUsers().then(result => {
      this.options = result;
    })
    this.getProfilePic();
  }

  invitees(val: any) {
    switch (val) {
      case 'A': this.dataPage = 'A';
        break;
      case 'B': this.dataPage = 'B';
        break;
      case 'C': this.dataPage = 'C';
        break;
      case 'D': this.dataPage = 'D';
        break;
    }
  }
  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }
  
  public onIndexChange(index: number): void {
    console.log('Swiper index: ', index);
  }


  navItem(val: any) {
    switch (val) {
      case 'A': this.activePage = 'A';
        document.getElementById('nav-home-tab').style.background = '#e74c3c';
        document.getElementById('nav-profile-tab').style.background = '#272e38';
        document.getElementById('nav-contact-tab').style.background = '#272e38';
        break;
      case 'B': this.activePage = 'B';
        document.getElementById('nav-profile-tab').style.background = '#e74c3c';
        document.getElementById('nav-home-tab').style.background = '#272e38';
        document.getElementById('nav-contact-tab').style.background = '#272e38';
        break;
      case 'C': this.activePage = 'C';
        document.getElementById('nav-contact-tab').style.background = '#e74c3c';
        document.getElementById('nav-profile-tab').style.background = '#272e38';
        document.getElementById('nav-home-tab').style.background = '#272e38';
        break;
    }
  }



  updateMeeting(val: any, field: any) {
    if(this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin'){
    const id = this._route.snapshot.params['id'];
    var object = {};

    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["reoccrence"] = "Yes";
    object["Conclusion"] = this.meeting.Conclusion;
    object["RoomKey"] = this.meeting.RoomKey;

    switch (field) {
      case 'Meeting_Subject': object["Meeting_Subject"] = val;
        break;
      case 'project_Name': object["project_Name"] = val;
        break;
      case 'Status': if (val === 0) {
        object["Status"] = 1;
      } else if (val === 1) {
        object["Status"] = 2;
      } else {
        object["Status"] = 0;
      }
        break;
    }
    console.log("updating meeting")
    console.log(id);
    console.log(object);
    const data = this.meetingService.updateMeeting(id, object).then(data => {
      this.refresh();
    })
  }
    else{
      location.reload();
    }
  }

  onFocusOut() {
    this.focusOut.emit(this.meeting.Meeting_objective);
    console.log(this.meeting.Meeting_objective)
   if(this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin'){
    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  onHeaderFocused() {
    this.focusOut.emit(this.meeting.Meeting_Subject);
    console.log(this.meeting.Meeting_Subject)

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      this.refresh();
    })
  }

  submitConclusion() {
    this.focusOut.emit(this.meeting.Conclusion);
    console.log(this.meeting.Conclusion)

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      this.refresh();
    })
  }

  submitAgenda() {
    this.focusOut.emit(this.meeting.Agenda);
    console.log(this.meeting.Agenda)
    if(this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin'){
    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    var mailobject = {};
    mailobject["subject"] = "Meeting Agenda Updated",
      mailobject["message"] = "This is to inform you that, agenda has been change for meeting name '" + this.meeting.project_Name + "'" + ".<br/> <br/>" + "The new agenda is : " + this.meeting.Agenda;
    mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
    mailobject["MeetingDate"] = this.meeting.MeetingTime;
    mailobject["NewMeetingDate"] = this.meeting.MeetingTime;
    mailobject["HostUser"] = this.meeting.HostUser;
    
    mailobject["MeetingDescription"] = this.tempAgenda;
    mailobject["NewMeetingDescription"] = this.meeting.Agenda;

    const data = this.meetingService.updateMeeting(id, object).then(async () => {
      for (var i = 0; i < this.participants.length; i++) {
        var temp = this.options.find(({ Email }) => Email === this.participants[i]);
        mailobject["toname"] = temp.FirstName +" "+ temp.LastName;

        // object["toemail"] = this.participants.toString();
        mailobject["toemail"] = temp.Email;
        mailobject["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+temp.LoginName+"$"+this.meeting.MeetingID+"$1";
        this.meetingService.sendMailAgenda(mailobject).then(result => {
          console.log("Message sent to  the participant");
        })
      }
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  detailedAction(actionID: any) {
    this.route.navigate(['/singleActionItem/' + actionID])
  }


  detailedDecision(decisionID: any) {
    this.route.navigate(['/singleDecision/' + decisionID])
  }

  blockParticipant(val: any) {
    const index: number = this.participants.indexOf(val);
    if (index !== -1) {
      this.participants.splice(index, 1);
    }

    console.log(this.participants)

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    var mailobject = {};
    mailobject["subject"] = "Meeting Cancellation",
      mailobject["message"] = "We are kindly to inform you that the meeting name " + this.meeting.project_Name + " has been cancelled.";
    mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
    mailobject["MeetingDate"] = this.meeting.MeetingTime;
    mailobject["HostUser"] = this.meeting.HostUser;
    // mailobject["ShareLink"] = "www.checkboxtechnology.com";
    var tempUser = this.options.find(({ Email }) => Email === val);
    mailobject["Meeting_Location"]="https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+tempUser.LoginName+"$"+this.meeting.MeetingID+"$1";
    mailobject["MeetingDescription"] = this.meeting.Agenda;

    const data = this.meetingService.updateMeeting(id, object).then(async () => {
     
      mailobject["toname"] = tempUser.FirstName +" "+tempUser.LastName;
      mailobject["toemail"] = val;
      await this.meetingService.sendMailCancellation(mailobject).then(result => {
        console.log("Message sent");
      })
      this.refresh();
    })
  }

  showAutoComplete() {
    this.newParticipant = true;
  }

  getPosts(val: any) {
    console.log(val)
    if (!this.participants.includes(val)) {
      this.participants.push(val);
      console.log(this.participants);
      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["project_Name"] = this.meeting.project_Name;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["Agenda"] = this.meeting.Agenda;
      object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
      object["MeetingDate"] = this.meeting.MeetingDate;
      object["MeetingTime"] = this.meeting.MeetingTime;
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      // object["Partipatents"] = this.participants.toString();
      if(this.meeting.Partipatents.length != 0){
        object["Partipatents"] = this.participants.toString();
      }
      else{
      object["Partipatents"] = val;
      }
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";
      object["RoomKey"] = this.meeting.RoomKey;

      var mailobject = {};
      mailobject["subject"] = "Meeting Invitation",
      mailobject["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + this.meeting.project_Name;
      mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
      mailobject["MeetingDate"] = this.meeting.MeetingTime;
      mailobject["HostUser"] = this.meeting.HostUser;
      // mailobject["ShareLink"] = "www.checkboxtechnology.com";
      var tempUser = this.options.find(({ Email }) => Email === val);
      mailobject["Meeting_Location"]= "https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+tempUser.LoginName+"$"+this.meeting.MeetingID+"$1";
      // this.meeting.Meeting_Location
      mailobject["MeetingDescription"] = this.meeting.Agenda;
      const data = this.meetingService.updateMeeting(id, object).then(async () => {
        this.newParticipant = false;
        
        mailobject["toname"] = this.currentUser.FirstName +" "+this.currentUser.LastName;
        mailobject["toemail"] = val;
        await this.meetingService.sendMail(mailobject).then(result => {
          console.log("Message sent");
        })
        this.refresh();
      })
    } else {
      alert("User is already added")
    }
  }

  async deleteMeeting() {
    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["project_Name"] = this.meeting.project_Name;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["Agenda"] = this.meeting.Agenda;
    object["Agenda_SubItem"] = this.meeting.Agenda_SubItem
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants.toString();
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "No";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      console.log(data)
      if (data == null) {
        alert('The meeting has deleted successfully')
        this.route.navigateByUrl('/dashboard');
      } else {
        this.refresh();
      }
    })
  }

  rescheduleMeeting(scheduleForm: NgForm) {
    console.log(scheduleForm.value.MeetingDate)
    if (this.tempMeetingDate !== scheduleForm.value.MeetingDate || this.tempMeetingTime !== scheduleForm.value.MeetingTime) {
      console.log("Success")
      document.getElementById('id01').style.display = 'none';

      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["project_Name"] = this.meeting.project_Name;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["Agenda"] = this.meeting.Agenda;
      object["Agenda_SubItem"] = this.meeting.Agenda_SubItem;

      var temp = new Date(scheduleForm.value.MeetingDate);
      // temp.setDate(temp.getDate() + 1);
      object["MeetingDate"] = temp;
      object["MeetingTime"] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      console.log(temp.toLocaleString())
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      object["Partipatents"] = this.participants.toString();
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";

      object["RoomKey"] = this.meeting.RoomKey;
      console.log(object)

      // var newDate = new Date(this.meeting.MeetingDate.getDate()) + "/" + new Date(this.meeting.MeetingDate.getMonth()) + "/" + new Date(this.meeting.MeetingDate.getFullYear());

      var mailObject = {};
      mailObject["subject"] = "Re-Schedule Meeting",
      mailObject["message"] = "The meeting name " + "'" + this.meeting.project_Name + "'" + " is Re-scheduled on '" + this.meeting.MeetingDate + "' at " + this.meeting.MeetingTime;
      mailObject["MeetingSubject"] = this.meeting.Meeting_Subject;
      mailObject["MeetingDate"] = this.meeting.MeetingTime;
      mailObject["NewMeetingDate"] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      mailObject["HostUser"] = this.meeting.HostUser;
      // mailObject["ShareLink"] = "www.checkboxdev.com";
      
      mailObject["MeetingDescription"] = this.meeting.Agenda;

      const data = this.meetingService.updateMeeting(id, object).then(async () => {
        this.refresh();
        for (var i = 0; i < this.participants.length; i++) {
          var tempUser = this.options.find(({ Email }) => Email === this.participants[i]);
          mailObject["toname"] = tempUser.FirstName +" "+ tempUser.LastName;
          mailObject["toemail"] = tempUser.Email;
          mailObject["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM"+this.meeting.RoomKey+"$"+tempUser.LoginName+"$"+this.meeting.MeetingID+"$1";
          await this.meetingService.sendMailReschedule(mailObject).then(result => {
            console.log("Message sent");
          })
        }
      })
      // }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onFileInput(val: any) {

    const id = this._route.snapshot.params['id'];
    console.log(val)
    const fileList = val.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      console.log(file)
      let formData: FormData = new FormData();
      formData.append('uploadFile', file);
      console.log(formData)
      this.meetingService.uploadFile(formData, id).then(result => {
        this.openSnackBar("Attachment is Uploaded", "OK");
        console.log("success")
        this.refresh();
      })
    }
  }

  async getServerFiles() {
    // if(this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin'){

   
      if(this.deviceDetector()){
        console.log("Values inside if")
        document.getElementById('id02').style.display = 'block'
      } else {
        document.getElementById('id03').style.display = 'block'
      }
    const id = this._route.snapshot.params['id'];

    const images = await this.meetingService.getAllFiles(id).then(result => {
      // this.allFiles = result;
      console.log(result)
      this.allFiles = [];
      for (var i = 0; i < result.length; i++) {
        var filename = result[i].replace(/^.*[\\\/]/, '')
        console.log(filename)
        this.allFiles.push(filename);
        this.filesLoaded = true
      }
    })

  }

  async editComment(val: any, id: any) {
    var tempComment = this.allComments.find(({ CommentID }) => CommentID === id);
    tempComment["Comment1"] = val;
    const data = await this.commentService.updateComment(tempComment, id).then(data => {
      console.log("Success");
      this.refresh();
    })
  }

  async deleteComment(id: any) {
    const data = await this.commentService.deleteComment(id).then(result => {
      console.log("Success");
      this.refresh();
    })
  }

  getFile(filename: any) {

    const id = this._route.snapshot.params['id'];

    let checkFileType = filename.split('.').pop();
    var fileType;
    if (checkFileType == ".txt") {
      fileType = "text/plain";
    }
    if (checkFileType == ".pdf") {
      fileType = "application/pdf";
    }
    if (checkFileType == ".doc") {
      fileType = "application/vnd.ms-word";
    }
    if (checkFileType == ".docx") {
      fileType = "application/vnd.ms-word";
    }
    if (checkFileType == ".xls") {
      fileType = "application/vnd.ms-excel";
    }
    if (checkFileType == ".xlsx") {
      fileType = "application/vnd.ms-excel";
    }
    if (checkFileType == ".png") {
      fileType = "image/png";
    }
    if (checkFileType == ".jpg") {
      fileType = "image/jpeg";
    }
    if (checkFileType == ".jpeg") {
      fileType = "image/jpeg";
    }
    if (checkFileType == ".gif") {
      fileType = "image/gif";
    }
    if (checkFileType == ".csv") {
      fileType = "text/csv";
    }
    this.meetingService.downloadAttachment(filename, id)
      .subscribe(res => {
        // console.log("downloadAttachment res " + res);
        document.getElementById('id02').style.display = 'none';
        let options = { type: fileType };
        // let filename = this.attachGroup[index].originalName;
        this.createAndDownloadBlobFile(res, options, filename);
      });
  }

  createAndDownloadBlobFile(blob, options, filename) {
    var link = document.createElement("a");        // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  async getProfilePic() {
    this.isImageLoading = true;
    var id = this.currentUser.AppUserID;
    this.userService.getUploadProfile(id, this.currentUser.MiddleName)
      .subscribe(res => {

          console.log(res)
        this.createImageFromBlob(res);
        this.isImageLoading = false;

      }, error => {
        this.isImageLoading = true;
        console.log(error);
      });
  }

  createImageFromBlob(image: Blob) {
         let reader = new FileReader();
         reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
         }, false);
  
         if (image) {
            reader.readAsDataURL(image);
         }
  }

  async postComment() {

    if (this.commentArea.nativeElement.value !== '') {
      var id = this._route.snapshot.params['id'];
      // console.log(this.commentArea.nativeElement.value);
      var object = {};
      object["project_Name"] = this.meeting.project_Name;
      object["Comment1"] = this.commentArea.nativeElement.value;
      var temp = new Date();
      temp.setDate(temp.getDate() + 1);
      object["CommentDate"] = temp;
      object["CommentTime"] = temp.getHours() + ":" + temp.getMinutes() + ":" + temp.getSeconds();
      object["Status"] = 0;
      object["HostUser"] = this.currentUser.LoginName;
      object["MeetingID"] = id;
      object["ActionID"] = null;
      object["DecisionID"] = null;

      const data = await this.commentService.postComment(object).then(result => {
        console.log(result)
        this.commentArea.nativeElement.value = '';
        this.refresh();
      })
    }
  }

  async sendNotes() {

    if (this.meetingText.nativeElement.value !== '') {

      const id = this._route.snapshot.params['id'];
      const data = this.meetingService.getMeetingById(id).then(data => {
        this.meeting = data;
      });
      this.meetingNotes.MeetingID = this.meeting.MeetingID;
      this.meetingNotes.project_Name = this.meeting.project_Name;
      this.meetingNotes.LoginName = this.currentUser.LoginName;
      this.meetingNotes.Status = this.meeting.Status;
      this.meetingNotes.meetingNotes = this.meetingText.nativeElement.value

      await this.meetingNoteService.postMeetingNotes(this.meetingNotes).then(data => {
        console.log("postMeetingNotes API");
        this.meetingText.nativeElement.value = '';
        this.refresh();
        //   document.getElementById('id02').style.display = 'none';
        // this.meetingNotes.nativeElement.value = null;
      });
    }
  }

  editMeetingNotes(meetingNotes: any, meetingNoteId: any) {
    this.meetingNoteService.getMeetingNotesById(meetingNoteId).then(result => {
      this.mNote = result;
      var object = this.mNote;
      object["meetingNotes"] = meetingNotes;

      this.meetingNoteService.updateMeetingNotes(meetingNoteId, object).then(data => {
        this.refresh();
      });
    });

  }


  deleteMeetingNotes(meetingId: any) {
    this.meetingNoteService.deleteMeetingNotesById(meetingId).then(data => {
      this.refresh();
    });
  }

  sendConclusion() {

    var object = {};
    object["subject"] = " Thanks for taking the time to meet with me today";
    object["message"] = " Thanks for meeting with me today. I enjoyed our meeting very much and look forward to meeting you again.<br/>" + "<br/> With the meeting '" + this.meeting.project_Name + "', we conclude to this : <br/> <br/>" + this.meeting.Conclusion;
    object["MeetingSubject"] = this.meeting.Meeting_Subject;
    object["MeetingDate"] = this.meeting.MeetingTime;
    object["HostUser"] = this.meeting.HostUser;
    // object["ShareLink"] = "www.checkboxtechnology.com";
   
    object["MeetingDescription"] = this.meeting.Agenda;
    object["Conclusion"] = this.meeting.Conclusion;

    if (this.meeting.Partipatents !== null) {
      this.participants = this.meeting.Partipatents.split(',');
    }
    for (var i = 0; i < this.participants.length; i++) {
      var temp = this.options.find(({ Email }) => Email === this.participants[i]);
      object["toname"] = temp.FirstName +" "+ temp.LastName;
      // object["toemail"] = this.participants.toString();
      object["toemail"] = temp.Email;
      object["Meeting_Location"]="https://meetingminutes.checkboxtechnology.com/videoRoom/" + this.meeting.RoomKey + '$' + this.currentUser.FirstName;
      this.meetingService.sendMailConclusion(object).then(result => {
        console.log("Message sent to  the participant");
      })
    }

  }

  showFab() {
    this.fabIcon = !this.fabIcon
  }

  openChat(meetingID : any) {
    this.route.navigate(['/videoRoom/' + meetingID + '$' + this.currentUser.LoginName])
  }
}