import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Coordinate } from 'ol/coordinate';
import { Observable, debounceTime, map } from 'rxjs';

interface GeoData {
  place: string;
  countryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeoDataService {
  constructor(private http: HttpClient) {}

  // private getUrl(coordinateLatLon: Coordinate) {
  //   return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinateLatLon[0]}&longitude=${coordinateLatLon[1]}&localityLanguage=en`;
  // }

  private getReverseUrl(coordinateLatLon: Coordinate): string {
    return `https://nominatim.openstreetmap.org/reverse?lat=${coordinateLatLon[0]}&lon=${coordinateLatLon[1]}&format=json`;
  }

  private getAddressesUrl(searchQuery: string): string {
    // 'eiffel+tower'
    return `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&accept-language=en`;
  }

  getGeoData(coordinateLatLon: Coordinate): Observable<GeoData> {
    return this.http.get<any>(this.getReverseUrl(coordinateLatLon)).pipe(
      map((data) => {
        if (data.error) return data.error;
        const newData = {
          place:
            data.address.city ||
            data.address.town ||
            data.address.municipality ||
            data.address.village ||
            data.address.county ||
            data.address.state,
          countryName: data.address.country,
        };
        return newData;
      })
    );
  }

  getAddresses(searchQuery: string): Observable<any> {
    return this.http
      .get<any>(this.getAddressesUrl(searchQuery))
      .pipe(
        map((addresses) => {
          return addresses.map(({ display_name, lat, lon, place_id }: any) => {
            return {
              displayName: display_name,
              lat,
              lon,
              placeId: place_id,
            };
          });
        })
      );
  }
}
