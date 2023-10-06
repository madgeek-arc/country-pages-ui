import {DataLabelsOptions, PointMarkerOptionsObject} from "highcharts";
import {SeriesMapDataOptions} from "highcharts/highmaps";

export class CategorizedAreaData {
  series: Series[];

  constructor() {
    this.series = [];
  }
}

export class Series {
  allAreas: boolean;
  name: string;
  type: string;
  color: string;
  showInLegend: boolean;
  dataLabels: DataLabelsOptions = {};
  marker: PointMarkerOptionsObject = {};
  data: any[];

  constructor(name: string, allAreas: boolean, type?: string) {
    this.allAreas = allAreas;
    this.name = name;
    this.data = [];
    this.dataLabels.enabled = false;
    this.showInLegend = false;
    this.type = undefined;
    if (type) {
      this.type = type;
    }
    // this.marker = null;
    // if (marker) {
    //   this.marker = new Marker(marker.radius, marker.fillColor);
    // }
  }
}

export class ActivityGauge {
  name: string;
  y: number;
}

export const colorAxisDataWithZeroValue: (number | SeriesMapDataOptions | [string, number])[] = [
  ["fo", -1],
  ["um", -1],
  ["us", -1],
  ["jp", -1],
  ["sc", -1],
  ["in", -1],
  ["fr", -1],
  ["fm", -1],
  ["cn", -1],
  ["pt", -1],
  ["sw", -1],
  ["sh", -1],
  ["br", -1],
  ["ki", -1],
  ["ph", -1],
  ["mx", -1],
  ["es", -1],
  ["bu", -1],
  ["mv", -1],
  ["sp", -1],
  ["gb", -1],
  ["gr", -1],
  ["as", -1],
  ["dk", -1],
  ["gl", -1],
  ["gu", -1],
  ["mp", -1],
  ["pr", -1],
  ["vi", -1],
  ["ca", -1],
  ["st", -1],
  ["cv", -1],
  ["dm", -1],
  ["nl", -1],
  ["jm", -1],
  ["ws", -1],
  ["om", -1],
  ["vc", -1],
  ["tr", -1],
  ["bd", -1],
  ["lc", -1],
  ["nr", -1],
  ["no", -1],
  ["kn", -1],
  ["bh", -1],
  ["to", -1],
  ["fi", -1],
  ["id", -1],
  ["mu", -1],
  ["se", -1],
  ["tt", -1],
  ["my", -1],
  ["pa", -1],
  ["pw", -1],
  ["tv", -1],
  ["mh", -1],
  ["cl", -1],
  ["th", -1],
  ["gd", -1],
  ["ee", -1],
  ["ag", -1],
  ["tw", -1],
  ["bb", -1],
  ["it", -1],
  ["mt", -1],
  ["vu", -1],
  ["sg", -1],
  ["cy", -1],
  ["lk", -1],
  ["km", -1],
  ["fj", -1],
  ["ru", -1],
  ["va", -1],
  ["sm", -1],
  ["kz", -1],
  ["az", -1],
  ["tj", -1],
  ["ls", -1],
  ["uz", -1],
  ["ma", -1],
  ["co", -1],
  ["tl", -1],
  ["tz", -1],
  ["ar", -1],
  ["sa", -1],
  ["pk", -1],
  ["ye", -1],
  ["ae", -1],
  ["ke", -1],
  ["pe", -1],
  ["do", -1],
  ["ht", -1],
  ["pg", -1],
  ["ao", -1],
  ["kh", -1],
  ["vn", -1],
  ["mz", -1],
  ["cr", -1],
  ["bj", -1],
  ["ng", -1],
  ["ir", -1],
  ["sv", -1],
  ["sl", -1],
  ["gw", -1],
  ["hr", -1],
  ["bz", -1],
  ["za", -1],
  ["cf", -1],
  ["sd", -1],
  ["cd", -1],
  ["kw", -1],
  ["de", -1],
  ["be", -1],
  ["ie", -1],
  ["kp", -1],
  ["kr", -1],
  ["gy", -1],
  ["hn", -1],
  ["mm", -1],
  ["ga", -1],
  ["gq", -1],
  ["ni", -1],
  ["lv", -1],
  ["ug", -1],
  ["mw", -1],
  ["am", -1],
  ["sx", -1],
  ["tm", -1],
  ["zm", -1],
  ["nc", -1],
  ["mr", -1],
  ["dz", -1],
  ["lt", -1],
  ["et", -1],
  ["er", -1],
  ["gh", -1],
  ["si", -1],
  ["gt", -1],
  ["ba", -1],
  ["jo", -1],
  ["sy", -1],
  ["mc", -1],
  ["al", -1],
  ["uy", -1],
  ["cnm", -1],
  ["mn", -1],
  ["rw", -1],
  ["so", -1],
  ["bo", -1],
  ["cm", -1],
  ["cg", -1],
  ["eh", -1],
  ["rs", -1],
  ["me", -1],
  ["tg", -1],
  ["la", -1],
  ["af", -1],
  ["ua", -1],
  ["sk", -1],
  ["jk", -1],
  ["bg", -1],
  ["qa", -1],
  ["li", -1],
  ["at", -1],
  ["sz", -1],
  ["hu", -1],
  ["ro", -1],
  ["ne", -1],
  ["lu", -1],
  ["ad", -1],
  ["ci", -1],
  ["lr", -1],
  ["bn", -1],
  ["iq", -1],
  ["ge", -1],
  ["gm", -1],
  ["ch", -1],
  ["td", -1],
  ["kv", -1],
  ["lb", -1],
  ["dj", -1],
  ["bi", -1],
  ["sr", -1],
  ["il", -1],
  ["ml", -1],
  ["sn", -1],
  ["gn", -1],
  ["zw", -1],
  ["pl", -1],
  ["mk", -1],
  ["py", -1],
  ["by", -1],
  ["cz", -1],
  ["bf", -1],
  ["na", -1],
  ["ly", -1],
  ["tn", -1],
  ["bt", -1],
  ["md", -1],
  ["ss", -1],
  ["bw", -1],
  ["bs", -1],
  ["nz", -1],
  ["cu", -1],
  ["ec", -1],
  ["au", -1],
  ["ve", -1],
  ["sb", -1],
  ["mg", -1],
  ["is", -1],
  ["eg", -1],
  ["kg", -1],
  ["np", -1]
]
