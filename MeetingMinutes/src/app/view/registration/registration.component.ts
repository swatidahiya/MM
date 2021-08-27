import { Component, OnInit } from '@angular/core';
import { NgForm ,ReactiveFormsModule, FormControl,Validators,FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../controllers/user.service'
import { async } from '@angular/core/testing';
import { LoginComponent } from '../login/login.component';
import {PasswordValidators,UniversalValidators,EmailValidators } from 'ngx-validators'
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [UserService]
})
export class RegistrationComponent implements OnInit {

  usernameText: any;
  passwordText: any;
  firstnameText: any;
  lastnameText: any;
  emailIDText: any;
  phoneText: any;
  OTPText: any;

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

    form: FormGroup;
  email = new FormControl('', Validators.compose([EmailValidators.normal]));
  constructor(private route: Router,
              private userService: UserService,
              protected _fb: FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      'email': this.email,
    });
  }
  
  async onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {

      registerForm.value.CreatedDate = new Date();
      registerForm.value.CreatedByID = 1;
      registerForm.value.isActive = true;
  
      const data = await this.userService.checkUser(registerForm.value.LoginName).then( async result => {
        if(!result){
          const emailVerify = await this.userService.checkEmail(registerForm.value.email).then( async result => {
            if(!result) {
              const data = await this.userService.createUser(registerForm.value).then( data => {
                console.log("User created successfully");
                this.route.navigateByUrl('/login')
              })
            } else {
              alert("Email ID is already registered");
            }
          })
        } else {
          alert("User already exists");
        }
      })
    }
  }

  async getOTP(){
    
  }
}
