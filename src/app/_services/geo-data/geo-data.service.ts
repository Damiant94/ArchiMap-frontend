import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Coordinate } from 'ol/coordinate';
import { Observable, map } from 'rxjs';

interface GeoData {
  city: string;
  countryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeoDataService {
  constructor(private http: HttpClient) {}

  private getUrl(coordinateLatLon: Coordinate) {
    return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinateLatLon[0]}&longitude=${coordinateLatLon[1]}&localityLanguage=en`;
  }

  getGeoData(coordinateLatLon: Coordinate): Observable<GeoData> {
    return this.http.get<any>(this.getUrl(coordinateLatLon)).pipe(
      map(({ city, countryName, coordinate }) => {
        const newData = {
          city,
          countryName,
          coordinate,
        };
        return newData;
      })
    );
  }
}
