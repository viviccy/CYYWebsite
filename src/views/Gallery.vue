<template>
  <div>
    <div class="app-container">
      <div id="lightgallery">
        <a
          class="gallery-item"
          v-bind:key="item.photoId"
          v-for="item in photoData"
          :href="item.photoURL"
          :data-sub-html="
            `<h6>${item.photoTitle}</h6><p>${item.photoShortDesc}</p>`
          "
        >
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

export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      blocks: [],
      imageList: [],
    }
  },
  mounted: async function() {
    await this.loadGallery()

    $("#lightgallery").justifiedGallery({
      rowHeight: 200,
      maxRowHeight: 250,
      lastRow: "nojustify",
      margins: 3,
    })

    const el = document.getElementById("lightgallery")
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
  },

  methods: {
    onInit: () => {
      console.log("lightGallery has been initialized")
    },
    onBeforeSlide: () => {
      console.log("calling before slide")
    },

    //load gallery data from Firestore to store
    async loadGallery() {
      await this.$store.dispatch("loadGalleryData")
    },
  },
  computed: {
    photoData() {
      return this.$store.state.galleryPhotos
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  margin-left: 5%;
  margin-right: 5%;
}

#lightgallery {
  margin-top: 10px;
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

//the container of the whole gallery
.masonry-container {
  width: 95%;
  margin: 0 auto;
}
</style>
