import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecisionService } from '../../controllers/decision.service';
import { Decisions } from '../../models/decisions.model'
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/controllers/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html',
  styleUrls: ['./decision-list.component.css'],
  providers: [DecisionService,UserService]
})
export class DecisionListComponent implements OnInit {

  currentUser: any;

  decisionItems: Array<any>=[];
  newStatus: any;
  redLoad = false;
  orangeLoad = false;
  yellowLoad = false;
  users: User[];
  fullNameText:any;
  projectNameText:any;
  mainValue:any;
  value:any;
  status0Text: any;
  status1Text:any;
  status2Text:any
  priority0Text:any
  priority1Text:any
  priority2Text:any
  selectedStatus: Number

  deviceDetectorInfo = null;


  options: User[];
  // string[] = ['Anuj Arora', 'Danish Ahmad', 'Ankur Garg', 'Mohit Sharma', 'Anil k. Garg', 'Susmita Kumari'];
  contacts = [];
  constructor(private decisionService: DecisionService,
              private _route: Router,
              private userService: UserService,
              private deviceDetectorService: DeviceDetectorService,) { }

  ngOnInit() {

    this.currentUser = this.userService.currentUserValue;
    // var data1 = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   // console.log(result)
    //   if (result) {
        if (this.currentUser.IsActive === true) {

          this.userService.getAllUsers().then(result => {
            this.options = result;
            
          })
          const data = this.decisionService.getDecision().then( data => {
            data.sort((a: any, b: any) => {
              return b.DecisionItemID - a.DecisionItemID;
            });
            this.decisionItems = data;
            console.log(this.decisionItems)
      
          for( var i = 0; i < data.length; i++){
            if (this.decisionItems[i].Priority === 'High') {
              this.redLoad = true;
              this.orangeLoad = false;
              this.yellowLoad = false;
            } else if (this.decisionItems[i].Priority === 'Medium') {
              this.orangeLoad = true;
              this.redLoad = false;
              this.yellowLoad = false;
            } else {
              this.yellowLoad = true;
              this.redLoad = false;
              this.orangeLoad = false;
            }
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
    // console.log("Device Info" + isDesktop)
    return isDesktop;
  }

  getPosts(val : any) {
    this.contacts = [];
    this.contacts.push(val);
  }

  detailedAction(decisionID: any) {
    this._route.navigate(['/singleDecision/' + decisionID])
  }

  dueDate(){
    this.decisionItems.sort((a, b) => new Date(b.ActionDate).getTime() - new Date(a.ActionDate).getTime())
    console.log(this.decisionItems);
    this.refresh();
  }

  priority(){
    this.decisionItems.sort((a: any, b: any) => {
      return a.DecisionItemID - b.DecisionItemID;
    });
    console.log(this.decisionItems);
    this.refresh();
  }
  upcoming(){
    this.decisionItems.sort((a: any, b: any) => {
      return a.Status - b.Status;
    });
    console.log(this.decisionItems);
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
  
  filterDecision() {
    
    this.userService.getAllUsers().then(data => {

      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].SortNameFirstLast);
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
    
        this.decisionService.filterDecision(object).then(data => {
          this.decisionItems= data;
          console.log(this.decisionItems);
          this.refresh();
         
        })
      }
      else{
        alert("Status is mandatory.\nPlease select one of the status!!");
      }

      // var a;
      // if (this.mainValue === 0 || this.mainValue === 1 || this.mainValue === 2) {
      //   a = this.mainValue;
      // }
      // else {
      //   a = -1;
      // }


    
    })
    
  }

  resetFilter() {
    this.decisionItems = [];
    this.projectNameText = "";
    this.fullNameText =""
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
   
    const data = this.decisionService.getDecision().then( data => {
      data.sort((a: any, b: any) => {
        return b.DecisionItemID - a.DecisionItemID;
      });
      this.decisionItems = data;
      console.log(this.decisionItems)
    })
    this.refresh();   
  }

}
