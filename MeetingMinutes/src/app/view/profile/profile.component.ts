import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { NotifierService } from 'angular-notifier';
import { MeetingService } from 'src/app/controllers/meetings.service';
import { Meetings } from '../../models/meetings.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, MeetingService]
})
export class ProfileComponent implements OnInit {
  currentUser: User
  users: User[];
  generalInfo = false;
  imageToShow: any;
  isImageLoading = true;
  meetings: Array<any> = [];
  participants = [];

  private readonly notifier: NotifierService;

  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;

  constructor(private userService: UserService,
    private route: Router,
    notifierService: NotifierService,
    private meetingService: MeetingService,) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    // var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   if (result) {
    //     if (this.currentUser.IsActive === true) {
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
    this.refresh()
  }

  async onFocusOut() {
    this.focusOut.emit(this.currentUser.AppUserNote);
    console.log(this.currentUser.AppUserNote);
    const data = await this.userService.updateUser(this.currentUser.AppUserID, this.currentUser).then(result => {
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.refresh();
      console.log(this.currentUser)
    })
  }

  async refresh() {
    // var tempUser = this.userService.currentUserValue
    // var userId = tempUser.AppUserID
    // const user = await this.userService.getUserById(userId).then( result => {
    //   this.currentUser = result;
    //   console.log("result",result)
    //   localStorage.removeItem('currentUser');
    //   localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    // })
    // console.log(this.currentUser);

    const data = this.meetingService.getMeetings().then(data => {
      data.sort((a: any, b: any) => {
        return b.MeetingID - a.MeetingID;
      });

      this.meetings = [];

      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {

          if (data[i].reoccrence === 'Yes' || data[i].reoccrence === null) {
            if (this.currentUser.Initials === 'sAdmin') {
              this.meetings.push(data[i]);
            }
            else {
              if (data[i].Partipatents !== null) {
                this.participants = data[i].Partipatents.split(',');
              }
              var c = 0;
              for (var j = 0; j < this.participants.length; j++) {
                if (this.currentUser.Email === this.participants[j]) {
                  c = j;
                }
              }
              if (this.currentUser.LoginName === data[i].HostUser || this.currentUser.Email === this.participants[c]) {
                this.meetings.push(data[i]);
              }
            }
          }
        }
      }


    })
    this.getProfilePic();
  }


  async updateAction(val: any, field: any) {
    var id = this.currentUser.AppUserID

    if (field === 'Email') {
      const emailVerify = await this.userService.checkEmail(val).then(async result => {
        if (!result) {
          this.currentUser[field] = val;

          await this.userService.updateUser(id, this.currentUser).then(async result => {
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.refresh();
          })
        } else {
          alert("Email Id is already registered");
        }
      });

    } else {
      this.currentUser[field] = val;

      await this.userService.updateUser(id, this.currentUser).then(async result => {
        localStorage.removeItem('currentUser');
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.refresh();
      })
    }

  }

  public showNotification(type: string, message: string): void {
    this.notifier.show({ type, message });
  }


  onSelectFile(event) {
    var id = this.currentUser.AppUserID;

    const fileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      console.log(file.name)
      let checkFileType = file.name.split('.').pop();
      console.log(checkFileType)
      if (checkFileType == "png" || checkFileType == "jpeg" || checkFileType == "jpg" || checkFileType == "Gif" || checkFileType == "tiff" || checkFileType == "eps" || checkFileType == "ai" || checkFileType == "indd" || checkFileType == "raw") {


        let formData: FormData = new FormData();
        formData.append('uploadFile', file);
        console.log(formData)
        this.userService.updateProfile(id, formData).then(result => {
          console.log("Success");
          console.log(result)
          this.updateAction(file.name, 'MiddleName');
        });
      }
      else {
        alert("Please choose valid image file type ")
      }
    }
  }

  async getProfilePic() {
    this.isImageLoading = true;
    var id = this.currentUser.AppUserID;

    this.userService.getUploadProfile(id, this.currentUser.MiddleName)
      .subscribe(res => {
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
