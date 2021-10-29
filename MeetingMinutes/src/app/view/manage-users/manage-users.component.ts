import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [UserService]
})
export class ManageUsersComponent implements OnInit {

  users: User[];
  tempDelete: User;
  tempUpdateUser: User;

  deviceDetectorInfo = null;

  constructor(private userService: UserService,
    private deviceDetectorService: DeviceDetectorService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.refresh()
  }

  async refresh() {
    const data = this.userService.getAllUsers().then( result => {
      this.users = result;
      console.log(this.users)
    })
  }

  deleteUser(username: any){
    this.tempDelete = this.users.find(({LoginName}) => LoginName === username);
    const data = this.userService.deleteUser(this.tempDelete.AppUserID).then( result => {
      alert("User Succesfully Deleted")
      this.refresh();
      this.tempDelete = null;
    })
  }

  updateUser(username: any, value: any) {
    this.tempUpdateUser = this.users.find(({LoginName}) => LoginName === username);
    this.tempUpdateUser.IsActive = value;
    if(this.tempUpdateUser.Phone === null) {
      this.tempUpdateUser.Phone = '8090909090'
    }
    const data = this.userService.updateUser(this.tempUpdateUser.AppUserID, this.tempUpdateUser).then( result => {
      this.refresh();
      this.tempUpdateUser = null;
    })
  }

  makeAdmin(username: any){
    this.tempUpdateUser = this.users.find(({LoginName}) => LoginName === username);
    this.tempUpdateUser.IsActive = true;
    this.tempUpdateUser.Initials = "sAdmin";
    if(this.tempUpdateUser.Phone === null) {
      this.tempUpdateUser.Phone = '8090909090'
    }
    const data = this.userService.updateUser(this.tempUpdateUser.AppUserID, this.tempUpdateUser).then( result => {
      this.refresh();
      this.tempUpdateUser = null;
    })

  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  transform(imageSrc: any) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageSrc);
  }
}
