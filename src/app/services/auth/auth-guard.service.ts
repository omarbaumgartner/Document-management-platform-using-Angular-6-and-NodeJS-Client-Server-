import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  // injection du Router dans le constructor
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['auth/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  // Création de méthode CanActivate qui retournera une observable booléenne , une promise booléenne ou une booléenne
  /*canActivate(): Observable<boolean> | Promise<boolean> | boolean {
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
  }*/

} 
