<template>
  <div class="app-wrapper">
    <div class="app">
      <Navigation v-if="!navigation" />
      <router-view />
      <Footer v-if="!navigation" />
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import firebase from "firebase/app"
import "firebase/auth"

export default {
  name: "app",
  components: { Navigation, Footer },
  data() {
    return {
      navigation: null,
    }
  },
  async created() {
    firebase.auth().onAuthStateChanged((user) => {
      let obj1 = { user: user }
      this.$store.commit("updateState", obj1)

      if (user) {
        this.$store.dispatch("getCurrentUser", user)
        let obj2 = { editPost: true }
        this.$store.commit("updateState", obj2)
      }
    })
    this.checkRoute()
    await this.$store.dispatch("getPost")
    console.log("getPost ended")
  },
  mounted() {},
  methods: {
    checkRoute() {
      if (
        this.$route.name === "Login" ||
        this.$route.name === "Register" ||
        this.$route.name === "ForgotPassword"
      ) {
        this.navigation = true
        return
      }
      this.navigation = false
    },
  },
  watch: {
    $route() {
      this.checkRoute()
    },
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}

.arrow {
  margin-left: 8px;
  width: 12px;

  path {
    fill: #000;
  }
}

.arrow-light {
  path {
    fill: #fff;
  }
}

.blog-card-wrap {
  position: relative;
  padding: 80px 16px;
  background-color: #f1f1f1;

  @media (min-width: 500px) {
    padding: 100px 16px;
  }

  .blog-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;

    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1200px) {
      grid-template-column: repeat(4, 1fr);
    }
  }
}
</style>
