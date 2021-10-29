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
import { MeetingNoteService } from 'src/app/controllers/meetingNote.service';
import { MatSnackBar } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper'
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { DomSanitizer } from '@angular/platform-browser';
import * as QuillNamespace from 'quill';
import QuillMention from 'quill-mention';
import { QuillEditorComponent } from "ngx-quill";
import Quill from 'quill'


const Quill: any = QuillNamespace;
Quill.register({ 'modules/mention': QuillMention }, true);

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css'],
  providers: [MeetingService, UserService, CommentService, MeetingNoteService, ActionService, DecisionService, ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class MeetingDetailsComponent implements OnInit {

  comment: any;
  public urlID: any;

  dataPage: any;
  activePage: any;
  collapsedA = false;
  collapsedB = false;
  time = new Date();
  meeting: Meetings;
  options: Array<any> = [];
  agendaItems: Array<any> = [];
  decisions: Decisions;
  tempActionPage = false;
  tempDecisionPage = false;
  participants: any;
  newParticipant = false;
  filesLoaded = false;
  allFiles = [];
  comments: Array<any> = [];
  tempAgenda: any;
  imageToShow: any;
  image: any;
  isImageLoading = true;

  downloadFile: any;

  tempMeetingDate: any;
  tempMeetingTime: any;
  fabIcon = false;

  timeToDisplay: any;
  fileList: FileList;
  currentUser: User;
  meetingNotes: any = {};

  editMode = false;
  editHeader = false;
  editConclusion = false;
  editAgenda = false;

  dataLoaded = false;
  userVerified = false;
  commentLoad: boolean = false;
  isCompleted = false;
  isConclude = false;
  isHost = false;
  isShow = false;
  isAction = false;
  deviceDetectorInfo = null;
  minDate: Date;
  mentionData: Array<any> = [];
  mentionUsers = [];
  columns: string[] = ['Project Name', 'Agenda Name', 'Status', 'Decision'];
  dataSource = [
    // { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ]
  public modelObj: Object = { placeholder: '' };

  @ViewChild('commentArea', { read: ElementRef, static: false }) commentArea: ElementRef;
  @ViewChild('meetingNotes', { read: ElementRef, static: false }) meetingNote: ElementRef;
  @ViewChild('meetingText', { read: ElementRef, static: false }) meetingText: ElementRef;

  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;


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

  public commentText: string = null;
  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'FullScreen']
  };

  public slides = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];

  atValues = [];

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['code-block'],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ],

    },

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === "@") {
          values = this.atValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },

    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  }

  constructor(private meetingService: MeetingService,
    private _route: ActivatedRoute,
    private route: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private commentService: CommentService,
    private meetingNoteService: MeetingNoteService,
    private actionService: ActionService,
    private decisionService: DecisionService,
    private deviceDetectorService: DeviceDetectorService,
    private _snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer,) { }

  ngOnInit() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.minDate = new Date();
    this.dataPage = 'A';
    this.activePage = 'A';

    this.currentUser = this.userService.currentUserValue;
    this.refresh();

  }

  async refresh() {
    this.dataLoaded = false;
    this.urlID = this._route.snapshot.params['id'];

    const id = this._route.snapshot.params['id'];

    const data = await this.meetingService.getMeetingById(id).then(data => {
      this.meeting = data[0];


      this.tempMeetingDate = this.meeting.MeetingDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      this.tempMeetingTime = this.meeting.MeetingTime;

      this.timeToDisplay = new Date(this.meeting.MeetingTime);

      if (this.meeting.Partipatents.length !== 0) {
        this.participants = this.meeting.Partipatents;
      }
      else {
        this.participants = []
      }

      if (this.currentUser.LoginName == this.meeting.HostUser) {
        this.userVerified = true;
      }

      if (this.currentUser.Initials === 'sAdmin' || this.currentUser.LoginName == this.meeting.HostUser) {
        if (this.meeting.Status === 2) {
          this.isCompleted = true;
          this.isShow = true;
        } else {
          this.isCompleted = false;
          this.isShow = false;
        }
      }

      if (this.currentUser.Initials === 'sAdmin' || this.currentUser.LoginName == this.meeting.HostUser) {
        if (this.meeting.Status === 0) {
          this.isHost = true;
        } else {
          this.isHost = false;
        }
      }

      if (this.currentUser.Initials === 'sAdmin') {
        this.isAction = true;
      }

      if (this.meeting.Status === 2) {
        this.isConclude = true;
      } else {
        this.isConclude = false;
      }


      const allComments = this.commentService.getCommentsByMeetingId(this.meeting.MeetingID).then(result => {
        this.comments = result;
        console.log(this.comments)
      })

      this.dataSource = [];

      const actionData = this.actionService.getActionByMeetingId(this.meeting.MeetingID).then(result => {
        this.agendaItems = result;

        var sortCount = 0
        var sameCount = 0;
        this.agendaItems.forEach(agenda => {
          var obj = {};
          obj['project_name'] = agenda.project_Name;
          obj['agenda_name'] = agenda.ActionItem_Title;
          obj['status'] = agenda.Status;
          obj['decision'] = agenda.decision;
          obj['id'] = agenda.id;

          if (this.dataSource.length > 0) {
            var count = 0;
            this.dataSource.forEach(element => {
              if (agenda.project_Name.toLowerCase() == element['project_name'].toLowerCase()) {
                count++;
                sameCount = element.sort;
              }
            });

            if (count > 0) {
              obj['project_name'] = '';
              obj['sort'] = sameCount;
              this.dataSource.push(obj);

            }
            else {
              sortCount += 1;
              obj['project_name'] = agenda.project_Name;
              obj['sort'] = sortCount;
              this.dataSource.push(obj);
            }
          }
          else {
            obj['sort'] = sortCount;
            this.dataSource.push(obj);
          }


        });
        this.dataSource = this.dataSource.sort((a, b) => a.sort - b.sort);
        this.dataLoaded = true;
      })


      // const decisionData = this.decisionService.getDecisionByMeetingId(this.meeting.MeetingID).then(result => {
      //   this.decisions = result;
      //   console.log("decisions", this.decisions)
      // })

    })

    this.atValues = [];
    const data1 = this.userService.getAllUsers().then(result => {
      this.options = result;

      var object = {}
      this.options.forEach(user => {
        object['username'] = user.LoginName;
        object['value'] = user.FirstName + '(' + user.LoginName + ')';
        object['id'] = user.id;

        this.atValues.push(object);
        object = {}
      });

      this.commentLoad = true;


    })
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
    if (this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin') {
      const id = this._route.snapshot.params['id'];
      var object = {};

      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["MeetingDate"] = this.meeting.MeetingDate;
      object["MeetingTime"] = this.meeting.MeetingTime;
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      object["Partipatents"] = this.participants;
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

      const data = this.meetingService.updateMeeting(id, object).then(data => {
        this.refresh();
      })
    }
    else {
      location.reload();
    }
  }

  onFocusOut() {
    this.focusOut.emit(this.meeting.Meeting_objective);
    if (this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin') {
      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["MeetingDate"] = this.meeting.MeetingDate;
      object["MeetingTime"] = this.meeting.MeetingTime;
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      object["Partipatents"] = this.participants;
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";
      object["RoomKey"] = this.meeting.RoomKey;

      const data = this.meetingService.updateMeeting(id, object).then(data => {
        this.refresh();
      })
    }
    else {
      location.reload();
    }
  }

  onHeaderFocused() {
    this.focusOut.emit(this.meeting.Meeting_Subject);

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants;
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

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants;
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      this.refresh();
    })
  }

  submitAgenda() {

    if (this.currentUser.LoginName == this.meeting.HostUser || this.currentUser.Initials === 'sAdmin') {
      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["MeetingDate"] = this.meeting.MeetingDate;
      object["MeetingTime"] = this.meeting.MeetingTime;
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      object["Partipatents"] = this.participants;
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";
      object["RoomKey"] = this.meeting.RoomKey;

      var mailobject = {};
      mailobject["subject"] = "Meeting Agenda Updated",
        mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
      mailobject["MeetingDate"] = this.meeting.MeetingTime;
      mailobject["NewMeetingDate"] = this.meeting.MeetingTime;
      mailobject["HostUser"] = this.meeting.HostUser;

      mailobject["MeetingDescription"] = this.tempAgenda;

      const data = this.meetingService.updateMeeting(id, object).then(async () => {
        for (var i = 0; i < this.participants.length; i++) {
          var temp = this.options.find(({ Email }) => Email === this.participants[i]);
          mailobject["toname"] = temp.FirstName + " " + temp.LastName;

          mailobject["toemail"] = temp.Email;
          mailobject["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM" + this.meeting.RoomKey + "$" + temp.LoginName + "$" + this.meeting.MeetingID + "$1";
          this.meetingService.sendMailAgenda(mailobject).then(result => {
            console.log("Message sent to  the participant");
          })
        }
        this.refresh();
      })
    }
    else {
      location.reload();
    }
  }

  detailedAction(actionID: any) {
    this.route.navigate(['/singleActionItem/' + actionID])
  }


  detailedDecision(actionID: any) {
    this.route.navigate(['/singleActionItem/' + actionID])
  }

  blockParticipant(val: any) {
    const index: number = this.participants.indexOf(val);
    if (index !== -1) {
      this.participants.splice(index, 1);
    }

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Subject"] = this.meeting.Meeting_Subject;
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants;
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "Yes";
    object["RoomKey"] = this.meeting.RoomKey;

    var mailobject = {};
    mailobject["subject"] = "Meeting Cancellation",
      mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
    mailobject["MeetingDate"] = this.meeting.MeetingTime;
    mailobject["HostUser"] = this.meeting.HostUser;
    var tempUser = this.options.find(({ Email }) => Email === val);
    mailobject["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM" + this.meeting.RoomKey + "$" + tempUser.LoginName + "$" + this.meeting.MeetingID + "$1";

    const data = this.meetingService.updateMeeting(id, object).then(async () => {

      mailobject["toname"] = tempUser.FirstName + " " + tempUser.LastName;
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
    if (!this.participants.includes(val)) {
      this.participants.push(val);
      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["Meeting_objective"] = this.meeting.Meeting_objective;
      object["MeetingDate"] = this.meeting.MeetingDate;
      object["MeetingTime"] = this.meeting.MeetingTime;
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      if (this.meeting.Partipatents.length != 0) {
        object["Partipatents"] = this.participants;
      }
      else {
        object["Partipatents"] = val;
      }
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";
      object["RoomKey"] = this.meeting.RoomKey;

      var mailobject = {};
      mailobject["subject"] = "Meeting Invitation",
        mailobject["MeetingSubject"] = this.meeting.Meeting_Subject;
      mailobject["MeetingDate"] = this.meeting.MeetingTime;
      mailobject["HostUser"] = this.meeting.HostUser;
      var tempUser = this.options.find(({ Email }) => Email === val);
      mailobject["Meeting_Location"] = "https://mmconferenceroom.checkboxtechnology.com:9002/#MM" + this.meeting.RoomKey + "$" + tempUser.LoginName + "$" + this.meeting.MeetingID + "$1";
      const data = this.meetingService.updateMeeting(id, object).then(async () => {
        this.newParticipant = false;

        mailobject["toname"] = this.currentUser.FirstName + " " + this.currentUser.LastName;
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
    object["Meeting_objective"] = this.meeting.Meeting_objective;
    object["MeetingDate"] = this.meeting.MeetingDate;
    object["MeetingTime"] = this.meeting.MeetingTime;
    object["Status"] = this.meeting.Status;
    object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
    object["MeetingID"] = this.meeting.MeetingID;
    object["Meeting_Location"] = this.meeting.Meeting_Location;
    object["Partipatents"] = this.participants;
    object["HostUser"] = this.meeting.HostUser;
    object["Conclusion"] = this.meeting.Conclusion;
    object["reoccrence"] = "No";
    object["RoomKey"] = this.meeting.RoomKey;

    const data = this.meetingService.updateMeeting(id, object).then(data => {
      if (data == null) {
        alert('The meeting has deleted successfully')
        this.route.navigateByUrl('/dashboard');
      } else {
        this.refresh();
      }
    })
  }

  rescheduleMeeting(scheduleForm: NgForm) {
    if (this.tempMeetingDate !== scheduleForm.value.MeetingDate || this.tempMeetingTime !== scheduleForm.value.MeetingTime) {
      document.getElementById('id01').style.display = 'none';

      var id = this._route.snapshot.params['id'];

      var object = {};
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Subject"] = this.meeting.Meeting_Subject;
      object["Meeting_objective"] = this.meeting.Meeting_objective;

      var temp = new Date(scheduleForm.value.MeetingDate);
      object["MeetingDate"] = temp;
      object["MeetingTime"] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      console.log(temp.toLocaleString())
      object["Status"] = this.meeting.Status;
      object["MeetingAssignedTo"] = this.meeting.MeetingAssignedTo;
      object["MeetingID"] = this.meeting.MeetingID;
      object["Meeting_Location"] = this.meeting.Meeting_Location;
      object["Partipatents"] = this.participants
      object["HostUser"] = this.meeting.HostUser;
      object["Conclusion"] = this.meeting.Conclusion;
      object["reoccrence"] = "Yes";

      object["RoomKey"] = this.meeting.RoomKey;
      console.log(object)

      var mailObject = {};
      mailObject["subject"] = "Re-Schedule Meeting",
        mailObject["MeetingSubject"] = this.meeting.Meeting_Subject;
      mailObject["MeetingDate"] = this.meeting.MeetingTime;
      mailObject["NewMeetingDate"] = temp.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      mailObject["HostUser"] = this.meeting.HostUser;

      const data = this.meetingService.updateMeeting(id, object).then(async () => {
        this.refresh();

        for (var i = 0; i < this.participants.length; i++) {

          var tempUser = this.options.find(({ Email }) => Email === this.participants[i]);

          mailObject["toname"] = tempUser.FirstName + " " + tempUser.LastName;
          mailObject["toemail"] = tempUser.Email;
          mailObject["Meeting_Location"] = "https://mmv1.checkboxtechnology.com/videoRoom/" + this.meeting.RoomKey;;
          await this.meetingService.sendMailReschedule(mailObject).then(result => {
            console.log("Message sent");
          })
        }
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onFileInput(val: any) {

    // const id = this._route.snapshot.params['id'];
    // const fileList = val.target.files;
    // if (fileList.length > 0) {
    //   const file: File = fileList[0];
    //   console.log(file)
    //   let formData: FormData = new FormData();
    //   formData.append('uploadFile', file);
    //   console.log(formData)
    //   this.meetingService.uploadFile(formData, id).then(result => {
    //     this.openSnackBar("Attachment is Uploaded", "OK");
    //     this.refresh();
    //   })
    // }

    const id = this._route.snapshot.params['id'];
    this.fileList = val.target.files;

    console.log(this.fileList)

    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      const formData: FormData = new FormData();
      formData.append('uploadFile', file);
      console.log(file)
      this.meetingService.uploadFile(id, formData).then(data => {
        console.log(data)
      });
    }
  }

  async getServerFiles() {

    if (this.deviceDetector()) {
      document.getElementById('id02').style.display = 'block'
    } else {
      document.getElementById('id03').style.display = 'block'
    }
    const id = this._route.snapshot.params['id'];

    const images = await this.meetingService.getAllFiles(id).then(result => {
      console.log(result)
      this.allFiles = result;
      this.filesLoaded = true
    })

  }

  downloadAttachment(index: number) {
    this.meetingService.downloadAttachment(this.allFiles[index].attachmentName)
      .subscribe(res => {
        let options = { type: 'image/jpeg;' };
        let filename = this.allFiles[index].originalName;
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

  async deleteAttachment(id: any) {
    const meetingID = this._route.snapshot.params['id'];

    var c = confirm("Do you want delete the attchment?");
    if (c == true) {
      this.filesLoaded = true
      await this.meetingService.deleteAttachmentById(id).then(data => {
        const images = this.meetingService.getAllFiles(meetingID).then(result => {
          this.allFiles = result;
          this.filesLoaded = true
        })
        alert("Attachment deleted successfully!")
      })


    }
    else {
      alert("Process Terminated")
    }
  }

  // async editComment(val: any, id: any) {
  //   var tempComment = this.allComments.find(({ CommentID }) => CommentID === id);
  //   tempComment["Comment1"] = val;
  //   const data = await this.commentService.updateComment(tempComment, id).then(data => {
  //     console.log("Success");
  //     this.refresh();
  //   })
  // }

  // async deleteComment(id: any) {
  //   const data = await this.commentService.deleteComment(id).then(result => {
  //     console.log("Success");
  //     this.refresh();
  //   })
  // }

  // getFile(filename: any) {

  //   const id = this._route.snapshot.params['id'];

  //   let checkFileType = filename.split('.').pop();
  //   var fileType;
  //   if (checkFileType == ".txt") {
  //     fileType = "text/plain";
  //   }
  //   if (checkFileType == ".pdf") {
  //     fileType = "application/pdf";
  //   }
  //   if (checkFileType == ".doc") {
  //     fileType = "application/vnd.ms-word";
  //   }
  //   if (checkFileType == ".docx" || checkFileType == ".odt") {
  //     fileType = "application/vnd.ms-word";
  //   }
  //   if (checkFileType == ".xls") {
  //     fileType = "application/vnd.ms-excel";
  //   }
  //   if (checkFileType == ".xlsx") {
  //     fileType = "application/vnd.ms-excel";
  //   }
  //   if (checkFileType == ".png") {
  //     fileType = "image/png";
  //   }
  //   if (checkFileType == ".jpg") {
  //     fileType = "image/jpeg";
  //   }
  //   if (checkFileType == ".jpeg") {
  //     fileType = "image/jpeg";
  //   }
  //   if (checkFileType == ".gif") {
  //     fileType = "image/gif";
  //   }
  //   if (checkFileType == ".csv") {
  //     fileType = "text/csv";
  //   }
  //   this.meetingService.downloadAttachment(filename, id)
  //     .subscribe(res => {
  //       document.getElementById('id02').style.display = 'none';
  //       let options = { type: fileType };
  //       this.createAndDownloadBlobFile(res, options, filename);
  //     });
  // }

  // createAndDownloadBlobFile(blob, options, filename) {
  //   var link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     var url = URL.createObjectURL(blob);
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", filename);
  //     link.style.visibility = 'hidden';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  transform(name: any) {
    for (var i = 0; i < this.options.length; i++) {
      if (name == this.options[i].LoginName) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.options[i].imageSrc);
      }
    }
  }

  commentTransform(data: any) {
    return this.domSanitizer.bypassSecurityTrustHtml(data.toString());
  }

  test = (event) => {
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event) => {
    this.mentionData = event.content.ops;
  }

  onFocus = () => {
  }
  onBlur = () => {
  }

  async onPostComment() {
    console.log(this.mentionData)
    this.mentionUsers = [];
    this.mentionData.forEach(async data => {
      if (typeof data.insert !== "string") {
        this.mentionUsers.push(data.insert.mention.id)
      }
    });

    console.log(this.mentionUsers)
    var object = {};

    object["meetingName"] = this.meeting.Meeting_Subject;
    object["comment"] = this.commentText;

    var temp = new Date();
    temp.setDate(temp.getDate() + 1);
    object["CommentDate"] = temp;
    object["CommentTime"] = temp.getHours() + ":" + temp.getMinutes() + ":" + temp.getSeconds();
    object["HostUser"] = this.currentUser.LoginName;
    object["MeetingID"] = this.meeting.MeetingID;
    object["mentionData"] = this.mentionUsers;

    this.commentService.postComment(object).then(data => {
      console.log(data);
      this.commentText = null;
      alert("Commented Successfully!")
      this.refresh()
    }).catch(err => {
      console.log(err);
      this.commentText = null;
    })

  }

  onCanelComment() {
    this.commentText = null;
  }


  deleteMeetingNotes(meetingId: any) {
    this.meetingNoteService.deleteMeetingNotesById(meetingId).then(data => {
      this.refresh();
    });
  }

  sendConclusion() {

    var object = {};
    object["subject"] = " Thanks for taking the time to meet with me today";
    object["MeetingSubject"] = this.meeting.Meeting_Subject;
    object["MeetingDate"] = this.meeting.MeetingTime;
    object["HostUser"] = this.meeting.HostUser;

    object["Conclusion"] = this.meeting.Conclusion;

    if (this.meeting.Partipatents !== null) {
      this.participants = this.meeting.Partipatents;
    }
    for (var i = 0; i < this.participants.length; i++) {
      var temp = this.options.find(({ Email }) => Email === this.participants[i]);
      object["toname"] = temp.FirstName + " " + temp.LastName;
      object["toemail"] = temp.Email;
      object["Meeting_Location"] = "https://mmv1.checkboxtechnology.com/videoRoom/" + this.meeting.RoomKey + '$' + this.currentUser.FirstName;
      this.meetingService.sendMailConclusion(object).then(result => {
        console.log("Message sent to  the participant");
      })
    }

  }

  showFab() {
    this.fabIcon = !this.fabIcon
  }

  openChat(meetingID: any) {
    this.route.navigate(['/videoRoom/' + meetingID + '$' + this.currentUser.LoginName])
  }

  onChangeAgendaName(val: any, id: any, field: any) {

    var obj = {};
    obj[field] = val

    this.actionService.updateAction(id, obj).then(data => {
      this.refresh();
    })
  }

  onChangeStatus(val: any, id: any, field: any) {
    console.log(val);
    console.log(id);
    console.log(field);
  }


}