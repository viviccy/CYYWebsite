<template>
  <div class="post-view" v-if="blogReady">
    <div class="container quillWrapper">
      <h2>{{ currentBlog.blogTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(this.currentBlog.blogDate).toLocaleString("en-my", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img :src="currentBlog.blogCoverPhoto" alt="" />

      <div class="shortDesc">{{ currentBlog.blogShortDesc }}</div>
      <!--   'v-html' is to bind to html code string -->
      <div class="post-content ql-editor" v-html="currentBlog.blogHTML"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewBlog",
  data() {
    return {
      blogReady: false,
      currentBlog: {
        blogTitle: "",
        blogCoverPhoto: "",
        blogShortDesc: "",
        blogHTML: "",
        blogDate: "",
      },
    }
  },

  async mounted() {
    //Check to see if 'blogPosts' values in Store are ready.
    //If yes the find the blog wanted.

    if (this.$store.state.blogPosts.length) {
      await this.findBlog()
    }

    //watch for 'state.blogPosts' to get all values first before rendering the whole page
    this.$store.watch(
      (state) => {
        //the state (which is 'blogPosts') that we want to watch
        return state.blogPosts
      },
      async () => {
        if (this.$route.name == "ViewBlog") {
          this.findBlog()
        }
      }
    )
  },
  methods: {
    async findBlog() {
      let tempArray
      tempArray = await this.$store.getters.findBlog(this.$route.params.blogid)

      if (tempArray) {
        this.$set(this.currentBlog, "blogTitle", tempArray.blogTitle)
        this.$set(this.currentBlog, "blogCoverPhoto", tempArray.blogCoverPhoto)
        this.$set(this.currentBlog, "blogShortDesc", tempArray.blogShortDesc)
        this.$set(this.currentBlog, "blogHTML", tempArray.blogHTML)
        this.$set(this.currentBlog, "blogDate", tempArray.blogDate)

        this.blogReady = true
      } else {
        this.$router.push({ name: "Home" })
      }
    },
  },
}
</script>

<style lang="scss">
.post-view {
  .shortDesc {
    font-style: italic;
    @include fluid-type($viewThreshold1, $viewThreshold2, 18px, 24px);
    margin-bottom: 25px;
  }
  h4 {
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>
