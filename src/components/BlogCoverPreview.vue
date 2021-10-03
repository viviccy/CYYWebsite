<template>
  <!-- Modal to show the user cover photo in 'CreatePost' -->
  <div class="modal" ref="modal">
    <div class="modal-content">
      <close @click="closePreview" class="icon" />
      <!--  <img :src="blogCoverPhoto" alt="" /> -->
      <canvas id="imageCanvas"></canvas>
    </div>
  </div>
</template>
<script>
import close from "../assets/Icons/times-circle-light.svg?inline"

export default {
  components: {
    close,
  },
  mounted() {
    document.addEventListener("click", this.checkClick)
  },
  methods: {
    checkClick(event) {
      // If user clicks inside the element, do nothing
      if (event.target.className == "modal") this.closePreview()
    },
    closePreview() {
      //reverse the value of variable 'blogPhotoPreview' in store to close this modal.
      this.$store.commit("openPhotoPreview")
    },
  },
  computed: {
    blogCoverPhoto() {
      return this.$store.state.blogPhotoFileURL
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClick)
  },
}
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .modal-content {
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 12px;
    background-color: #fff;
    height: auto;
    width: 600px;
    padding: 50px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .icon {
      width: 24px;
      height: auto;
      cursor: pointer;
      font-size: 24px;
      position: absolute;
      top: 15px;
      right: 15px;
      color: #303030;
    }

    canvas {
      margin: 16px auto auto auto;
      display: block;
      width: 100%;
      height: auto;
      max-width: 400px;
      max-height: 400px;

      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
