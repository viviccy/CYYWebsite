<template>
  <div>
    <Loading v-show="loading" />
    <div class="content-container">
      <h2>Manage Gallery</h2>

      <vue-dropzone ref="imgDropzone" id="dropzone" :options="dropzoneOptions">
        <!--   @vdropzone-complete="afterComplete" -->
      </vue-dropzone>
      <p class="task-message"></p>
      <div class="preview-container dropzone"></div>
      <button
        ref="imageUploadButton"
        @click="uploadImage"
        class="upload-image-button disabled"
        disabled
      >
        Run Image Upload
      </button>
      <div></div>
      <div class="accordion accordion-flush" id="accordionFlushExample">
        <draggable
          v-model="requiredPhotoData"
          ghost-class="ghost"
          @end="onEnd"
          handle=".drag-handle"
          :options="{ disabled: !this.$store.state.profileSuperAdmin }"
        >
          <!--  <draggable ghost-class="ghost" @end="onEnd"> -->
          <transition-group type="transition" name="flip-list">
            <div
              class="accordion-item"
              :class="{ 'grey-out': !checkUser(item.photoCreator) }"
              v-for="(item, index) in requiredPhotoData"
              v-bind:key="item.photoId"
            >
              <h2
                class="accordion-header"
                :id="`flush-heading-${item.photoId}`"
              >
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#flush-collapse-${item.photoId}`"
                  aria-expanded="false"
                  :aria-controls="`#flush-collapse-${item.photoId}`"
                >
                  <div
                    class="drag-container"
                    :class="{ 'grey-out': checkDragOption(item.photoCreator) }"
                  >
                    <div class="drag-handle"><dragSquare /></div>
                  </div>
                  <div class="image-container">
                    <div class="image-inner-container">
                      <img
                        :src="item.photoURL"
                        @load="imageLoaded(item.photoId)"
                        :imgid="item.photoId"
                      />
                    </div>
                  </div>
                  <div class="title-container">
                    <p placeholder="Enter blog title">{{ item.photoTitle }}</p>
                  </div>
                  <div
                    class="arrow-container"
                    :class="{ 'hide-arrow': !checkUser(item.photoCreator) }"
                  >
                    <dropDownArrow />
                  </div>
                </button>
              </h2>

              <div
                :id="`flush-collapse-${item.photoId}`"
                class="accordion-collapse collapse"
                :aria-labelledby="`flush-heading-${item.photoId}`"
                v-if="checkUser(item.photoCreator)"
              >
                <div class="accordion-body">
                  <input
                    type="text"
                    :name="`title-${index}`"
                    v-model="item.photoTitle"
                    placeholder="Enter blog title"
                  />
                  <textarea
                    type="text"
                    v-model="item.photoShortDesc"
                    placeholder="Enter short description"
                  ></textarea>
                  <div>
                    <button
                      @click="saveSingleItem(`${item.photoId}`, `${index}`)"
                    >
                      Save</button
                    ><button
                      @click="
                        deleteSingleItem(
                          `${item.photoId}`,
                          `${item.photoURL}`,
                          `${item.thumbPhotoURL}`,
                          `${item.blogId}`
                        )
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </draggable>
        <div
          class="staticLoadingText"
          ref="staticLoadingText"
          id="staticLoadingText"
        >
          Loading...
        </div>
        <button class="save-all" @click="saveGallery">Save</button>
      </div>
      <nav aria-label="Page navigation" class="navigation">
        <ul class="page-number pagination">
          <li class="page-item">
            <a
              href="javascript:void();"
              class="page-link"
              @click.prevent="loadRecord(paginationCurrentPageNumber - 1)"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            class="page-item"
            :key="'pagination' + index"
            v-for="index in countTotalPage"
          >
            <a
              href="javascript:void();"
              class="page-link"
              :class="checkClass(index)"
              @click.prevent="loadRecord(index)"
              ><span>{{ index }}</span></a
            >
          </li>

          <li class="page-item">
            <a
              href="javascript:void();"
              class="page-link"
              @click.prevent="loadRecord(paginationCurrentPageNumber + 1)"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
        <ul class="item-total pagination">
          <li class="page-item">
            <a
              class="page-link selected"
              href="javascript:void();"
              @click.prevent="changeRecordNumber(10, 1)"
              aria-label="2"
            >
              <span aria-hidden="true">10</span>
            </a>
          </li>
          <li class="page-item">
            <a
              href="javascript:void();"
              class="page-link"
              @click.prevent="changeRecordNumber(20, 2)"
              aria-label="5"
            >
              <span aria-hidden="true">20</span>
            </a>
          </li>
          <li class="page-item">
            <a
              href="javascript:void();"
              class="page-link"
              @click.prevent="changeRecordNumber(30, 3)"
              aria-label="7"
            >
              <span aria-hidden="true">30</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="collapse py-2" id="collapseTarget">
        This is the toggle-able content!
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"

//to allow to use of upload and download images from firebase
//import "firebase/storage"

//to allow to use of firebase database
import db from "../firebase/firebaseInit"

import draggable from "vuedraggable"

import Loading from "../components/Loading"

import dropDownArrow from "../assets/Icons/swipe-arrow.svg?inline"
import dragSquare from "../assets/Icons/four-square.svg?inline"

import vue2Dropzone from "vue2-dropzone"
import "vue2-dropzone/dist/vue2Dropzone.min.css"
let uuid = require("uuid")

