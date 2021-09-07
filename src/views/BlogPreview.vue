<template>
  <div class="post-view">
    <div class="previewMenu">
      <p>Click <span>"Back"</span> to go back to blog editing page.</p>
      <div class="break"></div>
      <button @click="goBack">Back</button>
    </div>
    <div class="container quillWrapper">
      <h2>{{ getData("blogTitle") }}</h2>
      <h4>
        Posted on:
        {{
          new Date(Number(getData("blogDate"))).toLocaleString("en-my", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img :src="getImageData('coverImageTempFileObject')" alt="" />
      <div class="shortDesc">{{ getData("blogShortDesc") }}</div>
      <!--   'v-html' is to bind to html code string -->
      <div class="post-content ql-editor" v-html="getData('blogHTML')"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostPreview",
  data() {
    return {
      routeID: null,
      currentBlog: null,
    }
  },
  computed: {
    blogTitle() {
      return this.$store.state.blogTitle
    },
    blogHTML() {
      return this.$store.state.blogHTML
    },
    blogCoverPhoto() {
      return this.$store.state.blogPhotoFileURL
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from) {
        //in here vm is refering to 'this'. Inside 'beforeRouterEnter' we cannot use 'this' but we can use vm.
        vm.prevRoute = from

        if (
          vm.prevRoute.name != "EditBlog" &&
          vm.prevRoute.name != "CreatePost"
        ) {
          if (
            !JSON.parse(sessionStorage.getItem("currentBlogReady")) &&
            !JSON.parse(sessionStorage.getItem("tempBlogReady"))
          ) {
            vm.$router.push({
              name: "Home",
            })
          }
        }
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to) {
      if (to.name != "EditBlog" && to.name != "CreatePost") {
        let obj = {
          coverImageTempFileObject: null,
          currentBlogReady: false,
          blogTitle: "",
          blogShortDesc: "",
          blogHTML: "",
          blogPhotoFileURL: "",
          blogPhotoFileThumbnailURL: "",
          blogPhotoName: "",
          blogDate: "",
        }
        //'this' can be use for 'beforeRouteLeave' because the page is already loaded.
        this.$store.commit("updateState", obj)
        sessionStorage.clear()
      }
      next()
    }
  },
  methods: {
    imageExists(url, callback) {
      var img = new Image()
      img.onload = function() {
        callback(true)
      }
      img.onerror = function() {
        callback(false)
      }
      img.src = url
    },
    getData(payload) {
      return this.$store.state[payload]
    },
    getImageData(payload) {
      if (!this.$store.state[payload]) {
        if (sessionStorage.getItem(payload)) {
          let obj = {
            coverImageTempFileObject: sessionStorage.getItem(payload),
          }
          this.$store.commit("updateState", obj)
        }
      }
      return this.$store.state[payload]
    },
    goBack() {
      if (this.routeID != false) {
        this.$router.push({
          name: "EditBlog",
          params: { blogid: this.routeID },
        })
      } else if (this.routeID === "0") {
        this.$router.push({ name: "CreatePost" })
      } else {
        this.$router.push({
          name: "Home",
        })
      }
    },
  },
  async mounted() {
    this.routeID = this.$route.params.blogid

    if (this.routeID != "0") {
      if (!this.$store.state.currentBlogReady) {
        if (JSON.parse(sessionStorage.getItem("currentBlogReady"))) {
          let obj = {
            currentBlogReady: JSON.parse(
              sessionStorage.getItem("currentBlogReady")
            ),
            blogTitle: sessionStorage.getItem("blogTitle"),
            blogShortDesc: sessionStorage.getItem("blogShortDesc"),
            blogHTML: sessionStorage.getItem("blogHTML"),
            blogPhotoFileURL: sessionStorage.getItem("blogPhotoFileURL"),
            blogPhotoFileThumbnailURL: sessionStorage.getItem(
              "blogPhotoFileThumbnailURL"
            ),
            blogPhotoName: sessionStorage.getItem("blogPhotoName"),
            blogDate: sessionStorage.getItem("blogDate"),
          }

          this.$store.commit("updateState", obj)
        }
      }
    } else {
      if (!this.$store.state.tempBlogReady) {
        if (JSON.parse(sessionStorage.getItem("tempBlogReady"))) {
          let obj = {
            blogTitle: sessionStorage.getItem("blogTitle"),
            blogShortDesc: sessionStorage.getItem("blogShortDesc"),
            blogHTML: sessionStorage.getItem("blogHTML"),
            blogPhotoFileURL: sessionStorage.getItem("blogPhotoFileURL"),
            blogPhotoFileThumbnailTempObj: sessionStorage.getItem(
              "coverImageTempFileObject"
            ),
            blogPhotoName: sessionStorage.getItem("blogPhotoName"),
            blogDate: sessionStorage.getItem("blogDate"),
          }

          this.$store.commit("updateState", obj)
        }
      }
    }
  },
}
</script>

<style lang="scss">
.post-view {
  min-height: 100%;

  .previewMenu {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: $inputColor3;
    padding: 15px 0;

    p {
      margin: 0;
    }

    button {
      margin: 15px 8px 0 8px;

      @include formButton;
      padding: 12px 15px;
      @include fluid-type(
        320px,
        1200px,
        $buttonTextSizeMin,
        $buttonTextSizeMax
      );
    }
  }

  .container {
    max-width: 1000px;
    padding: 60px 25px;
  }

  .ql-editor {
    padding: 0;
  }

  h2 {
    margin-bottom: 16px;
    font-weight: 300;
    font-size: 32px;
  }

  img {
    width: 100%;
    margin-bottom: 32px;
  }
}
</style>
