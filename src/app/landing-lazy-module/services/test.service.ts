import {Injectable} from '@angular/core';
import {ConnectableObservable, interval, Observable, Subject} from 'rxjs';
import {multicast, publish, refCount, tap} from 'rxjs/operators';
import {LandingProvidersModule} from '../landing-providers.module';

@Injectable({
  providedIn: LandingProvidersModule
})
export class TestService {

  constructor() {
    logtri('TestService');
  }


  main() {
    this.test2();
    // this.test1();
  }

  test3() {
    const observable = interval(500);
    const subject = new Subject();
    // to make it works like on multicastedWay() we need to call this when first subject.subscription is called
    const subConect = observable.subscribe(subject);
    // to make it works like on multicastedWay() we need to call this when last subject.subscription is called
    // subConect.unsubscribe();
    // without unsubscribe() the interval is going to be running all the time after `observable.subscribe(subject);`

    setTimeout(() => {
      const a = subject.subscribe({
        next: (v) => console.log(`observerA: ${v}`)
      });

      setTimeout(() => {
        a.unsubscribe();
      }, 900);
    }, 900);

    setTimeout(() => {
      const b = subject.subscribe({
        next: (v) => console.log(`observerB: ${v}`)
      });

      setTimeout(() => {
        b.unsubscribe();
      }, 4000);
    }, 1100);

    setTimeout(() => {
      const a = subject.subscribe({
        next: (v) => console.log(`observerC: ${v}`)
      });

      setTimeout(() => {
        a.unsubscribe();
      }, 1100);
    }, 6000);
  }

  test2() {
    const observable = interval(500);
    const subject = new Subject();
    // const multicasted = observable.pipe(multicast(subject)) as ConnectableObservable<any>;
    const multicasted = observable.pipe(multicast(subject), refCount());
    // const multicasted = observable.pipe(share());

    setTimeout(() => {
      const a = multicasted.subscribe({
        next: (v) => console.log(`observerA: ${v}`)
      });

      setTimeout(() => {
        a.unsubscribe();
      }, 900);
    }, 900);


    setTimeout(() => {
      const b = multicasted.subscribe({
        next: (v) => console.log(`observerB: ${v}`)
      });

      setTimeout(() => {
        b.unsubscribe();
      }, 4000);
    }, 1100);

    setTimeout(() => {
      const a = multicasted.subscribe({
        next: (v) => console.log(`observerC: ${v}`)
      });

      setTimeout(() => {
        a.unsubscribe();
      }, 1100);
    }, 6000);

  }

  test1() {
    const obs1 = new Observable<number>(obs => {
      obs.next(Math.random());
    });

    const hot = obs1.pipe(
      tap(_ => console.log('Do Something!')),
      publish()
    ) as ConnectableObservable<any>;

    hot.subscribe({
      next: value => {
        console.log(value);
      }
    });

    hot.subscribe({
      next: value => {
        console.log(value);
      }
    });


    setTimeout(() => {
      hot.connect();
    }, 3000);

  }
}
