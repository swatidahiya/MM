import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
// import { ActionSequence } from 'protractor';
import { ActionService } from 'src/app/controllers/action.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingActions } from 'src/app/models/actions.model';
import { CommentService } from 'src/app/controllers/comment.service';
import { Comments } from 'src/app/models/comment.model';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-single-action-item',
  templateUrl: './single-action-item.component.html',
  styleUrls: ['./single-action-item.component.css'],
  providers: [ActionService, CommentService, UserService]
})
export class SingleActionItemComponent implements OnInit {

  public urlID: any;
  imageToShow: any;
  image : any;
  isImageLoading = true;

  actionItem: MeetingActions;
  dataLoaded = false;
  redLoad = false;
  orangeLoad = false;
  yellowLoad = false;
  allComments: Comments[];
  currentUser: User;
  deviceDetectorInfo = null;

  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;

  @ViewChild('commentArea', { read: ElementRef, static: false }) commentArea: ElementRef;

  constructor(private actionService: ActionService,
    private _route: ActivatedRoute,
    private route: Router,
    private commentService: CommentService,
    private deviceDetectorService: DeviceDetectorService,
    private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
      // console.log(result)
      if (result) {
        if (this.currentUser.IsActive === true) {
          // console.log(this.userCheck())
          this.refresh();
        } else {
          alert("Your account has been blocked. Please contact admin!");
          this.route.navigateByUrl('/login')
        }
      } else {
        alert("Your account has been deleted. Please contact admin!");
        this.route.navigateByUrl('/login')
      }
    });
    // this.refresh();
  }

  async refresh() {
    const id = this._route.snapshot.params['id'];

    this.urlID = this._route.snapshot.params['id'];

    this.currentUser = this.userService.currentUserValue;

    const tempComment = await this.commentService.getAllComments().then(result => {
      this.allComments = result;
      console.log(this.allComments)
    })

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


      this.dataLoaded = true;
    })
    this.getProfilePic();
  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  onFocusOut() {
    if(this.currentUser.DisplayName == this.actionItem.ActionAssignedTo || this.currentUser.Initials === 'sAdmin'){
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

    const data = this.actionService.updateAction(id, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  async onPriority(actionID: any, val: any) {
    if(this.currentUser.DisplayName == this.actionItem.ActionAssignedTo || this.currentUser.Initials === 'sAdmin'){
    var object = {};
    // console.log(actionID)
    object["ActionItemID"] = this.actionItem.ActionItemID;
    object["ActionItem_Title"] = this.actionItem.ActionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["ActionDate"] = this.actionItem.ActionDate;
    object["ActionTime"] = this.actionItem.ActionTime;
    object["ActionAssignedTo"] = this.actionItem.ActionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["Action_Description"] = this.actionItem.Action_Description;
    object["MeetingID"] = this.actionItem.MeetingID;

    switch (val) {
      case 'High': object["Priority"] = 'Medium';
        break;
      case 'Medium': object["Priority"] = 'Low';
        break;
      case 'Low': object["Priority"] = 'High';
        break;
    }
    const data = this.actionService.updateAction(actionID, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  updateAction(val: any, field: any) {
    if(this.currentUser.DisplayName == this.actionItem.ActionAssignedTo || this.currentUser.Initials === 'sAdmin'){
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

    switch (field) {
      case 'ActionItem_Title': object["ActionItem_Title"] = val;
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
    const data = this.actionService.updateAction(id, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  async postComment() {

    if (this.commentArea.nativeElement.value !== '') {
      var id = this._route.snapshot.params['id'];
      // console.log(this.commentArea.nativeElement.value);
      var object = {};
      object["project_Name"] = this.actionItem.project_Name;
      object["Comment1"] = this.commentArea.nativeElement.value;
      var temp = new Date();
      temp.setDate(temp.getDate() + 1);
      object["CommentDate"] = temp;
      object["CommentTime"] = temp.getHours() + ":" + temp.getMinutes() + ":" + temp.getSeconds();
      object["Status"] = 0;
      object["HostUser"] = this.currentUser.LoginName;
      object["MeetingID"] = null;
      object["ActionID"] = id;
      object["DecisionID"] = null;

      const data = await this.commentService.postComment(object).then(result => {
        console.log(result)
        this.commentArea.nativeElement.value = '';
        this.refresh();
      })
    }
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

  
}
