import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RawData } from "../../../survey-tool/app/domain/raw-data";


const headerOptions = {
  headers : new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json'),
};

@Injectable ()
export class DataService {

  private OSOStatsAPIURL = environment.OSO_STATS_API_ENDPOINT + 'raw?json=';
  private osoProfileName = environment.osoStatsProfileName;

  constructor(private httpClient: HttpClient) {}

  public getCountryPageOverviewData(countryCode: string): Observable<RawData> {
    const countryPageOverviewDataQuery = `{"series":[{"query":{"name":"oso.rnd.country","parameters":["${countryCode}"],"profile":"${this.osoProfileName}"}},{"query":{"name":"oso.funder.country", "parameters":["${countryCode}"],"profile":"${this.osoProfileName}"}},{"query":{"name":"oso.funding_organizations.country", "parameters":["${countryCode}"],"profile":"${this.osoProfileName}"}},{"query":{"name":"oso.ec_funded_organizations.country", "parameters":["${countryCode}"],"profile":"${this.osoProfileName}"}},{"query":{"name":"new.oso.ec_funded_projects.country", "parameters":["${countryCode}"],"profile":"${this.osoProfileName}"}}],"verbose":true}`;
    return this.httpClient.get<RawData>(this.OSOStatsAPIURL + encodeURIComponent(countryPageOverviewDataQuery), headerOptions);
  }

}
