<template>
  <div>
    <div class="app-container">
      <h1>Gallery</h1>
      <div id="lightgallery">
        <a
          class="gallery-item"
          v-bind:key="item.photoId"
          v-for="(item, index) in photoDataForInfiniteScroll"
          :href="item.photoURL"
          :data-sub-html="'#caption' + index"
        >
          <div :id="'caption' + index">
            <h3>{{ item.photoTitle }}</h3>
            <p>{{ item.photoShortDesc }}</p>
            <router-link
              class="link"
              :class="{ hideLink: !item.blogId }"
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

//import sortGallery from "../mixins/sortGalleryData"

export default {
  name: "Gallery",
  // mixins: [sortGallery],
  data() {
    return {
      blocks: [],
      currentImageList: [],
      // galleryReady: false,
      rowHeight: 200,
      maxRowHeight: 250,
      currentImageIndex: 0,
      imageStartTotal: null,
      imageLoadBatchTotal: null,
    }
  },
  async mounted() {
    //if no value in 'galleryPhotos' array variable from store, then load the data from 'gallery' collection in firestore.
    if (this.$store.state.galleryPhotos.length == 0) {
      await this.loadGallery()
    }

    //load all image details to 'currentImageList' after sorted properly with store getter function 'photoDataSorted'
    this.currentImageList.push(...this.$store.getters.photoDataSorted)

    //imageRow = estimated total images for 1 column
    let imageRow = $(window).height() / this.maxRowHeight

    if (imageRow < 1) {
      imageRow = 1
    }

    //imageCol = estimated total images for 1 row
    let imageCol = $(window).width() / ((this.maxRowHeight / 2) * 3)

    if (imageCol < 1) {
      imageCol = 1
    }

    let allowedImage = Math.floor(imageCol * imageRow + imageCol)

    if (allowedImage <= this.$store.getters.photoDataSorted.length) {
      this.imageStartTotal = allowedImage
    } else {
      this.imageStartTotal = this.$store.getters.photoDataSorted.length
    }

    this.currentImageList = this.currentImageList.slice(0, this.imageStartTotal)

    this.currentImageIndex = this.imageStartTotal

    let thisPointer = this

    $(window).scroll(function() {
      /* 
    $(window).scrollTop():
    The position of scrollbar at the top of the browser is 0. 
    Once it starts moving down, it will has value. 
    
    $(window).height():
    The height of the browser viewport

    $(document).height():
    The height of the whole html page
    */

      if (
        $(window).scrollTop() + $(window).height() + $(window).height() / 2 >=
        $(document).height()
      ) {
        let countLoop = 0

        for (
          let i = thisPointer.currentImageIndex;
          i < thisPointer.$store.getters.photoDataSorted.length;
          i++
        ) {
          countLoop++
          if (countLoop > 3) {
            break
          }

          console.log(
            " thisPointer.$store.getters.photoDataSorted[i]=" +
              thisPointer.$store.getters.photoDataSorted[i]
          )
          thisPointer.currentImageList.push(
            thisPointer.$store.getters.photoDataSorted[i]
          )
          thisPointer.currentImageIndex++
        }
        $("#gallery").justifiedGallery("norewind")
      }
    })
  },

  methods: {
    //load gallery data from Firestore to store
    async loadGallery() {
      this.$store.commit("resetGalleryState")
      await this.$store.dispatch("loadGalleryData")
    },
  },
  computed: {
    photoDataForInfiniteScroll() {
      return this.currentImageList
    },
  },
  watch: {
    photoDataForInfiniteScroll() {
      console.log("watch")
      // let thisPointer = this
      this.$nextTick(() => {
        console.log("tick" + this.currentImageIndex)
        $("#lightgallery")
          .justifiedGallery({
            //the preferred height of images for each row
            rowHeight: this.rowHeight,
            //the max height of images for each row
            maxRowHeight: this.maxRowHeight,
            lastRow: "nojustify",
            margins: 3,
          })
          .on("jg.complete", function() {
            console.log("image ready")
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
  padding: 50px 0;
  margin-left: 5%;
  margin-right: 5%;

  h1 {
    @include pageTitle;
  }

  #lightgallery {
    margin-top: 40px;

    .gallery-item {
      div {
        display: none;
      }
    }
  }
}

.lg-sub-html {
  .hideLink {
    visibility: hidden;
    pointer-events: none;
  }
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
