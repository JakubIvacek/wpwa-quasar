
<template>
  <q-card  class="custom-width">
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
        <q-input
          name="email"
          id="email"
          v-model.trim="form.email"
          type="email"
          label="Email"
          autofocus
          color="cyan-10"
          filled
        />
        <q-input
          name="first_name"
          id="first_name"
          v-model.trim="form.first_name"
          type="text"
          label="First name"
          autofocus
          color="cyan-10"
          filled
        />
        <q-input
          name="last_name"
          id="last_name"
          v-model.trim="form.last_name"
          type="text"
          label="Last name"
          autofocus
          color="cyan-10"
          filled
        />
        <q-input
          name="nickname"
          id="nickname"
          v-model.trim="form.nickname"
          type="text"
          label="Nickname"
          autofocus
          color="cyan-10"
          filled
        />
        <q-input
          id="password"
          name="password"
          v-model="form.password"
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
        <q-input
          id="password_confirmation"
          name="password_confirmation"
          v-model="form.passwordConfirmation"
          label="Confirm Password"
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
        <q-card-actions align="center">
          <q-btn
            label="Register"
            rounded
            color="cyan-10"
            :loading="loading"
            @click="onSubmit"
            style="width:80%"
          />
        </q-card-actions>
        <div class="text-center">
          <router-link class="text-white" to="/auth">Wanna go back to login ? Click here</router-link>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'RegisterForm',
  data () {
    return {
      form: { email: '', password: '', passwordConfirmation: '', first_name: '', last_name: '', nickname: '' },
      showPassword: false
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/register', this.form)
        .then(() => this.$router.push(this.redirectTo))
        .catch(error => {
          console.error(error) // Log the error
          // Optionally, show an alert or a message to the user
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
</style>
