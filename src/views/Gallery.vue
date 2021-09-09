<template>
  <div>
    <div class="app-container">
      <div id="lightgallery" v-show="galleryReady">
        <a
          class="gallery-item"
          v-bind:key="item.photoId"
          v-for="(item, index) in photoDataSorted"
          :href="item.photoURL"
          :data-sub-html="'#caption' + index"
        >
          <div :id="'caption' + index">
            <h3>{{ item.photoTitle }}</h3>
            <p>{{ item.photoShortDesc }}</p>
            <router-link
              class="link"
              :to="{ name: 'ViewBlog', params: { blogid: `${item.blogId}` } }"
              >Explore More</router-link
            >
          </div>
          <img :src="item.thumbPhotoURL" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import "lightgallery.js"
import "lightgallery.js/dist/css/lightgallery.css"
import lgThumbnail from "lg-thumbnail.js"

import "justifiedGallery/dist/js/jquery.justifiedGallery.js"
import "justifiedGallery/dist/css/justifiedGallery.css"
import $ from "jquery"

import sortGallery from "../mixins/sortGalleryData"

export default {
  name: "Gallery",
  mixins: [sortGallery],
  data() {
    return {
      blocks: [],
      imageList: [],
      galleryReady: false,
    }
  },
  async mounted() {
    await this.loadGallery()
  },

  methods: {
    //load gallery data from Firestore to store
    async loadGallery() {
      this.$store.commit("resetGalleryState")
      await this.$store.dispatch("loadGalleryData")
    },
  },
  computed: {},
  watch: {
    photoDataSorted() {
      let thisPointer = this
      this.$nextTick(() => {
        $("#lightgallery")
          .justifiedGallery({
            rowHeight: 200,
            maxRowHeight: 250,
            lastRow: "nojustify",
            margins: 3,
          })
          .on("jg.complete", function() {
            thisPointer.galleryReady = true
          })

        let el = document.getElementById("lightgallery")

        window.lightGallery(el, {
          plugins: [lgThumbnail],
          thumbnail: true,
          animateThumb: true,
          currentPagerPosition: "right",
          pullCaptionUp: true,
          download: false,
          thumbMargin: 10,
          thumbItem: 1,
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  margin-left: 5%;
  margin-right: 5%;

  #lightgallery {
    margin-top: 45px;

    .gallery-item {
      div {
        display: none;
      }
    }
  }
}

.lg-sub-html {
  h3 {
    @include fluid-type($viewThreshold1, $viewThreshold2, 15px, 18px);
  }
  p {
    @include fluid-type($viewThreshold1, $viewThreshold2, 12px, 15px);
  }

  a {
    @include fluid-type($viewThreshold1, $viewThreshold2, 11px, 14px);
    letter-spacing: 2px;
  }
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.item {
  border: 1px solid #ac0;
  //set the width of each block
  width: 24%;

  img {
    width: 100%;
  }
}
</style>
