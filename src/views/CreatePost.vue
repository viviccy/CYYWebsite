<template>
  <div class="create-post">
    <!-- 'BlogCoverPreview' component is used to show the user cover photo once it uploaded.
     If 'blogPhotoPreview' variable in store is false, close this modal. -->
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />

    <!--  To show the loading animation while the post is being updated to Firebase database -->
    <Loading v-show="loading" />

    <div class="container">
      <h2>Create Blog</h2>
      <div :class="{ invisible: !error }" class="err-message">
        <span v-html="errorMsg"></span>
      </div>
      <div class="blog-info">
        <p>
          Please fill up the fields below and add a cover photo for your blog
        </p>
        <div class="break"></div>
        <input type="text" placeholder="Enter blog title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input
            @change="fileChange"
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            accept=".png, .jpg, .jpeg"
          />
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
        <div class="break"></div>
        <div class="shortDescription">
          <textarea
            id="shortDesc"
            v-model="blogShortDesc"
            placeholder="Enter short description"
          />
        </div>
        <div class="break"></div>
        <div class="editor">
          <div id="standalone-container">
            <div id="toolbar-container">
              <span class="ql-formats">
                <div
                  class="fontTypeContainer"
                  v-tooltip.top-center="{
                    content: 'Font Type',
                    delay: { show: 0, hide: 0 },
                  }"
                >
                  <select class="ql-font">
                    <option selected value="roboto">Roboto</option>
                    <option value="arial">Arial</option>
                    <option value="verdana">Verdana</option>
                    <option value="sans-serif">Sans Serif</option>
                  </select>
                </div>
                <div
                  class="fontSizeContainer"
                  v-tooltip.top-center="{
                    content: 'Font Size',
                    delay: { show: 0, hide: 0 },
                  }"
                >
                  <select
                    class="ql-size"
                    v-tooltip.top-center="{
                      content: 'Font Size',
                      delay: { show: 0, hide: 0 },
                    }"
                  ></select>
                </div>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-bold"
                  v-tooltip.top-center="{
                    content: 'Bold',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-italic"
                  v-tooltip.top-center="{
                    content: 'Italic',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-underline"
                  v-tooltip.top-center="{
                    content: 'Underline',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-strike"
                  v-tooltip.top-center="{
                    content: 'Strikeout',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
              <span
                class="ql-formats"
                v-tooltip.top-center="{
                  content: 'Color',
                  delay: { show: 0, hide: 0 },
                }"
              >
                <select class="ql-color"></select>
                <select class="ql-background"></select>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-blockquote"
                  v-tooltip.top-center="{
                    content: 'Blockquote',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-code-block"
                  v-tooltip.top-center="{
                    content: 'HTML Edit Mode',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-link"
                  v-tooltip.top-center="{
                    content: 'Hyperlink',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-image"
                  v-tooltip.top-center="{
                    content: 'Upload Image',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-header"
                  value="1"
                  v-tooltip.top-center="{
                    content: 'H1 tag',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-header"
                  value="2"
                  v-tooltip.top-center="{
                    content: 'H2 tag',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-list"
                  value="ordered"
                  v-tooltip.top-center="{
                    content: 'Numbered List',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-list"
                  value="bullet"
                  v-tooltip.top-center="{
                    content: 'Bulleted List',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-indent"
                  value="-1"
                  v-tooltip.top-center="{
                    content: 'Right Indent',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-indent"
                  value="+1"
                  v-tooltip.top-center="{
                    content: 'Left Indent',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
              <span
                class="ql-formats"
                v-tooltip.top-center="{
                  content: 'Type Direction & Alignment',
                  delay: { show: 0, hide: 0 },
                }"
              >
                <button class="ql-direction" value="rtl"></button>
                <select class="ql-align"></select>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-script"
                  value="sub"
                  v-tooltip.top-center="{
                    content: 'Subscript',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-script"
                  value="super"
                  v-tooltip.top-center="{
                    content: 'Superscript',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
              <span class="ql-formats">
                <button
                  class="ql-clean"
                  v-tooltip.top-center="{
                    content: 'Clear Format',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
              </span>
            </div>
          </div>
          <!--   Use '@image-added' to call a function when the user choose the image icon to upload image in the text editor -->
          <vue-editor
            :editorOptions="editorSettings"
            :editor-toolbar="customToolbar"
            v-model="blogHTML"
            useCustomImageHandler
            @image-added="imageHandler"
            placeholder="Enter content"
          />
        </div>
        <div class="break"></div>
        <div class="blog-actions">
          <button
            class="standardBtn"
            :class="{ 'button-inactive': !formReady }"
            @click="uploadBlog"
          >
            Publish Blog
          </button>
          <router-link
            class="router-button"
            :class="{
              'button-inactive': !formReady,
            }"
            :to="{ name: 'BlogPreview', params: { blogid: '0' } }"
            @click.native="addTempDate"
            >Post Preview</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VTooltip from "v-tooltip"
