<template>
  <div id="app">
    <appNavbar></appNavbar>
    <div class="col-md-12">
        <!-- link allmajors data to components -->
        <router-view :allmodules="allmodules"></router-view>
      </div>
  </div>

</template>

<script>
import Navbar from './components/Navbar.vue';
import allModules from './assets/allmoduleinfo.json';
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/firebase'


export default {
  name: 'App',
  components: {
    appNavbar: Navbar,
  },

  data() {
    return {
      allmodules: allModules
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}
#welcome {
  text-align: center;
  margin-top: 60px;
}
body {
  height: 100%;
  top: 0;
  margin-top: 0;
  padding: 0;
  background-color: #EBEFF2;
}
.row {
  margin: 30px;
}
</style>