import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { ActionService } from 'src/app/controllers/action.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingActions } from 'src/app/models/actions.model';
import { CommentService } from 'src/app/controllers/comment.service';
import { Comments } from 'src/app/models/comment.model';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer } from '@angular/platform-browser';
import * as QuillNamespace from 'quill';
import QuillMention from 'quill-mention';
import { QuillEditorComponent } from "ngx-quill";
import Quill from 'quill'
import { MeetingService } from 'src/app/controllers/meetings.service';

const Quill: any = QuillNamespace;
Quill.register({ 'modules/mention': QuillMention }, true);

@Component({
  selector: 'app-single-action-item',
  templateUrl: './single-action-item.component.html',
  styleUrls: ['./single-action-item.component.css'],
  providers: [ActionService, CommentService, UserService]
})
export class SingleActionItemComponent implements OnInit {

  public urlID: any;
  imageToShow: any;
  image: any;
  isImageLoading = true;
  meeting: Array<any> = [];
  actionItem: MeetingActions;
  dataLoaded = false;
  redLoad = false;
  orangeLoad = false;
  yellowLoad = false;
  allComments: Array<any> = [];
  comments: Array<any> = [];
  currentUser: User;
  deviceDetectorInfo = null;
  mentionData: Array<any> = [];
  mentionUsers = [];
  commentLoad: boolean = false;
  options: Array<any> = [];
  commentText: any = null;


  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;

  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;

  @ViewChild('commentArea', { read: ElementRef, static: false }) commentArea: ElementRef;

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

  constructor(private actionService: ActionService,
    private meetingService: MeetingService,
    private _route: ActivatedRoute,
    private route: Router,
    private commentService: CommentService,
    private deviceDetectorService: DeviceDetectorService,
    private userService: UserService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    const id = this._route.snapshot.params['id'];

    this.urlID = this._route.snapshot.params['id'];

    this.currentUser = this.userService.currentUserValue;

  
    const data = await this.actionService.getActionById(id).then(data => {
      this.actionItem = data;
      console.log(data)

      if (this.actionItem.Priority === 'High') {
        this.redLoad = true;
        this.orangeLoad = false;
        this.yellowLoad = false;
      } else if (this.actionItem.Priority === 'Medium') {
        this.orangeLoad = true;
        this.redLoad = false;
        this.yellowLoad = false;
      } else {
        this.yellowLoad = true;
        this.redLoad = false;
        this.orangeLoad = false;
      }


      const allComments = this.commentService.getCommentsByActionId(this.actionItem.ActionItemID).then(result => {
        this.comments = result;
        console.log(this.comments)
      })

      const mdata = this.meetingService.getMeetingById(this.actionItem.MeetingID).then(data => {
        this.meeting = data[0];
      })

      this.dataLoaded = true;


      this.atValues = [];
      
      const data1 = this.userService.getAllUsers().then(result => {
        this.options = result;

        var object = {}
        this.options.forEach(user => {
          object['username'] = user.LoginName;
          object['value'] = user.FirstName + '(' + user.LoginName + ')';
          object['id'] = user.Email;


          this.atValues.push(object);
          object = {}
        });

        var count = 0;
        this.meeting['Partipatents'].forEach(mail => {
          count = 0;
          this.atValues.forEach(user => {
            if (user.id === mail) {
              count += 1;
            }
          });
          if (count !== 0) {

          }
          else {
            object['username'] = mail;
            object['value'] = '<span style="color: red;"><i>' + mail + '</i></span>';
            object['id'] = mail;


            this.atValues.push(object);
            object = {}
          }
        })

        this.commentLoad = true;
      })

    })
  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    return isDesktop;
  }

  onFocusOut() {
    this.focusOut.emit(this.actionItem.Action_Description);
    console.log(this.actionItem.Action_Description)

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["ActionItemID"] = this.actionItem.ActionItemID;
    object["ActionItem_Title"] = this.actionItem.ActionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["ActionDate"] = this.actionItem.ActionDate;
    object["ActionTime"] = this.actionItem.ActionTime;
    object["ActionAssignedTo"] = this.actionItem.ActionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["Action_Description"] = this.actionItem.Action_Description;
    object["MeetingID"] = this.actionItem.MeetingID;
    object["Priority"] = this.actionItem.Priority;
    object["meetingName"] = this.actionItem.meetingName;

    const data = this.actionService.updateAction(id, object).then(data => {
      this.refresh();
    })

  }

  async onPriority(actionID: any, val: any) {
    const id = this._route.snapshot.params['id'];
    var object = {};
    object["ActionItemID"] = this.actionItem.ActionItemID;
    object["ActionItem_Title"] = this.actionItem.ActionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["ActionDate"] = this.actionItem.ActionDate;
    object["ActionTime"] = this.actionItem.ActionTime;
    object["ActionAssignedTo"] = this.actionItem.ActionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["Action_Description"] = this.actionItem.Action_Description;
    object["MeetingID"] = this.actionItem.MeetingID;
    object["meetingName"] = this.actionItem.meetingName;

    switch (val) {
      case 'High': object["Priority"] = 'Medium';
        break;
      case 'Medium': object["Priority"] = 'Low';
        break;
      case 'Low': object["Priority"] = 'High';
        break;
    }
    const data = this.actionService.updateAction(id, object).then(data => {
      this.refresh();
    })

  }

  updateAction(val: any, field: any) {

    const id = this._route.snapshot.params['id'];
    var object = {};

    object["ActionItemID"] = this.actionItem.ActionItemID;
    object["ActionItem_Title"] = this.actionItem.ActionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["ActionDate"] = this.actionItem.ActionDate;
    object["ActionTime"] = this.actionItem.ActionTime;
    object["ActionAssignedTo"] = this.actionItem.ActionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["Action_Description"] = this.actionItem.Action_Description;
    object["MeetingID"] = this.actionItem.MeetingID;
    object["Priority"] = this.actionItem.Priority;
    object["meetingName"] = this.actionItem.meetingName;

    if (field == 'Status') {
      if (val === 0) {
        object["Status"] = 1;
      } else if (val === 1) {
        object["Status"] = 2;
      } else {
        object["Status"] = 0;
      }
    }
    else {
      object[field] = val;
    }

    const data = this.actionService.updateAction(id, object).then(data => {
      this.refresh();
    })

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

    object["meetingName"] = this.actionItem.meetingName;
    object["comment"] = this.commentText;

    var temp = new Date();
    temp.setDate(temp.getDate() + 1);
    object["CommentDate"] = temp;
    object["CommentTime"] = temp.getHours() + ":" + temp.getMinutes() + ":" + temp.getSeconds();
    object["HostUser"] = this.currentUser.LoginName;
    object["ActionItemID"] = this.actionItem.ActionItemID;
    object["mentionData"] = this.mentionUsers;
    object["MeetingID"] = this.actionItem.MeetingID;

    this.commentService.postAgendaComment(object).then(data => {
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


}
