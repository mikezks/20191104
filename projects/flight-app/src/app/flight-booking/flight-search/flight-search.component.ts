import {Component, OnInit, Optional} from '@angular/core';
import { Flight} from '@flight-workspace/flight-api';
import * as fromFlightBooking from '../+state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, delay } from 'rxjs/operators';
import { FlightEditComponent } from '../flight-edit/flight-edit.component';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from: string = 'Hamburg'; // in Germany
  to: string = 'Graz'; // in Austria
  urgent: boolean = false;
  flights$: Observable<Flight[]>;

  /* get flights() {
    return this.flightService.flights;
  } */

  // "shopping basket" with selected flights
  basket: object = {
    "3": true,
    "5": true
  };

  constructor(
    private store: Store<fromFlightBooking.FeatureState>,
    // Without @Optional: Error to demonstrate Custom Error Handler
    @Optional() private editC: FlightEditComponent) {
  }

  ngOnInit() {
    this.flights$ = this.store
      .pipe(
        select(
          //state => state.flightBooking.flights
          fromFlightBooking.getFlights
        )
      );

    this.store
      .pipe(
        select(fromFlightBooking.getFlightsByActiveUser)
      )
      .subscribe(console.log);
  }

  search(): void {
    if (!this.from || !this.to) return;

    /* this.flightService
      .load(this.from, this.to, this.urgent); */

    /* this.flightService
      .find(this.from, this.to, this.urgent)
      .subscribe(
        flights => this.store.dispatch(
          fromFlightBooking.flightsLoaded({ flights })
        )
      ); */

    this.store.dispatch(fromFlightBooking.flightsLoad({
      from: this.from,
      to: this.to
    }));
  }

  delay(): void {
    //this.flightService.delay();

    this.flights$.pipe(first())
      .subscribe(flights => {
        const flight = flights[0];

        const oldDate = new Date(flight.date);
        const newDate = new Date(
          oldDate.getTime() + 15 * 60 * 1000
        );
        const newFlight = {
          ...flight,
          date: newDate.toISOString()
        }

        this.store.dispatch(
          fromFlightBooking.flightUpdate({ flight: newFlight })
        );
      });
  }

}
