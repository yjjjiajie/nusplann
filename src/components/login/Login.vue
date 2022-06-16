<template>
    <div class="login-form">
        <h1 class="login">Login</h1>
        <p><input type="text" placeholder="Email" v-model="email"></p>
        <p><input type="password" placeholder="Password" v-model="password"></p>
        <p v-if="errMsg">{{ errMsg }}</p>
        <p><button class="signIn" @click="signIn">Sign in</button></p>
        <div class="small-register">
            <router-link to="/register"><a>Don't have an account? Register here.</a></router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const errMsg = ref()

const signIn = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            alert("Successfully Signed in!");
            console.log(data);
            router.push('/moduleinfo')
        })
        .catch((error) => {
            console.log(error.code);
            switch(error.code) {
                case "auth/user-not-found":
                    errMsg.value = "User not found";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Wrong password";
                    break;
                case "auth/invalid-email":
                    errMsg.value = "Invalid email";
                    break;
                default:
                    errMsg.value = "Email or Password was incorrect";
                    break;
            }
        });
};

</script>


<style>

.login-form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    text-align: center;
}

.small-register {
    margin-top: 10px;
}

.login {
    color: #345c97;
    font-weight: bold;
}

.signIn {
    background: #345c97;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

</style>