import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';

@Injectable()
export class ActionService {
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

    getActions() {
        return this.request('get', this.baseUrl + '/Action/getActions')
    }

    postAction(action: any): any {
        return this.request('post', this.baseUrl + '/Action/postAction', action)
    }

    getActionById(actionItemID: any) {
      return this.request('get', this.baseUrl + '/Action/getActionById/' + actionItemID)
    }

    getActionByMeetingId(id : any){
      return this.request('get', this.baseUrl + '/Action/getActionByMeetingId/' + id)
    }

    updateAction(actionItemID: any, object: any): any{
      return this.request('put', this.baseUrl + '/Action/updateAction/' + actionItemID, object)
    }

    deleteAction(id: any) {
      return this.request('delete', this.baseUrl + '/Action/' + id)
    }

    filterActions(object: any){
      return this.request('post', this.baseUrl +'/Action/filterActions', object);
    }
}