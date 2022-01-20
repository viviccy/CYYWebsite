<template>
  <div>
    <div class="app-container">
      <h1>Gallery</h1>
      <div id="lightgallery">
        <!--  #anchorVFor -->
        <a
          class="gallery-item"
          v-bind:key="item.photoId"
          v-for="(item, index) in photoDataForInfiniteScroll"
          :href="item.photoURL"
          :data-sub-html="'.caption' + index"
          :data-exthumbimage="item.thumbPhotoURL"
        >
          <img :src="item.thumbPhotoURL" />
          <div :class="'caption' + index">
            <h3>{{ item.photoTitle }}</h3>
            <p>
              {{ item.photoShortDesc }}
            </p>

            <span
              class="link"
              :class="{ hideLink: !item.blogId }"
              :onclick="`location.href ='view-blog/${item.blogId}'`"
            >
              Explore More</span
            >

            <!--  <div>
                 <router-link
                class="link"
                :to="{ name: 'ViewBlog', params: { blogid: `${item.blogId}` } }"
                >Explore More</router-link
              >
            </div>  -->
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
//import Light Gallery js file
import lightGallery from "lightgallery"

//import Light Gallery css file
import "lightgallery/css/lightgallery.css"

//import Light Gallery thumbnail plugin css file
import "lightgallery/css/lg-thumbnail.css"

//NOTE: 'lightgallery.umd.js' need to be imported first before 'thumbnail' plugin.
import "lightgallery/lightgallery.umd.js"
import lgThumbnail from "lightgallery/plugins/thumbnail/lg-thumbnail.umd.js"

//import Justified Gallery js and css files
import "justifiedGallery/dist/js/jquery.justifiedGallery.js"
import "justifiedGallery/dist/css/justifiedGallery.css"
import $ from "jquery"

