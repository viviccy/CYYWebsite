<template>
  <div class="swiperDiv" v-show="blogSectionHeightForSwiper">
    <swiper
      :slides-per-view="1"
      :space-between="0"
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
  </div>
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

import scssStyle from "../style.scss"

// install Swiper modules
SwiperClass.use([Pagination, Navigation, Mousewheel, Autoplay, Lazy])
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)

export default {
  name: "SwiperComp",
  props: ["blogSectionHeightForSwiper"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOptions: {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        preloadImages: false,
        updateOnImagesReady: false,
        lazy: true,
        spaceBetween: 0,
        autoplay: {
          delay: 5000,
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
            //to fix a bug in Swiper that the last image on the list (duplicate of first image) not removing the 'data-src' attribute even the lazy loading is done.
          },
          lazyImageLoad: function() {
            // if (lastChild.getAttribute("data-src")) {
            //    console.log("last child")
            //  }
            // document.querySelector(".swiperDiv .swiper-slide.swiper-slide-active img").getAttribute("data-src")
          },
          lazyImageReady: function() {},
          beforeSlideChangeStart: function() {},
          reachEnd: function() {
            let lastImgURL = document
              .querySelector(".swiperDiv .swiper-slide:last-child img")
              .getAttribute("data-src")

            if (lastImgURL) {
              document
                .querySelector(".swiperDiv .swiper-slide:last-child img")
                .setAttribute("testing", "testing")

              document
                .querySelector(".swiperDiv .swiper-slide:last-child img")
                .removeAttribute("data-src")

              document
                .querySelector(".swiperDiv .swiper-slide:last-child img")
                .setAttribute("src", lastImgURL)

              document
                .querySelector(
                  ".swiperDiv .swiper-slide:last-child .swiper-lazy-preloader"
                )
                .remove()
            }
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
    onSlideChange(swiper) {
      console.log("slide change")
      swiper.autoplay.start()
    },
  },
  mounted() {
    document.querySelector(".swiperDiv").style.height =
      this.blogSectionHeightForSwiper + "px"
  },
  watch: {
    blogSectionHeightForSwiper: function(newVal) {
      let val = newVal

      if (window.screen.availWidth <= parseInt(scssStyle.viewThreshold3, 10)) {
        val = val / 2
      }

      val = val + "px"

      document.querySelector(".swiperDiv").style.height = val
    },
  },
}
</script>

<style lang="scss">
.swiperDiv {
  .swiper-container {
    width: 100%;
    // height: calc(100vw * 0.45);
    height: 100%;

    background: #e8e6e6;

    .swiper-wrapper {
      .swiper-slide {
        margin: 0 auto;
        img {
          display: block;
          max-width: 300%;
          max-height: initial !important;

          //required for small screen
          width: auto;
          height: auto;

          margin: 0px;
          padding: 0px;
          overflow-x: hidden;
          object-fit: cover;

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
      transition: 0.5s ease all;
      opacity: 0.4;

      &:hover {
        opacity: 1;
      }
    }

    .swiper-button-prev {
      transform: rotate(180deg);
    }

    .swiper-button-next::after,
    .swiper-button-prev::after {
      display: none;
    }
  }
}

.swiper-slide {
  text-align: center;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (min-width: $viewThreshold3) {
    display: flex;
    align-items: flex-start;
  }

  .desc {
    position: relative;
    z-index: 50;

    text-align: left;
    width: 40%;
    margin: 4% 12% 0 12%;

    @media (min-width: $viewThreshold3) {
      margin: 4% 8% 0 8%;
    }

    h3 {
      z-index: 55;
      text-transform: uppercase;
      @include fluid-type($viewThreshold1, $viewThreshold2, 22px, 35px);
      margin-bottom: 10px;
    }

    p {
      z-index: 55;
      @include fluid-type($viewThreshold1, $viewThreshold2, 12px, 20px);
      margin-bottom: 8px;
      color: #606060;
    }

    a {
      color: #606060;
      font-weight: 700;
      @include fluid-type($viewThreshold1, $viewThreshold2, 11px, 19px);
      text-decoration: none;
    }

    .whiteBg {
      z-index: -1;
      position: absolute;
      display: block;
      top: -700px;
      left: -100px;
      width: 180%;
      height: 2000px;
      transform: rotate(0deg);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.5) 85%,
        rgba(0, 0, 0, 0) 100%
      );

      @media (min-width: $viewThreshold3) {
        top: -300px;
        left: -500px;

        width: 200%;

        transform: rotate(20deg);
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
</style>
