<template>
  <div class="form-wrap">
    <form action="" class="register">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'Login' }"
          >Login</router-link
        >
      </p>
      <h2>Create Your Missing Piece Account</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="username" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <email class="icon" />
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
        <div class="error" v-show="error">{{ errorMsg }}</div>
      </div>
      <button @click.prevent="register">Sign Up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg"
import password from "../assets/Icons/lock-alt-solid.svg"
import user from "../assets/Icons/user-alt-light.svg"
import firebase from "firebase/app"
import "firebase/auth"
import db from "../firebase/firebaseInit"

export default {
  name: "Register",
  components: {
    email,
    password,
    user,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: null,
      errorMsg: "",
    }
  },
  methods: {
    async register() {
      if (
        this.email !== "" &&
        this.password !== "" &&
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.username !== ""
      ) {
        this.error = false
        this.errorMsg = ""

        /* 
        firebase.auth - to use the firebase authentication function.
        collection means database.
        NOTE: before we can use any collection from firebase, we need to create for the user a firebase user account that will authenticate the user to this website by using firebase.auth(). 
        Once the user account has been created, by default four types of data will be created for the user. They are email, password, user photo and username. These details are stored in the 'authentication' tab in firebase website and not in the project colection*/
        const firebaseAuth = await firebase.auth()

        //to create a new firebase user account
        const createUser = await firebaseAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )

        //to wait for the creation of the new firebase user account completed before move on to next code
        const result = await createUser

        /* 
        document or 'doc' means record of the database (collection)

        Below is to reference 'database' to collection 'users' that has a document named as user id. If this collection and document does not exist, firebase will automatic create it. */
        const database = db.collection("users").doc(result.user.uid)

        //set values to collection
        await database.set({
          firstName: this.firstName,
          lastName: this.lastName,
          userName: this.username,
          email: this.email,
        })

        // redirect to page "Home" once done updating data to user id document.
        this.$router.push({ name: "Home" })

        return
      }
      this.error = true
      this.errorMsg = "Please fill out all the fields."
      return
    },
  },
}
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
