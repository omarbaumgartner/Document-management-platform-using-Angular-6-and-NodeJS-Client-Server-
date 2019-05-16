import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.css']
})
export class ProjectlistComponent implements OnInit {
  myprojects: Project[];
  session: any;
  projectnumber: number = 0;

  constructor(public authService: AuthService,
    public managerService: ManagerService,
    public router: Router) { }

  ngOnInit() {
    this.getMyProjects();

  }


  getMyProjects() {
    this.session = this.authService.getPayload();
    if (this.session != false) {
      this.managerService.getUserProjects(this.session.id)
        .subscribe(
          projects => {
            //console.log(projects);
            this.myprojects = projects;
            if (projects.length != null)
              this.projectnumber = projects.length

          }
        )
    }
    else
      this.myprojects = null;

  }

  checkProjects() {
    this.getMyProjects();
    console.log(this.myprojects);
  }

  viewProject(id) {

    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(["/myprojects/" + id]));
  }

}
