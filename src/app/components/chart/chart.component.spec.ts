import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { EChartsOption } from 'echarts';
import { RouteDataProviderService } from '../../services/route-data-provider.service';
import { Subject } from 'rxjs';
import { RouteData } from '../../models/route.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxEchartsModule } from 'ngx-echarts';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let mockRouteDataProviderService: jasmine.SpyObj<RouteDataProviderService>;
  let selectedRouteSubject: Subject<RouteData>;

  const mockRouteData: RouteData = {
    route_id: 1,
    from_port: 'Port A',
    to_port: 'Port B',
    leg_duration: 123,
    points: [
      { longitude: 0, latitude: 0, timestamp: 1629988800000, speed: 10 },
      { longitude: 1, latitude: 1, timestamp: 1629992400000, speed: 15 },
    ],
  };

  beforeEach(async () => {
    selectedRouteSubject = new Subject<RouteData>();

    mockRouteDataProviderService = jasmine.createSpyObj('RouteDataProviderService', ['selectRoute']);
    mockRouteDataProviderService.selectedRoute$ = selectedRouteSubject.asObservable();

    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts')
        }),
      ],
      providers: [
        { provide: RouteDataProviderService, useValue: mockRouteDataProviderService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart when a route is selected', () => {
    spyOn(component as any, 'updateChart');
    selectedRouteSubject.next(mockRouteData);
    expect((component as any).updateChart).toHaveBeenCalledWith(mockRouteData);
  });

  it('should set chart options correctly', () => {
    component['updateChart'](mockRouteData);
    const expectedOptions: EChartsOption = {
      title: {
        text: 'Speed over Time'
      },
      xAxis: {
        type: 'category',
        data: mockRouteData.points.map(point => new Date(point.timestamp).toLocaleString())
      },
      yAxis: {
        type: 'value',
        name: 'Speed (knots)'
      },
      series: [{
        data: mockRouteData.points.map(point => point.speed),
        type: 'line',
        smooth: true
      }],
      tooltip: {
        trigger: 'axis'
      }
    };
    expect(component.chartOptions).toEqual(expectedOptions);
  });

  it('should unsubscribe from route subscription on destroy', () => {
    spyOn(component['routeSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['routeSubscription'].unsubscribe).toHaveBeenCalled();
  });
});