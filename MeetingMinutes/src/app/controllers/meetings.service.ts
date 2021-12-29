import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MeetingService {
    baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient){}

    private async request(method: string ,url : string, data?: any) {
        // const token = await this.authService.currentUserValue.token;
    
        console.log('request ' + JSON.stringify(data));
        const result = this.http.request(method, url, {
          body: data,
          responseType: 'json',
          observe: 'body',
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        });
        console.log(result)
        return new Promise<any>((resolve, reject) => {
          result.subscribe(resolve as any, reject as any);
        });
    }

    getMeetings() {
        return this.request('get', this.baseUrl + '/Meeting');
    }

    postMeeting(meeting: any) {
      console.log("working")
      console.log(meeting)
      return this.request('post', this.baseUrl + '/Meeting', meeting)
    }

    getMeetingById(meetingId: any) {
      return this.request('get', this.baseUrl + '/Meeting/' + meetingId)
    }

    updateMeeting(meetingID: any, object: any): any {
      return this.request('put', this.baseUrl + '/Meeting/updateMeeting/' + meetingID, object)
    }

    archiveMeeting(meetingID: any, object: any): any {
      return this.request('put', this.baseUrl + '/Meeting/archiveMeeting/' + meetingID, object)
    }

    sendMail(data: any) {
      console.log("inside meeting service.ts")
      return this.request('post', this.baseUrl + '/Meeting/SendEmail', data);
    }

    sendMailReschedule(data: any) {
      return this.request('post', this.baseUrl + '/Meeting/SendResheduleMeetingEmail', data);
    }
    
    sendMailCancellation(data: any) {
      return this.request('post', this.baseUrl + '/user/SendCancellationMeetingEmail', data);
    }
    
    sendMailConclusion(data: any) {
      return this.request('post', this.baseUrl + '/user/SendConclusionMeetingEmailBody', data);
    }

    sendMailAgenda(data: any) {
      return this.request('post', this.baseUrl + '/user/SendAgendaEmail', data);
    }

    deleteMeeting(id: any) {
      return this.request('delete', this.baseUrl + '/Meeting/' + id);
    }

    uploadFile(id: any, data: any) {
      console.log('working',data)
      return this.request('post', this.baseUrl + '/attachment/' + id, data);
    }

    downloadAttachment(id: any){

      return this.http.get(this.baseUrl + '/download/' + id, {
        responseType: 'blob',
      })
        .pipe(
          map((res: Blob) => res)
        );
      // return this.http.get(this.baseUrl + '/GetFile?FileName=' + name + '&MeetingID=' + id, {
      //   responseType: 'blob' as 'json',
      // })
      //   .pipe(
      //     map((res: Blob) => res)
      //   );
    }

    deleteAttachmentById(id: number, data: any) {
      return this.request('delete', this.baseUrl + '/attachment/' + id, data);
    }
   

    getAllFiles(meetingID: any) {
      return this.request('get', this.baseUrl + '/Meeting/getAttachmentsByMeetingId/' + meetingID);
    }

    searchMeetings(searchString: any) {
      return this.request('get', this.baseUrl + '/Meeting/Search?searchString=' + searchString);
    }

    filterMeetings(object: any){
      return this.request('post', this.baseUrl +'/Meeting/filterMeetings', object);
    }
}