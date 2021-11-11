import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-archived-meetings',
  templateUrl: './archived-meetings.component.html',
  styleUrls: ['./archived-meetings.component.css']
})
export class ArchivedMeetingsComponent implements OnInit {

  deviceDetectorInfo = null;


  constructor(private deviceDetectorService: DeviceDetectorService,

  ) { }

  ngOnInit() {
    this.refresh()
  }

  async refresh() {

  }

  deviceDetector() {
    this.deviceDetectorInfo = this.deviceDetectorService.getDeviceInfo();
    const isDesktop = this.deviceDetectorService.isDesktop();
    return isDesktop;
  }

}
