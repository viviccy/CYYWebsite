<template>
  <div class="blog-card-wrap">
    <Modal
      v-if="modalActive"
      :modalProperties="modalProperties"
      v-on:close-modal="closeModal"
      v-on:Delete="runDelete"
    />
    <!-- "Blogs.vue" is the blog page that has all the article boxes -->
    <div class="blog-cards container">
      <h1>Blogs</h1>

      <!--    <div class="toggle-edit">
        <span>Toggle Editing Post</span>
        <input type="checkbox" v-model="editPost" />
      </div> -->
      <!--  
      :post="post"
      :post means the prop name to pass to child
      ="post" measn the value to pass to child. In this case is the iteration call of function 'blogPosts' which return the each record of state.blogPosts from the store -->
      <BlogCard
        :post="post"
        v-for="(post, index) in blogPosts"
        :key="index"
        v-on:show-hide-modal="showHideModal"
        ref="blogCard"
        :data-key="post.blogID"
      />
    </div>
  </div>
</template>

<script>
import BlogCard from "../components/BlogCard"
import Modal from "../components/Modal"

export default {
  name: "blogs",
  components: { BlogCard, Modal },
  data() {
    return {
      modalActive: false,
      modalProperties: {
        message: "Are you sure you want to delete this blog?",
        task: "Delete",
        blogId: null,
      },
    }
  },
  methods: {
    showHideModal(blogId) {
      this.modalActive = !this.modalActive
      this.modalProperties.blogId = blogId
    },
    runDelete() {
      this.$refs.blogCard
        .find((el) => el.$attrs["data-key"] === this.modalProperties.blogId)
        .deletePost()
    },
    closeModal() {
      this.modalActive = !this.modalActive
    },
  },
  computed: {
    blogPosts() {
      //grab the values from 'state.blogPosts' in store.
      return this.$store.state.blogPosts
    },
    /* function 'editPost' is used to create two way binding between checkbox input element and the store.
    'editPost' will need to be put in 'computed' for this kind of two way binding to work. */
    // editPost: {
    //  get() {
    //get the value of 'editPost' from store.
    //'editPost' means can edit post or not. Value is either true or false.
    //  return this.$store.state.editPost
    // },
    //'payload' is the data passed to store's mutation.
    /*Since 'editPost' is bind to a checkbox, 'payload' in editPost: {set(payload)} will have the value of either True (checked) or False (unchecked).*/
    // set(payload) {
    //to update the value of 'toggleEditPost' in store
    //  this.$store.commit("toggleEditPost", payload)
    // },
    // },
  },
  beforeDestroy() {
    /* Before the user navigate away from this page ("Blogs.vue"), the variable "toggleEditPost" in store will be assigned back to False */
    //this.$store.commit("toggleEditPost", false)
  },
}
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  padding: 50px 16px;
  h1 {
    @include pageTitle;
    grid-column: 1 / -1;
  }

  .blog-cards {
    position: relative;
    display: grid;
    max-width: $viewThreshold7;
    gap: 32px;
    grid-template-columns: 1fr;

    @media (min-width: $viewThreshold3) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: $viewThreshold5) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: $viewThreshold2) {
      grid-template-columns: repeat(4, 1fr);
    }

    .toggle-edit {
      display: flex;
      align-items: center;
      position: absolute;
      top: -70px;
      right: 0;

      span {
        margin-right: 16px;
      }

      input[type="checkbox"] {
        position: relative;
        border: none;
        -webkit-appearance: none;
        background: #fff;
        outline: none;
        width: 80px;
        height: 30px;
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      input[type="checkbox"]:before {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 20px;
        top: 0px;
        left: 0px;
        background: #303030;
        transform: scale(1.1);
        transition: 750ms ease all;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      input:checked[type="checkbox"]:before {
        background: #fff;
        left: 52px;
      }
    }
  }
}
</style>
