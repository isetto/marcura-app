export interface RoutePoint {
  longitude: number;
  latitude: number;
  timestamp: number;
  speed: number;
}

export interface RouteData {
  route_id: number;
  from_port: string;
  to_port: string;
  leg_duration: number;
  points: RoutePoint[];
}
