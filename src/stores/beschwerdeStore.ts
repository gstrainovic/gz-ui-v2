export const useBeschwerdenStore = defineStore('beschwerden', {
  state: () => ({
    fehlerFrei: [] as BeschwerdenData[],
    beschwerden: [] as BeschwerdenData[]
  }),
  actions: {
    async fetchFehler(from: Date, to: Date, userNames: string[]) {
      try {
        const { getFehler } = useMyFetch(); // Verwende den useMyFetch-Composable
        const response: BeschwerdenData[] | unknown = await getFehler(from, to, userNames);
        if (!Array.isArray(response)) {
          throw new TypeError('response is not an array');
        }
        const temp = response.map((item: any) => ({
          username: item.mitarbeiter_username,
          beschwerde: item.fehler,
          beschwerde_auswahl: item.fehler_auswahl,
          count: item.count
        }));

        // if the first row is empty, it's fehlerfrei
        this.fehlerFrei = temp.filter((item: BeschwerdenData) => item.beschwerde === null && item.beschwerde_auswahl === null);
        this.beschwerden = temp.filter((item: BeschwerdenData) => item.beschwerde !== null || item.beschwerde_auswahl !== null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  }
});
