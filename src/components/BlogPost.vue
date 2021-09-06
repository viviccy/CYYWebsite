<template>
  <!-- 'BlogPost' component is the big post section on the page. Caller is from "Home.vue" -->
  <div class="blog-wrapper" :class="{ 'no-user': !user }">
    <div class="blog-content">
      <div>
        <!--   Child way of using a prop 
        (name of the prop(in this case 'post' which carry the value of 'welcomeScreen' object))
         .
        (property of the 'welcomeScreen' object, e.g. title) -->

        <!--    prop 'post' has the 'welcomeScreen' object as value
        post.welcomeScreen = return either true or false
        post.title = return title property for the object 'welcomeScreen' -->
        <h2 v-if="post.welcomeScreen">{{ post.title }}</h2>
        <h2 v-else>{{ post.blogTitle }}</h2>
        <p v-if="post.welcomeScreen">{{ post.blogPost }}</p>
        <p class="content-preview" v-else v-html="post.blogHTML"></p>
        <router-link class="link link-light" v-if="post.welcomeScreen" to="#">
          Login / Register <Arrow class="arrow arrow-light" />
        </router-link>
        <router-link
          class="link"
          v-else
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
      <img v-else :src="post.blogCoverPhoto" alt="" />
    </div>
  </div>
</template>

<script>
import Arrow from "../assets/Icons/arrow-right-light.svg?inline"

export default {
  name: "BlogPost",
  props: ["post"],
  components: {
    Arrow,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
}
</script>

<style lang="scss" scoped>
.blog-wrapper {
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  @media (min-width: 700px) {
    min-height: 650px;
    max-height: 650px;
    flex-direction: row;
  }

  .blog-content {
    display: flex;
    justify-content: center;
    align-items: center;
    /* 
    equal to flex-grow: 4, flex shrink: 1 (default), flex-basis: 0 (default).
    '.blog-content' will take 4 out of 8 portion of the space when the screen size is less than 700px 
    */
    flex: 4;

    /*  
    '.blog-content' is ordered to the bottom of '.blog-photo' when screen width less than 700px (mobile view).
    'order' property is based on 0,1,2,3...with element assigned to 0 will be placed before elements with 1 and so on.
     Element with not 'order' assignment is default to 0.
    */
    order: 1;
    @media (min-width: 700px) {
      /*  '.blog-content' is ordered to the left when screen width more than 700px */
      order: 0;
    }
    @media (min-width: 800px) {
      /* 
      '.blog-content' will take 3 out of 6 portion of the space when the screen size is more than 800px 
      */
      flex: 3;
    }

    div {
      max-width: 375px;
      padding: 72px 24px;
      @media (min-width: 700px) {
        padding: 0 24px;
      }

      h2 {
        font-size: 32px;
        font-weight: 300;
        text-transform: uppercase;
        margin-bottom: 24px;
        @media (min-width: 700px) {
          font-size: 40px;
        }
      }

      p {
        font-size: 15px;
        font-weight: 300;
        line-height: 1.7;
      }

      .content-preview {
        font-size: 13px;
        max-height: 24px;
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .link {
        display: inline-flex;
        align-items: center;
        margin-top: 32px;
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
    flex: 4;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    /*  '.blog-photo' is ordered to the top when screen width less than 700px (mobile view) */
    order: 0;
    @media (min-width: 700px) {
      /*  '.blog-photo' is ordered to the right when screen width more than 700px */
      order: 1;
    }

    @media (min-width: 800px) {
      /* 
      '.blog-photo' will take 3 out of 6 portion of the space when the screen size is more than 800px 
      */
      flex: 3;
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

  
 'background-color:red' will be shown on page even screen size is more than 700px in the first place.
 This is because 'background-color:blue' is executed first then overwritten by 'background-color:red'.
 */
  &:nth-child(even) {
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

.no-user:first-child {
  .blog-content {
    background-color: #303030;
    color: #fff;
  }
}
</style>
