import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../controllers/meetings.service';
import { Meetings } from '../../models/meetings.model';
import { ActionService } from '../../controllers/action.service';
import { MeetingActions } from '../../models/actions.model';
import { Decisions } from '../../models/decisions.model';
import { DecisionService } from '../../controllers/decision.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CanvasJS from 'src/app/canvasjs.min';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MeetingService, ActionService, DecisionService, UserService]
})
export class DashboardComponent implements OnInit {

  allmeeting: Meetings[];
  actions: MeetingActions[];
  decisions: Decisions[];
  isActionTrue = true;
  newAllMeeting: Array<any> = [];
  participants: String[];

  meetingLenght: any;
  assignmentLength: any;
  assignmentResultLength: any;
  chartLoaded = false;

  dataLoaded = true;

  currentUser: any;

  years: number[] = [];
  yy: number;
  mm: any;

  userSelectedYear = new Date().getFullYear();
  userSelectedMonth = new Date().getMonth();
  created = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  mCreated = [];

  meeting: Array<any> = [];
  newMeeting: Array<any> = [];
  chartParticipants: String[];
  completed: Array<any> = [];
  overdue: Array<any> = [];
  inProgress: Array<any> = [];

  deviceDetectorInfo = null;


  months = [
    { val: '01', name: 'Jan' },
    { val: '02', name: 'Feb' },
    { val: '03', name: 'Mar' },
    { val: '04', name: 'Apr' },
    { val: '05', name: 'May' },
    { val: '06', name: 'Jun' },
    { val: '07', name: 'Jul' },
    { val: '08', name: 'Aug' },
    { val: '09', name: 'Sep' },
    { val: '10', name: 'Oct' },
    { val: '11', name: 'Nov' },
    { val: '12', name: 'Dec' }
  ];

  public doughnutChartLabels: Label[] = ['Total Meetings', 'Total Actions', 'Total Decisions'];
  public demodoughnutChartData: MultiDataSet[] = [];
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = [{ // all colors in order
    backgroundColor: ['#FF0000', '#53a9ff', '#3D9945']
  }];

  constructor(private meetingService: MeetingService,
    private actionService: ActionService,
    private route: Router,
    private decisionService: DecisionService,
    private deviceDetectorService: DeviceDetectorService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;
    this.refresh();
    // var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   // console.log(result)
    //   if (result) {
    //     if (this.currentUser.IsActive === true) {
    //       console.log(this.currentUser.IsActive)
          
    //     } else {
    //       alert("Your account has been blocked. Please contact admin!");
    //       this.route.navigateByUrl('/login')
    //     }
    //   } else {
    //     alert("Your account has been deleted. Please contact admin!");
    //     this.route.navigateByUrl('/login')
    //   }
    // });
  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    return isDesktop;
  }

  async refresh() {
    // if(this.userCheck()){
    console.log("CurrentUser")
    await this.meetingService.getMeetings().then(data => {
      console.log("data")
      console.log(data)
      data.sort((a: any, b: any) => {
        return b.MeetingID - a.MeetingID;
      });
      this.meetingLenght = data.length;
      for (var i = 0; i < data.length; i++) {
        if (data[i].Partipatents !== null) {
          this.participants = data[i].Partipatents.split(',');
        }
        var c = 0;
        for (var j = 0; j < this.participants.length; j++) {
          if (this.currentUser.Email === this.participants[j]) {
            //  var temp = this.participants[j];
            c = j;
          }
        }
        if (this.currentUser.LoginName === data[i].HostUser || this.currentUser.Email === this.participants[c]) {
          this.newAllMeeting.push(data[i]);
        }

      }

      this.allmeeting = this.newAllMeeting.slice(0, 3);


    });
    await this.actionService.getActions().then(actions => {
      actions.sort((a: any, b: any) => {
        return b.ActionItemID - a.ActionItemID;
      });
      this.assignmentLength = actions.length;
      this.actions = actions.slice(0, 4)
    });

    await this.decisionService.getDecision().then(decisions => {
      this.assignmentResultLength = decisions.length;
      decisions.sort((a: any, b: any) => {
        return b.DecisionItemID - a.DecisionItemID;
      });
      this.decisions = decisions.slice(0, 4)
    });
    console.log(this.meetingLenght)
    this.demodoughnutChartData.push(this.meetingLenght, this.assignmentLength, this.assignmentResultLength)
    this.dataLoaded = false;
    this.monthChart();
    this.pieChart();
    // } else {
    //   console.log("wait")
    // }
  }


  onAction(): void {
    this.isActionTrue = true;
    this.actionService.getActions().then(actions => {
      actions.sort((a: any, b: any) => {
        return b.ActionItemID - a.ActionItemID;
      });
      this.actions = actions.slice(0, 4)
    });

  }

