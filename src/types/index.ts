export { };

declare global {

  interface PieData {
    label: string;
    labels: string[];
    datasets: {
      data: number[],
      backgroundColor: string[],
      hoverBackgroundColor: string[]
    }[];
  }

  interface StatusCardData {
    label: string;
    count: number;
    icon: string;
    color: string;
    percentage: number;
  }

  interface BeschwerdenData {
    username: string;
    beschwerde: string | null;
    beschwerde_auswahl: string | null;
    count: number;
  }

  interface QuotenData {
    username: string;
    gesamtanzahl: number;
    fehleranzahl_fehler: number;
    fehleranzahl_mangelware: number;
    fehleranzahl_ausschuss: number;
    fehleranzahl_total: number;
    fehlerquote_fehler: number;
    fehlerquote_mangelware: number;
    fehlerquote_ausschuss: number;
    fehlerquote_total: number;
    fehlerfrei: number;
  }

  interface LoginData {
    identifier: string;
    password: string;
  }

  interface PerformanceData {
    start: Date;
    ende: Date;
    barcodes: number;
    fehler: number;
    mangelware: number;
    ausschuss: number;
    fehlerfrei: number;
    username: string;
  }

  interface StatusCard {
    label: string;
    count: number;
    icon: string;
    color: string;
    percentage: number;
  }

  interface Data {
    beschwerdenListe: BeschwerdenData[];
    statusCards: ComputedRef<StatusCardData>[];
    pies: ComputedRef<PieData>[];
  }

}
