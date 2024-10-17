<script setup>

</script>

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
      <q-form  class="q-gutter-md" @submit.prevent="submitLogin">
        <q-input filled label="Email"  v-model="login.email" color="cyan-10">
        </q-input>
        <q-input  filled label="Password" type="password" v-model="login.password" color="cyan-10">
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
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitLogin () {
      const $q = useQuasar()

      if (!this.login.email || !this.login.password) {
        $q.notify({
          type: 'negative',
          message: 'Empty fields! Fill out email and password'
        })
      } else if (this.login.password.length < 6) {
        $q.notify({
          type: 'negative',
          message: 'Password too short, minimal length is 6'
        })
      } else {
        console.log('login')
        // logic
      }
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
}
</style>

<style lang="scss">
@media (max-width: 1117px) {
  .bg-dark-my{
    background: $dark;
  }
}
</style>
