<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'Home' }">
          <puzzle class="puzzle" /><span>The Missing Piece</span></router-link
        >
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <li>
            <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
          </li>
          <li>
            <router-link class="link" :to="{ name: 'Gallery' }"
              >Gallery</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: 'Blogs' }"
              >Blogs</router-link
            >
          </li>
          <li v-if="user">
            <router-link class="link" :to="{ name: 'EditGallery' }"
              >Edit Gallery</router-link
            >
          </li>
          <li v-if="user">
            <router-link class="link" :to="{ name: 'CreatePost' }"
              >Create Post</router-link
            >
          </li>
          <li v-if="!user">
            <router-link class="link" :to="{ name: 'Login' }"
              >Login/Register</router-link
            >
          </li>
        </ul>
        <div class="menu-icon-container" v-show="mobile">
          <menuIcon class="menu-icon" @click="toggleMobileNav" />
        </div>

        <!--   execute a computed function 'user' everytime the value of $store.state.user changed. If $store.state.user is false, remove this div profile div. -->
        <div class="profileContainer" v-if="user">
          <div @click="toggleProfileMenu" class="profile" ref="profile">
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
      </div>
    </nav>
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <li>
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'Home' }"
            >Home</router-link
          >
        </li>
        <li>
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'Gallery' }"
            >Gallery</router-link
          >
        </li>
        <li>
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'Blogs' }"
            >Blogs</router-link
          >
        </li>
        <li v-if="user">
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'EditGallery' }"
            >Edit Gallery</router-link
          >
        </li>
        <li v-if="user">
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'CreatePost' }"
            >Create Post</router-link
          >
        </li>
        <li v-if="!user">
          <router-link
            @click.native="resetMobileNav"
            class="link"
            :to="{ name: 'Login' }"
            >Login/Register</router-link
          >
        </li>
      </ul>
    </transition>
  </header>
</template>

<script>
import menuIcon from "../assets/Icons/bars-regular.svg?inline"
import userIcon from "../assets/Icons/user-alt-light.svg?inline"
import adminIcon from "../assets/Icons/user-crown-light.svg?inline"
import signOutIcon from "../assets/Icons/sign-out-alt-regular.svg?inline"

import puzzle from "../assets/Icons/puzzle.svg?inline"
import firebase from "firebase/app"
import "firebase/auth"

import scssStyle from "../style.scss"

export default {
  name: "navigation",
  components: {
    menuIcon,
    userIcon,
    adminIcon,
    signOutIcon,
    puzzle,
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

      if (this.windowWidth < parseInt(scssStyle.viewThreshold3, 10)) {
        this.mobile = true
      } else {
        this.mobile = false
        this.mobileNav = false
      }
      return
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav

      let mobileMenuContainer = document.querySelector(".mobile-nav")

      if (this.mobileNav) {
        document.addEventListener("click", this.checkClick)
        mobileMenuContainer.setAttribute("listener", "true")
      } else if (mobileMenuContainer.getAttribute("listener") === "true") {
        mobileMenuContainer.removeAttribute("listener")
        document.removeEventListener("click", this.checkClick)
      }
    },
    checkClick(event) {
      // If user clicks inside the element, do nothing
      if (
        event.target.closest(".mobile-nav") ||
        event.target.closest(".menu-icon")
      )
        return

      // If user clicks outside the element, hide it!
      this.mobileNav = false
    },
    resetMobileNav() {
      this.mobileNav = false
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
  padding: 0 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .link {
    font-weight: 500;
    transition: 0.3s color ease;
    max-width: 180px;

    &hover {
      color: red;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;
    width: 100%;
    max-width: none;

    .branding {
      display: flex;
      align-items: center;

      .header {
        @include fluid-type($viewThreshold1, $viewThreshold2, 14px, 24px);
        font-weight: 600;
        color: black;
        text-decoration: none;

        .puzzle {
          width: 20%;
          max-width: 100px;
          margin-right: 10px;
          position: relative;
          top: -5px;
          transition: all 1s ease;
          animation: spin 10s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotateY(0deg);
          }

          30% {
            transform: rotateY(0deg);
          }

          38% {
            transform: rotateY(360deg);
          }

          100% {
            transform: rotateY(360deg);
          }
        }
      }
    }

    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;

      ul {
        flex: 9;
        margin: 0;
        padding: 0;
        display: flex;
        width: 90%;
        justify-content: flex-end;
        align-items: center;
        list-style-type: none;

        li {
          flex: 1;
          text-align: center;

          .link {
            text-align: center;
            @include fluid-type($viewThreshold1, $viewThreshold2, 9px, 18px);
          }

          .link:last-child {
            margin-right: 0;
          }
        }
      }

      .profileContainer {
        flex: 1;
        .profile {
          margin: 0 0 0 19px;
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

          @media (min-width: $viewThreshold3) {
            margin: 0 auto;
          }

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
  }

  .menu-icon-container {
    flex: 9;
    display: flex;
    justify-content: flex-end;

    .menu-icon {
      cursor: pointer;
      height: 30px;
      width: 30px;
    }
  }

  .mobile-nav {
    list-style-type: none;
    padding: 20px 30px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background: $buttonColor1;
    top: 0;
    left: 0;

    .link {
      display: block;
      padding: 13px 0;
      color: white;
      border-bottom: 1px dashed white;
      max-width: none;
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
