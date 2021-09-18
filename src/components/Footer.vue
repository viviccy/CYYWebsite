<template>
  <footer>
    <div class="container">
      <div class="left">
        <div class="col-1">
          <router-link class="header" :to="{ name: 'home' }">
            The Missing Piece
          </router-link>
          <ul>
            <li href="#"><youTube class="svg-icon" /></li>
            <li href="#"><twitter class="svg-icon" /></li>
            <li href="#"><instagram class="svg-icon" /></li>
            <li href="#"><linkedin class="svg-icon" /></li>
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

<style lang="scss" scoped>
footer {
  margin-top: auto;
  padding: 100px 25px;
  background-color: #303030;

  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: auto;
    max-width: 1200px;
    padding: 0;

    @media (min-width: $viewThreshold3) {
      flex-direction: row;
      gap: 0px;
    }

    > div {
      display: flex;
      flex: 1;
    }

    .left {
      gap: 32px;
      color: #fff;
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      @media (min-width: $viewThreshold3) {
        flex-direction: row;
        align-items: initial;
        gap: 0px;
      }

      .header {
        font-size: 24px;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
      }

      ul {
        gap: 16px;
        list-style: none;
        display: flex;
        justify-content: center;
        padding: 0;

        @media (min-width: $viewThreshold3) {
          justify-content: flex-start;
        }
      }

      .col-1,
      .col-2 {
        gap: 32px;
        display: flex;
        flex: 1;
        justify-content: center;
        @media (min-width: $viewThreshold3) {
          gap: 0px;
        }
      }

      .col-1 {
        width: auto;
        flex-direction: column;

        a {
          text-align: center;
          @media (min-width: $viewThreshold3) {
            text-align: left;
          }
        }

        h2 {
          text-align: center;
          @media (min-width: $viewThreshold3) {
            text-align: initial;
          }
        }
        ul {
          margin: auto 0 0 0;

          li {
            display: flex;
            align-items: center;
            .svg-icon {
              width: 24px;
              height: auto;
              color: #fff;
            }
          }
        }
      }

      .col-2 {
        width: auto;

        ul {
          margin: 0;
          height: 100%;
          justify-content: center;
          flex-direction: row;
          flex-wrap: wrap;
          @media (min-width: $viewThreshold3) {
            flex-direction: column;
          }

          .link {
            font-size: 16px;
            font-weight: 500px;
            color: #fff;
            text-decoration: none;
          }
        }
      }
    }

    .right {
      gap: 32px;
      color: #fff;
      flex: 1;
      align-items: center;
      flex-direction: column;
      @media (min-width: 800px) {
        align-items: flex-end;
        gap: 0;
      }

      p {
        text-align: center;
        margin: auto 0 0 0;
      }
    }
  }
}
</style>
