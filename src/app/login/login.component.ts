import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SignIn } from '../model/signin';
import { AuthenticateService } from '../service/authenticate.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public signInForm = this.fb.group({
    email:[''],
    password:['']
  })
  constructor(private ser: AuthenticateService, private fb: FormBuilder) { }
   

  ngOnInit(): void {
  }

  signIn(value:SignIn){
  this.ser.signIn(value);
  }
}
