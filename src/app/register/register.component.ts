import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticateService } from '../service/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private ser: AuthenticateService) { }
    public signUpForm = this.fb.group({
      name:[''],
      email:[''],
      password:[''],
      cPassword:['']
  })


  ngOnInit(): void {
  }

  addData(value: any){
    if( value.password !== value.cPassword ){
      console.log("Password do not matched");
    }else{
      this.ser.signUp(value);
    }
  }

  

}
