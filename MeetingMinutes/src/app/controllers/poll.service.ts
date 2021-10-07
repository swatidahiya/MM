import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';

@Injectable()
export class PollService {
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

    createPoll( data: any) {
        return this.request('post', this.baseUrl + '/Poll/createPoll', data);
    }

    getAllPoll() {
        return this.request('get', this.baseUrl + '/Poll/getAllPoll')
    }

    createPollOption( data: any) {
        return this.request('post', this.baseUrl + '/PollOption', data); 
    }

    updatePoll(data: any) {
        return this.request('put', this.baseUrl + '/Poll/updatePoll', data);
    }

    deletePoll(id: any){
        return this.request('delete', this.baseUrl + '/Poll/' + id);
    }

    deletePollOptions(id: any) {
        return this.request('delete', this.baseUrl + '/PollOption/' + id);
    }
}