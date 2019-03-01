import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//Modules 
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatIconModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from '@auth0/angular-jwt';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
// Services
import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { UsersService } from './services/users/users.service';
import { DocsService } from './services/docs/docs.service';

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




const appRoutes: Routes = [
  //Example : 
  { path: 'home', component: DocsComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'users', canActivate: [AuthGuardService], component: UsersComponent },
  { path: 'users/user/add', component: AdduserComponent, canActivate: [AuthGuardService] },
  {
    path: 'users/:id',
    component: SingleuserComponent, canActivate: [AuthGuardService]
  },
  { path: 'filemanager', component: FilemanagerComponent },

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


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    FlexLayoutModule,
    FileUploadModule,
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
        blacklistedRoutes: ['http://localhost:8080/api/signin']
      }
    })

  ],
  providers: [
    AuthService,
    AuthGuardService,
    UsersService,
    DocsService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
