import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {from} from 'rxjs';
import {FirebaseAuthService} from '../../../services/firebase.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public presetSettingsForm: FormGroup;
  public showValidationResults = false;
  public loginFailed = false;

  constructor(private firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.presetSettingsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
    });
    this.presetSettingsForm.valueChanges.subscribe(n => this.showValidationResults = false);
  }

  public handleClickLogin() {
    this.showValidationResults = true;
    this.loginFailed = false;
    if (this.presetSettingsForm.valid) {
      from(this.firebaseAuthService.login(this.presetSettingsForm.value.email, this.presetSettingsForm.value.password)).subscribe(
        () => {
        },
        error => {
          this.loginFailed = true;
        }
      );
    }
  }

}
