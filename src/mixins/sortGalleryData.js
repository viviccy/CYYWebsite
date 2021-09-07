const mixin = {
  computed: {
    photoDataSorted() {
      let reference_array = this.$store.state.galOrder

      let reference_object = {}

      for (var i = 0; i < reference_array.length; i++) {
        reference_object[reference_array[i]] = i
      }

      var array = [...this.$store.state.galleryPhotos]

      array.sort(function(a, b) {
        return (
          Number(reference_object[a.photoId]) -
          Number(reference_object[b.photoId])
        )
      })

      if (this.$options.name == "EditGallery") {
        array = array.slice(
          this.paginationStartIndex,
          this.paginationStartIndex + this.paginationRecordPerPage
        )
      }
      return array
    },
  },
}

export default mixin
