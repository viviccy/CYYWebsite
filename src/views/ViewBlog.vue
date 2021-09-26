<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container quillWrapper">
      <h2>{{ this.currentBlog[0].blogTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(this.currentBlog[0].blogDate).toLocaleString("en-my", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img :src="this.currentBlog[0].blogCoverPhoto" alt="" />

      <div class="shortDesc">{{ this.currentBlog[0].blogShortDesc }}</div>
      <!--   'v-html' is to bind to html code string -->
      <div
        class="post-content ql-editor"
        v-html="this.currentBlog[0].blogHTML"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewBlog",
  data() {
    return {
      currentBlog: null,
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
        this.findBlog()
      }
    )
  },
  methods: {
    async findBlog() {
      this.currentBlog = await this.$store.state.blogPosts.filter(
        //for each object in 'this.$store.state.blogPosts'
        (post) => {
          //check to see if object property 'blogID' is equals to the current 'blogid' parameter from URL. If there is a match, return the whole object to 'this.currentBlgo'.
          return post.blogID === this.$route.params.blogid
        }
      )
    },
  },
}
</script>

<style lang="scss">
.post-view {
  .shortDesc {
    font-style: italic;
    @include fluid-type($viewThreshold1, $viewThreshold2, 18px, 24px);
  }
  h4 {
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>
