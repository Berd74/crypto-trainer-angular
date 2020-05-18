import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LoggedProvidersModule} from '../logged-providers.module';

export interface Coin {
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  symbol: string;
  name: string;
  id: string;
  description: {
    en: string;
  };
  last_updated: string;
  market_data: {
    current_price: {
      usd: number;
    };
    high_24h: {
      usd: number;
    }
    low_24h: {
      usd: number;
    }
  };
}

@Injectable({
  providedIn: LoggedProvidersModule
})
export class GetCoinDetailsService {

  private readonly url = environment.coingeckoURL + '/coins/';

  constructor(private http: HttpClient) {
  }

  get(id: string): Observable<Coin> {
    const url = this.url + id;
    return this.http.get<Coin>(url).pipe();
  }

}

























