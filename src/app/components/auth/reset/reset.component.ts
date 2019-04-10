import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  token: any;
  decodedToken: any;
  resetForm: FormGroup;
  error: string;
  iserror: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.token = this.route.snapshot.url[2].path;
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  onSubmit() {
    const password = this.resetForm.get('password').value;
    this.authService.onChangePassword(this.token, password)
      .subscribe((result) => {
        if (result == false) {
          this.iserror = true;
          this.error = "This reset doesn't exist or is already used";
        }
        else {
          this.router.navigate(['/auth/signin']);
          this.snackBar.open("Password changed", "Close", {
            duration: 3000,
            verticalPosition: "top",
          });
        }
      })
  }




}
