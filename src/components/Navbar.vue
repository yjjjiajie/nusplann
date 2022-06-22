<template>
    <div class="headerStyle">
        <nav>
            <div class="header-title">
                <!-- <router-link to = "/" v-if="!user.loggedIn"> -->
                <a class="header-title-first">nus</a>
                <a class="header-title-second">Plan</a>
                <!-- </router-link> -->
            </div>
            <!-- Show tabs when user is logged in -->
            
            <div class="header-tabs">
                <span class="header-tab"><router-link to="/acadplan"><a>Academic Planner</a></router-link></span>
                <span class="header-tab"><router-link to="/todo"><a>Pending To-Dos</a></router-link></span>            
                <span class="header-tab"><router-link to="/moduleinfo"><a>Module Information</a></router-link></span>
                <span class="header-tab"><router-link to="/login" v-if="!isLoggedIn"><a>Login/Register</a></router-link></span>
                <button class="signOutButton" @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
            </div>
        </nav>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from "vue-router"

const isLoggedIn = ref(false);
const router = useRouter();

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};


</script>

<style scoped>
/** main header style */
.headerStyle {
    overflow: hidden;
    background: white;
    padding: 10px;
    text-align: center;
    align-content: center;
    margin-bottom: 30px;
}
/** header title - vuePlan */
.header-title {
    margin-top: 30px;
    font-size: 80px;
    font-weight: bold;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
}
.header-title .header-title-first {
    color: rgb(221, 218, 218);
}
.header-title .header-title-second {
    color: #345c97;
} 
/** header tabs */
span {
    padding: 25px;
    display: inline-block;
}
a {
    color: #345c97;
}
/* add bolding to tabs that are hovered */
a:hover, .header-tab-dropdown:hover .dropdown-button {
    text-decoration: none;
    font-weight: bold;
}
.router-link-active {
    font-weight: bold;
}


.signOutButton {
    background-color: #345c97;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px;
    font-size: 15px;
    cursor: pointer;
}
</style>