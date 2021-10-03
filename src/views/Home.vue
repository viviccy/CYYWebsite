<template>
  <div class="home">
    <SwiperComp :blogSectionHeightForSwiper="blogSectionHeight" />
    <div class="topSection">
      <BlogPost
        :post="post"
        @blogSectionHeightChange="getHeightChange"
        v-for="(post, index) in blogPostFeed"
        :key="index"
      />
    </div>
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Recent Blogs</h3>
        <div class="blog-cards">
          <BlogCards
            :post="post"
            v-for="(post, index) in blogPostCards"
            :key="index"
          />
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Register for your free account today to start blogging!</h2>
        <div>
          <router-link class="router-button" to="#"
            >Register <Arrow class="arrow arrow-light"
          /></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlogPost from "../components/BlogPost"
import BlogCards from "../components/BlogCard"
import Arrow from "../assets/Icons/arrow-right-light.svg?inline"
import SwiperComp from "../components/SwiperComp"

export default {
  name: "Home",
  components: { BlogPost, BlogCards, Arrow, SwiperComp },
  data() {
    return { blogSectionHeight: null }
  },
  created() {
    this.$store.dispatch("getPost")
  },
  methods: {
    getHeightChange(event) {
      this.blogSectionHeight = event
    },
  },
  computed: {
    blogPostFeed() {
      return this.$store.getters.blogPostFeed
    },
    blogPostCards() {
      return this.$store.getters.blogPostCards
    },
    user() {
      return this.$store.state.user
    },
  },
}
</script>

<style lang="scss" scoped>
.topSection {
  display: grid;
  grid-auto-rows: 1fr;
}

.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    div {
      display: flex;
      justify-content: center;
      flex: 1;
      .router-button {
        font-size: 14px;
        @include fluid-type($viewThreshold1, $viewThreshold2, 16px, 25px);
        text-decoration: none;

        @include formButton;

        @media (min-width: 800px) {
        }
      }
    }

    h2 {
      font-weight: 300;
      font-size: 32px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      margin: 15px 0;

      @media (min-width: 800px) {
        flex: 2;
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>
