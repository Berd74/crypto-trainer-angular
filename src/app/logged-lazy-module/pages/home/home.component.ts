import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {GetCoinDetailsService} from '../../services/get-coin-details.service';
import {from, Observable} from 'rxjs';
import {concatMap, map, toArray} from 'rxjs/operators';

export interface MainHistoryItem {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  actions: MainHistoryActionItem[];
  coinThumb: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  priceWhenBuying: number;
}

export interface MainHistoryActionItem {
  action: 'buy' | 'sell';
  cost: number;
  cryptoAmount: number;
  priceAtTheTime: number;
  timestamp: number;
}

export interface APIHistoryItem {
  action: 'buy' | 'sell';
  cost: number;
  cryptoAmount: number;
  priceAtTheTime: number;
  timestamp: number;
  coinId: string;
  coinName: string;
  coinSymbol: string;
}

export interface CoinInfo {
  id: string;
  name: string;
  symbol: string;
  price: number;
  thumb: string;
  description: string;
  high_24h: number;
  low_24h: number;
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public myCash: number;
  public historyMain: MainHistoryItem[] = [];
  public profit: number;
  public loading = true;
  public valueOfAllCrypto: number;

  constructor(private firebaseAuthService: FirebaseAuthService,
              private angularFireDatabase: AngularFireDatabase,
              private cdr: ChangeDetectorRef,
              private getCoinDetailsService: GetCoinDetailsService
  ) {
    logtri('HomeComponent');
  }

  ngOnInit(): void {
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
          this.profit = this.historyMain.reduce((previousValue, currentValue) => {
            return previousValue + (currentValue.currentPrice - currentValue.priceWhenBuying);
          }, 0);
          this.valueOfAllCrypto = this.historyMain.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.currentPrice;
          }, 0);
          this.loading = false;
          this.cdr.detectChanges();
        });


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
        this.angularFireDatabase.database.ref('users/' + this.firebaseAuthService.user.uid + '/portfolio/'
          + el.coinId + '/averagePrice').once('value').then( (snap) => {
            el.averagePrice =  snap.val();
            this.cdr.detectChanges();
        });
        return el;
      }),
    );
  }

}
