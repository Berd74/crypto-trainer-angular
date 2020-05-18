import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GetCoinDetailsService} from '../../services/get-coin-details.service';
import {GetCoinPricesService} from '../../services/get-coin-prices.service';
import {GraphComponent} from '../../components/graph/graph.component';
import {timer} from 'rxjs';
import {BuyModal} from '../../modals/buy/buy.modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CoinInfo} from '../home/home.component';

@Component({
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.scss']
})
export class CoinDetailsComponent {

  public coinId: string;
  public prices: Array<Array<number>>;

  public coinInfo: CoinInfo;

  @ViewChild('graph', {static: false}) public graph: GraphComponent;
  loading = true;


  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private cdr: ChangeDetectorRef,
              private getCoinPricesService: GetCoinPricesService,
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

  public updatePrices(from: number, to: number) {
    this.getCoinPricesService.get(this.coinId, from, to).subscribe((prices) => {
      this.prices = prices;
      this.loading = false;
      this.cdr.detectChanges();

      timer(200).subscribe(() => {
        this.graph.drawChart();
      });
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
