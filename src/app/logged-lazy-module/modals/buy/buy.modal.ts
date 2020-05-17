import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  templateUrl: './buy.modal.html',
  styleUrls: ['./buy.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BuyModal implements OnInit {

  @Input() coinId;
  @Input() coinName;
  @Input() price;
  @Input() coinTag;
  public myCash;
  public amount: any;


  public formGroup: FormGroup;
  public error: string;


  constructor(private firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder,
              private angularFireDatabase: AngularFireDatabase,
              public activeModal: NgbActiveModal) {
  }

  public ngOnInit() {
    this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid + '/cash').once('value').then((snapshot) => {
      this.myCash = snapshot.val();
    });

    this.formGroup = this.formBuilder.group({
      cash: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    });
    this.formGroup.valueChanges.subscribe(n => {
      this.amount = this.formGroup.value.cash / this.price;
      this.error = null;
    });


  }

  public onOkClick() {

    if (this.formGroup.valid) {

      if (this.formGroup.value.cash > this.myCash) {
        this.error = 'You don\'t have enought money';
        return;
      }

      const postData = {
        action: 'buy',
        timestamp: (new Date().getTime() / 1000),
        coinId: this.coinId,
        coinSymbol: this.coinTag,
        coinName: this.coinName,
        priceAtTheTime: this.price,
        cost: this.formGroup.value.cash,
        cryptoAmount: this.formGroup.value.cash / this.price,
      };
      const newHistoryKey = this.angularFireDatabase.database.ref('users/' + this.firebaseAuthService.user.uid + '/history').push().key;
      const updates = {};
      updates['users/' + this.firebaseAuthService.user.uid + '/history/' + newHistoryKey] = postData;
      updates['users/' + this.firebaseAuthService.user.uid + '/cash/'] = this.myCash - this.formGroup.value.cash;
      this.angularFireDatabase.database.ref().update(updates);

      this.error = null;
      this.activeModal.close();

    } else {
      this.error = 'Invalid number';
    }

  }

}
