import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { RouteData } from '../../models/route.model';
import { RouteDataProviderService } from '../../services/route-data-provider.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy  {
  public map!: L.Map;
  private routeSubscription!: Subscription;
  private polylines: L.Polyline[] = [];

  constructor(private csvParserService: RouteDataProviderService) {}

  public ngOnInit(): void {
    this.routeSubscription = this.csvParserService.selectedRoute$.subscribe((route) => {
      if (route) {
        this.clearRoute();
        this.showRoute(route);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors',
      detectRetina: true,
    });

    tiles.addTo(this.map);
  }

  private showRoute(route: RouteData): void {
    const localPolylines = [];
    for (let i = 0; i < route.points.length - 1; i++) {
      const p1 = route.points[i];
      const p2 = route.points[i + 1];
      const color = this.getColorForSpeed(p1.speed);
      const segment = L.polyline([[p1.latitude, p1.longitude], [p2.latitude, p2.longitude]], { color });
      localPolylines.push(segment);
      segment.addTo(this.map);
    }
    this.polylines = localPolylines;
    this.map.fitBounds(L.featureGroup(localPolylines).getBounds());
  }

  private clearRoute(): void {
    if (this.polylines) {
      this.polylines.forEach((segment) => this.map.removeLayer(segment));
      this.polylines = [];
    }
  }

  private getColorForSpeed(speed: number): string {
    if (speed < 5) return 'red';
    if (speed < 10) return 'orange';
    if (speed < 15) return 'yellow';
    if (speed < 20) return 'green';
    return 'blue';
  }

  public ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
