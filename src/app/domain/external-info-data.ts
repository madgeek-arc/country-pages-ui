export class CountryPageOverviewData {

  name: string;
  code: string;

  rndExpenditure: RnDExpenditure;
  funders: number = null;
  fundingOrganizations: number = null;
  ec_fundedOrganizations: number = null;
  ec_fundedProjects: number = null;
}

export class RnDExpenditure {
  expenditure: number;
  year: number;
}