export default {
  name: "Gallery",
  data() {
    return {
      blocks: [],
      currentImageList: [],
      rowHeight: 200,
      //the estimated maximum height of each image on each row
      maxRowHeight: 250,
      //the index number of next image to be loaded to page
      currentImageIndex: 0,
      //the total image to be shown on the page
      imageStartTotal: null,
      //Light Gallery instance variable
      lightGalleryObj: null,
      //Justified Gallery instance variable
      justifyGalleryObj: null,
      //Used for scroll section. To determine when the image adding is allowed when the scroll condition is met.
      readyToAddImage: true,
    }
  },
  async mounted() {
    //if no value in 'galleryPhotos' array variable from store, then load the data from 'gallery' collection in firestore.
    if (this.$store.state.galleryPhotos.length == 0) {
      await this.loadGallery()
    }

    //load all image details to 'currentImageList' after sorted properly with store getter function 'photoDataSorted'
    this.currentImageList.push(...this.$store.getters.photoDataSorted)

    //this.maxRowHeight = the estimated height of each image on each row on the page
    //imageRow = estimated total images for 1 column
    let imageRow = $(window).height() / this.maxRowHeight

    //set 'imageRow' variable to be always 1 if calculated value above is less than 1
    if (imageRow < 1) {
      imageRow = 1
    }

    //imageCol = estimated total images for 1 row
    /* 
    (this.maxRowHeight * 3) / 2 
    - this means based on the ratio of 3 : 2 for width : height, what would be the width of the image when its height is equal to 'maxRowHeight' */
    let imageCol = $(window).width() / ((this.maxRowHeight * 3) / 2)

    //set 'imageCol' variable to be always 1 if calculated value above is less than 1
    if (imageCol < 1) {
      imageCol = 1
    }

    // allowedIMage = the estimated total images that should be showing based on current viewport + one extra row of images (this is to make sure that the recently loaded images are always more than what the viewport can display to give the impression that there more images at the bottom to see if scrolled down)
    let allowedImage = Math.floor(imageCol * imageRow + imageCol)

    /*  This is to determine how many images should be loaded to the viewport based on the device screen size.
    If total images showing on viewport is less than or equal to the total images of 'photoDataSorted', then set 'imageStartTotal' variable as the total images that should be loaded in the page. */
    if (allowedImage <= this.$store.getters.photoDataSorted.length) {
      this.imageStartTotal = allowedImage
    } else {
      //if 'allowedImage' is more than what in 'photoDataSorted', then just show all images from 'photoDataSorted' as it has lesser images compare to the calculated total images in 'allowedImage' variable.
      this.imageStartTotal = this.$store.getters.photoDataSorted.length
    }

    /*   Cut off all the axcess images from 'currentImageList' that should not be showing on viewport for now. This will be from 0 index until a number immediately before 'imageStartTotal'. 

    E.g.
    If 'currentIMageList' = 10 and 'imageStartTotal' is 5, then currentImageList should only have images from index 0 until 4. Image index 5 will serve as the next starting index for the next batch of images to be loaded. */
    this.currentImageList = this.currentImageList.slice(
      0,
      this.imageStartTotal + 1
    )

    //assign 'currentImageIndex' as then next starting index for next image batch.
    this.currentImageIndex = this.imageStartTotal + 1

    let thisPointer = this

    //execute below when browser is scrolled.
    window.addEventListener("scroll", () => {
      /*  
      window.scrollY
      - The number of pixel the page has scrolled up from the starting position (page start from the top of the viewport) when the scrollbar is move down

      window.innerHeight
      - The height of the viewport (the exact area where the page is shown)

      document.documentElement
      - This means referring to <html> tag

      document.documentElement.scrollHeight
      - The whole page height

      window.scrollY + window.innerHeight >=  document.documentElement.scrollHeight
      - If the distance of scroll plus the height of the viewport are more than or equal to the whole page height (This means when the bottommost of the page reach the bottommost part of the view port), then load the next batch of images.

      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.88
      - If the scroll travel distance is more than or equal to 88 percent of the whole page height, then load the next batch of images.
  */

      /*  'readyToAddImage' is set to true initially. The scroll condition below will run multiple times once the page almost scrolled to the bottom. Hence to prevent the code inside being run indefinately, we use the variable 'readyToAddImage' to determine when the codes can run again. */
      if (
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight * 0.75 &&
        this.readyToAddImage == true
      ) {
        //Declare an empty variable
        let tempArray = []

        /*   
        nextBatchEndIndex = The ending index number of the current batch of images
        currentImageIndex = The starting index number of the current batch of images
        imageStartTotal = The total image to be shown on the page on one batch 
        */

        let nextBatchEndIndex =
          thisPointer.currentImageIndex + thisPointer.imageStartTotal

        /*  
       If 'nextBatchEndIndex' is more than total images in 'photoDataSorted', then assign it to the total images number of 'photoDataSorted', which is the number of the final image index number + 1 */
        if (
          nextBatchEndIndex > thisPointer.$store.getters.photoDataSorted.length
        ) {
          nextBatchEndIndex = thisPointer.$store.getters.photoDataSorted.length
        }

        //'currentImageIndex' = the starting image index for the next batch
        for (
          let i = thisPointer.currentImageIndex;
          i < nextBatchEndIndex;
          i++
        ) {
          //push the next image data to 'tempArray'. Once all data has been populated to 'tempArray', then only assign the final values to 'currentImageList' variable.
          tempArray.push(thisPointer.$store.getters.photoDataSorted[i])
          thisPointer.currentImageIndex++
        }

        //if 'tempArray' is not empty then execute the code. If it is empty then do nothing. This will prevent the variable 'currentImageList' from being updated with empty array as any changes to 'currentImageList' will trigger a  'photoDataForInfiniteScroll' function run from 'computed' section and subsequently trigger the 'photoDataForInfiniteScroll' function run from 'watch' section.
        if (tempArray.length > 0) {
          /*   Once done assigning data to 'tempArray', destroy the Light Gallery instance before adding the images to page.
          If there is no more image to update (meaning tempArray.length = 0), then no need to destroy the Light Gallery instance. */
          thisPointer.currentImageList.push(...tempArray)
        }

        this.readyToAddImage = false
      }
    })
  },
  methods: {
    //load gallery data from Firestore to store
    async loadGallery() {
      this.$store.commit("resetGalleryState")
      await this.$store.dispatch("loadGalleryData")
    },

    async initializeJustifyGallery() {
      let thisPointer = this

      this.justifyGalleryObj = $("#lightgallery")
        .justifiedGallery({
          //the preferred height of images for each row
          rowHeight: this.rowHeight,
          //the max height of images for each row
          maxRowHeight: this.maxRowHeight,
          lastRow: "nojustify",
          margins: 3,
        })
        //'.on("jg.complete",...) means once the images inside Justify Gallery container have been processed, then run the code. NOTE: This part will also run when being called using $("#lightgallery").justifiedGallery("norewind") at #anchorNoRewind.
        .on("jg.complete", async () => {
          if (thisPointer.lightGalleryObj == null) {
            //This is for first time create Light Gallery instance
            //Once Justified Gallery has finished its job, then create the Light Gallery instance.
            thisPointer.initializeLightGallery()
          } else {
            //subsequent images update to Light Gallery will only need to call refresh method.
            thisPointer.lightGalleryObj.refresh()

            //once the new images are loaded, set 'readyToAddImage' to true to allow the scroll codes to run again.
            thisPointer.readyToAddImage = true
          }
        })
    },
    initializeLightGallery() {
      //reference to the Light Gallery element
      let el = document.getElementById("lightgallery")

      //create Light Gallery instance
      this.lightGalleryObj = lightGallery(el, {
        plugins: [lgThumbnail],
        thumbnail: true,
        toggleThumb: true,
        allowMediaOverlap: true,
        exThumbImage: "data-exthumbimage",
        subHtmlSelectorRelative: true,
        currentPagerPosition: "right",
        download: false,
        selector: "a",
        licenseKey: "0000-0000-000-0000",
        mobileSettings: {
          controls: false,
          showCloseIcon: true,
          download: false,
        },
      })
    },
  },
  computed: {
    photoDataForInfiniteScroll() {
      return this.currentImageList
    },
  },
  watch: {
    async photoDataForInfiniteScroll() {
      /*   
    'this.$nextTick' will run once all the latest images have been rendered on page. Images are loaded through v-for in #anchorVFor.  */
      this.$nextTick(() => {
        let thisPointer = this

        //the first condition will be executed when the page first loaded. If Justify Gallery instance is not created, then create it then follow by creating Light Gallery instance.
        if (this.justifyGalleryObj == null) {
          thisPointer.initializeJustifyGallery()
        } else {
          /*  #anchorNoRewind */
          /*  - 'norewind' means only the latest added images will be processed. Existing images will not be reprocessed again. This will save some processing power. */
          $("#lightgallery").justifiedGallery("norewind")
        }
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

  span {
    @include fluid-type($viewThreshold1, $viewThreshold2, 11px, 14px);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $buttonColor1;
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
