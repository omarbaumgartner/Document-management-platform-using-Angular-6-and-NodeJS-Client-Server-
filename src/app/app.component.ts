import { Component } from '@angular/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    // Initialisation de firebase
    var config = {
      apiKey: "AIzaSyD6sYsqr0lFfl3gkOc5fqQeKJPoGOgjQpI",
      authDomain: "pfeinstadeep.firebaseapp.com",
      databaseURL: "https://pfeinstadeep.firebaseio.com",
      projectId: "pfeinstadeep",
      storageBucket: "pfeinstadeep.appspot.com",
      messagingSenderId: "716291468694"
    };
    firebase.initializeApp(config);
  }
}
