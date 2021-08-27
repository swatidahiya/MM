import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Decisions } from 'src/app/models/decisions.model';
import { DecisionService } from 'src/app/controllers/decision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CommentService } from 'src/app/controllers/comment.service';
import { UserService } from 'src/app/controllers/user.service';
import { Comments } from 'src/app/models/comment.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-single-decision',
  templateUrl: './single-decision.component.html',
  styleUrls: ['./single-decision.component.css'],
  providers: [DecisionService, CommentService, UserService]
})
export class SingleDecisionComponent implements OnInit {

  public urlID: any;

  actionItem: Decisions;
  dataLoaded = false;
  redLoad = false;
  orangeLoad = false;
  yellowLoad = false;
  currentUser: User;
  allComments: Comments[];
  imageToShow: any;
  image : any;
  isImageLoading = true;

  deviceDetectorInfo = null;
  // @Input() data: number;
  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;

  @ViewChild('commentArea', { read: ElementRef, static: false }) commentArea: ElementRef;

  constructor(private decisionService: DecisionService,
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

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  async refresh() {
    this.urlID = this._route.snapshot.params['id'];

    this.currentUser = this.userService.currentUserValue;

    const tempComment = await this.commentService.getAllComments().then(result => {
      this.allComments = result;
      console.log(this.allComments)
    })

    const id = this._route.snapshot.params['id'];
    const data = await this.decisionService.getDecisionById(id).then(data => {
      this.actionItem = data;
      console.log(data)

      if (this.actionItem.Priority === 'High') {
        this.redLoad = true;
        this.orangeLoad = false;
        this.yellowLoad = false;
      } else if (this.actionItem.Priority === 'medium') {
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

  onFocusOut() {
    if(this.currentUser.DisplayName == this.actionItem.DecisionAssignedTo || this.currentUser.Initials === 'sAdmin'){
    this.focusOut.emit(this.actionItem.Description);
    console.log(this.actionItem.Description)

    var id = this._route.snapshot.params['id'];

    var object = {};
    object["DecisionItemID"] = this.actionItem.DecisionItemID;
    object["DecisionItem_Title"] = this.actionItem.DecisionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["Description"] = this.actionItem.Description;
    object["DecisionDate"] = this.actionItem.DecisionDate;
    object["DecisionAssignedTo"] = this.actionItem.DecisionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["DecisionTime"] = this.actionItem.DecisionTime;
    object["MeetingID"] = this.actionItem.MeetingID;
    object["Priority"] = this.actionItem.Priority

    const data = this.decisionService.updateDecision(id, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  async onPriority(actionID: any, val: any) {
    if(this.currentUser.DisplayName == this.actionItem.DecisionAssignedTo || this.currentUser.Initials === 'sAdmin'){
    var object = {};
    // console.log(actionID)
    object["DecisionItemID"] = this.actionItem.DecisionItemID;
    object["DecisionItem_Title"] = this.actionItem.DecisionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["Description"] = this.actionItem.Description;
    object["DecisionDate"] = this.actionItem.DecisionDate;
    object["DecisionAssignedTo"] = this.actionItem.DecisionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["DecisionTime"] = this.actionItem.DecisionTime;
    object["MeetingID"] = this.actionItem.MeetingID;

    switch (val) {
      case 'High': object["Priority"] = 'Medium';
        break;
      case 'Medium': object["Priority"] = 'Low';
        break;
      case 'Low': object["Priority"] = 'High';
        break;
      default: object["Priority"] = "High"
    }
    const data = this.decisionService.updateDecision(actionID, object).then(data => {
      this.refresh();
    })
  }
  else{
    location.reload();
  }
  }

  updateDecision(val: any, field: any) {
    if(this.currentUser.DisplayName == this.actionItem.DecisionAssignedTo || this.currentUser.Initials === 'sAdmin'){
    const id = this._route.snapshot.params['id'];
    var object = {};

    object["Priority"] = this.actionItem.Priority;
    object["DecisionItemID"] = this.actionItem.DecisionItemID;
    object["DecisionItem_Title"] = this.actionItem.DecisionItem_Title;
    object["project_Name"] = this.actionItem.project_Name;
    object["Description"] = this.actionItem.Description;
    object["DecisionDate"] = this.actionItem.DecisionDate;
    object["DecisionAssignedTo"] = this.actionItem.DecisionAssignedTo;
    object["Status"] = this.actionItem.Status;
    object["DecisionTime"] = this.actionItem.DecisionTime;
    object["MeetingID"] = this.actionItem.MeetingID;

    switch (field) {
      case 'DecisionItem_Title': object["DecisionItem_Title"] = val;
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

    const data = this.decisionService.updateDecision(id, object).then(data => {
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
      object["ActionID"] = null;
      object["DecisionID"] = id;

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
