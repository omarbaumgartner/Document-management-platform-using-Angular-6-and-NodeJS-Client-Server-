import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from './services/loading.service';
import { MatDialog } from '@angular/material';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { ManagerService } from './services/manager/manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  toggled: boolean;
  load: boolean;
  isloading = this.loadingService.isloading;
  isConnected: boolean;
  currentstatus = this.authService.currentstatus;
  currentrole = this.authService.currentrole;

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loadingTemplate: TemplateRef<any>;
  public primaryColour = '#dd0031';
  session: any;
  role: any;
  activePage: any;


  constructor(public loadingService: LoadingService,
    private authService: AuthService,
    private managerService: ManagerService,
    private router: Router,
    public dialog: MatDialog) {

    this.isloading.subscribe((val) => {
      this.load = val;
    })
    this.currentstatus.subscribe((val) => {
      this.isConnected = val;
    })

    this.authService.currentrole.subscribe((val) => {
      this.role = val;
    })


  }
  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.authService.setRole();
    }
  }


  toggle(term) {
    this.loadingService.toggle(term);
    if (this.toggled == true)
      this.toggled = false;
    else
      this.toggled = true;
  }


  /*   openUploader(): void {
      const dialogRef = this.dialog.open(UploadersComponent, {
        autoFocus: true,
      });
    } */
}
