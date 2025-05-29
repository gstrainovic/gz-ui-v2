<template>
  <section id="unterschriften" class="avoid-break flex flex-wrap pt-4 invisible">
    <div class="card col-5">
      <h5>Mitarbeiter</h5>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Ort</label>
        <div class="col-5 md:col-10">
          <InputText type="text" />
        </div>
      </div>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Datum</label>
        <div class="col-12 md:col-10">
          <InputText type="text" />
        </div>
      </div>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Unterschrift</label>
        <div class="col-12 md:col-10">
          <InputText type="text" />
        </div>
      </div>
    </div>

    <div class="col-2" />

    <div class="card col-5">
      <h5>Vorgesetzter</h5>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Ort</label>
        <div class="col-12 md:col-10">
          <InputText type="text" />
        </div>
      </div>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Datum</label>
        <div class="col-12 md:col-10">
          <InputText type="text" />
        </div>
      </div>
      <div class="field grid">
        <label class="col-12 mb-2 md:col-2 md:mb-0">Unterschrift</label>
        <div class="col-12 md:col-10">
          <InputText type="text" />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  @media print {
    .layout-topbar {
      position: absolute !important;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    .invisible {
      visibility: visible;
    }
  }

  @media screen {
    .invisible {
      visibility: hidden;
    }
  }
</style>
