import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import { DecisionDialogComponent } from '../decision-dialog/decision-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { CreatePollComponent } from '../create-poll/create-poll.component';
import { RespondPollComponent } from '../respond-poll/respond-poll.component';
import { HttpClient } from '@angular/common/http';
import { SchedulerComponent } from '../scheduler/scheduler.component';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector'
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';

export interface ActionDailogData {
  meetingID: any;
}

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
  providers: [UserService, MeetingService]
})
export class MainNavComponent implements OnInit {

  showMenu = false;
  currentUser: User;
  dataLoad = false;
  allUser: User[];
  imageToShow: any;

  userId: string = "offline-demo";
  username: string;
  search: any;
  deviceDetectorInfo = null;
  isRecording = false;
  private recorder: any;
  value: any;

  fabButtonsRandom: MatFabMenu[] = [
    {
      id: 1,
      icon: 'create',
      tooltip: 'Create Quick Meeting',
      tooltipPosition: "left"
    },
    {
      id: 2,
      icon: 'pan_tool',
      tooltip: 'Response Poll',
      tooltipPosition: "left"
    },
    {
      id: 3,
      icon: 'today',
      tooltip: 'Scheduler',
      tooltipPosition: "left"
    },
  ];

  fabButtonsDetailed: MatFabMenu[] = [
    {
      id: 1,
      icon: 'assignment',
      tooltip: 'Action Item',
      tooltipPosition: "left"
    },
    {
      id: 2,
      icon: 'assignment_turned_in',
      tooltip: 'Decision',
      tooltipPosition: "left"
    }
  ]

  @ViewChild('matFabMenu', { static: false }) matFabMenu: MatFabMenu;
  @ViewChild('searchArea', { read: ElementRef, static: false }) searchString: ElementRef;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public actiondialog: MatDialog,
    public decisiondialog: MatDialog,
    public schedulerdialog: MatDialog,
    public createPoll: MatDialog,
    public respondPoll: MatDialog,
    public searchDialog: MatDialog,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    private meetingService: MeetingService,
    private domSanitizer: DomSanitizer,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.currentUser = this.userService.currentUserValue;
    this.dataLoad = true;
    const data = this.userService.getAllUsers().then(result => {
      this.allUser = result;
    })
    // this.getProfilePic();
  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  openCreatePoll() {
    this.createPoll.open(CreatePollComponent, {
      height: '450px',
      width: '400px'
    })
  }

  openRespondPoll() {
    this.respondPoll.open(RespondPollComponent, {
      width: '400px'
    })
  }

  openActionDialog() {
    const meetingID = this.activatedRoute.snapshot.params['id'];
    console.log(meetingID)
    this.actiondialog.open(ActionDialogComponent, {
      width: '400px',
      data: { id: meetingID, from: 0 }
    });
  }

  openDecisionDialog() {
    const meetingID = this.activatedRoute.snapshot.params['id'];
    this.decisiondialog.open(DecisionDialogComponent, {
      height: '570px',
      width: '400px',
      data: { meetingID: meetingID }
    });
  }

  openScheduler() {
    this.schedulerdialog.open(SchedulerComponent, {
      width: '1000px'
    })
  }

  pageDetector() {
    var matched = this.router.url.match(/dashboard/);
    if (matched === null) {
      return true;
    } else {
      return false;
    }
  }

  videoPageDetector() {
    var matched = this.router.url.match(/videoRoom\/([\d]*)/);
    if (matched === null) {
      return true;
    } else {
      return false;
    }
  }

  buttonDetector() {
    var matched = this.router.url.match(/browse\/([\d]*)/);
    if (matched === null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl("/login")
  }

  async onSearchChange(val: any) {
    console.log("Searched string", val)

    if (val == undefined || val.length == 0) {
      alert("Please enter valid string!")
    }
    else {
      if (val.length > 0) {
        this.searchDialog.open(SearchDialogComponent, {
          data: {value: val}
        });
      }
      else {
        alert("Please enter valid string!")
      }
    }

  }

  // async getProfilePic() {
  //   // var id = this.currentUser.AppUserID;
  //   this.userService.getUploadProfile(id, this.currentUser.MiddleName)
  //     .subscribe(res => {
  //       // console.log(res)
  //       this.createImageFromBlob(res);

  //     }, error => {
  //       console.log(error);
  //     });
  // }

  transform() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.currentUser.imageSrc);
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

