import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteData, RoutePoint } from '../models/route.model';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class RouteDataProviderService {
  private routeDataSubject = new BehaviorSubject<RouteData[]>([]);
  public routeData$ = this.routeDataSubject.asObservable();

  private selectedRouteSubject = new BehaviorSubject<RouteData | null>(null);
  public selectedRoute$ = this.selectedRouteSubject.asObservable();

  constructor() {
    this.loadCsvData();
  }

  private loadCsvData(): void {
    const csvFilePath = 'assets/web_challenge.csv';
    const fileReader = new FileReader();

    fileReader.onload = (event: any) => {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        complete: (result: any) => {
          const jsonData = this.mapRawDataToRouteData(result.data);
          this.routeDataSubject.next(jsonData);
        }
      });
    };

    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvText => {
        fileReader.readAsText(new Blob([csvText]));
      })
      .catch(error => console.error('Error fetching the CSV file: ', error));
  }

  private mapRawDataToRouteData(rawRoutes: any[]): RouteData[] {
    const routes: RouteData[] = rawRoutes.map((rawRoute: any, i: number) => this.createRouteData(rawRoute, i));
    const validRoutes: RouteData[] = this.filterValidRoutes(routes);
    return validRoutes;
  }

  private createRouteData(data: any, index: number): RouteData {
    const routePoints: RoutePoint[] = this.parsePoints(data.points, index);

    return {
      route_id: Number(data.route_id),
      from_port: data.from_port,
      to_port: data.to_port,
      leg_duration: Number(data.leg_duration),
      points: routePoints
    } as RouteData;
  }

  private parsePoints(pointsString: string, index: number): RoutePoint[] {
    let parsedPoints: any[] = [];
    try {
      parsedPoints = JSON.parse(pointsString);
    } catch (error) {
      console.error(`Error parsing points on index ${index}`, error);
    }

    return parsedPoints.map((point: number[]) => ({
      longitude: point[0],
      latitude: point[1],
      timestamp: point[2],
      speed: point[3]
    })) as RoutePoint[];
  }

  private filterValidRoutes(routes: RouteData[]): RouteData[] {
    return routes.filter(route => route.points.length > 0);
  }

  public selectRoute(route: RouteData): void {
    this.selectedRouteSubject.next(route);
  }
}
