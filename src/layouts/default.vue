<script lang="ts">
import { defineComponent } from 'vue';
import AppTopBar from '~/components/layouts/default/AppTopbar.vue';
import AppMenu from '~/components/layouts/default/AppMenu.vue';
import AppConfig from '~/components/layouts/default/AppConfig.vue';

export default defineComponent({
  components: {
    AppTopBar,
    AppMenu,
    AppConfig
  },
  data() {
    return {
      layoutMode: 'static',
      menuActive: false,
      menuClick: false,
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          label: 'Mitarbeiter Auswertung',
          items: [
            { label: 'Fehler', icon: 'pi pi-fw pi-table', to: '/mitarbeiter/auswertung/fehler' },
            { label: 'Performance', icon: 'pi pi-fw pi-table', to: '/mitarbeiter/auswertung/performance' }
          ]
        },
        {
          label: 'Sonstiges',
          icon: 'pi pi-fw pi-clone',
          items: [
            { label: 'Metabase', icon: 'pi pi-fw pi-table', to: 'https://gz-mb.strainovic-it.ch', target: '_blank' },
            { label: 'Strapi', icon: 'pi pi-fw pi-table', to: 'https://gz-strapi.strainovic-it.ch', target: '_blank' }
          ]
        }
      ]
    };
  },
  computed: {
    containerClass() {
      return ['layout-wrapper', {
        'layout-overlay': this.layoutMode === 'overlay',
        'layout-static': this.layoutMode === 'static',
        'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
        'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
        'layout-mobile-sidebar-active': this.mobileMenuActive,
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false,
        'layout-theme-light': this.$appState.theme?.startsWith('saga')
      }];
    },
    logo() {
      return (this.$appState.darkTheme) ? '/images/logo-white.svg' : '/images/logo.svg';
    }
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    }
  },
  beforeUpdate() {
    if (this.mobileMenuActive) {
      this.addClass(document.body, 'body-overflow-hidden');
    } else {
      this.removeClass(document.body, 'body-overflow-hidden');
    }
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle(event: Event) {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === 'overlay') {
          if (this.mobileMenuActive) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === 'static') {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event: any) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode: string) {
      this.layoutMode = layoutMode;
    },
    addClass(element: Element, className: string) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ` ${className}`;
      }
    },
    removeClass(element: Element, className: string) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
      }
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === 'static') {
          return !this.staticMenuInactive;
        } else if (this.layoutMode === 'overlay') {
          return this.overlayMenuActive;
        }
      }

      return true;
    }
  }
});
</script>

<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
      </div>
    </div>

    <AppConfig :layout-mode="layoutMode" @layout-change="onLayoutChange" />
    <transition name="layout-mask">
      <div v-if="mobileMenuActive" class="layout-mask p-component-overlay" />
    </transition>
  </div>
</template>

<style lang="scss">
  @import '~/assets/styles/App.scss';
</style>
