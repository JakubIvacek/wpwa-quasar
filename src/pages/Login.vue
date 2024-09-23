<template>
  <div  class="col-12 col-md-6 content-center flex justify-center q-pt-xl">
    <q-card v-bind:style="isScreenLtSm ? {'width': '80%'} : {'width': '50%'}">
      <q-card-section>
        <q-avatar size="100px" class="absolute-center shadow-10">
          <img src="~assets/avatar.png" alt="avatar">
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <div class="q-pt-lg">
          <div class="col text-h6 ellipsis flex justify-center">
            <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">Login</h2>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submitLogin">
          <q-input label="Username" model-value="" v-model="login.username">
          </q-input>
          <q-input label="Password" model-value="" type="password" v-model="login.password">
          </q-input>
          <div  class="flex flex-center">
            <q-btn style="width:80%" color="primary" label="Login" rounded type="submit">
            </q-btn>
          </div>
          <div class="text-center">
            <router-link class="text-white" to="/register">Create new account here</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {useQuasar} from 'quasar'

export default{
  name: "LoginName",
  data () {
    return {
      login: {
        username: '',
        password: ''
      },
      $q: null
    }
  },
  computed: {
    isScreenLtSm() {
      return this.$q ? this.$q.screen.lt.sm : false; // Safely access $q
    }
  },
  methods: {
    submitLogin () {
      if(!this.login.username || !this.login.password){
        this.$q.notify({
          type: 'negative',
          message: "Empty fields"
        })
      }else if(this.login.password.length < 6){
        this.$q.notify({
          type: 'negative',
          message: "Password to short"
        })
      }
      else{
        console.log('login')
      }
    }
  },
  mounted() {
    this.$q = useQuasar();
  }
}
</script>

<style scoped>

</style>
