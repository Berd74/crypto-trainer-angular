import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseAuthService} from '../services/firebase.service';
import {StartModal} from './modals/test/start.modal';

@Component({
  templateUrl: './logged-core.component.html',
  styleUrls: ['./logged-core.component.scss']
})
export class LoggedCoreComponent {

  constructor(private modalService: NgbModal,
              private angularFireDatabase: AngularFireDatabase,
              public firebaseAuthService: FirebaseAuthService) {
    logtri('LoggedCoreComponent');

    this.angularFireDatabase.database.ref('/users/' + firebaseAuthService.user.uid + '/cash').once('value').then((snapshot) => {
      const data = snapshot.val();

      if (data === null ) {
        this.angularFireDatabase.database.ref('users/' + firebaseAuthService.user.uid).set({
          email: firebaseAuthService.user.email,
          cash: null,
          portfolio: {},
          history: {},
        });
        modalService.open(StartModal);
      } else if (data.cash === null) {
        modalService.open(StartModal);
      } else {

      }

    });

  }

}
