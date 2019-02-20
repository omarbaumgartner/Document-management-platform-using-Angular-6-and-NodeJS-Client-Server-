import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  user: any;
  userToken: any;
  isConnected: boolean;
  currentstatus = this.authService.currentstatus;

  // injection du Router dans le constructor
  constructor(private router: Router,
    private authService: AuthService,
    private userSerivce: UsersService) {
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.userToken = this.authService.getToken();
    if (this.isConnected == true && this.userToken != undefined)
      return true;
    else {
      this.authService.logout(this.currentstatus);
      this.router.navigate(['auth/signin']);
      return false;
    }

  }
}

