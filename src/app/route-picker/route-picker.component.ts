import { Component, OnInit } from '@angular/core';
import { RouteDataProviderService } from '../services/route-data-provider.service';
import { Observable } from 'rxjs';
import { RouteData } from '../models/route.model';

@Component({
  selector: 'app-route-picker',
  templateUrl: './route-picker.component.html',
  styleUrls: ['./route-picker.component.scss']
})
export class RoutePickerComponent implements OnInit {
  public routes$!: Observable<RouteData[]>;
  
  constructor(private csvParserService: RouteDataProviderService) {}

  public ngOnInit(): void {
    this.routes$ = this.csvParserService.routeData$;
  }

  public onRouteChange(id: number): void {
    this.routes$.subscribe((routes: RouteData[]) => {
      const selectedRoute = routes.find((route: RouteData) => route.route_id === id);
      if (selectedRoute) {
        this.csvParserService.selectRoute(selectedRoute);
      }
    });
  }
}
