export const useQuotenStore = defineStore('quoten', {
  state: () => ({
    quoten: [] as QuotenData[]
  }),
  actions: {
    produziert(username: string): StatusCard {
      const user = this.quoten.find(user => user.username === username);
      const count = user ? Number(user.gesamtanzahl) + Number(user.fehleranzahl_total) : 0;
      return {
        label: 'Produziert',
        count,
        icon: 'pi-cog',
        color: 'blue',
        percentage: 100
      };
    },
    ausschuss(username: string): StatusCard {
      const user = this.quoten.find(user => user.username === username);
      const count = user ? Number(user.fehleranzahl_ausschuss) : 0;
      const percentage = user ? Number(user.fehlerquote_ausschuss) : 0;
      return {
        label: 'Ausschuss',
        count,
        icon: 'pi-trash',
        color: 'yellow',
        percentage
      };
    },
    mangelware(username: string): StatusCard {
      const user = this.quoten.find(user => user.username === username);
      const count = user ? Number(user.fehleranzahl_mangelware) : 0;
      const percentage = user ? Number(user.fehlerquote_mangelware) : 0;
      return {
        label: 'Mangelware',
        count,
        icon: 'pi-times',
        color: 'yellow',
        percentage
      };
    },
    ausschussUndMangelware(username: string): StatusCard {
      const ausschuss = this.ausschuss(username);
      const mangelware = this.mangelware(username);
      const percentage = Number((ausschuss.percentage + mangelware.percentage).toFixed(2));
      return {
        label: 'Ausschuss und Mangelware',
        count: ausschuss.count + mangelware.count,
        icon: 'pi-trash',
        color: 'yellow',
        percentage
      };
    },
    geliefert(username: string): StatusCard {
      const produziert = this.produziert(username);
      const auschussUndMangelware = this.ausschussUndMangelware(username);
      const percentage = Number((produziert.percentage - auschussUndMangelware.percentage).toFixed(2));
      return {
        label: 'Geliefert',
        count: produziert.count - auschussUndMangelware.count,
        icon: 'pi-box',
        color: 'blue',
        percentage
      };
    },
    beschwerden(username: string): StatusCard {
      const user = this.quoten.find(user => user.username === username);
      const count = user ? Number(user.fehleranzahl_fehler) : 0;
      const percentage = user ? Number(user.fehlerquote_fehler) : 0;
      return {
        label: 'Beschwerden',
        count,
        icon: 'pi-exclamation-triangle',
        color: 'orange',
        percentage
      };
    },
    fehlerfrei(username: string): StatusCard {
      const geliefert = this.geliefert(username);
      const beschwerden = this.beschwerden(username);
      const percentage = Number((geliefert.percentage - beschwerden.percentage).toFixed(2));
      return {
        label: 'Fehlerfrei geliefert',
        count: geliefert.count - beschwerden.count,
        icon: 'pi-check',
        color: 'green',
        percentage
      };
    },
    async fetchQuoten(from: Date, to: Date, usernames: string[]) {
      try {
        const { getQuoten } = useMyFetch();
        const data: QuotenData[] = await getQuoten(from, to, usernames) as QuotenData[];

        if (!Array.isArray(data)) {
          throw new TypeError('response is not an array');
        }

        this.quoten = data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  }
});
