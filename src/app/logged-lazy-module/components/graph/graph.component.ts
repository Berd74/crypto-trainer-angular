import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {fromEvent, timer} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  public dataTest = [
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', -1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2004', 1000],
    ['2005', 1200],
    ['2006', 1500],
    ['2007', 2000],
    ['2008', 4000],
    ['2009', 1000],
    ['2010', 2000]
  ];

  @Input() title: string;

  @Input() data: Array<Array<number>>;

  @ViewChild('googleChart') public googleChartRef: ElementRef;
  public target: string;
  public targetPrev: string;
  public price: number;
  public grow: number;
  public increase: number;
  private mousedown: boolean;
  private chart: any;
  private lastHovered: any;

  constructor() {
    logtri('GraphComponent');
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.mousedown = true;
    this.grow = null;
    this.increase = null;
    if (this.lastHovered) {
      this.chart.setSelection([this.lastHovered]);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    this.mousedown = false;
    if (this.lastHovered) {
      timer(1).subscribe(() => {
        this.chart.setSelection([this.chart.getSelection()[0], this.lastHovered]);
      });
    }
  }

  public ngOnInit(): void {

    this.target = this.data[this.data.length - 1][0].toString();
    this.price = this.data[this.data.length - 1][1];

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawChart.bind(this));

    fromEvent(window, 'resize').pipe(
      debounceTime(50)
    ).subscribe(event => {
      this.drawChart();
    });

  }

  public drawChart() {
    let data;
    try {
      data = new google.visualization.DataTable();
    } catch (e) {
      return;
    }
    data.addColumn('string', 'time');
    data.addColumn('number', 'price');
    data.addRows(this.data);

    const options = {
      selectionMode: 'multiple',
      legend: 'none',
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'none'
      },
      colors: ['#f5bb5a'],
      chartArea: {
        left: '60',
        width: '100%',
        height: '80%'
  },
      // focusTarget: 'category',
      hAxis: {
        textPosition: 'in',
        // maxTextLines: 4,
        // minTextSpacing: 100,
        maxAlternation: 1,
        slantedText: false,
        // slantedTextAngle: 0,
        // showTextEvery: Math.floor(this.data.length / 12) - 1,
        textStyle: {
          color: '#2f6763',
        },
      },
      vAxis: {
        textPosition: 'out',
        baselineColor: '#002525',
        gridlines: {
          color: '#002525'
        },
        minorGridlines: {
          color: '#002525'
        },
        textStyle: {
          color: '#2f6763',
          bold: true,
        },
        // title: 'Price in USD',
        // titleTextStyle: {
        //   color: '#d0d8d8'
        // }
      },
      crosshair: {
        trigger: 'both',
        orientation: 'vertical'
      },
      aggregationTarget: 'auto'
    };

    try {
      this.chart = new google.visualization.LineChart(this.googleChartRef.nativeElement);
    } catch (e) {
      return;
    }

    this.chart.draw(data, options);

    google.visualization.events.addListener(this.chart, 'onmouseover', (properties) => {
      this.price = this.data[properties.row][1] as number;
      this.target = (this.data[properties.row][0]).toString() as string;
      this.lastHovered = properties;
      if (this.mousedown) {
        this.targetPrev = (this.data[this.chart.getSelection()[0].row][0]).toString() as string;
        this.chart.setSelection([this.chart.getSelection()[0], this.lastHovered]);


        if (!this.chart.getSelection()[1]) {
          this.grow = null;
          this.increase = null;
          return;
        }


        let a: any;

        if (this.chart.getSelection()[0].row > this.chart.getSelection()[1].row + 1) {
          a = this.data.slice(this.chart.getSelection()[1].row, this.chart.getSelection()[0].row + 1);
        } else if (this.chart.getSelection()[0].row === this.chart.getSelection()[1].row + 1) {
          a = this.data.slice(this.chart.getSelection()[1].row, this.chart.getSelection()[0].row + 1);
        } else {
          a = this.data.slice(this.chart.getSelection()[0].row, this.chart.getSelection()[1].row + 1);
        }

        a = a.reduce((accumulator: any, value) => {
          accumulator.push(value);
          return accumulator;
        }, []);

        const first = a[0][1];
        const last = a[a.length - 1][1];
        this.grow = (last - first);
        this.increase = (((last - first) / first) * 100);
      }
    });

    google.visualization.events.addListener(this.chart, 'onmouseout', (properties) => {
      if (!this.mousedown) {
        this.chart.setSelection([]);
        this.grow = null;
        this.increase = null;
      }
    });

    google.visualization.events.addListener(this.chart, 'click', (properties) => {
    });

  }

}
