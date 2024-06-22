import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePickerComponent } from './route-picker.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RouteData } from '../../models/route.model';
import { RouteDataProviderService } from '../../services/route-data-provider.service';
import { AppModule } from 'src/app/app.module';

describe('RoutePickerComponent', () => {
  let component: RoutePickerComponent;
  let fixture: ComponentFixture<RoutePickerComponent>;
  let mockRouteDataProviderService: jasmine.SpyObj<RouteDataProviderService>;

  const mockRouteData: RouteData[] = [
    {
      route_id: 1,
      from_port: 'Port A',
      to_port: 'Port B',
      leg_duration: 123,
      points: [
        { longitude: 0, latitude: 0, timestamp: 1629988800000, speed: 10 },
        { longitude: 1, latitude: 1, timestamp: 1629992400000, speed: 15 },
      ],
    },
    {
      route_id: 2,
      from_port: 'Port C',
      to_port: 'Port D',
      leg_duration: 456,
      points: [
        { longitude: 2, latitude: 2, timestamp: 1630000000000, speed: 20 },
        { longitude: 3, latitude: 3, timestamp: 1630003600000, speed: 25 },
      ],
    },
  ];

  beforeEach(async () => {
    mockRouteDataProviderService = jasmine.createSpyObj('RouteDataProviderService', ['selectRoute']);
    mockRouteDataProviderService.routeData$ = of(mockRouteData);

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [RoutePickerComponent],
      providers: [
        { provide: RouteDataProviderService, useValue: mockRouteDataProviderService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize routes$', () => {
    component.routes$.subscribe(routes => {
      expect(routes).toEqual(mockRouteData);
    });
  });

  it('should call selectRoute with the correct route when a route is selected', () => {
    const select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    select.value = mockRouteData[0].route_id;
    select.dispatchEvent(new Event('selectionChange'));

    fixture.detectChanges();

    component.onRouteChange(mockRouteData[0].route_id);
    expect(mockRouteDataProviderService.selectRoute).toHaveBeenCalledWith(mockRouteData[0]);
  });

});