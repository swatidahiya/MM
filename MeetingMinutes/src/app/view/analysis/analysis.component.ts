import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../controllers/meetings.service';
import { Meetings } from '../../models/meetings.model';
import { UserService } from 'src/app/controllers/user.service';
import * as CanvasJS from 'src/app/canvasjs.min';
import { Router } from '@angular/router';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
  providers: [MeetingService, UserService]
})
export class AnalysisComponent implements OnInit {


  userSelectedYear = new Date().getFullYear();
  userSelectedMonth = new Date().getMonth();
  created = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  mCreated = [];


  meeting: Array<any> = [];
  newAllMeeting: Array<any> = [];
  participants: String[];
  currentUser: any;
  completed: Array<any> = [];
  overdue: Array<any> = [];
  inProgress: Array<any> = [];


  years: number[] = [];
  yy: number;
  mm: any;


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

  constructor(private meetingService: MeetingService,
    private userService: UserService,
    private route: Router) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
    // var data = this.userService.checkUser(this.currentUser.LoginName).then(result => {
    //   if (result) {
    //     if (this.currentUser.IsActive === true) {
    this.getMonth();
    this.pieChart();
    this.monthChart();
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
      data.sort((a: any, b: any) => {
        return b.MeetingID - a.MeetingID;
      });

      for (var i = 0; i < data.length; i++) {
        if (data[i].Partipatents !== null) {
          this.participants = data[i].Partipatents;
        }
        var c = 0;
        for (var j = 0; j < this.participants.length; j++) {
          if (this.currentUser.Email === this.participants[j]) {
            c = j;
          }
        }
        if (this.currentUser.LoginName === data[i].HostUser || this.currentUser.Email === this.participants[c]) {
          this.newAllMeeting.push(data[i]);
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
        text: "Created  Meeting By User (Monthly)"
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

}

