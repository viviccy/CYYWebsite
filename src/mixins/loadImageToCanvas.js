const mixin = {
  methods: {
    //to put file object (either from file input element or coversion to file from a base64 image) into a canvas
    imageLoadToCanvas(file) {
      //canvas in "BlogCoverPreview" component
      let canvas = document.getElementById("imageCanvas")
      let ctx = canvas.getContext("2d")

      //reference to 'this'
      let thisPointer = this

      var reader = new FileReader()

      reader.onload = function(event) {
        let img = new Image()

        //to put the base64 image to canvas
        img.onload = function() {
          canvas.width = 400
          canvas.height = (img.height * canvas.width) / img.width
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }

        //'event.target.result' will produce base64 URL of the image.
        img.src = event.target.result

        //save the base64 URL image string to variable 'coverImageTempFileObject' in store.
        let imgObj = { coverImageTempFileObject: event.target.result }
        thisPointer.$store.commit("updateState", imgObj)

        sessionStorage.setItem("coverImageTempFileObject", event.target.result)
      }

      //to use 'FileReader' to read an object of type File.
      //using method 'readAsDataURL' will produce a an output of base64 URL when 'reader.result' or 'event.target.result' is used.
      reader.readAsDataURL(file)
    },

    //to load the base64 string either from Store variable 'coverImageTempFileObject' or from session storage variable 'coverImageTempFileObject'
    //the loaded base64 string will be loaded into canvas
    //'payload' is the base64 string
    loadImageFromBase64String(payload) {
      var canvas = document.getElementById("imageCanvas")
      var ctx = canvas.getContext("2d")

      var img = new Image()

      //to put the base64 image to canvas
      img.onload = function() {
        canvas.width = 400
        canvas.height = (img.height * canvas.width) / img.width
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      img.src = payload

      //save the base64 URL to 'blogPhotoFileURL' in store. This means that the cover photo is no longer a blob URL but instead a base64 URL.
      let obj = { blogPhotoFileURL: payload }
      this.$store.commit("updateState", obj)

      let thisPointer = this

      //to convert a base64 image to File object.
      //the File object will be used by 'filechange' function later.
      this.urltoFile(
        payload,
        sessionStorage.getItem("blogPhotoName"),
        payload.substring("data:image/".length, payload.indexOf(";base64"))
      ).then(function(file) {
        thisPointer.file = file

        thisPointer.fileChange()
      })
    },
    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer()
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
  },
}

export default mixin
