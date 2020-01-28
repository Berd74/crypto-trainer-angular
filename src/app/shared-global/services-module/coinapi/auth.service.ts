import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url = environment.coinApiUrl + 'v1/exchangerate/BTC';
  private readonly httpOptions = {
    headers: new HttpHeaders(
      {
        'X-CoinAPI-Key': environment.coinApiKey,
      }
    )
  };

  constructor(private http: HttpClient) {
  }

  auth(): Observable<any> {
    return this.http.get<any>(this.url, this.httpOptions);
  }

}
