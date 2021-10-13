import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';
import { NgForm,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {PasswordValidators,UniversalValidators} from 'ngx-validators'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [UserService]
})
export class ResetPasswordComponent implements OnInit {
  passwordText: any;
  verifiedPasswordText: any;
  usernameText: any;
  users: User[];
  pass: any ={};
  currentUser: User;
  password: FormControl = new FormControl('', Validators.compose([
    Validators.required,
    PasswordValidators.repeatCharacterRegexRule(4),
    PasswordValidators.alphabeticalCharacterRule(1),
    PasswordValidators.digitCharacterRule(1),
    PasswordValidators.lowercaseCharacterRule(1),
    PasswordValidators.uppercaseCharacterRule(1),
    PasswordValidators.specialCharacterRule(1),
    PasswordValidators.allowedCharacterRule(['a', 'b'])
    ]));

  constructor(private userService: UserService,
    private route: Router) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    const data = this.userService.getAllUsers().then( user => {
      this.users = user;
    })
  }

   async onSubmit(newEmailForm: NgForm) {
    // if (newEmailForm.valid) {
    this.currentUser = this.users.find(({LoginName}) => LoginName === newEmailForm.value.LoginName);
    var object = this.currentUser;
    object["Password"] = this.passwordText;
     var id =this.currentUser.AppUserID;
    if (this.passwordText=== this.verifiedPasswordText && this.passwordText!=null && this.verifiedPasswordText!= null) {
       const data =  await this.userService.updateUser(id, object).then(result => {
        alert("Your password has been reset successfully!");
        this.route.navigateByUrl('/login');
          this.refresh();
      })
    }
    else 
    {
      alert("password mismatch");
    } 
  // }
  // else{
  //   alert("Please enter Valid Username,Password & Conform Password");
  // }
}
  
}
