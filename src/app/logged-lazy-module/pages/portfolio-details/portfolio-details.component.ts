import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GetCoinDetailsService} from '../../services/get-coin-details.service';
import {GetCoinPricesService} from '../../services/get-coin-prices.service';
import {GraphComponent} from '../../components/graph/graph.component';
import {from, Observable, timer} from 'rxjs';
import {BuyModal} from '../../modals/buy/buy.modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {APIHistoryItem, CoinInfo, MainHistoryActionItem, MainHistoryItem} from '../home/home.component';
import {concatMap, map, toArray} from 'rxjs/operators';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {SellModal} from '../../modals/sell/sell.modal';

@Component({
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.scss']
})
export class PortfolioDetailsComponent implements OnInit {

  public Date = Date;
  public coinId: string;
  public prices: Array<Array<number>>;
  public historyMain: MainHistoryItem[] = [];
  public historyCoin: MainHistoryActionItem[] = [];
  public coinInfo: CoinInfo;
  public myCash: number;
  public profit: number;
  public amountCoins: number;
  public sumCost: number;
  public averagePerPriceCoin: number;
  public noInPortfolio = false;


  @ViewChild('graph', {static: false}) public graph: GraphComponent;
  loading = true;

  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private cdr: ChangeDetectorRef,
              private getCoinPricesService: GetCoinPricesService,
              private firebaseAuthService: FirebaseAuthService,
              private angularFireDatabase: AngularFireDatabase,
              private getCoinDetailsService: GetCoinDetailsService) {
    // tslint:disable-next-line:radix
    this.coinId = this.activatedRoute.snapshot.paramMap.get('id');

    logtri('CoinDetailsComponent ' + this.coinId);

    this.getCoinDetailsService.get(this.coinId).subscribe((coinInfo) => {
      this.coinInfo = {
        id: coinInfo.id,
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        price: coinInfo.market_data.current_price.usd,
        thumb: coinInfo.image.thumb,
        description: coinInfo.description.en,
        high_24h: coinInfo.market_data.high_24h.usd,
        low_24h: coinInfo.market_data.low_24h.usd
      };
      this.getPricesFrom(7);
    });

  }

  public getPricesFrom(days: number) {
    const today = new Date();
    const ago = new Date();
    ago.setDate(ago.getDate() - days);
    this.updatePrices(Math.floor(ago.getTime() / 1000), Math.floor(today.getTime() / 1000));
  }

  public updatePrices(fromTimestamp: number, toTimestamp: number) {
    this.getCoinPricesService.get(this.coinId, fromTimestamp, toTimestamp).subscribe((prices) => {
      this.prices = prices;
      this.loading = false;
      this.cdr.detectChanges();

      timer(200).subscribe(() => {
        this.graph.drawChart();
      });
    });
  }

  public onSellClick(coinId, coinName, price, symbol) {
    const ref = this.modalService.open(SellModal);
    ref.componentInstance.coinId = coinId;
    ref.componentInstance.coinName = coinName;
    ref.componentInstance.coinTag = symbol;
    ref.componentInstance.price = price;
  }

  public onBuyClick(coinId, coinName, price, symbol) {
    const buyModalRef = this.modalService.open(BuyModal);
    buyModalRef.componentInstance.coinId = coinId;
    buyModalRef.componentInstance.coinName = coinName;
    buyModalRef.componentInstance.coinTag = symbol;
    buyModalRef.componentInstance.price = price;
  }

  ngOnInit(): void {
    this.angularFireDatabase.database.ref('/users/' + this.firebaseAuthService.user.uid)
      .on('value', (snapshot) => {
        if (!snapshot.val()) { return; }
        this.myCash = snapshot.val().cash;
        const history = snapshot.val().history;
        const portfolio = snapshot.val().portfolio;
        try {
          this.averagePerPriceCoin = snapshot.val().portfolio[this.coinId].averagePrice;
        } catch (e) {
          this.noInPortfolio = true;
        }
        if (this.noInPortfolio) { return; }
        this.amountCoins = snapshot.val().portfolio[this.coinId].amount;

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
          const thisCoin = this.historyMain.find((el) => {
            return el.coinId === this.coinId;
          });
          this.profit = thisCoin.currentPrice - thisCoin.priceWhenBuying;
          this.loading = false;
          this.historyCoin = (this.historyMain.find((el) => {
            return el.coinId === this.coinId;
          })).actions;


          this.sumCost = this.historyCoin.reduce((prev, curr) => {
            if (curr.action === 'buy') {
              return prev + curr.cost;
            } else {
              return prev - curr.cost;
            }
          }, 0);

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
        return el;
      })
    );
  }
}

