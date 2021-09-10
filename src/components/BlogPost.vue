<template>
  <!-- 'BlogPost' component is the big post section on the page. Caller is from "Home.vue" -->
  <div class="blog-wrapper" :class="{ 'no-user': !user }" ref="blogSection">
    <div class="blog-content">
      <div>
        <!--   Child way of using a prop 
        (name of the prop(in this case 'post' which carry the value of 'welcomeScreen' object))
         .
        (property of the 'welcomeScreen' object, e.g. title) -->

        <!--    prop 'post' has the 'welcomeScreen' object as value
        post.welcomeScreen = return either true or false
        post.title = return title property for the object 'welcomeScreen' -->

        <h2>{{ post.blogTitle }}</h2>
        <div class="content-preview" v-html="post.blogShortDesc"></div>
        <router-link
          class="link"
          :to="{ name: 'ViewBlog', params: { blogid: this.post.blogID } }"
        >
          View The Post <Arrow class="arrow" />
        </router-link>
      </div>
    </div>
    <div class="blog-photo">
      <img
        v-if="post.welcomeScreen"
        :src="require(`../assets/blogPhotos/${post.photo}.jpg`)"
      />
      <img v-else :src="post.blogCoverPhoto" alt="" @load="onImgLoad" />
    </div>
  </div>
</template>

<script>
import Arrow from "../assets/Icons/arrow-right-light.svg?inline"

export default {
  name: "BlogPost",
  props: ["post"],
  blogHeight: null,
  components: {
    Arrow,
  },
  created() {
    window.addEventListener("resize", this.divSizeCheck)
  },
  mounted() {},
  methods: {
    divSizeCheck() {
      this.$emit("blogSectionHeightChange", this.$refs.blogSection.clientHeight)
    },
    onImgLoad() {
      this.divSizeCheck()
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler)
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
}
</script>

<style lang="scss">
//the container for 1 blog cover image and 1 blog detail box
.blog-wrapper {
  //use grid system
  display: grid;

  //1, 1fr = each row has 1 column of 1 fraction
  grid-template-columns: repeat(1, 1fr);

  //make each row has the same height and expand according to the child within the grid that has the tallest content
  grid-auto-rows: 1fr;
  align-content: center;

  //small shadow for the whole container at the bottom
  @include boxShadow;

  @media (min-width: $viewThreshold3) {
    //make 2 elements per row when in computer view
    grid-template-columns: repeat(2, 1fr);
  }

  //the box with the blog details
  .blog-content {
    display: flex;

    //horizontally centered the content
    justify-content: center;

    //vertically centered the content
    align-items: center;
    /*
    '.blog-content' is initial stack on top of '.blog-photo'.
    '.blog-content' is then ordered to the bottom of '.blog-photo' when screen width less than 700px (mobile view).
    'order' property is based on 0,1,2,3...with element assigned to 0 will be placed before elements with 1 and so on.
     Element with no 'order' assignment is default to 0.
    */
    order: 1;

    @media (min-width: 700px) {
      /*  '.blog-content' is ordered to the left when screen width more than 700px.
      This will be altered in #alternatePosition to make the alternating positions.
      */

      order: 0;
    }

    div {
      max-width: 375px;
      height: auto;
      padding: 0;
      margin: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;

      h2 {
        @include fluid-type($viewThreshold1, $viewThreshold2, 20px, 32px);
        font-weight: 300;
        text-transform: uppercase;
        margin: 0;
      }

      .content-preview {
        @include fluid-type($viewThreshold1, $viewThreshold2, 13px, 15px);
        font-weight: 300;
        line-height: 1.7;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;

        p {
          margin: 15px 0;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
        }
      }

      .link {
        display: inline-flex;
        align-items: center;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;
        transition: 0.5s ease-in all;

        &:hover {
          border-bottom-color: #303030;
        }
      }

      .link-light {
        &:hover {
          border-bottom-color: #fff;
        }
      }
    }
  }

  .blog-photo {
    @include boxShadow;

    /*  '.blog-photo' is ordered to the top when screen width less than 700px (mobile view) */
    order: 0;
    @media (min-width: 700px) {
      /*  '.blog-photo' is ordered to the right when screen width more than 700px */
      order: 1;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;

      // The image will be clipped to fit in the container without stretching the image
      object-fit: cover;
    }
  }

  //alternating the 'blog-wrapper' element
  /* 
  NOTE: Media Queries will always run after the normal CSS, even the normal CSS is located below of Media Queries.
  E.g.

  .element{
      @media (min-width: 700px) {
        background-color:red;
      }

      background-color:blue;

  }

  
 'background-color:red' will always be shown on page even screen size is more than 700px in the first place.
 This is because 'background-color:blue' is executed first then overwritten by 'background-color:red'.
 */
  &:nth-child(even) {
    @media (min-width: 700px) {
      //#alternatePosition
      /*   even numbered 'blog-wrapper' will have 'blog-photo' placed before 'blog-content'
     odd numbered 'blog-wrapper' will have 'blog-content' placed before 'blog-photo' */
      .blog-content {
        order: 1;
      }
      .blog-photo {
        order: 0;
      }
    }
  }
}

.no-user:first-child {
  .blog-content {
    background-color: #303030;
    color: #fff;
  }
}
</style>
