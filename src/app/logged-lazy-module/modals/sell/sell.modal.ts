import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {from, Observable} from 'rxjs';
import {concatMap, map, toArray} from 'rxjs/operators';
import {APIHistoryItem, MainHistoryItem} from '../../pages/home/home.component';
import {GetCoinDetailsService} from '../../services/get-coin-details.service';
import {PortfolioItem} from '../buy/buy.modal';

@Component({
  templateUrl: './sell.modal.html',
  styleUrls: ['./sell.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class SellModal implements OnInit {

  @Input() coinId;
  @Input() coinName;
  @Input() price;
  @Input() coinTag;
  public myCash;
  public amount: any;

  public historyMain: MainHistoryItem[] = [];
  public loading = true;
  public amoutOfCrypto: number;

  public formGroup: FormGroup;
  public error: string;


  constructor(private firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder,
              private angularFireDatabase: AngularFireDatabase,
              private cdr: ChangeDetectorRef,
              private getCoinDetailsService: GetCoinDetailsService,
              public activeModal: NgbActiveModal) {
  }


  public ngOnInit() {
    this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid + '/cash').once('value').then((snapshot) => {
      this.myCash = snapshot.val();
    });

    this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid)
      .on('value', (snapshot) => {
        if (!snapshot.val()) {
          return;
        }
        this.myCash = snapshot.val().cash;
        const history = snapshot.val().history;

        const historyArr: APIHistoryItem[] = [];
        for (const prop in history) {
          if (history.hasOwnProperty(prop)) {
            historyArr.push(history[prop]);
          }
        }

        const historyMain: MainHistoryItem[] = [];

        historyArr.forEach(el => {

          const obj = historyMain.find(el2 => {
            return el.coinId === el2.coinId;
          });
          if (obj) {
            obj.actions.push(
              {
                action: el.action,
                cost: el.cost,
                cryptoAmount: el.cryptoAmount,
                priceAtTheTime: el.priceAtTheTime,
                timestamp: el.timestamp
              }
            );
          } else {
            historyMain.push({
              coinId: el.coinId,
              coinName: el.coinName,
              coinSymbol: el.coinSymbol,
              coinThumb: null,
              amount: null,
              currentPrice: null,
              averagePrice: null,
              priceWhenBuying: null,
              actions: [
                {
                  action: el.action,
                  cost: el.cost,
                  cryptoAmount: el.cryptoAmount,
                  priceAtTheTime: el.priceAtTheTime,
                  timestamp: el.timestamp
                }
              ]
            });
          }

        });


        from(historyMain).pipe(
          concatMap((mainHistoryItem) => {
            return this.getRestOfDataUsingAPI(mainHistoryItem);
          }),
          toArray()
        ).subscribe((arr) => {
          this.historyMain = arr;
          this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid + '/portfolio/' + this.coinId + '/amount')
          // tslint:disable-next-line:no-shadowed-variable
            .once('value').then((snapshot) => {
              this.amoutOfCrypto = snapshot.val();
              this.cdr.detectChanges();
          });
        });


      });

    this.formGroup = this.formBuilder.group({
      cash: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    });
    this.formGroup.valueChanges.subscribe(n => {
      this.amount = this.formGroup.value.cash * this.price;
      this.error = null;
    });


  }

  getRestOfDataUsingAPI(el: MainHistoryItem): Observable<MainHistoryItem> {
    return this.getCoinDetailsService.get(el.coinId).pipe(
      map((coinInfo) => {
        el.coinThumb = coinInfo.image.thumb;
        el.amount = el.actions.reduce((previousValue, currentValue) => {
          if (currentValue.action === 'buy') {
            return previousValue + currentValue.cryptoAmount;
          } else {
            return previousValue - currentValue.cryptoAmount;
          }
        }, 0);
        el.currentPrice = el.amount * coinInfo.market_data.current_price.usd;
        el.priceWhenBuying = el.actions.reduce((previousValue, currentValue) => {
          if (currentValue.action === 'buy') {
            return previousValue + currentValue.cost;
          } else {
            return previousValue - currentValue.cost;
          }
        }, 0);
        return el;
      })
    );
  }

  public onOkClick() {

    if (this.formGroup.valid) {

      this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid).once('value').then((snapshot) => {
        this.myCash = snapshot.val().cash;
        const portfolio = snapshot.val().portfolio;



        const portfolioArr: PortfolioItem[] = [];
        for (const prop in portfolio) {
          if (portfolio.hasOwnProperty(prop)) {
            portfolioArr.push(
              {
                ...portfolio[prop],
                coinId: prop
              });
          }
        }
        let obj = portfolioArr.find(el => {
          return el.coinId === this.coinId;
        });
        obj = {
          coinId: this.coinId,
          amount: 0,
          averagePrice: 0,
          ...obj
        };
        const postData2: PortfolioItem = {
          coinId: this.coinId,
          amount: obj.amount - Number(this.formGroup.value.cash),
          averagePrice: obj.averagePrice
        };

        if (Number(this.formGroup.value.cash) > obj.amount) {
          this.error = 'You don\'t have enought coins';
          return;
        }

        this.angularFireDatabase.database.ref('users/' + this.firebaseAuthService.user.uid + '/portfolio/' + this.coinId).set(postData2);


        const amount = snapshot.val().portfolio.amount;



        const postData = {
          action: 'sell',
          timestamp: (new Date().getTime() / 1000),
          coinId: this.coinId,
          coinSymbol: this.coinTag,
          coinName: this.coinName,
          priceAtTheTime: this.price,
          cost: Number(this.formGroup.value.cash * this.price),
          cryptoAmount: Number(this.formGroup.value.cash)
        };
        const newHistoryKey = this.angularFireDatabase.database.ref('users/' + this.firebaseAuthService.user.uid + '/history').push().key;
        const updates = {};
        updates['users/' + this.firebaseAuthService.user.uid + '/history/' + newHistoryKey] = postData;
        updates['users/' + this.firebaseAuthService.user.uid + '/cash/'] = this.myCash + Number(this.formGroup.value.cash * this.price);
        this.angularFireDatabase.database.ref().update(updates);

        this.error = null;
        this.activeModal.close();

      });


    } else {
      this.error = 'Invalid number';
    }

  }

}
