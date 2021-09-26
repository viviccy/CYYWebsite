const mixin = {
  methods: {
    changeUploadedFileName(fullFileName) {
      let uuid = require("uuid")

      let ext =
        fullFileName.substring(
          fullFileName.lastIndexOf(".") + 1,
          fullFileName.length
        ) || fullFileName

      let fileName = fullFileName.substr(0, fullFileName.lastIndexOf("."))

      return fileName + uuid.v1() + "." + ext
    },
  },
}

export default mixin
