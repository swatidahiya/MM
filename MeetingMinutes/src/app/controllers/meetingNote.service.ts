import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Injectable()
export class MeetingNoteService {
    baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient){}

    private async request(method: string ,url : string, data?: any) {
       
    
        console.log('request ' + JSON.stringify(data));
        const result = this.http.request(method, url, {
          body: data,
          responseType: 'json',
          observe: 'body',
        });
        console.log(result)
        return new Promise<any>((resolve, reject) => {
          result.subscribe(resolve as any, reject as any);
        });
    }

    postMeetingNotes(meeting: any) : any {
        return this.request('post', this.baseUrl + '/meetingnote', meeting)
    }

    getMeetingNotes():any{
        return this.request('get', this.baseUrl + '/meetingnote');
    }

    getMeetingNotesById(meetingId: any):any {
        return this.request('get', this.baseUrl + '/meetingnote/' + meetingId)
    }

    deleteMeetingNotesById(meetingId: any) : any{
      return this.request('delete', this.baseUrl + '/meetingnote/'+ meetingId)
    }
    
    updateMeetingNotes(meetingID: any, object: any): any {
        return this.request('put', this.baseUrl + '/meetingnote/' + meetingID, object)
      }

     
}
