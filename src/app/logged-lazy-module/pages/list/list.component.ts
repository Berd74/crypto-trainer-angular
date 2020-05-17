import {Component, PipeTransform} from '@angular/core';
import {GetCoinDetailsService} from '../../services/get-coin-details.service';
import {GetListOfCoinsService} from '../../services/get-list-of-coins.service';
import {from} from 'rxjs';
import {concatMap, map, startWith, toArray} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {BuyModal} from '../../modals/buy/buy.modal';
import {FormControl} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

interface CoinTableItem {
  id: number;
  name: string;
  symbol: string;
  price: number;
  thumb: string;
  coinId: string;
}

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  page = 1;
  pageSize = 10;
  _orginalCoins: CoinTableItem[] = [];
  _coins: CoinTableItem[] = [];
  loading = true;
  filter = new FormControl('');

  public max = 0;
  public currentCoin = 0;

  get coins(): CoinTableItem[] {
    return this._coins
      .sort((a, b) => {
        return (a.id < b.id ? 0 : 1);
      })
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  set coins(coins) {
    this._coins = coins;
  }

  constructor(private getListOfCurrencyService: GetListOfCoinsService,
              private modalService: NgbModal,
              private angularFireDatabase: AngularFireDatabase,
              public firebaseAuthService: FirebaseAuthService,
              private decimalPipe: DecimalPipe,
              private getCoinDetailsService: GetCoinDetailsService) {

    this.getListOfCurrencyService.getList().subscribe((list) => {

      this.max = list.length;

      from(list).pipe(
        concatMap((coin, index) => {
          this.currentCoin = index;
          return this.getCoinDetailsService.get(coin.id);
        }),
        toArray()
      ).subscribe( arr => {
        this._orginalCoins = arr.map((coinInfo, index) => {
          return {
            id: index,
            coinId: coinInfo.id,
            name: coinInfo.name,
            symbol: coinInfo.symbol,
            price: coinInfo.market_data.current_price.usd,
            thumb: coinInfo.image.thumb
          };
        });

        this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text, decimalPipe))
        ).subscribe( (coins) => {
          this._coins = coins;
        });

        this.loading = false;
      });

    });


  }

  public search(text: string, thisPipe: PipeTransform): CoinTableItem[] {
    return this._orginalCoins.filter(country => {
      const term = text.toLowerCase();
      return country.name.toLowerCase().includes(term)
        || country.symbol.toLowerCase().includes(term)
        || country.name.toLowerCase().includes(term);
    });
  }


  public onBuyClick(coinId, coinName, price, symbol) {
    const buyModalRef = this.modalService.open(BuyModal);
    buyModalRef.componentInstance.coinId = coinId;
    buyModalRef.componentInstance.coinName = coinName;
    buyModalRef.componentInstance.coinTag = symbol;
    buyModalRef.componentInstance.price = price;
  }
}

