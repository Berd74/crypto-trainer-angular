import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FirebaseAuthService} from '../../services/firebase.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fromEvent, timer} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {TestService} from '../services/test.service';
import {CoinAuthService} from '../../shared/services/coinapi/coin-auth.service';
import {AngularFireDatabase} from '@angular/fire/database';

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

  public coinAuthServiceAuthResponse: any;

  public data = [
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2010', 2000]
  ];
  public chart: any;
  public lastHovered: any;

  @ViewChild('test') public testRef: ElementRef;
  public grow: number;
  public increase: number;
  private mousedown: boolean;

  constructor(private coinAuthService: CoinAuthService,
              public firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder,
              private testService: TestService,
              public angularFireDatabase: AngularFireDatabase
  ) {

    logtri('LandingPageComponent');

    this.testService.main();

    console.log(this.angularFireDatabase.database);

    this.firebaseAuthService.userStateListener().subscribe((user) => {
      console.log(user.uid);
      console.log();

      this.angularFireDatabase.database.ref('users/' + user.uid).set({
        email: user.email
      });
    });


    timer(2000).subscribe({
      next: () => {


        this.angularFireDatabase.database.ref('/users').once('value').then((snapshot) => {
          const data = snapshot.val();
          console.log(data);
        });

      }
    });


    this.coinAuthService.auth().subscribe({
      next: value => {
        this.coinAuthServiceAuthResponse = value;
      }
    });

    this.signUpFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: ['']
    }, {validator: this.matchingInputsValidator('password', 'confirmPassword')});

    this.signInFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
    });

  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.mousedown = true;
    this.grow = null;
    this.increase = null;
    if (this.lastHovered) {
      this.chart.setSelection([this.lastHovered]);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    this.mousedown = false;
    if (this.lastHovered) {
      timer(1).subscribe(() => {
        this.chart.setSelection([this.chart.getSelection()[0], this.lastHovered]);
      });
    }
  }

  public drawChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'time');
    data.addColumn('number', 'price');
    data.addRows(this.data);

    const options = {
      selectionMode: 'multiple',
      curveType: 'function',
      legend: 'none',
      tooltip: {
        trigger: 'none'
      },
      chartArea: {width: '100%', height: '80%'},
      focusTarget: 'category',
      crosshair: {
        trigger: 'both',
        orientation: 'vertical'
      },
      aggregationTarget: 'auto'
    };

    this.chart = new google.visualization.LineChart(this.testRef.nativeElement);
    this.chart.draw(data, options);

    google.visualization.events.addListener(this.chart, 'onmouseover', (properties) => {
      this.lastHovered = properties;
      if (this.mousedown) {
        this.chart.setSelection([this.chart.getSelection()[0], this.lastHovered]);


        if (!this.chart.getSelection()[1]) {
          this.grow = null;
          this.increase = null;
          return;
        }


        let a: any;

        if (this.chart.getSelection()[0].row > this.chart.getSelection()[1].row + 1) {
          a = this.data.slice(this.chart.getSelection()[1].row, this.chart.getSelection()[0].row + 1);
        } else if (this.chart.getSelection()[0].row === this.chart.getSelection()[1].row + 1) {
          a = this.data.slice(this.chart.getSelection()[1].row, this.chart.getSelection()[0].row + 1);
        } else {
          a = this.data.slice(this.chart.getSelection()[0].row, this.chart.getSelection()[1].row + 1);
        }

        a = a.reduce((accumulator: any, value) => {
          accumulator.push(value);
          return accumulator;
        }, []);

        const first = a[0][1];
        const last = a[a.length - 1][1];
        this.grow = (last - first);
        this.increase = (((last - first) / first) * 100);
      }
    });

    google.visualization.events.addListener(this.chart, 'onmouseout', (properties) => {
      if (!this.mousedown) {
        this.chart.setSelection([]);
        this.grow = null;
        this.increase = null;
      }


    });

    google.visualization.events.addListener(this.chart, 'click', (properties) => {

    });
  }

  public ngOnInit(): void {

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawChart.bind(this));

    fromEvent(window, 'resize').pipe(
      debounceTime(50)
    ).subscribe(event => {
      this.drawChart();
    });

  }

  public onLogoutClick() {
    this.firebaseAuthService.logout().then(() => {
      // nothing
    });
  }

  public onUserSignInClick() {
    if (this.signInFormGroup.valid) {
      this.firebaseAuthService.login(
        this.signInFormGroup.value.email,
        this.signInFormGroup.value.password
      ).subscribe((val) => {
        this.isUserSignedIn = true;
        this.signInFormGroupError = null;
      }, (err) => {
        this.isUserSignedIn = false;
        this.signInFormGroupError = err;
      });
    } else {
      this.signInFormGroupError = 'Validation failed.';
    }
  }

  public onUserSignUpClick() {

    if (this.signUpFormGroup.valid) {
      this.firebaseAuthService.signUp(
        this.signUpFormGroup.value.email,
        this.signUpFormGroup.value.password
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
