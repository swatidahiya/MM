import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/controllers/action.service';
import { MeetingActions } from '../../models/actions.model';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css'],
  providers: [ActionService,UserService]
})

export class ActionItemsComponent implements OnInit {

  currentUser: any;

  actionItems: Array<any> = [];
  newStatus: any;
  priorityText:any;
  DueText:any;
  fullNameText:any;
  projectNameText:any;
  statusText:any;
  optionss:any;
  mainValue:any;
  value:any;
  dValue:any
  users: User[];
  status0Text: any;
  status1Text:any;
  status2Text:any
  priority0Text:any
  priority1Text:any
  priority2Text:any
   deviceDetectorInfo = null;
   selectedStatus: Number;

  options: User[];
  // string[] = ['Anuj Arora', 'Danish Ahmad', 'Ankur Garg', 'Mohit Sharma', 'Anil k. Garg', 'Susmita Kumari'];
  contacts = [];

  constructor(private actionService: ActionService,
              private _route: Router,
              private userService: UserService,
              private deviceDetectorService: DeviceDetectorService,) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    // var data1 = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   // console.log(result)
    //   if (result) {
        if (this.currentUser.IsActive === true) {
          // console.log(this.userCheck())
          this.userService.getAllUsers().then(result => {
            this.options = result;
            
          })
          const data = this.actionService.getActions().then( data => {
            data.sort((a: any, b: any) => {
              return b.ActionItemID - a.ActionItemID;
            });
            this.actionItems = data;
            console.log(this.actionItems)
            
      
            this.sortDate(data);
        
            for (var i = 0; i < data.length; i++) {
              var date = new Date();
              var createdDate = date.getTime() - Date.parse(data[i].ActionTime);
              this.msToTime(createdDate, i);
            }
        
      
          })
          this.refresh();
        } else {
          alert("Your account has been blocked. Please contact admin!");
          this._route.navigateByUrl('/login')
        }
    //   } else {
    //     alert("Your account has been deleted. Please contact admin!");
    //     this._route.navigateByUrl('/login')
    //   }
    // });
  }

  async refresh() {
  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    return isDesktop;
  }

  getPosts(val : any) {
    this.contacts = [];
    this.contacts.push(val);
  }

  detailedAction(actionID: any) {
    this._route.navigate(['/singleActionItem/' + actionID])
  }
  dueDate(){
    this.actionItems.sort((a, b) => new Date(b.ActionDate).getTime() - new Date(a.ActionDate).getTime())
    console.log(this.actionItems);
    this.refresh();
  }

  priority(){
    this.actionItems.sort((a: any, b: any) => {
      return a.ActionItemID - b.ActionItemID;
    });
    console.log(this.actionItems);
     this.refresh();
  }

  upcoming(){
    this.actionItems.sort((a: any, b: any) => {
      return a.Status - b.Status;
    });
    console.log(this.actionItems);
    this.refresh();
  }

  statusCheck (val :any){
    switch(val) {
       case 'overdue' : this.mainValue = 0;
         break;
         case 'inProgress' : this.mainValue = 1;
         break;
         case 'completed' : this.mainValue = 2;
         break;
    }
  }

  priorityCheck(val :any){
    switch(val) {
      case 'low' : this.value = 'Low';
        break;
      case 'mid' : this.value = 'Medium';
        break;
        case 'high' : this.value = 'High';
        break;

   }

  }
  
  filterAction() {
    
    this.userService.getAllUsers().then(data => {

      for (var i = 0; i < data.length; i++) {
        console.log(data[i].DisplayName);
        if (data[i].DisplayName === this.fullNameText) {
          this.users = data[i].LoginName;
          break;
        }
      }
      var object = {};
      if (this.projectNameText !== undefined) {
        if(this.projectNameText.length > 0) {
          object['project_Name'] = this.projectNameText.toLowerCase();
        }
      }
      // object['project_Name']= this.projectNameText;
      object['user']= this.contacts[0];
      object['status']= this.selectedStatus;
     
      if (this.selectedStatus != undefined || this.selectedStatus != null){
    
      this.actionService.filterActions(object).then(data => {
        this.actionItems= data;
        console.log(this.actionItems);
        this.refresh();
      })
      }
      else{
        alert("Status is mandatory.\nPlease select one of the status!!");
      }
      
 
    })
  }

  resetFilter() {
    this.actionItems = [];
    this.projectNameText = "";
    this.fullNameText = "";
    this.value ="";
    this.mainValue ="";
    this.status0Text="";
    this.status1Text="";
    this.status2Text="";
    this.priority0Text="";
    this.priority1Text="";
    this.priority2Text="";
    this.selectedStatus= undefined;
    this.contacts= [];

    const data = this.actionService.getActions().then( data => {
      data.sort((a: any, b: any) => {
        return b.ActionItemID - a.ActionItemID;
      });
      this.actionItems = data;
      console.log(this.actionItems)
    })
    this.refresh();   
  }

  msToTime(epoch: any, i: number) {

    var rem = epoch % 1000;
    var secs = (epoch - rem) / 1000;
    rem = secs % 60;
    var mins = (secs - rem) / 60;
    rem = mins % 60;
    var hrs = (mins - rem) / 60;
    rem = hrs % 24;
    var days = (hrs - rem) / 24;


    var time = days + ':' + hrs + ':' + mins + ':' + secs + '.';

    if (mins >= 1 && hrs == 0) {
      time = mins + ' minutes ago'
    }
    else if (mins < 1 && hrs == 0) {
      time = 'Just now '
    }
    // else if(days >= 1 && hrs >= 24){
    else if (days >= 1) {
      var val = days;
      var rem = val % 7;
      if (rem != 0) {
        val = rem;
      } else if (rem == 0) {
        val = 7;
      }
      switch (val) {
        case 1:
          time = "Monday";
          break;
        case 2:
          time = "Tuesday";
          break;
        case 3:
          time = "Wednesday";
          break;
        case 4:
          time = "Thursday";
          break;
        case 5:
          time = "Friday";
          break;
        case 6:
          time = "Saturday";
          break;
        case 7:
          time = "Sunday";
          break;
      }
    }
    else if (hrs < 24 && hrs != 0) {
      time = hrs + ' hour ago'
    }
    this.actionItems[i].ActionTime = time;
  }

  sortDate(data: any) {
    return data.sort((a: any, b: any) => {
      return <any>new Date(b.ActionTime) - <any>new Date(a.ActionTime);
    });
  }
}
