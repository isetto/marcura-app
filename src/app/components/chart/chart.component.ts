import { Component, OnDestroy } from '@angular/core';
import { RouteData, RoutePoint } from '../../models/route.model';
import { RouteDataProviderService } from '../../services/route-data-provider.service';
import { Subscription } from 'rxjs';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnDestroy {
  public chartOptions: EChartsOption = {};
  private routeSubscription!: Subscription;

  constructor(private csvParserService: RouteDataProviderService) { }

  public ngOnInit(): void {
    this.routeSubscription = this.csvParserService.selectedRoute$.subscribe(route => {
      if (route) {
        this.updateChart(route);
      }
    });
  }

  private updateChart(route: RouteData): void {
    const speedData: number[] = route.points.map((point: RoutePoint) => point.speed);
    const timeLabels: string[] = route.points.map((point: RoutePoint) => new Date(point.timestamp).toLocaleString());

    this.chartOptions = {
      title: {
        text: 'Speed over Time'
      },
      xAxis: {
        type: 'category',
        data: timeLabels
      },
      yAxis: {
        type: 'value',
        name: 'Speed (knots)'
      },
      series: [{
        data: speedData,
        type: 'line',
        smooth: true
      }],
      tooltip: {
        trigger: 'axis'
      }
    };
  }

  public ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}

