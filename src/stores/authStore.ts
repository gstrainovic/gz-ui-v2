import config from '../composables/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async authenticateUser({ identifier, password }: LoginData) {
      const { data }: any = await useFetch(config.api.url + 'login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
            identifier,
            password,
        },
      });

      if (data.value) {
        const token = useCookie('token'); // useCookie new hook in nuxt 3
        token.value = data?.value?.token; // set token to cookie
        this.authenticated = true; // set authenticated  state value to true
      }
    },
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});