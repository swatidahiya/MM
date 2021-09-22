import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, DayService, WeekService, TimelineMonthService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { MeetingService } from 'src/app/controllers/meetings.service';

export class scheduleModel {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [DayService, WeekService, MonthService, AgendaService, TimelineMonthService, MeetingService]
})
export class SchedulerComponent implements OnInit {

  public dataSchedule = [];
  dataload = false;

  constructor(private meetingService: MeetingService) { }

  ngOnInit() {
    this.refresh()
  }

  async refresh() {
    const data = await this.meetingService.getMeetings().then(result => {
      console.log("inside scheduler and printing result")
      console.log(result)
      for (var i = 0; i < result.length; i++) {
        var check = Date.parse(result[i].MeetingTime)
        console.log(check.valueOf())
        var startTimeTemp = new Date(result[i].MeetingTime)
        var temp = new Date(result[i].MeetingTime);
        temp.setHours(temp.getHours() + 1);

        var object = {};
        object["Id"] = result[i].MeetingID;
        object["Subject"] = result[i].project_Name;
        object["StartTime"] = startTimeTemp
        object["EndTime"] = temp;
        object["Description"] = result[i].Meeting_objective;
        object["Location"] = result[i].Meeting_Location
        this.dataSchedule.push(object);
      }
      console.log(this.dataSchedule)
      this.dataload = true;
    })
  }

    public data: object[] = [{
      Id: 2,
      Subject: 'Paris',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 12, 30)
  }];
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: this.dataSchedule,
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false
  };

}

