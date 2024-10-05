<script setup>

</script>

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
      <q-form class="q-gutter-md" @submit.prevent="submitRegister">
        <q-input filled label="Username" model-value="" v-model="login.username" color="cyan-10">
        </q-input>
        <q-input  filled  label="First name" model-value="" v-model="login.firstName" color="cyan-10">
        </q-input>
        <q-input filled  label="Last name" model-value="" v-model="login.lastName" color="cyan-10">
        </q-input>
        <q-input filled  label="Email" model-value="" v-model="login.email" color="cyan-10">
        </q-input>
        <q-input  filled  label="Password" model-value="" type="password" v-model="login.password" color="cyan-10">
        </q-input>
        <q-input  filled  label="Password repeat" model-value="" type="password" v-model="login.passwordRepeat" color="cyan-10">
        </q-input>
        <div  class="flex flex-center">
          <q-btn style="width:80%" color="cyan-10" label="Register" rounded type="submit">
          </q-btn>
        </div>
        <div class="text-center">
          <router-link class="text-white" to="/auth">Wanna go back to login ? Click here</router-link>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  data () {
    return {
      login: {
        username: '',
        password: '',
        passwordRepeat: '',
        firstName: '',
        lastName: '',
        email: ''
      },
      $q: null
    }
  },
  methods: {
    submitRegister () {
      if (!this.login.username || !this.login.password) {
        // VALIDACIU UROBIT
      } else {
        console.log('register')
      }
    }
  },
  mounted () {
    this.$q = useQuasar()
  }
}
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
}
</style>
