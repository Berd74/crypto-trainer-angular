import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'CryptoTrainer';
  isLanding = false;

  constructor(private router: Router) {

  }

  @HostListener('click')
  onHostClick() {
    this.isLanding = true;
    this.router.navigateByUrl('/landing_page');
  }


}
