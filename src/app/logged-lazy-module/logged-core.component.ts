import {Component} from '@angular/core';

@Component({
  templateUrl: './logged-core.component.html',
  styleUrls: ['./logged-core.component.scss']
})
export class LoggedCoreComponent {

  constructor() {
    logtri('LoggedCoreComponent');
  }

}
