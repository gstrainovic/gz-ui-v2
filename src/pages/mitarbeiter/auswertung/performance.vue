<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Chart from 'primevue/chart';

const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);
const fromDate = ref<Date>(lastMonth);
const toDate = ref<Date>(today);
const selectedUsers = ref<string[]>([]);
const interval = ref<{ label: string, value: string }>({ label: 'Täglich', value: 'd' });
const interValOptions = [
  { label: 'Täglich', value: 'd' },
  { label: 'Wöchentlich', value: 'w' },
  { label: 'Monatlich', value: 'm' },
  { label: 'Jährlich', value: 'y' }
];

const getChartData = (username: string) => {
  const data = getData(username);
  return {
    labels: data.map(item => item.start),
    datasets: [
      {
        label: 'Barcodes',
        data: data.map(item => item.barcodes),
        fill: false,
        borderColor: '#42A5F5'
      },
      {
        label: 'Fehler',
        data: data.map(item => item.fehler),
        fill: false,
        borderColor: '#FF6384'
      },
      {
        label: 'Mangelware',
        data: data.map(item => item.mangelware),
        fill: false,
        borderColor: '#FFCE56'
      },
      {
        label: 'Ausschuss',
        data: data.map(item => item.ausschuss),
        fill: false,
        borderColor: '#36A2EB'
      },
      {
        label: 'Fehlerfrei',
        data: data.map(item => item.fehlerfrei),
        fill: false,
        borderColor: '#4BC0C0'
      }
    ]
  };
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  }
};

const getData = (username: string) => {
  return performance.value.filter(item => item.username === username);
};

const { getPerformance } = useMyFetch();
const userStore = useUserStore();
const userOptions = await userStore.getUsers();
const performance = ref<PerformanceData[]>([]);

const userData = computed(() => {
  return selectedUsers.value.map((username) => {
    return {
      username,
      tableData: getData(username),
      chartData: getChartData(username)
    };
  });
});

watch([fromDate, toDate, selectedUsers, interval], async () => {
  performance.value = await getPerformance(fromDate.value, toDate.value, selectedUsers.value, interval.value.value) as PerformanceData[];
});

const printPage = () => {
  useAppTheme('lara-light-teal');
  window.print();
};
</script>

<template>
  <div>
    <div id="performancePage" class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center">
              <h3 class="pt-4">
                Mitarbeiter Auswertung - Performance
              </h3>
            </div>
            <Button class="text-right" label="Drucken" icon="pi pi-print" @click="printPage" />
          </div>
          <div class="flex align-items-center justify-content-between pt-6">
            <Calendar v-model="fromDate" date-format="dd.mm.yy" placeholder="Von" />
            <Calendar v-model="toDate" date-format="dd.mm.yy" placeholder="Bis" />
            <Dropdown
              v-model="interval" :options="interValOptions" option-label="label"
              placeholder="Intervall auswählen"
            />

            <div class="flex">
              <Button
                v-tooltip="'Wähle zwei Mitarbeiter aus um ein Seitenvergleich anzuzeigen.'" icon="pi pi-info" severity="success"
                class="mr-3"
                raised
                rounded size="small"
              />
              <MultiSelect
                v-model="selectedUsers" display="chip" :options="userOptions"
                :filter="true"
                placeholder="Mitarbeiter auswählen" class="large-dropdown"
              />
            </div>
          </div>
        </div>
        <div v-if="!selectedUsers.length" class="card">
          <h4 class="text-center pl-4">
            Bitte Mitarbeiter auswählen
          </h4>
        </div>
      </div>

      <div class="col-12 pt-4">
        <div class="grid">
          <div v-for="user in userData" :key="user.username" class="col-12 md:col-6">
            <h4>{{ user.username }}</h4>
            <section v-if="selectedUsers.length" id="performance" class="avoid-break">
              <div class="card">
                <Chart type="line" :data="user.chartData" :options="chartOptions" />
                <DataTable id="performanceTable" :value="user.tableData">
                  <Column field="start" header="Von" />
                  <Column field="ende" header="Bis" />
                  <Column field="barcodes" header="Barcodes" />
                  <Column field="fehler" header="Fehler" />
                  <Column field="mangelware" header="Mangelware" />
                  <Column field="ausschuss" header="Ausschuss" />
                  <Column field="fehlerfrei" header="Fehlerfrei" />
                </DataTable>
              </div>
            </section>
          </div>
        </div>
      </div>

      <UnterschriftenCards />
    </div>
  </div>
</template>

<style>
.p-column-title {
  text-align: right !important;
}

#performancePage .grid {
  display: flex;
  flex-wrap: wrap;
}

#performancePage .grid > .col-12 {
  flex: 1;
}

#performance {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

#performance .card {
  flex-grow: 1;
}
</style>
