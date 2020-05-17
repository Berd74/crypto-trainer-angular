import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LoggedProvidersModule} from '../logged-providers.module';
import {concatMap, filter, map, toArray} from 'rxjs/operators';

interface CoinListItemInfo {
  id: string;
  symbol: string;
  name: string;
}

const MY_CRYPTO_SYMBOLS = [
  'btc',
  'eth',
  'xrp',
  'ltc',
  'usdt',
  'bch',
  'xmr',
  'eos',
  'bsv',
  'bnb',
  'xlm',
  'ada',
  'link',
  'leo',
  'trx',
  'ht',
  'neo',
  'etc',
  'usdc',
  'dash',
  'atom',
  'zec',
  'xem',
  'mkr',
  'doge',
  'okb',
];

@Injectable({
  providedIn: LoggedProvidersModule
})
export class GetListOfCoinsService {

  private readonly url = environment.coingeckoURL + '/coins/list';

  constructor(private http: HttpClient) {
  }

  public getList(): Observable<CoinListItemInfo[]> {
    return this.http.get<CoinListItemInfo[]>(this.url).pipe(
      concatMap( val => val),
      filter((val)  => {
        return MY_CRYPTO_SYMBOLS.includes(val.symbol);
      }),
      toArray(),
      map(arr => {
        arr.sort((a, b) => {
          if (MY_CRYPTO_SYMBOLS.indexOf(a.symbol) < MY_CRYPTO_SYMBOLS.indexOf(b.symbol)) {
            return -1;
          }
          if (MY_CRYPTO_SYMBOLS.indexOf(a.symbol) > MY_CRYPTO_SYMBOLS.indexOf(b.symbol)) {
            return 1;
          }
          return 0;
        });
        return arr;
      })
    );
  }

}

























