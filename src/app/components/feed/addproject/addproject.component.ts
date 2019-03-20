import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users/users.service';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {

  project = new Project();
  projectForm: FormGroup;
  users: User[];
  creatoruser: User;
  selectedmembers: Array<string> = [];
  members: Array<number> = [];
  status: Array<boolean> = [false];
  submitted: boolean;
  session: any;


  constructor(private formBuilder: FormBuilder,
    private userService: UsersService,
    private managerService: ManagerService,
    private router: Router, ) {

  }

  ngOnInit() {
    this.session = this.userService.getPayload();
    this.getCreatorUser();
    this.getUsers();
    this.members.push(this.session.id);
    //  this.selectedmembers.push(this.creatoruser.firstname + this.creatoruser.lastname)
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9]{1,15}')]],
      description: ['', [Validators.required, Validators.pattern('.*\\S.*[a-zA-Z0-9_.]{1,15}')]],
      creatorId: [this.session.id, [Validators.required]],
      members: [this.members, Validators.minLength(2)],
      documents: [],
    });

  }

  getUsers() {
    return this.userService.getUsers()
      .subscribe(
        users => {
          this.users = users
        }
      );
  }
  getCreatorUser() {
    return this.userService.getUserById(this.session.id)
      .subscribe(
        user => {
          this.creatoruser = user
          this.selectedmembers.push(user.firstname + " " + user.lastname)
        }
      )
  }

  onSubmit() {
    this.submitted = true;
    this.project.name = this.projectForm.get('name').value;
    this.project.description = this.projectForm.get('description').value;
    this.project.creatorId = this.projectForm.get('creatorId').value;
    this.project.members = this.projectForm.get('members').value;
    this.project.documents = this.projectForm.get('documents').value;
    this.managerService.addProject(this.project)
      .subscribe(result => this.router.navigate(['/users']));
  }

  selectUser(user) {
    var y = 0;
    if (this.members.length == 1) {
      this.selectedmembers[1] = user.firstname + " " + user.lastname;
      this.members[1] = user.id;
      this.status[user.id] = true;
    }
    else {
      for (var i = 1; i < this.members.length; i++) {
        if (user.id == this.members[i]) {
          i = this.members.length - 1;
          y++;
        }
      }
      if (y == 0) {
        this.members[this.members.length] = user.id;
        this.status[user.id] = true;
        this.selectedmembers[this.members.length - 1] = user.firstname + " " + user.lastname;
      }
    }
    //console.log("Id members :" + this.members);
    this.projectForm.controls['members'].setValue(this.members);

  }

  deselectUser(userId) {
    if (userId == this.session.id) {

    }
    else {
      var y = 0;
      for (var i = 0; i < this.members.length; i++) {
        if (userId == this.members[i]) {
          this.status[this.members[i]] = false;
          this.members.splice(i, 1);
          this.selectedmembers.splice(i, 1);
          i = this.members.length - 1;
          y++;
        }
      }
      /*     this.projectForm = this.formBuilder.group({
            members: [this.members, [Validators.required]],
          }); */
      this.projectForm.controls['members'].setValue(this.members);

      console.log("Id members :" + this.members);
    }
  }

  test() {
    console.log(this.session.id)
    console.log(this.users)
    console.log(this.creatoruser)
    console.log(this.members)
    console.log(this.selectedmembers)
  }

}
