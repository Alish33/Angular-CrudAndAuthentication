import { Injectable } from '@angular/core';
import { Login } from '../model/login';
import{AngularFireAuth} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { SignIn } from '../model/signin';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private afa: AngularFireAuth, private router: Router, private afs: AngularFirestore) { }

  signUp(value:Login){
    this.afa.createUserWithEmailAndPassword(value.email, value.password).then((e)=>{
    this.setUserData(e.user, value)
    })
  }

  signIn(value: SignIn){
    this.afa.signInWithEmailAndPassword(value.email, value.password).then(e=>{
      console.log('Signed in')
    this.router.navigate(['read']);
    })
  }

  setUserData(user:any, value:Login){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      name: value.name
  }
  return userRef.set(userData, {merge: true})
}
}
