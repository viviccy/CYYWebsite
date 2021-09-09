<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'Home' }"
          >The Missing Piece</router-link
        >
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'Gallery' }"
            >Gallery</router-link
          >
          <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
          <router-link v-if="user" class="link" :to="{ name: 'CreatePost' }"
            >Create Post</router-link
          >
          <router-link v-if="!user" class="link" :to="{ name: 'Login' }"
            >Login/Register</router-link
          >
        </ul>
        <!--   execute a computed function 'user' everytime the value of $store.state.user changed. If $store.state.user is false, remove this div profile div. -->
        <div
          v-if="user"
          @click="toggleProfileMenu"
          class="profile"
          ref="profile"
        >
          <span>{{ this.$store.state.profileInitials }} </span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>
                  {{ this.$store.state.profileFirstName }}
                  {{ this.$store.state.profileLastName }}
                </p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'Profile' }">
                  <userIcon class="icon" />
                  <p>Profile</p>
                </router-link>
              </div>
              <div class="option">
                <router-link class="option" :to="{ name: 'Admin' }">
                  <adminIcon class="icon" />
                  <p>Admin</p>
                </router-link>
              </div>
              <!--  '@' and 'v-on' are the same -->
              <div v-if="user" @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <menuIcon class="menu-icon" @click="toggleMobileNav" v-show="mobile" />
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
        <router-link class="link" :to="{ name: 'CreatePost' }"
          >Create Post</router-link
        >
        <router-link v-if="!user" class="link" :to="{ name: 'Login' }"
          >Login/Register</router-link
        >
      </ul>
    </transition>
  </header>
</template>

<script>
import menuIcon from "../assets/Icons/bars-regular.svg?inline"
import userIcon from "../assets/Icons/user-alt-light.svg?inline"
import adminIcon from "../assets/Icons/user-crown-light.svg?inline"
import signOutIcon from "../assets/Icons/sign-out-alt-regular.svg?inline"
import firebase from "firebase/app"
import "firebase/auth"

export default {
  name: "navigation",
  components: {
    menuIcon,
    userIcon,
    adminIcon,
    signOutIcon,
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      show: true,
      profileMenu: null,
    }
  },
  created() {
    window.addEventListener("resize", this.checkScreen)
    this.checkScreen()
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    checkScreen() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 750) {
        this.mobile = true
      } else {
        this.mobile = false
        this.mobileNav = false
      }
      return
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav
    },
    toggleProfileMenu(e) {
      /*
      'e' means event from an action. In this case it is a click.
      e.target means the direct element clicked on that triggered this 'toggleProfileMenu' function.
      e.target return an object value of the element.
      this.$ref.profile also return an object value of element 'profile'
      */

      /* if e.target object which user clicked on is the same as 'profile' object, then revert the value of 'profileMenu' value  */
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu
      }
    },
    signOut() {
      firebase.auth().signOut()
      window.location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;

    &hover {
      color: red;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        @include fluid-type($viewThreshold1, $viewThreshold2, 12px, 24px);
        font-weight: 600;
        color: black;
        text-decoration: none;
      }
    }

    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }

        .link:last-child {
          margin-right: 0;
        }
      }

      .profile {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
        background-color: #303030;

        span {
          pointer-events: none;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0px;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .info {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #fff;

          .initials {
            position: initial;
            width: 40px;
            height: 40px;
            background-color: #fff;
            color: #303030;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }

          .right {
            flex: 1;
            margin-left: 24px;

            p:nth-child(1) {
              font-size: 14px;
            }

            p:nth-child(2),
            p:nth-child(3) {
              font-size: 12px;
            }
          }
        }

        .options {
          padding: 15px;
          .option {
            text-decoration: none;
            color: white;
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .icon {
              width: 18px;
              height: auto;
            }

            p {
              font-size: 14px;
              margin-left: 12px;
            }

            &:last-child {
              margin-bottom: 0px;
            }
          }
        }
      }
    }
  }

  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: red;
    top: 0;
    left: 0;

    link {
      padding: 15px 0;
      color: white;
    }
  }

  //-enter-active = the css throughout the animation of element showing up
  //-leave-acitve = the css throughout the animation of element hiding away
  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  //-enter = css for the beginning animation state when the element showing up
  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  //-enter-to = css for the ending animation state when the element showing up
  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  //-leave-to = css for beginning animation state when the element is hiding away
  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>
