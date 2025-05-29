<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import Tooltip from 'primevue/tooltip';

const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

const fromDate = ref<Date | null>(lastMonth);
const toDate = ref<Date | null>(today);
const selectedUsers = ref<string[]>([]);

const beschwerdenStore = useBeschwerdenStore();
const quotenStore = useQuotenStore();
const userStore = useUserStore();

const userOptions = await userStore.getUsers();

const pieProduktion = (username: string) => {
  return {
    label: 'Produktion / Lager',
    labels: ['Ausschuss', 'Mangelware', 'Geliefert'],
    datasets: [
      {
        data: [
          quotenStore.ausschuss(username).percentage,
          quotenStore.mangelware(username).percentage,
          quotenStore.geliefert(username).percentage
        ],
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors
      }
    ]
  };
};

const pieBeschwerden = (username: string) => {
  return {
    label: 'Beschwerden',
    labels: ['Beschwerden', 'Fehlerfrei'],
    datasets: [
      {
        data: [
          quotenStore.beschwerden(username).percentage,
          quotenStore.fehlerfrei(username).percentage
        ],
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors
      }
    ]
  };
};

const pieBeschwerdenDetails = (username: string) => {
  return {
    label: 'Beschwerden Details',
    labels: getBeschwerdenListe(username).map(beschwerde => beschwerde.beschwerde_auswahl || ''),
    datasets: [
      {
        data: getBeschwerdenListe(username).map(beschwerde => beschwerde.count),
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors
      }
    ]
  };
};

function getBeschwerdenListe(username: string) {
  return beschwerdenStore.beschwerden.filter(beschwerde => beschwerde.username === username);
}

function getStatusCards(username: string) {
  return [
    quotenStore.produziert(username),
    quotenStore.ausschuss(username),
    quotenStore.mangelware(username),
    quotenStore.geliefert(username),
    quotenStore.beschwerden(username),
    quotenStore.fehlerfrei(username)
  ];
}

function getPieData(username: string) {
  return [
    pieProduktion(username),
    pieBeschwerden(username),
    pieBeschwerdenDetails(username)
  ];
}

const getBerechnung = (username: string) => {
  const produziert = quotenStore.produziert(username);
  const ausschuss = quotenStore.ausschuss(username);
  const mangelware = quotenStore.mangelware(username);
  const geliefert = quotenStore.geliefert(username);
  const beschwerden = quotenStore.beschwerden(username);
  const fehlerfrei = quotenStore.fehlerfrei(username);

  return [
    { label: `${produziert.label === 'Produziert' ? 'Produziert / Verpackt' : produziert.label}`, count: produziert.count, percentage: `${produziert.percentage}%` },
    { label: `${ausschuss.label}`, count: -(ausschuss.count || 0), percentage: `${-ausschuss.percentage}%` },
    { label: `${mangelware.label}`, count: -(mangelware.count || 0), percentage: `${-mangelware.percentage}%` },
    { label: `${geliefert.label}`, count: geliefert.count, percentage: `${geliefert.percentage}%` },
    { label: `${beschwerden.label}`, count: -beschwerden.count, percentage: `${-beschwerden.percentage}%` },
    { label: `${fehlerfrei.label}`, count: fehlerfrei.count, percentage: `${fehlerfrei.percentage}%` }
  ];
};

const userData = computed(() => {
  return selectedUsers.value.map((username) => {
    return {
      userName: username,
      produziertCount: quotenStore.produziert(username).count,
      beschwerdenListe: getBeschwerdenListe(username),
      statusCards: getStatusCards(username),
      pies: getPieData(username),
      berechnung: getBerechnung(username)
    };
  });
});

watch([fromDate, toDate, selectedUsers], ([newFromDate, newToDate, selectedUsers]) => {
  if (newFromDate && newToDate && selectedUsers.length > 0) {
    beschwerdenStore.fetchFehler(newFromDate, newToDate, selectedUsers);
    quotenStore.fetchQuoten(newFromDate, newToDate, selectedUsers);
  }
});

const printPage = () => {
  useAppTheme('lara-light-teal');
  window.print();
};
</script>

<template>
  <div>
    <div id="fehlerPage" class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center">
              <h3 class="pt-4">
                Mitarbeiter Auswertung - Fehler
              </h3>
            </div>
            <Button class="text-right" label="Drucken" icon="pi pi-print" @click="printPage" />
          </div>
          <div class="flex align-items-center justify-content-between pt-6">
            <Calendar v-model="fromDate" date-format="dd.mm.yy" placeholder="Von" />
            <Calendar v-model="toDate" date-format="dd.mm.yy" placeholder="Bis" />

            <div class="flex">
              <Button
                v-tooltip="'Wähle zwei Mitarbeiter aus um ein Seitenvergleich anzuzeigen.'" icon="pi pi-info" severity="success"
                raised
                rounded size="small"
              />
              <MultiSelect
                v-model="selectedUsers" class="ml-3" display="chip"
                :options="userOptions" :filter="true"
                placeholder="Mitarbeiter auswählen"
              />
            </div>
          </div>
        </div>
        <div v-if="selectedUsers.length === 0" class="card">
          <h4 class="text-center pl-4">
            Bitte Mitarbeiter auswählen
          </h4>
        </div>
      </div>
      <div class="col-12 pt-4">
        <div class="grid">
          <div
            v-for="data in userData" :key="data.userName"
            :class="['col-12', selectedUsers.length === 1 ? 'md:col-12' : 'md:col-6']"
          >
            <h4>{{ data.userName }}</h4>
            <template v-if="!data.produziertCount">
              <div class="pt-4">
                <div class="card">
                  <h4 class="text-center pl-4">
                    Keine Daten vorhanden für {{ data.userName }} in diesem Zeitraum
                  </h4>
                </div>
              </div>
            </template>

            <template v-if="data.produziertCount">
              <div class="pt-4">
                <div class="grid">
                  <StatusCard
                    v-for="statusCard in data.statusCards" :key="statusCard.label" :label="statusCard.label === 'Produziert' ? 'Produziert / Verpackt' : statusCard.label"
                    :count="statusCard.count" :icon="statusCard.icon" :color="statusCard.color"
                    :percentage="statusCard.percentage"
                  />
                </div>
              </div>

              <div class="pt-4">
                <div class="card">
                  <h4>Berechnung</h4>
                  <DataTable :value="data.berechnung" class="calculation-table">
                    <Column field="label" header="Bezeichnung" />
                    <Column
                      field="count" header="Anzahl" header-style="width: 1rem; text-align: right"
                      :style="{ textAlign: 'right' }"
                    />
                    <Column
                      field="percentage" header="Prozent" header-style="width: 1rem; text-align: right"
                      :style="{ textAlign: 'right' }"
                    />
                  </DataTable>
                </div>
              </div>

              <PieChart :pie-liste="data.pies" />

              <div class="avoid-break pt-4">
                <section id="beschwerden" class="avoid-break">
                  <div class="card">
                    <h4>Beschwerden</h4>
                    <DataTable id="fehlerTable" :value="data.beschwerdenListe" sort-field="count" :sort-order="-1">
                      <Column field="beschwerde" header="Beschwerde Detail" />
                      <Column field="beschwerde_auswahl" header="Beschwerde" />
                      <Column field="count" header="Anzahl" sortable />
                    </DataTable>
                  </div>
                </section>

                <UnterschriftenCards />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.p-column-title {
  text-align: right !important;
}
</style>
