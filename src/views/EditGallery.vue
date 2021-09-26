<template>
  <div class="content-container">
    <h2>Manage Gallery</h2>
    <Loading v-show="loading" />

    <vue-dropzone
      ref="imgDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      @vdropzone-complete="afterComplete"
    >
    </vue-dropzone>

    <div class="preview-container dropzone"></div>
    <button
      ref="imageUploadButton"
      @click="uploadImage"
      class="upload-image-button"
    >
      Upload Image
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
            v-bind:key="item.photoId"
            v-for="(item, index) in requiredPhotoData"
          >
            <h2 class="accordion-header" :id="`flush-heading-${item.photoId}`">
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
                  <img :src="item.photoURL" @load="checkImageHeight" />
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
                    @click="deleteSingleItem(`${item.photoId}`, `${index}`)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
      <button class="save-all" @click="saveGallery">Save</button>
    </div>
    <nav aria-label="Page navigation" class="navigation">
      <ul class="page-number pagination">
        <li class="page-item">
          <a
            class="page-link"
            @click="loadRecord(paginationCurrentPageNumber - 1)"
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
            class="page-link"
            :class="checkClass(index)"
            @click="loadRecord(index)"
            ><span>{{ index }}</span></a
          >
        </li>

        <li class="page-item">
          <a
            class="page-link"
            @click="loadRecord(paginationCurrentPageNumber + 1)"
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
            @click="changeRecordNumber(3, 1)"
            aria-label="2"
          >
            <span aria-hidden="true">3</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="changeRecordNumber(5, 2)" aria-label="5">
            <span aria-hidden="true">5</span>
          </a>
        </li>
        <li class="page-item">
          <a
            class="page-link"
            @click="changeRecordNumber(20, 3)"
            aria-label="7"
          >
            <span aria-hidden="true">7</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="collapse py-2" id="collapseTarget">
      This is the toggle-able content!
    </div>
    <!--   <table class="galleryTable">
      <tbody>
        <tr v-bind:key="index" v-for="(item, index) in photoDataSorted">
          <td>{{ item.photoId }}</td>
          <td>
            <input type="text" v-model="item.photoTitle" />
          </td>
          <td>{{ item.photoURL }}</td>
          <td>{{ item.photoName }}</td>

          <td>{{ item.photoCreator }}</td>
        </tr>
      </tbody>
    </table> -->
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
      dropzoneObj: null,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 250,
        thumbnailHeight: 250,
        dictDefaultMessage: "Drop images here to upload",
        previewsContainer: ".preview-container",
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .png",
        autoProcessQueue: false,
        init: function() {
          thisPointer.dropzoneObj = this

          this.on("removedfile", function(file) {
            let index = thisPointer.images.indexOf(file.name)

            if (index !== -1) {
              thisPointer.images.splice(index, 1)
            }
          })

          this.on("addedfile", (file) => {
            thisPointer.images.push(file.name)

            let index = thisPointer.images.indexOf(file.name) + 1
            console.log("file name=" + file.name)
            console.log("index=" + index)

            document.querySelector(
              ".dropzone .dz-preview:nth-child(" + index + ") .dz-progress"
            ).style.opacity = 0

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
                }
              }
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

      oldIndex: "",
      testing: [{ test: 0 }, { test: 1 }],
      newIndex: "",
      galleryCurrentOrder: [],
      paginationStartIndex: 0,
      paginationRecordPerPage: 3,
      paginationCurrentPageNumber: 1,
      paginationCurrentRecordIndex: 1,
      loading: null,
      thumbnailHeight: 0,
      thumbnailWidth: 0,
      files: [],
    }
  },
  destroyed() {
    console.log("destroyed")
  },
  mounted: function() {
    this.updateDatabaseBatch()
  },

  methods: {
    uploadImage() {
      this.dropzoneObj.processQueue()

      let el = document.querySelectorAll(".dropzone .dz-preview .dz-progress")

      for (var i = 0; i < el.length; i++) {
        var currentEl = el[i]
        currentEl.style.opacity = 1
      }

      this.$refs.imgDropzone.processQueue()
    },
    async afterComplete(file) {
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

        let newFileName = fileName + uuid.v1() + ext

        const storageRef = firebase.storage().ref()

        const imageRef = storageRef.child(
          `documents/BlogCoverPhotos/${newFileName}`
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
                  console.log("blob=" + blob)

                  const storageRef = firebase.storage().ref()

                  const docRefThumbnail = await storageRef.child(
                    `documents/BlogCoverPhotos_Thumbnail/${newFileName}`
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
                      thumbnailURL = await imageRef.getDownloadURL()

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

                      let tempArray

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

                          await galleryOrderDocument
                            .get()
                            .then(async (snap) => {
                              tempArray = await snap.data().order

                              tempArray.unshift(snapshot.id)

                              batch.set(
                                //get the id of the document in gallery collection with the matched blog id
                                galleryOrderDocument,
                                {
                                  order: firebase.firestore.FieldValue.arrayUnion(
                                    ...tempArray
                                  ),
                                }
                              )
                            })
                        })

                      // Commit the batch
                      batch.commit().then(() => {
                        thisPointer2.$store.commit("updateGalleryState", data)
                        thisPointer2.$store.commit(
                          "updateGalleryOrderState",
                          tempArray
                        )

                        thisPointer2.$refs.imgDropzone.removeFile(file)
                        //this.images.push({src:imageURL})
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
      if (user == this.$store.state.profileUserName) {
        return true
      }
      return false
    },
    checkClass(index) {
      if (index == 1) {
        return { selected: true }
      }
    },
    checkImageHeight(evt) {
      if (evt.target.clientWidth > evt.target.clientHeight) {
        if (evt.target.clientHeight > this.thumbnailHeight) {
          this.thumbnailHeight = evt.target.clientHeight
          this.thumbnailWidth = evt.target.clientWidth
        }
      } else {
        evt.target.classList.add("vertical-image")
      }
    },
    onEnd: async function(evt) {
      // this.loading = true

      this.oldIndex = evt.oldIndex
      this.newIndex = evt.newIndex

      this.galleryCurrentOrder = this.$store.state.galOrder

      let elementToMove = this.galleryCurrentOrder[evt.oldIndex]

      this.galleryCurrentOrder.splice(evt.oldIndex, 1)
      this.galleryCurrentOrder.splice(evt.newIndex, 0, elementToMove)

      const galleryOrderDatabase = await db
        .collection("galleryOrder")
        .doc("galleryOrder")

      var self = this

      galleryOrderDatabase
        .set({
          order: firebase.firestore.FieldValue.arrayUnion(
            ...this.galleryCurrentOrder
          ),
        })
        .then(function() {
          this.$store.commit(
            "updateGalleryOrderState",
            this.galleryCurrentOrder
          )
          console.log("Document successfully written!")

          self.loading = false
        })
        .catch(function(error) {
          console.error("Error writing document: ", error)
        })
    },

    loadRecord(index) {
      console.log("total number = " + index)

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
    },

    changeRecordNumber(num, index) {
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
      const dataBase = await db.collection("gallery").limit(1)

      await dataBase.get().then(async (docSnapshot) => {
        /////gohere

        if (docSnapshot.size >= 1) {
          // this.$store.commit("resetGalleryState")

          if (this.$store.state.galleryPhotos.length === 0) {
            await this.$store.dispatch("loadGalleryData")
          }

          this.galleryCurrentOrder = [...this.$store.state.galOrder]
        } else {
          const blogDatabase = await db
            .collection("blogPosts")
            .orderBy("date", "desc")

          await blogDatabase.get().then(async (docSnaps) => {
            for (const doc of docSnaps.docs) {
              // await docSnaps.forEach(async (doc) => {

              let tempUserData

              await db
                .collection("users")
                .doc(doc.data().profileId)
                .get()
                .then((userDoc) => {
                  tempUserData = userDoc.data().username

                  const galleryDatabase = db.collection("gallery").doc()

                  galleryDatabase.set({
                    blogID: doc.data().blogID,
                    blogTitle: doc.data().blogTitle,
                    blogCoverPhoto: doc.data().blogCoverPhoto,
                    blogCoverPhotoThumbnail: doc.data().blogCoverPhotoThumbnail,
                    blogCoverPhotoName: doc.data().blogCoverPhotoName,
                    userName: tempUserData,
                  })
                })

              //})
            }
          })

          const galleryOrder = await db
            .collection("galleryOrder")
            .doc("galleryOrder")

          const galleryDatabase = db.collection("gallery")

          let tempArray = []

          await galleryDatabase.get().then((docSnapshot) => {
            if (docSnapshot.size >= 1) {
              for (const doc of docSnapshot.docs) {
                // docSnapshot.forEach(async (doc) => {
                tempArray.push(doc.id)
                //})
              }

              galleryOrder.set({
                order: firebase.firestore.FieldValue.arrayUnion(...tempArray),
              })

              console.log("order ok")
            }
          })
        }
      })
    },
    async saveGallery() {
      //var tbodyRowCount = table.tBodies[0].rows.length

      let content = document.querySelectorAll(".gallery-list li")

      // Get a new write batch
      var batch = db.batch()

      for (let i = 0; i < content.length; ++i) {
        const galleryDatabase = db
          .collection("gallery")
          .doc(content[i].getElementsByTagName("span")[0].innerHTML)

        batch.update(galleryDatabase, {
          blogTitle: content[i]
            .getElementsByTagName("span")[1]
            .getElementsByTagName("input")[0].value,
          blogCoverPhoto: content[i].getElementsByTagName("span")[2].innerHTML,
          blogCoverPhotoName: content[i].getElementsByTagName("span")[3]
            .innerHTML,
          userName: content[i].getElementsByTagName("span")[4].innerHTML,
        })

        let blogId
        await galleryDatabase
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              blogId = await doc.data().blogID
              console.log("ok")
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!")
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error)
          })

        const blogDatabase = db.collection("blogPosts").doc(blogId)

        batch.update(blogDatabase, {
          blogTitle: content[i]
            .getElementsByTagName("span")[1]
            .getElementsByTagName("input")[0].value,
          blogCoverPhoto: content[i].getElementsByTagName("span")[2].innerHTML,
          blogCoverPhotoName: content[i].getElementsByTagName("span")[3]
            .innerHTML,
        })

        //  blogDatabase.update({

        //   })

        // tempArray.push({
        // photoID: content[i].getElementsByTagName("td")[0].innerHTML,
        /*   blogTitle: content[i]
            .getElementsByTagName("td")[1]
            .getElementsByTagName("input")[0].value,
          blogCoverPhoto: content[i].getElementsByTagName("td")[2].innerHTML,
          blogCoverPhotoName: content[i].getElementsByTagName("td")[3]
            .innerHTML,
          userName: content[i].getElementsByTagName("td")[4].innerHTML, */
        //  })
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
      var batch = db.batch()

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
            console.log("ok")
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!")
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error)
        })

      const blogDatabase = db.collection("blogPosts").doc(blogId)

      batch.update(blogDatabase, {
        blogTitle: this.requiredPhotoData[index].photoTitle,
        blogShortDescription: this.requiredPhotoData[index].photoShortDesc,
      })

      // Commit the batch
      batch.commit().then(() => {
        this.loading = false
        console.log("success")
      })
    },
    async deleteSingleItem(photoId, index) {
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
        this.requiredPhotoData.splice(index, 1)
        this.$store.commit("updateGalleryOrderState", this.galleryCurrentOrder)
      })
    },
  },
  computed: {
    countTotalPage() {
      return Math.ceil(
        this.galleryCurrentOrder.length / this.paginationRecordPerPage
      )
    },

    requiredPhotoData: {
      get() {
        //get all the gallery data after sorted in the Store's getter 'photoDataSorted'
        let allPhotoData = this.$store.getters.photoDataSorted

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
    thumbnailHeight: function() {
      document.documentElement.style.setProperty(
        "--image-height",
        this.thumbnailHeight + "px"
      )

      document.documentElement.style.setProperty(
        "--image-width",
        this.thumbnailWidth + "px"
      )
    },
    requiredPhotoData: function() {
      // let thisPointer = this
      /*   this.$nextTick(() => {
        const elements = document.querySelectorAll(".accordion-header")

        Array.from(elements).forEach((element, index, arr) => {
          if (element.clientHeight > thisPointer.itemHeight) {
            thisPointer.itemHeight = element.clientHeight
          }

          if (index === arr.length - 1) {
            Array.from(elements).forEach((element) => {
              element.style.height = thisPointer.itemHeight + "px"
              console.log(
                "element.style.height=" + element.getAttribute("style")
              )
            })
          }
        })
      }) */
    },
  },
}
</script>

<style lang="scss">
:root {
  --image-height: auto;
  --image-width: 100%;
}

.content-container {
  width: 100%;
  max-width: $viewThreshold5;
  margin: 50px auto;
  padding: 0 10px;

  & > h2 {
    @include pageTitle;
    margin-bottom: 40px;
  }

  .accordion {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .accordion-item {
      margin: 0 0 10px 0;
      border: 0;
      background: $inputColor1;
      border-radius: 7px;
      box-shadow: none;
      overflow: hidden;

      &.grey-out {
        opacity: 0.5;
        pointer-events: none;
      }

      h2 {
        .accordion-button {
          display: grid;
          grid-template-columns: 30px 1fr 5fr 25px;
          background: transparent;
          padding: 10px 15px;

          @media (min-width: $viewThreshold1) {
            grid-template-columns: 35px 1fr 5fr 25px;
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
            height: var(--image-height);
            width: var(--image-width);
            display: grid;
            align-items: center;
            margin-right: 10px;
            position: relative;

            //vertical image
            /*      display: flex;
            flex-direction: column;
            align-items: center; */

            img {
              width: 100%;
              min-width: 60px;
              border-radius: 5px;

              &.vertical-image {
                position: absolute;
                width: auto;
                height: 100%;
                left: 50%;
                top: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
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
      margin-left: auto;
    }
  }
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-top: 30px;
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
      border-radius: 0;
    }
    .dz-remove {
      color: #3c4f6f;
      text-decoration: none;
      padding: 7px;
      font-weight: bold;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .dz-image-preview {
    background: none !important;
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
}

.preview-container {
  background: #969696;
  border: 0;
  min-height: auto;
}
</style>
