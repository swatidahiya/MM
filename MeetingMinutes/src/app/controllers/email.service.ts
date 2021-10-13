import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable()
export class EmailService {

    baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient){}

    private async request(method: string, url: string, data?: any) {
        

        console.log('request ' + JSON.stringify(data));
        const result = this.http.request(method, url, {
            body: data,
            responseType: 'json',
            observe: 'body',
        });

        return new Promise<any>((resolve, reject) => {
            result.subscribe(resolve as any, reject as any);
        });
    }

    ResetPasswordMail(email: any){
        console.log("post email");
        return this.request('post', this.baseUrl + '/User/ForgetPassword' ,email);
    }
}
