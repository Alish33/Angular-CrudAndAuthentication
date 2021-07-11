
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Crud } from '../model/crud';
import { CrudService } from '../service/crud.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {
 public cruds: any;
 public did: any;

  constructor(private ser: CrudService,private route: ActivatedRoute) {}
  ngOnInit():void{

    this.ser.getAllValue().subscribe(e=>{
      this.cruds=e.map(data=>{
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data() as Crud
        }
      })
    })
  }

  deleteToDatabase(id: any){
      this.ser.deleteData(id);
  }
}
