import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';

@Injectable()
export class CommentService {
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

    postComment(data: any) {
        return this.request('post', this.baseUrl + '/Comment/postComment', data)
    }

    postAgendaComment(data: any) {
      return this.request('post', this.baseUrl + '/Comment/postAgendaComment', data)
  }

    getAllComments() {
        return this.request('get', this.baseUrl + '/Comment/getAllComments/');
    }

    updateComment(data: any, id: any) {
      return this.request('put', this.baseUrl + '/Comment/' + id, data);
    }

    deleteComment(id: any) {
      return this.request('delete', this.baseUrl + '/Comment/' + id);
    }

    getCommentsByActionId(id: any) {
      return this.request('get', this.baseUrl + '/Comment/getCommentsByActionId/' + id);    
    }

    getCommentsByMeetingId(id: any) {
      return this.request('get', this.baseUrl + '/Comment/getCommentsByMeetingId/' + id);
    }
}