Vue.use(VTooltip)

import LoadImageToCanvas from "../mixins/loadImageToCanvas"
import ChangeUploadedFileName from "../mixins/changeUploadedFileName"

import BlogCoverPreview from "../components/BlogCoverPreview"
import firebase from "firebase/app"

//to allow to use of upload and download images from firebase
import "firebase/storage"

//to allow to use of firebase database
import db from "../firebase/firebaseInit"

import Loading from "../components/Loading"

//import Quill files to the project
import Quill from "quill"

/*
This is a fix for module 'ImageResize' being not working with Quill when registered below.
Putting these two lines will solve the problem.
This is explained in
https://github.com/kensnyder/quill-image-resize-module/issues/7
under 'shady-xia commented on Dec 28, 2020'
*/
window.Quill = Quill
const ImageResize = require("quill-image-resize-module").default

/* var toolbarOptions = [
  {
    bold: {
      attributes: {
        "data-toggle": "tooltip",
        "data-placement": "bottom",
        title: "Bold",
      },
    },
  },
  "italic",
  "underline",
  "strike",
] */

/* to register either a module, theme or format in Quill.
In this case the module 'imageResize' is registered. */
Quill.register("modules/imageResize", ImageResize)

// Add fonts to whitelist
let Font = Quill.import("formats/font")
// We do not add Sans Serif since it is the default
Font.whitelist = ["roboto", "verdana", "arial", "sans-serif"]
Quill.register(Font, true)

