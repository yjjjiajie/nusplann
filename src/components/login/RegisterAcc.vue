<template>
    <div class="register-form">
        <h1 class="create">Create an account</h1>
        <p><input type = "text" placeholder="Email" v-model="email"></p>
        <p><input type = "text" placeholder = "Password" v-model="password"></p>
        <p v-if="errMsg">{{ errMsg }}</p>
        <p><button class = btn1 @click = "register">Register</button></p>
        <div class="small-login">
            <router-link to="/login"><a>Already have an account? Login here.</a></router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router= useRouter()
const errMsg = ref()

const register = () => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            alert("Successfully registered");
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

// const signInWithGoogle = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(getAuth(), provider)
//         .then((result) => {
//             console.log(result.user);
//             router.push('/moduleinfo')
//         })
//         .catch((error) => {

//         });
// };
</script>

<style>

.register-form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    text-align: center;
}

.small-login {
    margin-top: 10px;
}

.create {
    color: #345c97;
    font-weight: bold;
}

.btn1 {
    background-color: #345c97;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}



</style>
