import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;
  returnUrl: string;
  emailpattern = "@instadeep.com";
  email: string;
  error: any;
  iserror: boolean;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{2,15}/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });

    //reset login status
    this.authService.logout(this.authService.currentstatus);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  onSubmit() {
    const email = this.signInForm.get('email').value + this.emailpattern;
    const password = this.signInForm.get('password').value;
    this.authService.onlogin(email, password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.authService.connexion(this.authService.currentstatus);
        },
        error => {
          this.iserror = true;
          this.error = error.error.message;
        });
  }


} 
