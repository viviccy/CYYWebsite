<template>
  <!--   "blog-card" is the small post that show older posts -->
  <div class="blog-card">
    <router-link
      class="link-block"
      :to="{ name: 'ViewBlog', params: { blogid: this.post.blogID } }"
    >
    </router-link>
    <div class="blog-card-container">
      <!--  "icons" is the container for icon edit and delete -->
      <div v-show="editPost" class="icons">
        <!-- This "icon" is the container for icon edit -->
        <div class="icon">
          <Edit class="edit" @click="editBlog" />
        </div>
        <!-- This "icon" is the container for icon delete -->
        <div class="icon">
          <Delete class="delete" @click="deletePost" />
        </div>
      </div>
      <!-- The image for each blog box -->
      <img :src="post.blogCoverPhoto" alt="" />
      <!-- "info" is the container for each blog box information -->
      <div class="info">
        <h4>{{ post.blogTitle }}</h4>
        <h6>
          <!--   post.blogDate return a firebase format date. to convert it to conventional date format, we will have to use 'Date' object and change the information to a specific country representation by using '.toLocaleString'. 
        e.g.
        firebase timestamp: 1627883023527

        after Date(firebase timestamp)
        Tue Aug 03 2021 11:18:40 GMT+0800 (Malaysia Time)

        dateStyle
        long = 2 August 2021
        full = Monday, 2 August 2021
        medium = 2 Aug 2021
        short = 02/08/2021
        -->
          Posted on:
          {{
            new Date(post.blogDate).toLocaleString("en-my", {
              dateStyle: "long",
            })
          }}
        </h6>
        <h6>Author: {{ username }}</h6>
        <router-link
          class="link"
          :to="{ name: 'ViewBlog', params: { blogid: this.post.blogID } }"
        >
          View The Post <Arrow class="arrow" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Arrow from "../assets/Icons/arrow-right-light.svg?inline"
import Edit from "../assets/Icons/edit-regular.svg?inline"
import Delete from "../assets/Icons/trash-regular.svg?inline"

import db from "../firebase/firebaseInit"

export default {
  name: "blogCard",

  //props 'post' hold the data of each record in state.blogPosts in store.
  props: ["post"],
  components: {
    Arrow,
    Edit,
    Delete,
  },
  data() {
    return {
      username: "",
    }
  },

  methods: {
    deletePost() {
      //this.post.blogID is the ID of this post taken from store
      this.$store.dispatch("deletePost", this.post.blogID)
    },
    editBlog() {
      this.$router.push({
        name: "EditBlog",
        params: { blogid: this.post.blogID },
      })
    },
    async userName() {
      //reference to the collection 'users' in firestore and get the author detail
      const dataBase = await db
        .collection("users")
        .doc(this.post.profileId)
        .get()

      //access the author 'userName' in the object by using "data().userName"
      this.username = await dataBase.data().userName
    },
  },
  created() {
    this.userName()
  },
  mounted() {},

  computed: {
    editPost() {
      let allowEditDelete

      if (
        this.username == this.$store.state.profileUserName &&
        this.$store.state.editPost == true
      ) {
        allowEditDelete = true
      } else {
        allowEditDelete = false
      }

      return allowEditDelete
    },
  },
}
</script>

<style lang="scss" scoped>
.blog-card {
  position: relative;
  cursor: pointer;
  display: flex;
  //all divs inside "blog-card" to be align from top to bottom
  flex-direction: column;
  //box rounded corner - all corners to have radius of 8px
  border-radius: 8px;
  background-color: #fff;
  min-height: 420px;
  transition: 0.2s ease all;
  @include boxShadow;

  &:hover {
    // transform: rotateZ(-1deg) scale(1.01);
    transform: translate(3px, -2px);

    box-shadow: 0 5px 8px -1px rgba(0, 0, 0, 0.1),
      0 3px 6px -1px rgba(0, 0, 0, 0.06);
  }

  .link-block {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }

  .blog-card-container {
    position: relative;
    pointer-events: none;
    z-index: 1;

    .icons {
      display: flex;
      position: absolute;
      top: 0px;
      right: 10px;
      z-index: 99;
      pointer-events: all;

      .icon {
        display: flex;
        //align content to the center horizontally
        justify-content: center;
        //align content to the center vertically
        align-items: center;
        width: 35px;
        height: 35px;
        //turn the image to have round shape
        border-radius: 50%;
        background-color: #fff;
        transition: 0.5s ease all;
        margin: 8px;

        //what happens when hover on icons
        &:hover {
          background-color: #303030;
          //the class of the svg icon for edit and delete. To turn the icon to white when hover.
          .edit,
          .delete {
            path {
              fill: #fff;
            }
          }
        }

        .edit,
        .delete {
          //pointer-events: none;
          height: 15px;
          width: auto;
        }
      }
    }

    img {
      display: block;
      border-radius: 8px 8px 0 0;
      z-index: 1;
      width: 100%;
      min-height: 200px;
      //fill the image will cover the whole container while maintain its aspect ratio
      object-fit: cover;
    }

    .info {
      display: flex;
      flex-direction: column;
      height: 100%;
      z-index: 3;
      padding: 32px 16px;
      color: #000;

      h4 {
        padding-bottom: 8px;
        font-size: 20px;
        font-weight: 300;
      }

      h6 {
        font-weight: 400;
        font-size: 12px;
        padding-bottom: 16px;
      }

      .link {
        display: flex;
        //align content to the center vertically
        align-items: center;
        font-weight: 500;
        font-size: 12px;
        padding-bottom: 4px;
        transition: 0.5s ease-in all;

        &:hover {
          color: rgba(48, 48, 48, 0.8);
        }

        .arrow {
          width: 10px;
        }
      }
    }
  }
}
</style>
