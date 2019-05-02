import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Project } from 'src/app/models/Project.model';
import { Router } from '@angular/router';
import { NgxHmCarouselBreakPointUp } from 'ngx-hm-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  session: any;
  myprojects: Project;
  finishedprojects: Array<Project> = [];
  ongoingprojects: Array<Project> = [];
  ongoingnumber: number = 0;
  finishednumber: number = 0;
  loaded : boolean = false;

  constructor(public managerService: ManagerService,
    private authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.getMyProjects();
  }


  getMyProjects() {
    this.session = this.authService.getPayload();
    this.managerService.getUserProjects(this.session.id)
      .subscribe(
        projects => {
          this.myprojects = projects;
          this.checkProjects(projects);
        }
      )
  }

  checkProjects(projects: any) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].finished == true) {
        this.finishedprojects.push(projects[i]);
        this.finishednumber++;
      }
      else {
        this.ongoingprojects.push(projects[i]);
        this.ongoingnumber++;
      }
    }
    this.loaded = true;
  }

  viewProject(id) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects/" + id]));
  }

}
