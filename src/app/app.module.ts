import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//Modules 
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatIconModule } from '@angular/material';
import { FileSelectDirective } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from '@auth0/angular-jwt';

// Services
import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { UsersService } from './services/users/users.service';

//Components
import { DocsComponent } from './components/docs/docs.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { UsersComponent } from './components/users/users.component';
import { AdduserComponent } from './components/users/adduser/adduser.component';
import { SingleuserComponent } from './components/users/singleuser/singleuser.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FileuploaderComponent } from './components/docs/fileuploader/fileuploader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




const appRoutes: Routes = [
  //Example : 
  { path: 'home', component: DocsComponent, canActivate: [AuthGuardService] },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/user/add', component: AdduserComponent, canActivate: [AuthGuardService] },
  {
    path: 'users/:id',
    component: SingleuserComponent, canActivate: [AuthGuardService]
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
    FileSelectDirective,
    PageNotFoundComponent,
    SigninComponent,
    UsersComponent,
    AdduserComponent,
    SingleuserComponent,
    DocsComponent,
    FileuploaderComponent

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

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
