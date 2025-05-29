<script lang="ts">
export default {
  emits: ['topbarMenuToggle', 'menuToggle'],
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    }
  },
  methods: {
    onMenuToggle(event) {
      this.$emit('menuToggle', event);
    },
    onTopbarMenuToggle(event) {
      this.$emit('topbarMenuToggle', event);
    },
    topbarImage() {
      return this.$appState.darkTheme ? '/images/logo-white.svg' : '/images/logo-dark.svg';
    }
  }
};
</script>

<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <i class="pi pi-bars" />
    </button>

    <div class="layout-topbar-menu hidden lg:flex origin-top">
      <img alt="Logo" :src="topbarImage()" class="logo">
    </div>
    <h1 class="pl-8">
      Auswertungen
    </h1>

    <button
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true
      }"
      class="p-link layout-topbar-menu-button layout-topbar-button"
    >
      <i class="pi pi-ellipsis-v" />
    </button>

    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <NuxtLink to="/logout" class="logout-link">
          <button class="p-link layout-topbar-button">
            <i class="pi pi-sign-out" />
          </button>
          <div>Abmelden</div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
img.logo {
    width: 100%;
    height: auto;
    max-width: 200px;
    /* oder gewünschte Maximalbreite */
    display: block;
}
</style>
