<template>
  <swiper
    :slides-per-view="1"
    :space-between="0"
    navigation
    :pagination="{ clickable: true }"
    :scrollbar="{ draggable: true }"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
    :options="swiperOptions"
  >
    <swiper-slide>
      <div class="desc">
        <h3>Kuala Lumpur</h3>

        <p>
          Malaysia's capital and largest city has much to offer visitors,
          regardless of their interests
        </p>
        <a href="#">Get to know more! &raquo;</a>
        <div class="whiteBg"></div>
      </div>

      <img
        class="img1 swiper-lazy"
        :data-src="require('@/assets/swiperImages/image1.jpg')"
        sizes="100vw"
      />

      <div class="swiper-lazy-preloader">
        <span></span>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="desc">
        <h3>Pulau Tioman</h3>
        <p>
          Pulau Tioman is an island off Peninsular Malaysia's east coast
          paradise and one of Southeast Asia's most beautiful travel
          destinations
        </p>
        <a href="#">Get to know more! &raquo;</a>
        <div class="whiteBg"></div>
      </div>
      <img
        class="img2 swiper-lazy"
        :data-src="require('@/assets/swiperImages/image2.jpg')"
        sizes="100vw"
      />
      <div class="swiper-lazy-preloader">
        <span></span>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="desc">
        <h3>Cameron Highland</h3>
        <p>
          Cameron Highlands is the most popular of the highland retreats in
          Malaysia
        </p>
        <a href="#">Get to know more! &raquo;</a>
        <div class="whiteBg"></div>
      </div>
      <img
        class="img3 swiper-lazy"
        :data-src="require('@/assets/swiperImages/image3.jpg')"
        sizes="100vw"
      />
      <div class="swiper-lazy-preloader">
        <span></span>
      </div>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
  </swiper>
</template>

<script>
// import Swiper core and required modules

import SwipeArrow from "../assets/Icons/swipe-arrow.svg"

import {
  Swiper as SwiperClass,
  Pagination,
  Navigation,
  Mousewheel,
  Autoplay,
  Lazy,
} from "swiper/core"

import getAwesomeSwiper from "vue-awesome-swiper/dist/exporter"

import "swiper/swiper-bundle.css"
// Import Swiper styles

// Import Swiper styles
import "swiper/swiper.scss"

import "swiper/components/pagination/pagination.scss"
import "swiper/components/navigation/navigation.scss"
import "swiper/components/lazy/lazy.min.css"

// install Swiper modules
SwiperClass.use([Pagination, Navigation, Mousewheel, Autoplay, Lazy])
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

export default {
  name: "SwiperComp",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    const vue = this
    return {
      swiperOptions: {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        lazy: true,
        preloadImages: true,
        updateOnImagesReady: true,
        spaceBetween: 10,
        autoplay: {
          delay: 500000,
          disableOnInteraction: false,
        },
        //Bottom dot buttons
        pagination: {
          el: ".swiper-pagination",
        },

        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        on: {
          init: function() {
            console.log("initialized.") // this works
            vue.testing
          },
          lazyImageLoad: function() {
            //this.slides[this.activeIndex].querySelector(".desc").style.display =
            // "none"
          },
          lazyImageReady: function() {
            //  console.log("been here")
            // this.slides[this.activeIndex].querySelector(".desc").style.display =
            //   "block"
          },
          beforeSlideChangeStart: function() {
            //  console.log("kkkkkk")
            // this.slides[this.activeIndex].querySelector(".desc").style.display =
            //  "none"
          },
        },
      },
    }
  },
  computed: {
    swipeArrow() {
      return SwipeArrow
    },
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper)
    },
    onSlideChange() {
      console.log("slide change")
    },

    testing: function() {
      console.log("testing")
    },
  },
}
</script>

<style lang="scss">
.swiper-lazy-preloader {
  //to turn make default swiper loading icon invisible
  visibility: hidden;

  //the height and width of the preloader icon
  width: 50px;
  height: 50px;

  //set the icon slightly above
  top: 48%;

  // this will make a new custom icon to replace the default Swiper icon

  background-color: red;
  //'@keyframes' is for 'span' element below. To define the animation used by 'span'.
  //#anchorSpin
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }

  span {
    //make this child visible
    visibility: visible;
    display: block;

    //the the size of the span smaller to cater for the round circle
    width: 100%;
    height: 100%;

    //remove margin and center the element
    margin: 0 auto;

    border: 3px solid transparent;
    border-top-color: #3e3e3e;
    border-bottom-color: #3e3e3e;
    border-radius: 50%;

    //use the 'spin' animation as defined in #anchorSpin
    animation: spin ease 1000ms infinite;
  }
}

.swiper-slide {
  text-align: center;
  height: 100%;
  overflow: hidden;

  .desc {
    position: relative;
    z-index: 50;

    text-align: left;
    width: 40%;
    margin: 2% 4% 0 4%;

    h3 {
      z-index: 55;
      text-transform: uppercase;
      @include fluid-type(320px, 1200px, 18px, 30px);
      margin-bottom: 10px;
    }

    p {
      z-index: 55;
      @include fluid-type(320px, 1200px, 12px, 20px);
      margin-bottom: 8px;
      color: #606060;
    }

    a {
      color: #606060;
      font-weight: 700;
      @include fluid-type(320px, 1200px, 11px, 19px);
      text-decoration: none;
    }

    .whiteBg {
      z-index: -1;
      background: white;
      position: absolute;
      top: -130px;
      left: -100px;
      display: block;
      opacity: 0.6;
      width: 160%;
      height: 800px;
      transform: rotate(10deg);

      @media (min-width: 580px) {
        width: 140%;
      }

      @media (min-width: 950px) {
        width: 120%;
      }
    }
  }

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
  }
}

.swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  background-color: white;
}
.swiper-container {
  width: auto;
  height: 80vh;
  background: #e8e6e6;

  .swiper-wrapper {
    border: 1px solid white;
    .swiper-slide {
      margin: 0 auto;
      img {
        display: block;
        max-width: 150%;

        //required for small screen
        width: auto;
        height: 100%;

        margin: 0px;
        padding: 0px;
        overflow-x: hidden;
        object-fit: cover;
        //to fix the left and right image get exposed on the left and right edges when current image in view
        transform: translate(-50.1%, -50.1%);

        @media (min-width: 650px) {
          width: 100%;
        }

        @media screen and (orientation: landscape) {
          width: 100%;
        }

        &.img1 {
          @include mediaProcess(800px, none, 40%, 80%);
          @include mediaProcess(930px, none, 0%, 90%);
          @include mediaProcess(1000px, none, 0%, 100%);
        }

        &.img2 {
          @include mediaProcess(700px, none, 0% 40%);
          @include mediaProcess(1030px, none, 50% 550%);
        }

        &.img3 {
          @include mediaProcess(900px, none, 0% 95%);
          @include mediaProcess(1030px, none, 50% 220%);
        }
      }
    }

    .swiper-button-next,
    .swiper-button-prev {
      transform: scale(0.1);
    }
  }

  .swiper-button-next,
  .swiper-button-prev {
    background-image: url("../assets/Icons/swipe-arrow.svg");

    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    opacity: 0.4;
  }

  .swiper-button-prev {
    transform: rotate(180deg);
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    display: none;
  }
}
</style>
