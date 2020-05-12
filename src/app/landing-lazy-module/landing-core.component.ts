import {Component} from '@angular/core';

@Component({
  templateUrl: './landing-core.component.html',
  styleUrls: ['./landing-core.component.scss']
})
export class LandingCoreComponent {

  constructor() {
    logtri('LandingCoreComponent');
  }

}
