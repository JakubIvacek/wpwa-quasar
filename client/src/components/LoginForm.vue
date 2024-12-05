<template>
  <q-card  class="custom-width q-mt-xxl">
    <q-card-section>
      <q-avatar size="180px" class="absolute-center ">
        <img src="../assets/logo-white.png" alt="avatar" class="bg-dark-my" >
      </q-avatar>
    </q-card-section>
    <q-card-section>
      <div class="q-pt-xl">
        <div class="col text-h6 ellipsis flex justify-center">
          <h2 class="q-my-none q-pb-lg custom-font">ChatterBox</h2>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="onSubmit">
        <q-input filled label="Nickname"  v-model="credentials.nickname" color="cyan-10">
        </q-input>
        <q-input
          id="password"
          name="password"
          v-model="credentials.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          filled
          color="cyan-10"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
        <div  class="flex flex-center">
          <q-btn style="width:80%" color="cyan-10" label="Login" rounded type="submit">
          </q-btn>
        </div>
        <div class="text-center">
          <router-link class="text-white" to="/auth/register">Don´t have account ? Register here</router-link>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LoginForm',
  data () {
    return {
      credentials: { nickname: '', password: '', remember: false },
      showPassword: false
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'home' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  setup() {
    const $q = useQuasar();
    return { $q };
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/login', this.credentials)
        .then(() => {
          this.$router.push(this.redirectTo)
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Invalid credentials, please try again.'
          })
        })
    }
  }
})
</script>

<style scoped>
*{
  font-family: 'Roboto', sans-serif;
}
.custom-width{
  width: 35%
}
.custom-font{
  font-family: 'Merriweather', serif;
}
.q-mt-xxl{
  margin-top: 150px;
}
@media (max-width: 1200px){
  .custom-width{
    width: 45%
  }
}
@media (max-width: 1000px){
  .custom-width{
    width: 65%
  }
}
@media (max-width: 767px) {
  .custom-width{
    width: 80%
  }
  .custom-font{
    font-size:50Px
  }
}
@media (max-width: 567px) {
  .custom-width{
    width: 90%
  }
  .custom-font{
    font-size: 45Px
  }
}
</style>

<style lang="scss">
@media (max-width: 1117px) {
  .bg-dark-my{
    background: $dark;
  }
}
</style>
