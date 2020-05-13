import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseAuthService} from '../../../services/firebase.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public presetSettingsForm: FormGroup;
  public buttonClicked = false;
  public emailInUseError: string;

  constructor(private firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.presetSettingsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: ['', []]
    }, {validator: this.matchingInputsValidator('password', 'confirmPassword')});
  }

  public handleClickCreateAccount() {
    this.buttonClicked = true;
    if (this.presetSettingsForm.valid) {
      this.firebaseAuthService.signUp(
        this.presetSettingsForm.value.email,
        this.presetSettingsForm.value.password
      ).subscribe({
        error: err => {
          if (err.code === 'auth/email-already-in-use') {
            this.emailInUseError = 'The email address is already in use.';
          } else {
            this.emailInUseError = 'Something went wrong. Contact administrator.';
          }
        }
      });
    }
  }

  private matchingInputsValidator(password: string, confirmPassword: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const match = control.value[password] === control.value[confirmPassword];
      return match ? null : {notMatch: {value: control[password], matchValue: control[confirmPassword]}};
    };
  }

}
