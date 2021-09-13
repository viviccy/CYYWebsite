<template>
  <div>
    <div class="app-container">
      <div id="lightgallery" v-show="galleryReady">
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
      imageList: [],
      galleryReady: false,

      currentImageIndex: 0,
      imageStartTotal: 3,
      imageLoadBatchTotal: 1,
    }
  },
  async mounted() {
    await this.loadGallery()

    this.currentImageIndex = this.imageStartTotal - 1

    let thisPointer = this

    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        console.log(
          "thisPointer.currentImageIndex=" + thisPointer.currentImageIndex
        )
        console.log(
          "thisPointer.$store.getters.photoDataSorted.length=" +
            thisPointer.$store.getters.photoDataSorted.length
        )

        for (
          let i = thisPointer.currentImageIndex;
          i < thisPointer.$store.getters.photoDataSorted.length;
          i++
        ) {
          console.log("loop time=" + i)
          $("#lightgallery").append(
            /*   '<a class="gallery-item" href="' +
              thisPointer.$store.getters.photoDataSorted[i].photoURL +
              '" data-sub-html="#caption' +
              i +
              '"' +
              ' <div id="caption' +
              i +
              '"><h3>' +
              thisPointer.$store.getters.photoDataSorted[i].photoTitle +
              "</h3>" +
              "<p>" +
              thisPointer.$store.getters.photoDataSorted[i].photoShortDesc +
              "</p>" +
              "</div>" +
              '<img src="' +
              thisPointer.$store.getters.photoDataSorted[i].thumbPhotoURL +
              '" dfsdfsfsfd &#47;></a>' */
            '<div  id="caption' +
              i +
              '"><h3>' +
              thisPointer.$store.getters.photoDataSorted[i].photoTitle +
              "</h3>" +
              "<p>" +
              thisPointer.$store.getters.photoDataSorted[i].photoShortDesc +
              "</p>" +
              ' <router-link class="link" :to="#"></router-link>' +
              "</div>"
          )
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
      //get all the gallery data after sorted in the Store's getter 'photoDataSorted'
      let tempPhotoData = this.$store.getters.photoDataSorted

      // show only the ones needed
      tempPhotoData = tempPhotoData.slice(0, this.imageStartTotal)
      return tempPhotoData
    },
  },
  watch: {
    photoDataForInfiniteScroll() {
      let thisPointer = this
      this.$nextTick(() => {
        $("#lightgallery")
          .justifiedGallery({
            //the preferred height of images for each row
            rowHeight: 200,
            //the max height of images for each row
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
