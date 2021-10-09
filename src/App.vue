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
  },
  mounted() {},
  methods: {
    checkRoute() {
      /*   if (
        this.$route.name === "Login" ||
        this.$route.name === "Register" ||
        this.$route.name === "ForgotPassword"
      ) {
        this.navigation = true
        return
      } */
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

  .container {
    .blog-cards {
      display: grid;
      gap: 32px;
      grid-template-columns: 1fr;
      grid-template-areas: "bc1" "bc2" "bc3" "bc4";

      @media (min-width: $viewThreshold3) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: "bc1 bc2" "bc3 bc4";
      }

      @media (min-width: $viewThreshold5) {
        grid-template-columns: repeat(5, 1fr);
        grid-template-areas: "bc1 bc1 bc1 bc2 bc2" "bc3 bc3 bc4 bc4 bc4";
      }

      @media (min-width: $viewThreshold2) {
        grid-template-columns: repeat(4, 1fr);
        grid-template-areas: "bc1 bc2 bc3 bc4";
      }

      .blog-card:nth-child(1) {
        grid-area: bc1;
      }
      .blog-card:nth-child(2) {
        grid-area: bc2;
      }
      .blog-card:nth-child(3) {
        grid-area: bc3;
      }
      .blog-card:nth-child(4) {
        grid-area: bc4;
      }
    }
  }
}

//for Light Gallery thumbnail highlight. This only work when put in global scoped css.
.lg-outer .lg-thumb-item.active {
  border: 2px solid #a90707;
}
</style>