export default {
  name: "CreatePost",
  components: { BlogCoverPreview, Loading },
  mixins: [LoadImageToCanvas, ChangeUploadedFileName],
  data() {
    return {
      msg: "This is a button.",
      formReady: null,
      file: null,
      error: null,
      errorMsg: null,
      errorMsgArray: [],
      loading: null,
      leavingPage: false,
      editorSettings: {
        formats: {
          Font: true,
        },
        modules: {
          imageResize: {},
          toolbar: "#toolbar-container",
        },
      },
      customToolbar: [
        [{ font: ["mirza", "roboto"] }],

        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["link", "image", "video"],
        ["clean"], // remove formatting button
      ],
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from) {
        vm.prevRoute = from

        if (vm.prevRoute.name != "BlogPreview") {
          let obj = {
            currentBlogReady: false,
            tempBlogReady: false,
            coverImageTempFileObject: null,
            blogTitle: "",
            blogShortDesc: "",
            blogHTML: "",
            blogPhotoFileURL: "",
            blogPhotoFileThumbnailURL: "",
            blogPhotoName: "",
            blogDate: "",
          }
          vm.$store.commit("updateState", obj)
        }
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to) {
      if (to.name != "BlogPreview") {
        this.leavingPage = true
        let obj = {
          currentBlogReady: false,
          tempBlogReady: false,
          coverImageTempFileObject: null,
          blogTitle: "",
          blogShortDesc: "",
          blogHTML: "",
          blogPhotoFileURL: "",
          blogPhotoFileThumbnailURL: "",
          blogPhotoName: "",
          blogDate: "",
        }
        //'this' can be use for 'beforeRouteLeave' because the page is already loaded.
        this.$store.commit("updateState", obj)

        sessionStorage.clear()
      }
      next()
    }
  },
  created() {},
  async mounted() {
    if (this.file) {
      await this.fileChange()
    } else if (sessionStorage.getItem("coverImageTempFileObject")) {
      this.loadImageFromBase64String(
        sessionStorage.getItem("coverImageTempFileObject")
      )
    }

    this.checkFormReady()

    if (JSON.parse(sessionStorage.getItem("tempBlogReady"))) {
      let obj = {
        currentBlogReady: null,
        tempBlogReady: JSON.parse(sessionStorage.getItem("tempBlogReady")),
        blogTitle: sessionStorage.getItem("blogTitle"),
        blogShortDesc: sessionStorage.getItem("blogShortDesc"),
        blogHTML: sessionStorage.getItem("blogHTML"),
        blogPhotoFileURL: sessionStorage.getItem("blogPhotoFileURL"),
        blogPhotoFileThumbnailURL: null,
        coverImageTempFileObject: sessionStorage.getItem(
          "coverImageTempFileObject"
        ),
        blogPhotoName: sessionStorage.getItem("blogPhotoName"),
        blogDate: sessionStorage.getItem("blogDate"),
      }

      this.$store.commit("updateState", obj)

      //reassign values to 'blogTitle', 'blogShortDesc' and 'blogHTML' to trigger the error checking function in Computed everytime when the page reloaded.
      this.blogTitle = this.$store.state.blogTitle
      this.blogShortDesc = this.$store.state.blogShortDesc
      this.blogHTML = this.$store.state.blogHTML
    } else {
      let obj2 = {
        blogTitle: sessionStorage.getItem("blogTitle"),
        blogShortDesc: sessionStorage.getItem("blogShortDesc"),
        blogHTML: sessionStorage.getItem("blogHTML"),
      }
      this.$store.commit("updateState", obj2)
    }
  },
  methods: {
    fileChange() {
      /*'this.file' is the 'file' variable from data(). This variable will be assigned to the 'blogPhoto' uploaded first file object because of the files[0].
      Use '$refs' to reference to any element in the html in the template. */
      //#anchorFile
      //check to see if there is a file from file upload input element as this take priority, if yes load the file to 'this.file'. If not, 'this.file' should already has a value loaded from 'mounted'.
      if (this.$refs.blogPhoto.files[0]) {
        this.file = this.$refs.blogPhoto.files[0]
        /*  URL.createObjectURL() is used for converted input type file or blob to URL.
      This will create an URL location for the upload file.
      Below code is to enable the image preview button once 'blogPhotoFileURL' variable in store has a value.
      */
      }

      //Convert 'this.file' to temporary blob URL and save it to store variable 'blogPhotoFileURL'
      let obj1 = { blogPhotoFileURL: URL.createObjectURL(this.file) }
      this.$store.commit("updateState", obj1)

      //Save the value to local storage
      sessionStorage.setItem(
        "blogPhotoFileURL",
        this.$store.state.blogPhotoFileURL
      )

      //assign a temporary variable 'fileName' and assigned it to file object name (string) by using '.name'
      const fileName = this.file.name

      /*     To update the variable 'blogPhotoName' in store so that it will be reflected in 'File Chosen' span element.
      Always use 'commit' then targeting a function in 'mutation' in store. */
      let obj2 = { blogPhotoName: fileName }
      this.$store.commit("updateState", obj2)

      sessionStorage.setItem("blogPhotoName", this.$store.state.blogPhotoName)

      this.imageLoadToCanvas(this.file)

      this.checkFormReady()
    },
    openPreview() {
      //To change the value of variable 'blogPhotoPreview' in store to the opposite of current value whenever the preview button is clicked. The modal for the preview button (BlogCoverPreview.vue) will also have this function.
      this.$store.commit("openPhotoPreview")
    },
    //imageHandler(file object, editor object, index number of the current cursor location in the textarea, resetUploader)
    imageHandler(file, Editor, cursorLocation, resetUploader) {
      //show preloader
      this.loading = true

      //this is a pointer to the root location of the images
      const storageRef = firebase.storage().ref()

      /*
      To access the folder in the root location, use '.child' and give the name of the folder name (in this case documents).
      If the folder or file do not exist, firebase will automatically create it.
      /To upload image to firebase, first will need to create a full path to the location of the image, INCLUDING the file name even though the file is not exist yet.
      E.g. documents/blogPostPhotos/testImage.jpg
      */
      //use '.name' to acces the name of the file object
      const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`)

      //use '.put' to put the file into firebase storage
      //use '.on("state_changed") to track the progress of the file upload
      //'snapshot' is
      docRef.put(file).on(
        "state_changed",
        //'snapshot' is a object to track the in progress of the file upload from starting until before completion.
        (snapshot) => {
          console.log(snapshot)
        },
        // this is triggered if there is an error with the upload
        (err) => {
          console.log(err)
        },
        // this is triggered if the upload is completed
        async () => {
          // get the full url of the uploaded image bu using '.getDownloadURL'
          const downloadURL = await docRef.getDownloadURL()

          //insertEmbed(cursor location, type of 'image', the URL source of the image)
          Editor.insertEmbed(cursorLocation, "image", downloadURL)
          //use together with 'insertEmbed'
          resetUploader()

          //hide preloader
          this.loading = false
        }
      )
    },
    async uploadBlog() {
      let thisPointer = this

      //if title and textarea are filled, then pass the condition
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        //'this.file' is the cover photo. If uploaded, then pass the condition
        if (this.file) {
          //start loading animation
          this.loading = true

          // reference to 'this'
          const thisContextPointer = this

          //point to the collection 'blogPosts' with an auto generated document by firebase.
          //Need to put this early in the code so that we can use 'dataBAse.id' to create blog Id folder in the storage.
          const dataBase = await db.collection("blogPosts").doc()

          //first half of the reference to the firebase storage
          const storageRef = firebase.storage().ref()
          /* concatenate the reference with 'child(...) to point to the image location with image name after loading complete.
          In this case it will be something like example 'documents/BlogCoverPhotos/blogPhoto.jpg'. */
          const docRef = storageRef.child(
            `documents/BlogCoverPhotos/${dataBase.id}/${this.$store.state.blogPhotoName}`
          )

          //this.file is the file objected assigned at #anchorFile.
          //execute the task to put the cover image in firebase storarge.
          await docRef.put(this.file).on(
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
              //'docRef' = documents/BlogCoverPhotos/blogPhoto.jpg
              /*  Hence docRef.getDownloadURL() is to get the full URL of the cover image.
              NOTE: '.getDownloadURL' is a firebase method. */
              const downloadURL = await docRef.getDownloadURL()

              var canvas = document.getElementById("imageCanvas")

              canvas.toBlob(async function(blob) {
                const docRefThumbnail = await storageRef.child(
                  `documents/BlogCoverPhotos_Thumbnail/${dataBase.id}/${thisContextPointer.$store.state.blogPhotoName}`
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
                    const thumbnailDownloadURL = await docRefThumbnail.getDownloadURL()

                    //define this post is created now
                    const timestamp = await Date.now()

                    // Get a new write batch
                    var batch = db.batch()

                    let blogData
                    let galleryData

                    //set the data to the auto generated document
                    //'.set' will replace everything in the record with whatever specified below.
                    ///use '.update' if want to only update a certain fields in a record.

                    batch.set(dataBase, {
                      blogID: dataBase.id,
                      blogHTML: thisContextPointer.blogHTML,
                      blogCoverPhoto: downloadURL,
                      blogCoverPhotoThumbnail: thumbnailDownloadURL,
                      blogCoverPhotoName: thisContextPointer.blogCoverPhotoName,
                      blogTitle: thisContextPointer.blogTitle,
                      blogShortDescription: thisContextPointer.blogShortDesc,
                      profileId: thisContextPointer.profileId,
                      date: timestamp,
                    })

                    blogData = {
                      blogID: dataBase.id,
                      blogHTML: thisContextPointer.blogHTML,
                      blogCoverPhoto: downloadURL,
                      blogCoverPhotoThumb: thumbnailDownloadURL,
                      blogTitle: thisContextPointer.blogTitle,
                      blogShortDesc: thisContextPointer.blogShortDesc,
                      blogDate: timestamp,
                      blogCoverPhotoName: thisContextPointer.blogCoverPhotoName,
                      profileId: thisContextPointer.profileId,
                    }

                    let tempArray

                    await db
                      .collection("users")
                      .doc(thisContextPointer.profileId)
                      .get()
                      .then(async (userDoc) => {
                        const galleryDataBase = await db
                          .collection("gallery")
                          .doc()

                        batch.set(
                          //get the id of the document in gallery collection with the matched blog id
                          galleryDataBase,
                          {
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoThumbnail: thumbnailDownloadURL,
                            blogCoverPhotoName:
                              thisContextPointer.blogCoverPhotoName,
                            blogID: dataBase.id,
                            blogTitle: thisContextPointer.blogTitle,
                            blogShortDescription:
                              thisContextPointer.blogShortDesc,
                            userName: userDoc.data().userName,
                          }
                        )

                        galleryData = {
                          photoId: galleryDataBase.id,
                          blogId: dataBase.id,
                          photoTitle: thisContextPointer.blogTitle,
                          photoURL: downloadURL,
                          thumbPhotoURL: thumbnailDownloadURL,
                          photoName: thisContextPointer.blogCoverPhotoName,
                          photoShortDesc: thisContextPointer.blogShortDesc,
                          photoCreator: userDoc.data().userName,
                        }
                        //add all the latest records to state.blogPosts

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

                                batch.update(galleryOrderDocument, {
                                  order: firebase.firestore.FieldValue.delete(),
                                })

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
                      })

                    // Commit the batch
                    batch.commit().then(() => {
                      thisPointer.$store.commit(
                        "updateGalleryOrderState",
                        tempArray
                      )

                      thisPointer.$store.commit("addArrayState", {
                        blogPosts: "blogPosts",
                        blogData: blogData,
                      })

                      thisPointer.$store.commit("addArrayState", {
                        galleryPhotos: "galleryPhotos",
                        galleryData: galleryData,
                      })

                      //redirect to ViewBlog once the data update to firebase is completed
                      thisContextPointer.$router.push({
                        name: "ViewBlog",
                        params: { blogid: dataBase.id },
                      })
                    })
                  }
                )
              })
            }
          )
        }
      }

      return
    },

    addErrorMessage(payload) {
      this.error = true
      if (!this.errorMsgArray.includes(payload)) {
        this.errorMsgArray.push(payload)

        let errorDesc = ""

        for (const element in this.errorMsgArray) {
          errorDesc = errorDesc + this.errorMsgArray[element] + "<br/>"
        }

        this.errorMsg = errorDesc
      }
    },
    removeErrorMessage(payload) {
      const index = this.errorMsgArray.indexOf(payload)
      if (index > -1) {
        this.errorMsgArray.splice(index, 1)

        if (this.errorMsgArray.length > 0) {
          let errorDesc = ""

          for (const element in this.errorMsgArray) {
            errorDesc = errorDesc + this.errorMsgArray[element] + "<br/>"
          }

          this.errorMsg = errorDesc
        } else {
          this.error = false
          this.errorMsg = ""
        }
      }
    },
    checkFormReady() {
      if (
        this.blogTitle &&
        this.blogTitle.length !== 0 &&
        this.blogShortDesc &&
        this.blogShortDesc.length !== 0 &&
        this.blogHTML &&
        this.blogHTML.length !== 0 &&
        this.file !== null
      ) {
        this.formReady = true
        sessionStorage.setItem("tempBlogReady", "true")
      } else {
        this.formReady = false
      }
    },
    async addTempDate() {
      this.$store.state.blogDate = await Date.now()
      sessionStorage.setItem("blogDate", this.$store.state.blogDate)
    },
  },
  computed: {
    /* function 'blogtitle' is used to create two way binding between input box element and the store.
    'blogtitle' will need to be put in 'computed' for this kind of two way binding to work. */
    blogTitle: {
      get() {
        //get the value of 'blogTitle' from store.
        //'blogTitle' is a string value.

        return this.$store.state.blogTitle
      },
      set(payload) {
        /*  'payload' is the 'value' of the input element, hence it is a string.
        Update the value of payload in store. */
        if (!payload) {
          this.addErrorMessage("Please enter blog title")
        } else {
          this.removeErrorMessage("Please enter blog title")
        }

        let obj = { blogTitle: payload }
        this.$store.commit("updateState", obj)
        this.checkFormReady()

        sessionStorage.setItem("blogTitle", payload)
      },
    },
    blogShortDesc: {
      get() {
        //get the value of 'blogShortDesc' from store.
        //'blogShortDesc' is a string value.
        return this.$store.state.blogShortDesc
      },
      set(payload) {
        /*  'payload' is the 'value' of the input element, hence it is a string.
        Update the value of payload in store. */
        if (!payload) {
          this.addErrorMessage("Please enter short description")
        } else {
          this.removeErrorMessage("Please enter short description")
        }

        let obj = { blogShortDesc: payload }
        this.$store.commit("updateState", obj)
        this.checkFormReady()

        sessionStorage.setItem("blogShortDesc", payload)
      },
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML
      },
      set(payload) {
        if (!payload) {
          this.addErrorMessage("Please enter blog content")
        } else {
          this.removeErrorMessage("Please enter blog content")
        }

        //to fix a weird bug that 'blogHTML' variable for session storage still exist after page navigated away.
        //'this.leavingPage' set from 'beforeRouteLeave' will determine whether to write the 'blogHTML' to session storage.
        if (!this.leavingPage) {
          /*  'payload' is the 'value' of the textarea element, in this case it is a html string. */
          let obj = { blogHTML: payload }
          this.$store.commit("updateState", obj)
          this.checkFormReady()

          sessionStorage.setItem("blogHTML", payload)
        }
      },
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName
    },
    profileId() {
      return this.$store.state.profileId
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  & > h2 {
    margin-bottom: 40px !important;
  }

  .blog-info {
    & > p {
      flex: 1;
      margin: 0;
      color: $buttonColor1;
    }
  }
}
</style>
