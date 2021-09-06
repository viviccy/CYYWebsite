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
    //Use '.filter' to extract out each object from 'this.$store.state.blogPosts'
    this.currentBlog = await this.$store.state.blogPosts.filter(
      //for each object in 'this.$store.state.blogPosts'
      (post) => {
        //check to see if object property 'blogID' is equals to the current 'blogid' parameter from URL. If there is a match, return the whole object to 'this.currentBlgo'.
        return post.blogID === this.$route.params.blogid
      }
    )
  },
}
</script>

<style lang="scss">
.post-view {
  .shortDesc {
    font-style: italic;
    @include fluid-type(320px, 1200px, 18px, 24px);
  }
  h4 {
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>
