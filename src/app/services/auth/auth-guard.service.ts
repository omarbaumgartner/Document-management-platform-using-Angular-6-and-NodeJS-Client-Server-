import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  // injection du Router dans le constructor
  constructor(private router: Router) { }

  // Création de méthode CanActivate qui retournera une observable booléenne , une promise booléenne ou une booléenne
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            // Si l'utilisateur est connecté, on lui donne accés aux routes
            if (user) {
              resolve(true);
            }
            // Sinon il sera redirigé vers la page de connexion
            else {
              this.router.navigate(['/auth', 'signin']);
              resolve(false);
            }
          }
        );
      }
    );
  }

}
