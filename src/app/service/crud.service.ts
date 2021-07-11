
import { ConstructorProvider, Injectable } from '@angular/core';
import{AngularFirestore} from '@angular/fire/firestore';
import { Crud } from '../model/crud';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private afs:AngularFirestore) { }

  addToFirebase(value:Crud){
    this.afs.collection('students').add(value).then(e=>{
      console.log('added');
    });
  }
  
  getAllValue(){
  return this.afs.collection('students').snapshotChanges();
  }

 getOneValue(id: any){
  return this.afs.collection('students').doc(id).get();
 }
 update(id: any, value: Crud){
return this.afs.collection('students').doc(id).update(value);
 }

 deleteData(id: any){
   return this.afs.collection('students').doc(id).delete();
 }
  
}
