import { Component, OnInit } from '@angular/core'
import { UserService } from 'src/app/controllers/user.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import '../../../vendor/jitsi/external_api.js'
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

  title: 'Jitsi Meet';
  // domain: string = "jitsi.linux.it";
  // domain: string = "meet.domov.de"
  domain: string = "meet.checkboxtechnology.com";
  options: any;
  api: any;
  currentUser: any;
  urlID: any;
  params = [];
  dataLoaded = false;
  userFromDashboard = false;

  constructor(private userService: UserService,
    private _route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    // this.currentUser = this.userService.currentUserValue;

    this.urlID = this._route.snapshot.params['id'];
    this.params = this.urlID.split('$')

    // if(this.currentUser == null || this.currentUser == undefined) {
    //   this.userFromDashboard = true;
      this.refresh();
    // } else {
    //   this.dataLoaded = true;
    // }
  }

  async refresh() {
    // const data = await this.userService.getAllUsers().then( result => {
    //   this.currentUser = result.find(({LoginName}) => LoginName === this.params[1]);
    // })
    this.dataLoaded = true;
  }

  ngAfterViewInit(): void {
    this.options = {
      roomName: "MM-" + this.params[0] + "-utf",
      width: 100 + "%",
      height: 110 + "%", 
      parentNode: document.querySelector("#meet"),
      // userInfo: {
      //   email: this.currentUser.Email,
      //   displayName: this.currentUser.FirstName + " " + this.currentUser.LastName
      // }
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    this.api.on('readyToClose', () => {
        console.log("Hangup is triggered")
        // document.getElementById('id04').style.display='block';
        this.router.navigateByUrl('/dashboard')
    });
  }

  Hangup() {
    this.api.executeCommand('hangup', () => {
      console.log("Hangup")
      document.getElementById('id04').style.display='block';
    })
  }

  callEnd() {
    // if(this.userFromDashboard) {
    //   this.router.navigateByUrl('/login');
    // } else {
    this.router.navigateByUrl('/dashboard');
    // }
  }
}
