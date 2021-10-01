<template>
  <!-- A modal is a dialog box/popup window that is displayed on top of the current page -->
  <div class="modal">
    <div class="modal-content">
      <p>{{ this.modalProperties.message }}</p>
      <button v-if="this.modalProperties.task" @click="runTask">
        {{ this.modalProperties.task }}
      </button>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modalProperties"],
  methods: {
    closeModal() {
      /*  $emit is used to pass variable from child component to parent component.
      "close-modal" signal will be attached to the parent component (e.g. ForgotPassword) */
      this.$emit("close-modal")
    },
    runTask() {
      /*  $emit is used to pass variable from child component to parent component.
      "close-modal" signal will be attached to the parent component (e.g. ForgotPassword) */
      this.$emit(this.modalProperties.task)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 8px;
    width: 300px;
    padding: 40px 30px;
    background-color: #fff;

    p {
      text-align: center;
      flex: 1;
      flex-basis: 100%;
    }

    button {
      flex: 1;
      align-self: center;
      @include formButton;

      &:first-of-type {
        margin-right: 15px;
      }
    }
  }
}
</style>
