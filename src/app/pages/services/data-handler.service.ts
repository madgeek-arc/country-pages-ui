import { Injectable } from '@angular/core';
import { RawData } from "../../domain/raw-data";
import { CountryPageOverviewData, RnDExpenditure } from "../../domain/external-info-data";


@Injectable ()
export class DataHandlerService {

  public convertRawDataToCountryPageOverviewData(rawData: RawData) {

    const countryPageOverviewData: CountryPageOverviewData = new CountryPageOverviewData();

    for (const series of rawData.datasets) {

      if (series.series.query.name === 'oso.rnd.country'
        && series.series.result && series.series.result.length > 0 && series.series.result[0].row) {

        const rndExpenditure: RnDExpenditure = new RnDExpenditure();
        rndExpenditure.expenditure = Number(series.series.result[0].row[0]);
        rndExpenditure.year = Number(series.series.result[0].row[1]);
        countryPageOverviewData.rndExpenditure = rndExpenditure;

      } else if (series.series.query.name === 'oso.funder.country'
        && series.series.result && series.series.result.length > 0 && series.series.result[0].row) {

        countryPageOverviewData.funders = Number(series.series.result[0].row[0]);

      } else if (series.series.query.name === 'oso.funding_organizations.country'
        && series.series.result && series.series.result.length > 0 && series.series.result[0].row) {

        countryPageOverviewData.fundingOrganizations = Number(series.series.result[0].row[0]);

      } else if (series.series.query.name === 'oso.ec_funded_organizations.country'
        && series.series.result && series.series.result.length > 0 && series.series.result[0].row) {

        countryPageOverviewData.ec_fundedOrganizations = Number(series.series.result[0].row[0]);

      } else if (series.series.query.name === 'new.oso.ec_funded_projects.country'
        && series.series.result && series.series.result.length > 0 && series.series.result[0].row) {

        countryPageOverviewData.name = series.series.result[0].row[1];
        countryPageOverviewData.code = series.series.result[0].row[2];

        countryPageOverviewData.ec_fundedProjects = Number(series.series.result[0].row[0]);
      }
    }

    return countryPageOverviewData;
  }

  isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

}
