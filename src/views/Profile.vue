<template>
  <div>
    <Modal
      v-if="modalActive"
      :modalProperties="modalProperties"
      v-on:close-modal="closeModal"
    />

    <div class="profile-section">
      <div class="container">
        <h2>Account Settings</h2>
        <div class="profile-info">
          <div class="initials">{{ $store.state.profileInitials }}</div>
          <div class="admin-badge">
            <adminIcon class="icon" />
            <span>Admin</span>
          </div>
          <div class="input">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              v-model="firstName"
            />
          </div>
          <div class="input">
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              v-model="lastName"
            />
          </div>
          <div class="input">
            <input
              type="text"
              id="username"
              placeholder="Username"
              v-model="username"
            />
          </div>
          <div class="input">
            <input
              disabled
              type="text"
              id="email"
              placeholder="Email"
              v-model="email"
              style="opacity:0.6"
            />
          </div>
          <button @click="updateProfile">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "../components/Modal"
import adminIcon from "../assets/Icons/user-crown-light.svg?inline"
export default {
  name: "Profile",
  components: {
    Modal,
    adminIcon,
  },
  data() {
    return {
      modalProperties: {
        message: "Changes were saved!",
        task: "",
        blogId: null,
      },
      modalActive: null,
    }
  },
  methods: {
    closeModal() {
      this.modalActive = !this.modalActive
    },
    updateProfile() {
      this.$store.dispatch("updateUserSettings")
      this.modalActive = !this.modalActive
    },
  },
  mounted() {},
  computed: {
    firstName: {
      get() {
        return this.$store.state.profileFirstName
      },
      set(payload) {
        this.$store.commit("changeFirstName", payload)
      },
    },
    lastName: {
      get() {
        return this.$store.state.profileLastName
      },
      set(payload) {
        this.$store.commit("changeLastName", payload)
      },
    },
    username: {
      get() {
        return this.$store.state.profileUserName
      },
      set(payload) {
        this.$store.commit("changeUsername", payload)
      },
    },
    email() {
      return this.$store.state.profileEmail
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-section {
  .container {
    max-width: 1000px;
    padding: 60px 25px;

    h2 {
      text-align: center;
      margin-bottom: 16px;
      @include pageTitle;
    }

    .profile-info {
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background-color: #f1f1f1;
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;

      .initials {
        position: initial;
        width: 80px;
        height: 80px;
        font-size: 32px;
        background-color: #303030;
        color: #fff;
        display: flex;
        align-self: center;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }

      .admin-badge {
        display: flex;
        align-self: center;
        color: white;
        font-size: 14px;
        padding: 8px 24px;
        border-radius: 8px;
        background-color: #303030;
        margin: 16px 0;
        text-align: center;
        text-transform: capitalize;

        icon {
          width: 14px;
          height: auto;
          margin-right: 8px;
        }
      }

      .input {
        margin: 16px 0;

        label {
          font-size: 14px;
          display: block;
          padding-bottom: 6px;
        }

        input {
          @include inputField;
          @media (min-width: 900px) {
          }

          &:focus {
            outline: none;
          }
        }
      }

      button {
        align-self: center;
        margin: 20px 0 20px 0;
        @include formButton;
      }
    }
  }
}
</style>
