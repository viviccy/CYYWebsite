<template>
  <footer>
    <div class="container">
      <div class="left">
        <div class="col-1">
          <router-link class="header" :to="{ name: 'home' }">
            FireBlogs
          </router-link>
          <ul>
            <li href="#"><youTube class="svgicon" /></li>
            <li href="#"><twitter class="svgicon" /></li>
            <li href="#"><instagram class="svgicon" /></li>
            <li href="#"><linkedin class="svgicon" /></li>
          </ul>
        </div>
        <div class="col-2">
          <ul>
            <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
            <router-link class="link" :to="{ name: 'Blogs' }"
              >Blogs</router-link
            >
            <router-link class="link" :to="{ name: 'CreatePost' }"
              >Create Post</router-link
            >
            <router-link v-if="!user" class="link" :to="{ name: 'Login' }"
              >Login / Register</router-link
            >
          </ul>
        </div>
      </div>
      <div class="right">
        <p>Copyright 2021 All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>

<script>
import youTube from "../assets/Icons/youtube-brands.svg?inline"
import twitter from "../assets/Icons/twitter-brands.svg?inline"
import instagram from "../assets/Icons/instagram-brands.svg?inline"
import linkedin from "../assets/Icons/linkedin-brands.svg?inline"

export default {
  name: "footer-vue",
  components: {
    youTube,
    twitter,
    instagram,
    linkedin,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
}
</script>

<style lang="scss" scoped></style>
