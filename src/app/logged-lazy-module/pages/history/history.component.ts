import {Component} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseAuthService} from '../../../services/firebase.service';

interface HistoryItem {
  action: string;
  timestamp: number;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  priceAtTheTime: number;
  cost: number;
  cryptoAmount: number;
}

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  page = 1;
  pageSize = 10;
  _history = [];
  loading: boolean = true;

  get history(): HistoryItem[] {
    return this._history
      .sort((a, b) => {
        return (a.timestamp < b.timestamp ? 0 : 1);
      })
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  set history(history) {
    this._history = history;
  }

  constructor(private angularFireDatabase: AngularFireDatabase,
              public firebaseAuthService: FirebaseAuthService
  ) {

    logtri('HistoryComponent');

    this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid + '/history').once('value').then((snapshot) => {
      const data = snapshot.val();
      const arr = [];
      // tslint:disable-next-line:forin
      for (const prop in data) {
        if (data.hasOwnProperty(prop)) {
          arr.push(data[prop]);
        }
      }
      this.history = arr;
      this.loading = false;
    });
  }

}
