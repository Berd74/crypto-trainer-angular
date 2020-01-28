import {Component} from '@angular/core';
import {AuthService} from '../../shared-global/services-module/coinapi/auth.service';

@Component({
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {


  private responseObj: any;

  constructor(private authService: AuthService) {
    this.authService.auth().subscribe({
      next: value => {
        console.log(value);
        this.responseObj = value;
      }
    });
  }

  test() {
    // asdda
    // asdasdsa
    console.log(12321);
    console.log(12321);
    console.log(12321);
    console.log(12321);
    console.log(12321);
  }


}
