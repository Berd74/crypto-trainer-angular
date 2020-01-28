import {Component, OnInit} from '@angular/core';
import {CoinAuthService} from '../../shared-global/services-module/coinapi/coin-auth.service';
import {FirebaseService} from '../services/firebase.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public isUserSignedUp: boolean;
  public isUserSignedIn: boolean;
  public signInFormGroup: FormGroup;
  public signInFormGroupError: string;
  public signUpFormGroup: FormGroup;
  public signUpFormGroupError: string;

  private coinAuthServiceAuthResponse: any;

  constructor(private coinAuthService: CoinAuthService,
              public firebaseService: FirebaseService,
              private formBuilder: FormBuilder) {


    this.coinAuthService.auth().subscribe({
      next: value => {
        console.log(value);
        this.coinAuthServiceAuthResponse = value;
      }
    });

    this.signUpFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: [''],
    }, {validator: this.matchingInputsValidator('password', 'confirmPassword')});

    this.signInFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
    });

  }

  public ngOnInit(): void {

  }

  public onLogoutClick() {
    this.firebaseService.logout().then(() => {
      // nothing
    });
  }

  public onUserSignInClick() {
    if (this.signInFormGroup.valid) {
      this.firebaseService.login(
        this.signInFormGroup.value.email,
        this.signInFormGroup.value.password,
      ).then((val) => {
        console.log(val);
        this.isUserSignedIn = true;
        this.signInFormGroupError = null;
      }).catch((err) => {
        this.isUserSignedIn = false;
        this.signInFormGroupError = err;
      });
    } else {
      this.signInFormGroupError = 'Validation failed.';
    }
  }

  public onUserSignUpClick() {

    if (this.signUpFormGroup.valid) {
      this.firebaseService.signUp(
        this.signUpFormGroup.value.email,
        this.signUpFormGroup.value.password,
      ).subscribe({
        error: err => {
          this.isUserSignedUp = false;
          if (err.code === 'auth/email-already-in-use') {
            this.signUpFormGroupError = 'The email address is already in use.';
          } else {
            this.signUpFormGroupError = 'Something went wrong. Contact administrator.';
          }
        },
        next: value => {
          console.log(value);
          this.isUserSignedUp = true;
          this.signUpFormGroupError = null;
        }
      });
    } else {
      this.signUpFormGroupError = 'Validation failed.';
    }

  }

  private matchingInputsValidator(password: string, confirmPassword: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const match = control.value[password] === control.value[confirmPassword];
      return match ? null : {notMatch: {value: control[password], matchValue: control[confirmPassword]}};
    };
  }


}
