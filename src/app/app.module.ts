import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//Modules 
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatIconModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule, MatDialogModule, MatSidenavModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from '@auth0/angular-jwt';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { NgxLoadingModule } from 'ngx-loading';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AutosizeModule } from 'ngx-autosize';

// Services
import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { RoleGuardService } from './services/auth/role-guard.service';
import { UsersService } from './services/users/users.service';
import { DocsService } from './services/docs/docs.service';
import { LoadingService } from './services/loading.service';
import { ManagerService } from './services/manager/manager.service';


//Components
import { DocsComponent } from './components/docs/docs.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { UsersComponent } from './components/users/users.component';
import { AdduserComponent } from './components/users/adduser/adduser.component';
import { SingleuserComponent } from './components/users/singleuser/singleuser.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadersComponent } from './components/docs/uploaders/uploaders.component';
import { FilemanagerComponent } from './components/docs/filemanager/filemanager.component';
import { FeedComponent } from './components/feed/feed.component';
import { SidenavComponent } from './components/navbar/sidenav/sidenav.component';
import { AddprojectComponent } from './components/feed/addproject/addproject.component';
import { MyprojectsComponent } from './components/feed/myprojects/myprojects.component';
import { SingleprojectComponent } from './components/feed/singleproject/singleproject.component';
import { HomeComponent } from './components/home/home/home.component';
import { AdddocComponent } from './components/docs/adddoc/adddoc.component';
import { SingledocComponent } from './components/docs/singledoc/singledoc.component';




const appRoutes: Routes = [
  //Example : 
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Accueil'
    }
  },
  {
    path: 'adminpannel',
    component: FeedComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      name: 'AdminPannel'
    }
  },
  {
    path: 'docs',
    component: DocsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'docs/:id',
    component: SingledocComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'auth/signin',
    component: SigninComponent
  },
  {
    path: 'users',
    canActivate: [AuthGuardService],
    component: UsersComponent,
    data: {
      name: 'Users'
    }
  },
  {
    path: 'users/user/add',
    component: AdduserComponent,
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'users/:id',
    component: SingleuserComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'filemanager',
    component: FilemanagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'addproject',
    component: AddprojectComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'myprojects',
    component: MyprojectsComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Mes projets'
    }
  },
  {
    path: 'myprojects/:id',
    component: SingleprojectComponent,
    canActivate: [AuthGuardService]
  },



  //Empty link
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  //Wrong link
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    SigninComponent,
    UsersComponent,
    AdduserComponent,
    SingleuserComponent,
    DocsComponent,
    UploadersComponent,
    FilemanagerComponent,
    FeedComponent,
    SidenavComponent,
    AddprojectComponent,
    MyprojectsComponent,
    SingleprojectComponent,
    HomeComponent,
    AdddocComponent,
    SingledocComponent,


  ],
  entryComponents: [AdddocComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    AutosizeModule,
    FlexLayoutModule,
    ContextMenuModule.forRoot(),
    FileUploadModule,
    NgxLoadingModule.forRoot({}),
    PasswordStrengthBarModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:8080'],
        // blacklistedRoutes: ['http://localhost:8080/api/signin']
      }
    })

  ],
  providers: [
    AuthService,
    AuthGuardService,
    RoleGuardService,
    LoadingService,
    UsersService,
    DocsService,
    ManagerService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
