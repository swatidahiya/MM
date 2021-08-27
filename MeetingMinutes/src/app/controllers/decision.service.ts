import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';

@Injectable()
export class DecisionService {
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

    getDecision() {
        return this.request('get', this.baseUrl + '/Decision')
    }

    postDecision(action: any): any {
        return this.request('post', this.baseUrl + '/Decision', action)
    }

    getDecisionById(actionItemID: any) {
      return this.request('get', this.baseUrl + '/Decision/' + actionItemID)
    }

    updateDecision(actionItemID: any, object: any): any{
      return this.request('put', this.baseUrl + '/Decision/' + actionItemID, object)
    }
    filterDecision(projectName:any, loginName:any,status :any ,priority:any){
      console.log("filterMeetings");
      return this.request('get',this.baseUrl +'/Decision/SearchFilter?project=' + projectName + '&createdby=' + loginName + '&Status=' + status +'&Priority='+priority)
    }
}