import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs';
// import { OktaAuthService } from '@angular/';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';;
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    baseUrl = environment.apiBaseUrl;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient){
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
    }

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

    public get currentUserValue(): any {
      return this.currentUserSubject.value;
    }

    createUser(data: any): any {
      console.log(data)
       return this.request('post', this.baseUrl + '/User', data);
    }

    getAllUsers() {
        return this.request('get', this.baseUrl + '/User');
    }

    getUserById(id: any) {
        return this.request('get', this.baseUrl + '/User/' + id);
    }

    updateUser(userID: any, data: any) {
      return this.request('put', this.baseUrl + '/User/'+userID, data);
    }

    checkUser(id: any) {
      return this.request('get', this.baseUrl + '/User/UserExists/'+id);
    }

    authenticateUser(data: any){
      console.log("data")
      console.log(data)
      return this.request('post', this.baseUrl + '/User/UserAuthenticate', data );
    }

    deleteUser(userID: any) {
      return this.request('delete', this.baseUrl + '/User/'+userID);
    }

    checkEmail(email: any) {
      return this.request('get', this.baseUrl + '/User/UserEmailExists/' + email)
    }

    updateProfile(id: any, uploadFile: any) {
      return this.request('post', this.baseUrl + '/ProfileUpload?UserID='+ id, uploadFile)
    }

    getUploadProfile(id: any, profileName: any) {
      return this.http.get(this.baseUrl + '/GetFileProfile?FileName=' + profileName + '&UserID=' + id, {
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((res: Blob) => res)
      );
    }
}