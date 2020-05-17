import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LoggedProvidersModule} from '../logged-providers.module';
import {concatMap, map, toArray} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

interface CoinPrices {
  timestamp: number;
  price: number;
}

@Injectable({
  providedIn: LoggedProvidersModule
})
export class GetCoinPricesService {

  private readonly url = environment.coingeckoURL + '/coins/';

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }

  get(id: string, from: number, to: number): Observable<Array<Array<number>>> {
    const url = this.url + id + '/market_chart/range?vs_currency=usd&from=' + from + '&to=' + to;
    return this.http.get<any>(url).pipe(
      map((obj) => obj.prices),
      concatMap(value => value),
      map((arr) => {
        return [
          this.datePipe.transform(arr[0].toString(), 'yyyy-MM-dd'),
          arr[1]
        ];
      }),
      toArray()
    );
  }

}

























