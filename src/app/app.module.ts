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
import { AvatarModule } from 'ngx-avatar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';


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
import { ProjectlistComponent } from './components/navbar/sidenav/projectlist/projectlist.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { SearchPipePipe } from './pipes/search-pipe.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { ResetComponent } from './components/auth/reset/reset.component';
import { NotifComponent } from './components/notifications/notif/notif.component';
import { OngoingPipe } from './pipes/ongoing.pipe';




const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Home'
    }
  },
  {
    path: 'adminpannel',
    component: FeedComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      name: 'Admin Pannel'
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
    canActivate: [AuthGuardService],
    data: {
      name: 'Document Viewer'
    }
  },
  {
    path: 'auth/signin',
    component: SigninComponent,
    data: {
      name: 'Sign-In'
    }
  },
  {
    path: 'auth/reset/:token',
    component: ResetComponent,
    data: {
      name: 'Reset your password'
    }
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
    path: 'wiki',
    canActivate: [AuthGuardService],
    component: WikiComponent,
    data: {
      name: 'Wiki'
    }
  },
  {
    path: 'users/user/add',
    component: AdduserComponent,
    data: {
      name: 'Add a User'
    }
    //canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'users/:id',
    component: SingleuserComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'User'
    }
  },
  {
    path: 'filemanager',
    component: FilemanagerComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'File Manager'
    }
  },
  {
    path: 'addproject',
    component: AddprojectComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Create a project'
    }
  },
  {
    path: 'myprojects',
    component: MyprojectsComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'My projects'
    }
  },
  {
    path: 'myprojects/:id',
    component: SingleprojectComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Project Viewer'
    }
  },
  {
    path: 'inbox',
    component: NotifComponent,
    canActivate: [AuthGuardService],
    data: {
      name: 'Inbox'
    }
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
    ProjectlistComponent,
    WikiComponent,
    SearchPipePipe,
    FilterPipe,
    ResetComponent,
    NotifComponent,
    OngoingPipe,


  ],
  entryComponents: [AdddocComponent, UploadersComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AvatarModule,
    MatTreeModule,
    MatIconModule,
    AutosizeModule,
    AutoSizeInputModule,
    GoogleChartsModule.forRoot(),
    NgScrollbarModule,
    FlexLayoutModule,
    NgxHmCarouselModule,
    CKEditorModule,
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
