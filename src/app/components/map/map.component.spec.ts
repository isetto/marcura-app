import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { Subject } from 'rxjs';
import { RouteData } from '../../models/route.model';
import { RouteDataProviderService } from '../../services/route-data-provider.service';
import { AppModule } from 'src/app/app.module';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
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
      imports: [AppModule],
      declarations: [MapComponent],
      providers: [
        { provide: RouteDataProviderService, useValue: mockRouteDataProviderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;

    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    document.body.appendChild(mapContainer);
  });


  afterEach(() => {
    component.ngOnDestroy();
    let mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.remove();
      mapContainer = null
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to selectedRoute$ on ngOnInit and call showRoute', () => {
    const showRouteSpy = spyOn<any>(component, 'showRoute').and.callThrough();
    component.ngOnInit();
    selectedRouteSubject.next(mockRouteData);
    expect(showRouteSpy).toHaveBeenCalledWith(mockRouteData);
  });

  it('should unsubscribe from routeSubscription on destroy', () => {
    component.ngOnInit();
    component.ngOnDestroy();
    expect(component['routeSubscription'].closed).toBeTruthy();
  });
});