  onDecision(): void {
    this.isActionTrue = false;
    this.decisionService.getDecision().then(decisions => {
      decisions.sort((a: any, b: any) => {
        return b.DecisionItemID - a.DecisionItemID;
      });
      this.decisions = decisions.slice(0, 4)
    });

    // this.route.navigate(['/decision-page']);
  }

  actionListPage(actionID: any) {
    this.route.navigate(['/singleActionItem/' + actionID])
  }

  decisionListPage(decisionID: any) {
    this.route.navigate(['/singleDecision/' + decisionID])
  }

  meetingPage(meetingID: any) {
    this.route.navigate(['/browse/' + meetingID])
  }

  getMonth() {
    var today = new Date();
    this.mm = today.getMonth() + 1;
    if (this.mm < 10) {
      this.mm = '0' + this.mm
    }
  }

  selectedMonth(val: any) {
    this.userSelectedMonth = val;
    this.meeting = [0];
    this.monthChart();
  }

  async pieChart() {

    this.currentUser = this.userService.currentUserValue;
    const data = this.meetingService.getMeetings().then(data => {
      // console.log(data)
      data.sort((a: any, b: any) => {
        return b.MeetingID - a.MeetingID;
      });

      this.newAllMeeting = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].reoccrence === 'Yes' || data[i].reoccrence === null) {
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
            this.newAllMeeting.push(data[i]);
            // console.log(this.newAllMeeting)
          }
        }
      }

      for (var i = 0; i < this.newAllMeeting.length; i++) {


        switch (this.newAllMeeting[i].Status) {
          case 0: {
            this.overdue.push(this.newAllMeeting[i]);

            break;
          }
          case 1: {
            this.inProgress.push(this.newAllMeeting[i]);

            break;
          }
          case 2: {
            this.completed.push(this.newAllMeeting[i]);

            break;
          }

        }
      }

      var pieChart = new CanvasJS.Chart("piechartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "Overall Status Of Meeting Minutes "
        },
        data: [{
          type: "pie",
          showInLegend: true,
          startAngle: 240,
          dataPoints: []
        }]
      });

      pieChart.options.data[0].dataPoints.push({ y: this.overdue.length, name: "Overdue" });
      pieChart.options.data[0].dataPoints.push({ y: this.inProgress.length, name: "InProgress" });
      pieChart.options.data[0].dataPoints.push({ y: this.completed.length, name: "completed" });

      pieChart.render();
    });
  }

  async monthChart() {

    this.currentUser = this.userService.currentUserValue;
    if (this.userSelectedMonth === 1) {
      for (var i = 0; i < 29; i++) {
        this.mCreated[i] = 0;
      }

    } else if (this.userSelectedMonth === 0 || this.userSelectedMonth === 2 || this.userSelectedMonth === 4 || this.userSelectedMonth === 6 || this.userSelectedMonth === 7 || this.userSelectedMonth === 9 || this.userSelectedMonth === 11) {
      for (var i = 0; i < 31; i++) {
        this.mCreated[i] = 0;
      }
    }
    else {
      for (var i = 0; i < 30; i++) {
        this.mCreated[i] = 0;
      }
    }

    const data = await this.meetingService.getMeetings().then(data => {



      for (var i = 0; i < data.length; i++) {
        if (this.currentUser.LoginName === data[i].HostUser) {
          this.meeting.push(data[i]);
        }
      }

    });

    this.monthCalculator(this.meeting);

    var lineMonthChart = new CanvasJS.Chart("monthchartContainer", {

      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Created Meeting By User "
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Number of Meetings",
        crosshair: {
          enabled: true
        }
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "left",
        dockInsidePlotArea: true,
      },
      data: [{
        type: "line",
        showInLegend: true,
        name: "Created",
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#F08080",
        dataPoints: []
      }]
    });

    for (var i = 1; i <= this.mCreated.length; i++) {
      lineMonthChart.options.data[0].dataPoints.push({ x: new Date(this.userSelectedYear, this.userSelectedMonth, i), y: this.mCreated[i] });
    }

    lineMonthChart.render();

  }

  monthCalculator(data: any) {

    for (var i = 0; i < data.length; i++) {

      const temporaryDate = new Date(data[i].MeetingDate);
      const year = temporaryDate.getFullYear();
      const month = temporaryDate.getMonth();
      const date = temporaryDate.getDate();

      if (this.userSelectedYear === year) {
        if (this.userSelectedMonth === month) {

          for (var j = 0; j < this.mCreated.length; j++) {

            this.mCreated[0] = 0;
            if (date === j) {
              this.mCreated[j] = this.mCreated[j] + 1;
            }
          }
        }
      }
    }
  }

  userCheck() {
    console.log(this.currentUser.LoginName)
    var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
      console.log(result)
      return result
    });
  }
}
