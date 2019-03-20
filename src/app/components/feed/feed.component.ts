import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Project } from 'src/app/models/Project.model';
import { LoadingService } from 'src/app/services/loading.service';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  projects: Project[];


  constructor(private managerService: ManagerService,
    private userService: UsersService,
    public loadingService: LoadingService) {
    this.loadingService.isLoading();

  }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    return this.managerService.getProjects()
      .subscribe(
        projects => {
          this.projects = projects;
          this.loadingService.isFinished();
        }
      );
  }

  translatemeArray(ids) {
    return this.userService.fromIdToUsername(ids, this.userService.users);

  }


}
