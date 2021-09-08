import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/controllers/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  usernameText: any;
  passwordText: any;
  users: User[];
  currentUser: User;

  // users: [
  //   {name: 'Anuj', pass: '1234'},
  //   {name: 'Danish', pass: '1234'},
  //   {name: 'Mohit', pass: '1234'},
  //   {name: 'Anil', pass: '1234'},
  //   {name: 'Ron', pass: '1234'},
  // ]

  constructor(private route: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    localStorage.removeItem('currentUser');
    const data = this.userService.getAllUsers().then( user => {
      this.users = user;
    })
  }

  onSubmit(loginForm: NgForm) {
    console.log(loginForm)
    // if (loginForm.value.LoginName == loginForm.value.LoginName.toUpperCase()) {
    //  alert ('upper case true');
    // }
    // if (loginForm.value.LoginName == loginForm.value.LoginName.toLowerCase()){
    //  alert ('lower case true');
    // }
    if (loginForm.valid) {
      let obj = {};
      obj['LoginName'] = loginForm.value.LoginName;
      obj['Password'] = loginForm.value.Password;
      console.log(obj)
      const data = this.userService.authenticateUser(obj).then(result => {

       console.log("resuktttt")
       console.log(result);
        
          this.currentUser = this.users.find(({LoginName}) => LoginName === loginForm.value.LoginName);
          // console.log(this.currentUser);
          
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          if(this.currentUser.IsActive === true){
          this.route.navigateByUrl('/dashboard');
          } else {
            // console.log(this.currentUser)
            // this.currentUser.isActive = true;
            alert("You are not an active user.")
            localStorage.removeItem('currentUser');
          }
      
      
      })
      .catch(error => {alert("Please enter valid credentials")})
    }
    
  }

  onRegister(){
    this.route.navigateByUrl("/register")
  }

}
