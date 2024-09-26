<template>
  <img src="../assets/bg-img.jpg" alt="bg-img" class="bg-img">
  <div class="col-12 col-md-6 content-center flex custom-login">
    <q-card  class="custom-width">
      <q-card-section>
        <q-avatar size="100px" class="absolute-center bg-dark">
          <img src="../assets/logo.png" alt="avatar">
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <div class="q-pt-lg">
          <div class="col text-h6 ellipsis flex justify-center">
            <h2 class="q-my-none q-pb-lg custom-font">ChatterBox</h2>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submitLogin">
          <q-input rounded outlined label="Email" model-value="" v-model="login.username">
          </q-input>
          <q-input  rounded outlined label="Password" model-value="" type="password" v-model="login.password">
          </q-input>
          <div  class="flex flex-center">
            <q-btn style="width:80%" color="cyan-10" label="Login" rounded type="submit">
            </q-btn>
          </div>
          <div class="text-center">
            <router-link class="text-white" to="/register">Don´t have account ? Sign up here</router-link>
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
  methods: {
    submitLogin () {
      if(!this.login.username || !this.login.password){
        this.$q.notify({
          type: 'negative',
          message: "Empty fields! Fill out email and password"
        })
      }else if(this.login.password.length < 6){
        this.$q.notify({
          type: 'negative',
          message: "Password too short minimal length is 6"
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
  *{
    font-family: 'Roboto', sans-serif;
  }
  .bg-img{
    position: fixed;
    height: 100%;
    width: 66%;
    left: 0;
    bottom: 0;
    z-index: -1;
    object-fit: cover;
    object-position: left;
  }
  .custom-width{
    width: 35%
  }
  .custom-login {
    justify-content: flex-end;
    padding-right: 170px;
    padding-top: 230Px;
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
    .custom-login {
      justify-content: center;
      padding: 200Px 0 0;
    }
    .bg-img{
      width: 80%;
    }
    .custom-width{
      width: 80%
    }
  }
</style>
