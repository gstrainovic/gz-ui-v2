<script lang="ts" setup>
definePageMeta({
  layout: 'empty'
});

const { authenticateUser } = useAuthStore(); // use auth store

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive

const user = ref({
  identifier: '',
  password: ''
});
const router = useRouter();

const loginFailed = ref(false);

const login = async () => {
  try {
    await authenticateUser(user.value);
    // redirect to homepage if user is authenticated
    if (authenticated.value) {
      router.push('/');
    } else {
      loginFailed.value = true;
    }
  } catch (error) {
    loginFailed.value = true;
  }
};
</script>

<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img
          src="/images/logo-white.svg" alt="Gravurzeile Logo" class="mb-5"
          style="width:300px; height:100px;"
        >
      </div>
      <div
        class="col-12 xl:col-6"
        style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);"
      >
        <div
          class="h-full w-full m-0 py-7 px-4"
          style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));"
        >
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">
              Bitte melden Sie sich an
            </div>
            <span class="text-600 font-medium">Nur für Administratoren</span>
          </div>

          <div class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Benutzername</label>
            <InputText
              id="email1" v-model="user.identifier" type="text"
              class="w-full mb-3"
              placeholder="Benutzername" style="padding:1rem;"
            />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Passwort</label>
            <Password
              id="password1" v-model="user.password" placeholder="Passwort"
              :toggle-mask="true"
              class="w-full mb-3" input-class="w-full" style="padding:1rem"
            />
            <Button label="Anmelden" class="w-full p-3 text-xl" @click.prevent="login" />
            <Message v-if="loginFailed" severity="error">
              Anmeldung fehlgeschlagen
            </Message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>

