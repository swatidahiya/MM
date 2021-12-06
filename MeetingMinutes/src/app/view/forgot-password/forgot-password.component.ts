import { Component, OnInit } from '@angular/core';
import { Email } from 'src/app/models/email.model';
import { EmailService } from 'src/app/controllers/email.service';
import { UserService } from 'src/app/controllers/user.service';
import { async } from '@angular/core/testing';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [EmailService, UserService],
})
export class ForgotPasswordComponent implements OnInit {
  usernameText: any;
  emailText: any;
  users: User[];
  currentUser: User;
  validMail: boolean;


  constructor(private emailService: EmailService,
    private userService: UserService,
    private route: Router,
  ) { }


  ngOnInit() {
    this.refresh();
  }
  async refresh() {
    const data = this.userService.getAllUsers().then(user => {
      this.users = user;
    })
  }

  emailChange(val: any) {
    var count = 0;
    this.users.forEach(user => {
      if (user.Email == val) {
        count += 1;
        this.currentUser = user;
      }
    });

    if (count > 0) {
      this.validMail = true
    }
    else {
      this.validMail = false;
    }
  }

  async onSubmit(forgotPassForm: any) {

    if (this.validMail !== false) {
      var mailobject = {};
      if (this.currentUser.Email == forgotPassForm.value.Email) {
        mailobject["subject"] = "CheckBox - Reset Forgotten Password";
        mailobject["toname"] = this.currentUser.FirstName;
        mailobject["message"] = "test"
        mailobject["toemail"] = this.currentUser.Email;
        await this.emailService.ResetPasswordMail(mailobject).then(data => {
          alert("Reset password link sent to  your email Id please check it");
          this.emailText = "";
          this.route.navigateByUrl("/login");
        });
        // const data = await this.userService.checkUser(forgotPassForm.value.LoginName).then(async result => {
        //   if (result) {
        //     mailobject["subject"]="CheckBox - Reset Forgotten Password";
        //     mailobject["toname"] = this.currentUser.FirstName;
        //     mailobject["message"] = "test"
        //     mailobject["toemail"] = this.currentUser.Email;
        //     await this._emailService.ResetPasswordMail(mailobject).then(data => {
        //       alert("Reset password link sent to  your email Id please check it"); 
        //       this.usernameText ="";
        //       this.emailText=""; 
        //       this.route.navigateByUrl("/login");
        //     });

        //   } else {
        //     alert("User doesnot exists")
        //   }     
        // })
      }
      else {
        alert("Email Id doesnot exists")
      }
    }
    else {
      alert("Email is not registered.")
    }

  }


}