  selectedAction(event: any) {
    console.log(event)
    switch (event) {
      case 1: this.router.navigateByUrl('/quickMeeting');
        break;
      case 2: this.openRespondPoll();
        break;
      case 3: this.openScheduler();
        break;
    }
  }

  selectedEvent(event: any) {
    switch (event) {
      case 1: this.openActionDialog();
        break;
      case 2: this.openDecisionDialog();
        break;
    }
  }

  startRecorder() {
    this.captureScreen((screen) => {
      this.recorder = RecordRTC(screen, {
          type: 'video'
      });
      this.isRecording = true;

      this.recorder.startRecording();

      // release screen on stopRecording
      this.recorder.screen = screen;
    });
  }

  captureScreen(callback) {
    let audioTrack, videoTrack, stream;
    this.invokeGetDisplayMedia((videoScreen) => {
      this.invokeUserMedia((screen) => {
        [audioTrack] = screen.getAudioTracks();
        [videoTrack] = videoScreen.getVideoTracks();
        stream  = new MediaStream([videoTrack, audioTrack])

        this.addStreamStopListener(stream, () => {
            document.getElementById('stopRecording').click();
        });
        callback(stream);
      }, (error) => {
        console.log(error);
      })
    }, (error) => {
        console.error(error);
        alert('Unable to capture your screen. Please check console logs.\n' + error);
    });
  }

  invokeUserMedia(success, error) {
    navigator.mediaDevices.getUserMedia({audio: true}).then(success).catch(error)
  }

  invokeGetDisplayMedia(success, error) {
    console.log(success)
    const displaymediastreamconstraints = {
        video: {
            displaySurface: 'monitor', // monitor, window, application, browser
            logicalSurface: true,
            cursor: 'always' // never, always, motion,
        },
        audio: true
    };
  
    if ((navigator.mediaDevices as any).getDisplayMedia) {
        (navigator.mediaDevices as any).getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
    else {
         (navigator as any).getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
  }
  
  addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', () => {
        callback();
        callback = () => {};
    }, false);
    stream.addEventListener('inactive', () => {
        callback();
        callback = () => {};
    }, false);
    stream.getTracks().forEach((track) => {
        track.addEventListener('ended', () => {
            callback();
            callback = () => {};
        }, false);
        track.addEventListener('inactive', () => {
            callback();
            callback = () => {};
        }, false);
    });
  }

  async stopRecording() {
    await this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  }
  
  async stopRecordingCallback() {
    this.isRecording = false;

    const id = this._route.snapshot.params['id'];
    var params = id.split('$');
   
    await this.recorder.screen.stop();
    console.log(this.recorder)
    let options = { type: 'video/mp4' };
    // this.onFileInput(this.recorder)
    this.createAndDownloadBlobFile(this.recorder.blob, options, params[1])
  }

 async  onFileInput(val: any) {

    const id = this._route.snapshot.params['id'];
    var params = id.split('$');
    // console.log(val)

    


    const fileList = this.blobToFile(val.blob, params[1]);;
    // if (fileList.length > 0) {
      console.log(fileList)
      const file: File = fileList;
      console.log(file)
      let formData: FormData = new FormData();
      formData.append('uploadFile', file);
      console.log(formData)
      await this.meetingService.uploadFile(formData, id).then(result => {
        // this.openSnackBar("Attachment is Uploaded", "OK");
        console.log("success")
        this.refresh();
      })
    // }
  }

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.lastModified = 1609236060949;
    b.name = fileName;
    b.webkitRelativePath  = "";


    //Cast to a File() type
    return <File>theBlob;
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


}