export default {
  name: "EditGallery",
  components: {
    draggable,
    Loading,
    dropDownArrow,
    dragSquare,
    vueDropzone: vue2Dropzone,
  },
  // mixins: [sortGallery],
  data() {
    let thisPointer = this
    return {
      images: [],
      //total of new images loaded in (either through clicking 'changeRecordNumber' button or through dropzone). New images added through Dropzone is not counted here.
      totalImagesLoaded: 0,

      //the count of new images added in through Dropzone
      totalNewImage: 0,

      //the total number of files needed to upload after the upload button is clicked
      totalFilesToUpload: 0,

      imageWidthHeightArray: [],
      detectChangeCounter: 0,
      totalAcceptedFiles: 0,
      dropzoneObj: null,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 250,
        thumbnailHeight: null,
        dictDefaultMessage:
          "Drop images here to upload. <br/> Only allowed to upload maximum 8 images at a time.",
        previewsContainer: ".preview-container",
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .png",
        autoProcessQueue: false,
        maxFiles: 12,
        maxFilesize: 5,
        parallelUploads: 3,
        timeout: 180000,

        init: function() {
          thisPointer.dropzoneObj = this

          this.on("totaluploadprogress", function(progress) {
            console.log("progress percentage=" + progress)
          })

          this.on("error", function() {
            thisPointer.onOffUploadButton(this)
          })

          this.on("queuecomplete", function() {
            document.querySelector(
              ".content-container .task-message"
            ).textContent = ""

            /*  #anchorQueueComplete */
            thisPointer.dropzoneQueueComplete = true

            //remove 'disabled' class from '.accordion-flush' and '.navigation' to enable record editing
            document
              .querySelector(".accordion-flush")
              .classList.remove("disabled")
            document.querySelector(".navigation").classList.remove("disabled")
          })

          this.on("removedfile", function(file) {
            let index = thisPointer.images.indexOf(file.name)

            if (index !== -1) {
              thisPointer.images.splice(index, 1)
            }

            thisPointer.onOffUploadButton(this)
          })

          this.on("maxfilesexceeded", function(file) {
            this.removeFile(file)
          })

          this.on("addedfile", (file) => {
            thisPointer.images.push(file.name)

            let index = thisPointer.images.indexOf(file.name) + 1

            document.querySelector(
              ".dropzone .dz-preview:nth-child(" + index + ") .dz-progress"
            ).style.opacity = 0

            document.querySelector(
              ".content-container .upload-image-button"
            ).disabled = false

            document
              .querySelector(".content-container .upload-image-button")
              .classList.remove("disabled")

            if (this.files.length) {
              var _i, _len
              for (
                _i = 0, _len = this.files.length;
                _i < _len - 1;
                _i++ // -1 to exclude current file
              ) {
                if (
                  this.files[_i].name === file.name &&
                  this.files[_i].size === file.size &&
                  this.files[_i].lastModifiedDate.toString() ===
                    file.lastModifiedDate.toString()
                ) {
                  this.removeFile(file)

                  let index = thisPointer.images.indexOf(file.name)

                  if (index !== -1) {
                    thisPointer.images.splice(index, 1)
                  }

                  thisPointer.onOffUploadButton(this)
                }
              }
            }
          })

          this.on("sending", function(file, xhr) {
            /*  #anchorTotalFiles */
            thisPointer.totalFilesToUpload = this.files.length

            thisPointer.afterComplete(file)
            xhr.ontimeout = () => {
              console.log("Server Timeout")
            }
          })

          this.on("success", function(file) {
            let index = thisPointer.images.indexOf(file.name) + 1

            document.querySelector(
              ".dropzone .dz-preview:nth-child(" + index + ") .dz-progress"
            ).style.opacity = 0
          })
        },
      },

      testing: [{ test: 0 }, { test: 1 }],
      galleryCurrentOrder: [],
      //the record's starting index number for current pagination number. Starting index is 0 since pagination number started with 1 once page loaded.
      paginationStartIndex: 0,
      //the current total number of records showing on page. Starting number is 10.
      paginationRecordPerPage: 10,
      //the current index number for the pagination button. First button is indexed 1.
      paginationCurrentPageNumber: 1,
      paginationCurrentRecordIndex: 1,
      loading: null,
      thumbnailDimension: 0,
      files: [],
      windowScreenSize: 0,
      setTimeOutObj: null,
      dropzoneQueueComplete: false,
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkThumbnailHeight)
  },
  destroyed() {
    console.log("destroyed")
  },
  mounted: function() {
    //populate the gallery data from Firestore to Store
    this.updateDatabaseBatch()

    let thisPointer = this

    //Resize the image width and height whenever viewport resize happened
    window.addEventListener("resize", thisPointer.checkThumbnailHeight)
  },

  methods: {
    //This function will return the most common values in the array. If there is no common values, then it will return the first value in the array.
    mostOccurence(array) {
      if (array.length == 0) return null
      var modeMap = {}
      var maxEl = array[0],
        maxCount = 1
      for (var i = 0; i < array.length; i++) {
        var el = array[i]
        if (modeMap[el] == null) modeMap[el] = 1
        else modeMap[el]++
        if (modeMap[el] > maxCount) {
          maxEl = el
          maxCount = modeMap[el]
        }
      }
      return maxEl
    },
    onOffUploadButton(dropzoneObj) {
      if (dropzoneObj.getRejectedFiles().length == dropzoneObj.files.length) {
        document.querySelector(
          ".content-container .upload-image-button"
        ).disabled = true

        document
          .querySelector(".content-container .upload-image-button")
          .classList.add("disabled")
      }
    },
    uploadImage() {
      // this.dropzoneObj.processQueue()

      this.totalAcceptedFiles = this.dropzoneObj.getAcceptedFiles().length

      let el = document.querySelectorAll(".dropzone .dz-preview .dz-progress")

      for (var i = 0; i < el.length; i++) {
        var currentEl = el[i]
        currentEl.style.opacity = 1
      }

      this.$refs.imgDropzone.processQueue()
    },
    async afterComplete(file) {
      document.querySelector(".content-container .task-message").textContent =
        "Uploading images..."

      //add 'disabled' class to '.accordion-flush' and '.navigation' to disable record editing. These will be enabled back at #anchorQueueComplete once image uploading is completed.
      document.querySelector(".accordion-flush").classList.add("disabled")
      document.querySelector(".navigation").classList.add("disabled")

      let imageURL
      let thumbnailURL

      let thisPointer2 = this

      try {
        let ext =
          file.name.substring(
            file.name.lastIndexOf(".") + 1,
            file.name.length
          ) || file.name

        let fileName = file.name.substr(0, file.name.lastIndexOf("."))

        let newFileName = fileName + "_" + uuid.v1() + ext

        const storageRef = firebase.storage().ref()

        const imageRef = storageRef.child(
          `documents/GalleryPhotos/PrimaryPhoto/${newFileName}`
        )

        //this.file is the file objected assigned at #anchorFile.
        //execute the task to put the cover image in firebase storarge.
        await imageRef.put(file).on(
          "state_changed",
          (snapshot) => {
            console.log(snapshot)
          },
          (err) => {
            console.log(err)
            this.loading = false
          },
          // this is triggered if the upload is completed
          async () => {
            console.log("upload success")

            imageURL = await imageRef.getDownloadURL()

            var canvas = document.createElement("canvas")

            let ctx = canvas.getContext("2d")

            var reader = new FileReader()

            reader.onload = function(event) {
              let img = new Image()

              //to put the base64 image to canvas
              img.onload = function() {
                canvas.width = 400
                canvas.height = (img.height * canvas.width) / img.width
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob(async function(blob) {
                  const storageRef = firebase.storage().ref()

                  const docRefThumbnail = await storageRef.child(
                    `documents/GalleryPhotos/Thumbnail/${newFileName}`
                  )

                  await docRefThumbnail.put(blob).on(
                    "state_changed",
                    (snapshot) => {
                      console.log(snapshot)
                    },
                    (err) => {
                      console.log(err)
                      this.loading = false
                    },
                    async () => {
                      console.log("load thumbnail success")
                      thumbnailURL = await docRefThumbnail.getDownloadURL()

                      // Get a new write batch
                      var batch = db.batch()

                      const galleryDataBase = await db
                        .collection("gallery")
                        .doc()

                      batch.set(
                        //get the id of the document in gallery collection with the matched blog id
                        galleryDataBase,
                        {
                          blogCoverPhoto: imageURL,
                          blogCoverPhotoThumbnail: thumbnailURL,
                          blogCoverPhotoName: newFileName,

                          blogID: "",
                          blogTitle: "Dream Destination Awaits!",
                          blogShortDescription:
                            "Immerse yourself with a world of worder in Malaysia",
                          userName: thisPointer2.$store.state.profileUserName,
                        }
                      )

                      const data = {
                        photoId: galleryDataBase.id,
                        blogId: "",
                        photoTitle: "Dream Destination Awaits!",
                        photoURL: imageURL,
                        thumbPhotoURL: thumbnailURL,
                        photoName: newFileName,
                        photoShortDesc:
                          "Immerse yourself with a world of worder in Malaysia",
                        photoCreator: thisPointer2.$store.state.profileUserName,
                      }
                      //add all the latest records to state.blogPosts

                      //let tempArray

                      await galleryDataBase
                        .get()
                        .then(async function(snapshot) {
                          let galleryOrderDocument

                          const galleryOrderDatabase = await db.collection(
                            "galleryOrder"
                          )
                          await galleryOrderDatabase
                            .get()
                            .then(async (docSnapshot) => {
                              if (docSnapshot.size >= 1) {
                                galleryOrderDocument = await db
                                  .collection("galleryOrder")
                                  .doc(docSnapshot.docs[0].id)
                              }
                            })

                          await galleryOrderDocument.get().then(async () => {
                            //tempArray = await snap.data().order

                            thisPointer2.galleryCurrentOrder.unshift(
                              snapshot.id
                            )

                            //tempArray.unshift(snapshot.id)

                            batch.update(galleryOrderDocument, {
                              order: firebase.firestore.FieldValue.delete(),
                            })

                            batch.set(
                              //get the id of the document in gallery collection with the matched blog id
                              galleryOrderDocument,
                              {
                                order: firebase.firestore.FieldValue.arrayUnion(
                                  ...thisPointer2.galleryCurrentOrder
                                ),
                              }
                            )
                          })
                        })

                      // Commit the batch
                      batch.commit().then(() => {
                        thisPointer2.$store.commit(
                          "updateGalleryOrderState",
                          thisPointer2.galleryCurrentOrder
                        )

                        thisPointer2.$store.commit("updateGalleryState", data)

                        thisPointer2.$refs.imgDropzone.removeFile(file)
                      })
                    }
                  )
                })
              }

              //'event.target.result' will produce base64 URL of the image.
              img.src = event.target.result
            }

            //to use 'FileReader' to read an object of type File.
            //using method 'readAsDataURL' will produce a an output of base64 URL when 'reader.result' or 'event.target.result' is used.
            reader.readAsDataURL(file)
          }
        )

        // this.$ref.imgDropzone.removeFile(file)
      } catch (error) {
        console.log(error)
      }
    },
    checkDragOption(user) {
      if (
        user == this.$store.state.profileUserName &&
        !this.$store.state.profileSuperAdmin
      ) {
        return true
      }
      return false
    },
    checkUser(user) {
      if (
        user == this.$store.state.profileUserName ||
        this.$store.state.profileSuperAdmin
      ) {
        return true
      }
      return false
    },
    checkClass(index) {
      if (index == 1) {
        return { selected: true }
      }
    },
    //run below when image loaded (but maybe not rendered on page yet)
    imageLoaded(photoId) {
      let thisPointer = this

      //to make sure that image is RENDERED on page, we need to use 'requestAnimationFrame'. We need to use it twice to make sure that the image has completely rendered so that the image height and width can be retrieved.
      requestAnimationFrame(function() {
        //run 'render' function, which has another 'requestAnimationFrame'
        thisPointer.render(photoId)
      })
    },
    render(photoId) {
      let thisPointer = this

      //run 'requestAnimationFrame' the second time. When function 'reRender' is called, the image should have enought time to render on page.
      requestAnimationFrame(function() {
        thisPointer.reRender(photoId)
      })
    },
    reRender(photoId) {
      //If the image still exists on page (the image might have been removed )

      //We need to check if the so-called rendered images are still on page or not. Because of what happened at #anchorChangingRequiredPhotoData, the images loaded might not get rendered at all. Hence to make sure that only rendered images can access the function 'checkImageHeight', a condition 'if' statement is needed to check if the element still on page.
      if (document.querySelector("[imgid='" + photoId + "']") !== null) {
        this.checkImageHeight(
          document.querySelector("[imgid='" + photoId + "']")
        )
      }
    },

    handleImageUploadTask(imgObj) {
      //'totalNewImage' is the count of new images added in through Dropzone
      this.totalNewImage++

      let tempArray = []

      let tempHeight
      //getComputedStyle(element) = to get all the css value of the element
      //imgObj.parentNode.parentNode = the parent of parent of the image element. The targeted element is '.image-container'
      let objStyle = getComputedStyle(imgObj.parentNode.parentNode)

      //set 'tempHeight' to current image height
      tempHeight = imgObj.clientHeight

      /*
     Because the css 'width' for image is set to 100%, certain images might overflow the parent's parent's container(.image-container). To prevent this, we will set that the max-height for the image always less than the parent's parent's container.

    parseInt(value,10)
    this will remove the 'px' from the css max-height value */
      if (imgObj.clientHeight > parseInt(objStyle.maxHeight, 10)) {
        tempHeight = parseInt(objStyle.maxHeight, 10)
      }

      //assign the joined values of image width and height to array 'tempArray'
      tempArray = imgObj.clientWidth + "_" + tempHeight

      //remove the last item in the array
      this.imageWidthHeightArray.pop()

      //add in the latest width_height combination from 'tempArray' as the first item
      this.imageWidthHeightArray.unshift(tempArray)

      //if total new images loaded is equal to all the required files to upload (this value comes from #anchorTotalFiles)
      if (this.totalNewImage == this.totalFilesToUpload) {
        this.thumbnailDimension = this.mostOccurence(this.imageWidthHeightArray)

        //reset the variables to default once the image uploading tasks are done
        this.totalNewImage = 0
        this.dropzoneQueueComplete = 0
        this.totalFilesToUpload = 0

        //run the resize all record images function through 'detectChangeCounter'
        this.detectChangeCounter++
      }
    },

    //to get each image's height and width and put them in array 'imageWidthHeightArray'
    checkImageHeight(imgObj) {
      /*  If user is performing image upload task through dropzone, then 'dropzoneQueueComplete' will be true as assigned at #anchorQueueComplete. During this, the function 'handleImageUploadTask' will run instead. */
      if (this.dropzoneQueueComplete) {
        this.handleImageUploadTask(imgObj)
        return
      } else {
        /* If it is task other than image uploading, then execute below */
        //every time an image is rendered, add 1 to variable 'totalImagesLoaded'
        this.totalImagesLoaded++
        let tempArray = []

        let tempHeight

        //Display the loading message at the bottom of the records. NOTE: This has to be set as inline CSS as it make the style load faster compare to using Class.

        document.getElementById("staticLoadingText").style.display = "block"

        //getComputedStyle(element) = to get all the css value of the element
        //imgObj.parentNode.parentNode = the parent of parent of the image element. The targeted element is '.image-container'
        let objStyle = getComputedStyle(imgObj.parentNode.parentNode)

        //assign 'tempHeight' to the element(.image-container) css 'clientHeight' value
        tempHeight = imgObj.clientHeight

        /*
     Because the css 'width' for image is set to 100%, certain images might overflow the parent's parent's container(.image-container). To prevent this, we will set that the max-height for the image always less than the parent's parent's container.

    parseInt(value,10)
    this will remove the 'px' from the css max-height value */
        if (imgObj.clientHeight > parseInt(objStyle.maxHeight, 10)) {
          tempHeight = parseInt(objStyle.maxHeight, 10)
        }

        //assign the joined values of image width and height to array 'tempArray'
        tempArray = imgObj.clientWidth + "_" + tempHeight

        //push 'tempArray' values to 'imageWidthHeightArray' array
        this.imageWidthHeightArray.push(tempArray)

        //If the total images rendered on page are equal to the total image data in 'requiredPhotoData', then run the code
        if (this.totalImagesLoaded == this.requiredPhotoData.length) {
          /*
       'mostOccurence(array)
       - This will get the most frequent values in the array. We need this value to determine what is the most common image width and height from all the images then adjust all images' width and height according to this common values.  */
          this.thumbnailDimension = this.mostOccurence(
            this.imageWidthHeightArray
          )

          //We will use 'detectChangeCounter' variable as a trigger to resize all the images according to the common width height values from 'thumbnailDimension'. NOTE: we cannot assign 'thumbnailDimension' as the 'watch' variable because there are cases where we need to resize new images on page but the value 'thumbnailDimension' has not changed. Therefore having a separate 'watch' variable 'detectChangeCounter' will give more control on when the images' width and height need to adjust.
          this.detectChangeCounter++
        }
      }
    },

    //To handle viewport resize. Whenever viewport width changed, readjust the images' width and height accordingly.
    checkThumbnailHeight() {
      //Make 'imageWidthHeightArray' array empty as we will need to recalculate all the images common width and height.
      this.imageWidthHeightArray = []

      let imageContainerElement = document.querySelectorAll(
        ".accordion-item .image-container .image-inner-container img"
      )

      //Get one of the image parent's parent's CSS.
      let objStyle = getComputedStyle(
        imageContainerElement[0].parentNode.parentNode
      )

      for (let i = 0; i < imageContainerElement.length; ++i) {
        //Strip off the current CSS width and height for each image
        imageContainerElement[i].style.maxHeight = ""
        imageContainerElement[i].style.maxWidth = ""

        let tempArray

        let tempHeight

        //Get the image height once the image fixed CSS height has been stripped off. This will give us the natural max height of the image when the width is 100%.
        tempHeight = imageContainerElement[i].clientHeight

        //If the image height has overflown the parent's parent's container (.image-container) max height, set the max-height to equal to  parent's parent's container max height.
        if (
          imageContainerElement[i].clientHeight >
          parseInt(objStyle.maxHeight, 10)
        ) {
          tempHeight = parseInt(objStyle.maxHeight, 10)
        }

        tempArray = imageContainerElement[i].clientWidth + "_" + tempHeight

        //Asign 'imageWidthHeightArray' to the the updated 'tempArray' having all the images' width and height details.
        this.imageWidthHeightArray.push(tempArray)
      }

      //Get the most common image width and height
      this.thumbnailDimension = this.mostOccurence(this.imageWidthHeightArray)

      //Trigger 'detectChangeCounter' watch function to assign the new values from 'thumbnailDimension' to each images
      this.detectChangeCounter++
    },
    onEnd: async function(evt) {
      this.loading = true

      /*   
      oldIndex
      -index number before the element get moved, based on current image indexes shown on page. This means if currently there are only 10 images showing on page, the indexing used is from 0 to 9, not based on full gallery indexing from 'this.$store.state.galOrder'. If the user clicked on page 2, the indexing used for oldIndex and newIndex are still 0 to 10. If according to full gallery index, if it is page 2 now, then the indexing should be 10 to 19.

      newIndex
      -index number after the element get moved */
      let oldIndex, newIndex

      //determine the before and after index of the moved element based on full gallery indexing.
      oldIndex = this.paginationStartIndex + evt.oldIndex
      newIndex = this.paginationStartIndex + evt.newIndex

      this.galleryCurrentOrder = this.$store.state.galOrder

      let elementToMove = this.galleryCurrentOrder[oldIndex]

      //remove 1 element at index 'oldIndex'
      this.galleryCurrentOrder.splice(oldIndex, 1)

      //remove 0 element at index 'oldIndex', but add new element 'elementToMove' to 'oldIndex' position
      this.galleryCurrentOrder.splice(newIndex, 0, elementToMove)

      //repeat the position shifting for array 'imageWidthHeightArray'. Since 'imageWidthHeightArray' used 0-10 indexing, evt.oldIndex and evt.newIndex are not required to add 'this.paginationStartIndex'.
      let imageWidthHeightElementToMove = this.imageWidthHeightArray[
        evt.oldIndex
      ]

      this.imageWidthHeightArray.splice(evt.oldIndex, 1)
      this.imageWidthHeightArray.splice(
        evt.newIndex,
        0,
        imageWidthHeightElementToMove
      )

      const galleryOrderDatabase = await db
        .collection("galleryOrder")
        .doc("galleryOrder")

      var self = this

      await galleryOrderDatabase.update({
        order: firebase.firestore.FieldValue.delete(),
      })

      await galleryOrderDatabase
        .set({
          order: firebase.firestore.FieldValue.arrayUnion(
            ...this.galleryCurrentOrder
          ),
        })
        .then(function() {
          self.$store.commit(
            "updateGalleryOrderState",
            self.galleryCurrentOrder
          )

          self.loading = false
        })
        .catch(function(error) {
          console.error("Error writing document: ", error)
        })
    },

    loadRecord(index) {
      if (index <= this.countTotalPage && index > 0) {
        document
          .querySelector(
            ".navigation .page-number .page-item:nth-child(" +
              (this.paginationCurrentPageNumber + 1) +
              ") .page-link"
          )
          .classList.remove("selected")
      }

      this.paginationCurrentPageNumber = index

      if (index <= this.countTotalPage && index > 0) {
        document
          .querySelector(
            ".navigation .page-number .page-item:nth-child(" +
              (this.paginationCurrentPageNumber + 1) +
              ") .page-link"
          )
          .classList.add("selected")
      }

      if (this.paginationCurrentPageNumber > this.countTotalPage) {
        this.paginationCurrentPageNumber = this.countTotalPage
      }

      if (this.paginationCurrentPageNumber <= 0) {
        this.paginationCurrentPageNumber = 1
      }

      this.paginationStartIndex =
        this.paginationCurrentPageNumber * this.paginationRecordPerPage -
        this.paginationRecordPerPage

      this.totalImagesLoaded = 0
      this.imageWidthHeightArray = []
    },
    //can use this function to delay next code from running by calling this.delay(delay time e.g. 1000)
    delay: (ms) =>
      new Promise((res) => {
        setTimeout(res, ms)
      }),

    //to change the total records showing on page
    async changeRecordNumber(num, index) {
      /*
     num = total images to show on page
    index = the index number of the button clicked (index 1 = 10 records button, index 2 = 20 records button, index 3 = 30 records button) */

      this.imageWidthHeightArray = this.imageWidthHeightArray.slice(0, num)

      this.totalImagesLoaded = this.imageWidthHeightArray.length

      //this.detectChangeCounter++

      document
        .querySelector(
          ".navigation .page-number .page-item:nth-child(" +
            (this.paginationCurrentPageNumber + 1) +
            ") .page-link"
        )
        .classList.remove("selected")

      this.paginationCurrentPageNumber = 1

      document
        .querySelector(
          ".navigation .page-number .page-item:nth-child(" +
            (this.paginationCurrentPageNumber + 1) +
            ") .page-link"
        )
        .classList.add("selected")

      document
        .querySelector(
          ".navigation .item-total .page-item:nth-child(" +
            this.paginationCurrentRecordIndex +
            ") .page-link"
        )
        .classList.remove("selected")

      this.paginationCurrentRecordIndex = index
      this.paginationRecordPerPage = num
      this.paginationStartIndex = 0

      document
        .querySelector(
          ".navigation .item-total .page-item:nth-child(" +
            this.paginationCurrentRecordIndex +
            ") .page-link"
        )
        .classList.add("selected")
    },

    async updateDatabaseBatch() {
      //get 1 record from 'gallery' collection for testing
      const dataBase = await db.collection("gallery").limit(1)

      await dataBase.get().then(async (docSnapshot) => {
        //if one 'gallery' document exists then execute the following
        if (docSnapshot.size >= 1) {
          //check if 'galleryPhotos' array from Store is 0. If yes then call Store action 'loadGalleryData' to load gallery data to Store array variable 'galleryPhotos' and to load gallery order data to Store array variable 'galOrder'
          if (this.$store.state.galleryPhotos.length === 0) {
            await this.$store.dispatch("loadGalleryData")
          }

          //Store's 'galOrder' array will be populated after above code.
          this.galleryCurrentOrder = [...this.$store.state.galOrder]

          //If no gallery document exists in Firestore's Gallery collection then create a new 'gallery' collection.
        } else {
          //<-----grab data from 'blogPosts' and 'users' collection and join them to create 'gallery' collection----->

          //reference to Firestore 'blogPosts' collection
          const blogDatabase = await db
            .collection("blogPosts")
            .orderBy("date", "desc")

          await blogDatabase.get().then(async (docSnaps) => {
            //iterate to all blogs in 'blogPosts'
            for (const doc of docSnaps.docs) {
              let tempUserData

              // reference to 'users' collection based on the 'profileId' retrived from 'blogPosts'
              await db
                .collection("users")
                .doc(doc.data().profileId)
                .get()
                .then((userDoc) => {
                  //get the username of the current blog iteration
                  tempUserData = userDoc.data().username

                  //create a new 'gallery' collection's document. A new document id will be generated with '.doc()'
                  const galleryDatabase = db.collection("gallery").doc()

                  //set the needed blog data from 'blogPosts' and username from 'users' collection to the new 'gallery' document
                  galleryDatabase.set({
                    blogID: doc.data().blogID,
                    blogTitle: doc.data().blogTitle,
                    blogCoverPhoto: doc.data().blogCoverPhoto,
                    blogCoverPhotoThumbnail: doc.data().blogCoverPhotoThumbnail,
                    blogCoverPhotoName: doc.data().blogCoverPhotoName,
                    userName: tempUserData,
                  })
                })
            }
          })
          //</-----grab data from 'blogPosts' and 'users' collection and join them to create 'gallery' collection----->

          //<-----create 'galleryOrder' collection and put the newly created 'gallery' records order to 'galleryOrder'----->

          //reference to the newly created 'galleryOrder' document named 'galleryOrder'
          const galleryOrder = await db
            .collection("galleryOrder")
            .doc("galleryOrder")

          //reference to 'gallery' collection
          const galleryDatabase = db.collection("gallery")

          //create an empty array served as the gallery order array
          let tempArray = []

          //reference to 'this'
          let thisPointer = this

          await galleryDatabase.get().then(async (docSnapshot) => {
            if (docSnapshot.size >= 1) {
              //iterate to all the documents in 'gallery' collection
              for (const doc of docSnapshot.docs) {
                //add each 'gallery' record id to 'tempArray'
                tempArray.push(doc.id)
                //})
              }

              await galleryOrder.update({
                order: firebase.firestore.FieldValue.delete(),
              })

              //assign the 'tempArray' values to 'galleryOrder' property named 'order'
              await galleryOrder.set({
                order: firebase.firestore.FieldValue.arrayUnion(...tempArray),
              })

              //Store's 'galOrder' array will be populated after above code.
              thisPointer.galleryCurrentOrder = [
                ...thisPointer.$store.state.galOrder,
              ]
            }
          })
          //</-----create 'galleryOrder' collection and put the newly created 'gallery' records order to 'galleryOrder'----->
        }
      })
    },
    async saveGallery() {
      //var tbodyRowCount = table.tBodies[0].rows.length

      // let content = document.querySelectorAll(".gallery-list li")

      let content = this.$store.getters.photoDataSorted

      // Get a new write batch
      var batch = db.batch()

      for (let i = 0; i < content.length; ++i) {
        const galleryDatabase = db.collection("gallery").doc(content[i].photoId)

        batch.update(galleryDatabase, {
          blogTitle: content[i].photoTitle,
          blogShortDescription: content[i].photoShortDesc,
        })

        let blogId
        await galleryDatabase
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              blogId = await doc.data().blogID
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!")
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error)
          })

        if (blogId) {
          const blogDatabase = db.collection("blogPosts").doc(blogId)

          batch.update(blogDatabase, {
            blogTitle: content[i].blogId,
            blogShortDescription: content[i].photoShortDesc,
          })
        }
      }

      const galleryOrderDatabase = await db.collection("galleryOrder")
      let galleryOrderDocument

      await galleryOrderDatabase.get().then(async (docSnapshot) => {
        if (docSnapshot.size >= 1) {
          galleryOrderDocument = await db
            .collection("galleryOrder")
            .doc(docSnapshot.docs[0].id)
        }
      })

      batch.update(galleryOrderDocument, {
        order: this.galleryCurrentOrder,
      })

      // Commit the batch
      batch.commit().then(() => {
        console.log("success")
      })

      //tempArray
    },
    async saveSingleItem(photoId, index) {
      this.loading = true
      let batch = db.batch()

      let thisPointer = this

      const galleryDatabase = db.collection("gallery").doc(photoId)

      batch.update(galleryDatabase, {
        blogTitle: this.requiredPhotoData[index].photoTitle,
        blogShortDescription: this.requiredPhotoData[index].photoShortDesc,
      })

      let blogId

      await galleryDatabase
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            blogId = await doc.data().blogID
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!")
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error)
        })

      let blogData

      if (blogId) {
        const blogDatabase = db.collection("blogPosts").doc(blogId)

        batch.update(blogDatabase, {
          blogTitle: this.requiredPhotoData[index].photoTitle,
          blogShortDescription: this.requiredPhotoData[index].photoShortDesc,
        })

        blogData = {
          blogTitle: this.requiredPhotoData[index].photoTitle,
          blogShortDesc: this.requiredPhotoData[index].photoShortDesc,
        }
      }

      // Commit the batch
      batch.commit().then(() => {
        this.loading = false

        if (blogId) {
          thisPointer.$store.commit("updateArrayState", {
            array: "blogPosts",
            property: "blogID",
            searchedValue: blogId,
            object: blogData,
          })
        }
      })
    },
    async deleteSingleItem(photoId, imageURL, thumbnailURL, blogId) {
      this.loading = true
      var batch = db.batch()

      const galleryDatabase = db.collection("gallery").doc(photoId)

      batch.delete(galleryDatabase)

      const orderIndex = this.galleryCurrentOrder.indexOf(photoId)

      this.galleryCurrentOrder.splice(orderIndex, 1)

      const galleryOrderDatabase = await db.collection("galleryOrder")

      let galleryOrderDocument

      await galleryOrderDatabase.get().then(async (docSnapshot) => {
        if (docSnapshot.size >= 1) {
          galleryOrderDocument = await db
            .collection("galleryOrder")
            .doc(docSnapshot.docs[0].id)
        }
      })

      batch.update(galleryOrderDocument, {
        order: this.galleryCurrentOrder,
      })

      batch.commit().then(() => {
        this.loading = false

        this.totalImagesLoaded--

        //reference to the targeted image ancestor container '.accordion-item'
        let child = document
          .querySelector(
            ".accordion-item .image-container .image-inner-container img[imgid='" +
              photoId +
              "']"
          )
          .closest(".accordion-item")

        //reference to the '.accordion-item' parent
        let parent = child.parentNode

        // the equivalent of parent.children.indexOf(child)
        let index = Array.prototype.indexOf.call(parent.children, child)

        // remove the item from 'imageWidthHeightArray' according to index. The missing item will be replaced with the new added in image once 'requiredPhotoData' kicked in.
        this.imageWidthHeightArray.splice(index, 1)

        this.$store.commit("deleteArrayState", {
          array: "galleryPhotos",
          property: "photoId",
          value: photoId,
        })

        this.$store.commit("updateGalleryOrderState", this.galleryCurrentOrder)
      })

      var storage = firebase.storage()

      if (!blogId) {
        storage
          .refFromURL(imageURL)
          .delete()
          .then(
            () => {
              console.log("cover file deleted")
            },
            (err) => {
              console.log("main picture issue")
              console.log(err)
            }
          )

        storage
          .refFromURL(thumbnailURL)
          .delete()
          .then(
            () => {
              console.log("thumbnail file deleted")
            },
            (err) => {
              console.log(err)
            }
          )
      }
    },
  },
  computed: {
    countTotalPage() {
      return Math.ceil(
        this.galleryCurrentOrder.length / this.paginationRecordPerPage
      )
    },

    //#anchorChangingRequiredPhotoData
    /* When the page first load, 'requiredPhotoData' data will change three times because of below:
- First time the page load, 'photoDataSorted' still has no value, hence 'requiredPhotoData' will have no value too.
- Once 'photoDataSorted' has values, 'requiredPhotoData' values will be updated again. But because the value for object 'galOrder' inside Store function 'photoDataSorted' is not ready yet, another round of change for 'photoDataSorted' will happen.
- Once 'galOrder' values are ready, it will change the values in 'photoDataSorted', hence will change the values of 'requiredPhotoData'  */
    requiredPhotoData: {
      get() {
        //get all the gallery data after sorted in the Store's getter 'photoDataSorted'
        let allPhotoData = this.$store.getters.photoDataSorted

        /*
        paginationStartIndex
        - the record's starting index number for current pagination number
        paginationRecordPerPage
        - the current total number of records showing on page */

        // show only the ones needed
        allPhotoData = allPhotoData.slice(
          this.paginationStartIndex,
          this.paginationStartIndex + this.paginationRecordPerPage
        )

        return allPhotoData
      },
      set() {},
    },
  },

  watch: {
    //to give a numbered width and height to each image according to "thumbnailDimension" variable
    detectChangeCounter: function() {
      let thisPointer = this

      document
        .querySelectorAll(".accordion-button .image-container img")
        .forEach((el, index, array) => {
          //if 'thumbnailDimension' has value
          if (this.thumbnailDimension) {
            //get the width and height values from 'thumbnailDimension' by spliting the character "_"
            let averageDimension = this.thumbnailDimension.split("_")

            //assign width and height values to the image
            el.style.maxWidth = averageDimension[0] + "px"
            el.style.maxHeight = averageDimension[1] + "px"

            //make the whole record visible on page. Intially was set to 'hidden' on the CSS.
            el.closest(".accordion-item").style.visibility = "visible"
            el.closest(".accordion-item").style.position = "relative"

            if (index === array.length - 1) {
              /*  Once reach the end of rendering all the images according to the proper width and height, the "Loading..." text is shown. This code is here because at this point, nothing has been rendered yet on page (the new records are still blank on page) because browser has not intiated the next Tick, which means any changes made prior to this point will not be shown on page, even the new records have been 'rendered'. This is because all the changes are still in vue virtual memory.
            At this moment, the new records are still blank on page although if we use querySelector to the newly added record elements would return the objects. Somehow the records will take a while AFTER rendering to show on the page. 
            At this point, if we run below code to show 'staticLoadingText', it will show first before the rest of the records finally shown. This will give the impression that the records are loading although technically the 'staticLoadingText' and records should all shown at the same time. */

              let objStyle = getComputedStyle(
                document.querySelector(".staticLoadingText")
              )

              if (objStyle.display == "block") {
                thisPointer.setTimeOutObj = setTimeout(function() {
                  //the 'staticLoadingText' is hided after 1 second after it has shown.
                  document.querySelector(".staticLoadingText").style.display =
                    "none"
                  clearTimeout(thisPointer.setTimeOutObj)
                }, 1000)
              }
            }
          }
        })
    },

    //trigger 'detectChangeCounter' variable every time 'requiredPhotoData' changed (meaning there is changes in the total records shown on page)
    requiredPhotoData: {
      handler: function() {
        this.detectChangeCounter++
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
/* :root {
  --image-height: auto;
  --image-width: 100%;
} */

.content-container {
  width: 100%;
  max-width: $viewThreshold5;
  margin: 50px auto;
  padding: 0 10px;

  & > h2 {
    @include pageTitle;
    margin-bottom: 40px;
  }

  .task-message {
    margin-bottom: 8px;
    text-align: center;
  }

  .accordion {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    &.disabled {
      pointer-events: none;
      opacity: 0.6;
    }

    .staticLoadingText {
      text-align: center;
      display: none;
    }

    .accordion-item {
      margin: 0 0 10px 0;
      border: 0;
      background: $inputColor1;
      border-radius: 7px;
      box-shadow: none;
      overflow: hidden;
      // display: none;
      visibility: hidden;
      position: absolute;

      &.accordion-item-show {
        visibility: visible;
        position: relative;
      }

      &.grey-out {
        opacity: 0.5;
        pointer-events: none;
      }

      h2 {
        .accordion-button {
          display: grid;
          grid-template-columns: 30px 2fr 5fr 25px;
          background: transparent;
          padding: 10px 15px;

          @media (min-width: $viewThreshold4) {
            grid-template-columns: 30px 1fr 4fr 25px;
          }

          &:focus {
            outline: 0;
            border: none;
            box-shadow: none;
          }

          &::after {
            content: none;
          }

          &.collapsed svg {
            transform: rotate(180deg);
          }

          &:not(.collapsed) {
            box-shadow: none;
            svg {
              transform: rotate(90deg);
            }
          }

          .drag-container {
            &.grey-out {
              opacity: 0.3;
              pointer-events: none;
            }

            .drag-handle {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              padding-right: 15px;

              svg {
                path {
                  fill: $inputColor2;
                }
              }
            }
          }

          .image-container {
            /*  height: var(--image-height);
            width: var(--image-width); */
            display: grid;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            position: relative;
            max-height: 70px;

            //vertical image
            /*      display: flex;
            flex-direction: column;
            align-items: center; */

            .image-inner-container {
              display: flex;
              flex-wrap: wrap;
              border-radius: 5px;
              overflow: hidden;

              img {
                width: 100%;
                object-fit: contain;
              }
            }
          }
        }

        .title-container {
          text-overflow: ellipsis;
          color: #969696;
          white-space: nowrap;
          overflow: hidden;
          p {
            @include fluid-type($viewThreshold1, $viewThreshold2, 16px, 25px);
            color: #969696;
            display: inline;
            margin: 0;
          }

          p:empty:not(:focus)::before {
            content: attr(placeholder);
          }
        }

        .arrow-container {
          display: flex;
          justify-content: flex-end;

          &.hide-arrow {
            visibility: hidden;
          }
          svg {
            max-width: 18px;
            width: 100%;
            transition: 0.3s ease all;
            path {
              fill: $inputColor2;
            }
          }
        }
      }
      .accordion-collapse {
        .accordion-body {
          border-radius: 0 0 7px 7px;
          background: #ccc;
          display: flex;
          flex-direction: column;
          padding: 15px;

          input {
            width: 100%;
            margin-bottom: 10px;
            line-height: 0px;
            padding: 0;
            border: none;
            border-bottom: 1px solid #ccc;
            background: transparent;
            color: #969696;

            @include fluid-type($viewThreshold1, $viewThreshold2, 13px, 16px);

            font-size: 22px;

            &:focus {
              outline: none !important;
              border-bottom: 1px solid $buttonColor1;
            }
          }

          textarea {
            @include fluid-type($viewThreshold1, $viewThreshold2, 13px, 16px);
            border-radius: 3px;
            border: 0;
            padding: 0 5px;

            &:focus {
              outline: none !important;
              border: 1px solid $buttonColor1;
            }
          }

          div {
            display: flex;
            margin-top: 15px;
            button {
              @include fluid-type($viewThreshold1, $viewThreshold2, 13px, 16px);
              margin-right: 15px;
              transition: 500ms ease-in-out all;
              align-self: center;
              cursor: pointer;
              border-radius: 7px;
              border: none;
              background: none;
              padding: 5px 10px;
              color: white;
              background-color: #3c4f6f;
              text-decoration: none;
            }
          }
        }
      }
    }
    .save-all {
      @include formButton;
      width: 100%;

      @media (min-width: $viewThreshold6) {
        width: auto;
        margin-left: auto;
      }
    }
  }
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-top: 30px;

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .page-number {
    flex: 1;
    .page-item {
      &:first-child {
        padding-left: 0;
        a {
          margin-left: 0;
        }
      }
      .page-link {
        &:focus {
          outline: none;
          -webkit-box-shadow: none;
          box-shadow: none;
        }
        border-radius: 5px;
        background: $inputColor1;
        margin: 0 4px;
        color: $inputColor2;

        &.selected {
          background: $inputColor2;
          color: $inputColor1;
        }

        span {
          cursor: default;
        }
      }
    }
  }

  .item-total {
    flex: 0 1 auto;

    .page-item {
      &:last-child {
        padding-right: 0;
        a {
          margin-right: 0;
        }
      }

      &:first-child {
        padding-left: 0;
        a {
          margin-left: 0;
        }
      }
      .page-link {
        &:focus {
          outline: none;
          -webkit-box-shadow: none;
          box-shadow: none;
        }
        border-radius: 5px;
        background: $inputColor1;
        margin: 0 4px;
        color: $inputColor2;

        &.selected {
          background: $inputColor2;
          color: $inputColor1;
        }

        span {
          cursor: default;
        }
      }
    }
  }
}

strong {
  display: inline-block;
}

.sortable {
  display: inline-block;
  width: 100%;
  background: blue;
  padding: 1em;
  cursor: move;
  margin-bottom: 2px;

  span {
    float: right;
  }
}

.hello .sortable-drag {
  opacity: 0;
}

.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  border-left: 6px solid rgb(0, 183, 255);
  box-shadow: 10px 10px 5px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;

  /*   &&::before{
    content: "";
    position: absolute;
    width:20px;
    height:20px;
    margin-left: -50px;
    background-image:
  } */
}

.img-div {
  display: flex;
  margin: 25px;
}

.dropzone {
  min-height: 180px;
  background-color: #3c4f6f;
  margin: 0 0 10px 0;
  border-radius: 7px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: 0 !important;

  &.vue-dropzone:hover {
    background-color: #3c4f6f;
  }

  .dz-message {
    span {
      color: white;
    }
  }

  .dz-preview {
    margin: 10px;
    .dz-image {
      border-radius: 0 !important;
      display: flex;
      background: #ccc;

      img {
        width: 100%;
        object-fit: contain;
        margin: 0;
      }
    }
    .dz-remove {
      color: $inputColor3;
      background: $buttonColor1;
      text-decoration: none;
      padding: 7px;
      font-weight: bold;
      border: 1px solid $buttonColor1;

      &:hover {
        text-decoration: none;
      }
    }

    .dz-error-message {
      top: 163px !important;
    }
  }

  .dz-image-preview {
    background: none !important;

    .dz-progress {
      margin-top: -20px;
    }

    .dz-success-mark,
    .dz-error-mark {
      margin-top: -43px;
    }

    .dz-success-mark {
      svg {
        g {
          path {
            fill: $buttonColor1;
            fill-opacity: 1;
          }
        }
      }
    }

    .dz-error-mark {
      svg {
        g {
          g {
            path {
              fill: red;
            }
          }
        }
      }
    }
  }

  img {
    max-width: 180px;
    margin: 0 15px 0 0;
  }
}

.upload-image-button {
  @include formButton;
  margin: 0 auto 50px auto;
  display: block;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.preview-container {
  background: #969696;
  border: 0;
  min-height: auto;
}
</style>
