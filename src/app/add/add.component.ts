import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Crud } from '../model/crud';
import { CrudService } from '../service/crud.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  
  public id:any;

  constructor(private fb: FormBuilder, private ser: CrudService, private route:ActivatedRoute) { }

  public storeId: any;

  public profileForm = this.fb.group({
  name:['',Validators.required],
  age:['',Validators.required],
  color:['',Validators.required]
  })
  
  ngOnInit(): void {
    this.route.params.subscribe(e=>{
     let id = e.id;
     this.storeId=id;

     if(id != null){
    this.ser.getOneValue(id).subscribe(e=>{
    let data:any = e.data();
    this.profileForm = this.fb.group({
      name : data['name'],
      age: data['age'],
      color:data['color']
    })
    })
  }
    })
  }



  addToDatabase(value:Crud){
    let id = this.storeId;
    if(id == null ){
      this.ser.addToFirebase(value);
    }else{
      this.ser.update(id, value).then(e=>{
        console.log('updated');
      })
    }

  }


}
