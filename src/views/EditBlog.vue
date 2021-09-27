<template>
  <div class="create-post">
    <!-- 'BlogCoverPreview' component is used to show the user cover photo once it uploaded.
     If 'blogPhotoPreview' variable in store is false, close this modal. -->
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />

    <!--  To show the loading animation while the post is being updated to Firebase database -->
    <Loading v-show="loading" />
    <div class="container">
      <h2>Edit Blog</h2>
      <div :class="{ invisible: !error }" class="err-message">
        <span v-html="errorMsg"></span>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <!--  'label' act as the button for file 'input' by using 'for'. That why we can hide the file 'input' using css. -->
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
            Preview Cover Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
        <div class="break"></div>
        <div class="shortDescription">
          <textarea
            id="shortDesc"
            v-model="blogShortDesc"
            placeholder="Short Description"
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
                    content: 'Indent To The Left',
                    delay: { show: 0, hide: 0 },
                  }"
                ></button>
                <button
                  class="ql-indent"
                  value="+1"
                  v-tooltip.top-center="{
                    content: 'Indent To The Right',
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
            v-model="blogHTML"
            useCustomImageHandler
            @image-added="imageHandler"
            placeholder="Content"
          />
        </div>
        <div class="break"></div>
        <div class="blog-actions">
          <button
            class="standardBtn"
            :class="{ 'button-inactive': this.errorMsg }"
            @click="updateBlog"
          >
            Publish Changes
          </button>
          <router-link
            class="router-button"
            :class="{ 'button-inactive': this.errorMsg }"
            :to="{ name: 'BlogPreview', params: { blogid: this.routeID } }"
            >Preview Changes</router-link
          >
          <button
            class="standardBtn"
            :class="{ 'button-inactive': this.errorMsg }"
            @click="deleteBlog"
          >
            Delete Blog
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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

//import Quill core css. Must put before any theme css.
import "quill/dist/quill.core.css"

//import Quill snow theme css
import "quill/dist/quill.snow.css"

/*
This is a fix for module 'ImageResize' being not working with Quill when registered below.
Putting these two lines will solve the problem.
This is explained in
https://github.com/kensnyder/quill-image-resize-module/issues/7
under 'shady-xia commented on Dec 28, 2020'
*/
window.Quill = Quill
const ImageResize = require("quill-image-resize-module").default

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
      //the file object for the big cover image
      file: null,
      error: null,
      errorMsg: null,
      errorMsgArray: [],
      loading: null,
      routeID: null,
      currentBlog: null,
      leavingPage: false,
      editorSettings: {
        //use the snow theme
        theme: "snow",
        modules: {
          imageResize: {},
          toolbar: "#toolbar-container",
        },
      },
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from) {
        //in here vm is refering to 'this'. Inside 'beforeRouterEnter' we cannot use 'this' but we can use vm.
        vm.prevRoute = from

        if (vm.prevRoute.name != "BlogPreview") {
          let obj = {
            coverImageTempFileObject: null,
            currentBlogReady: false,
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
          coverImageTempFileObject: null,
          currentBlogReady: false,
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

  methods: {
    async loadFromDatabase() {
      //'.filter' return AN ARRAY of elements (and NOT object) that passed the condition given
      //'this.currentBlog' assigned route ID if the route ID exists in state.blogPost
      //Hence this.currentBlog = [{"blogID":"rJHBiMp0Gvr0uDwELqOh","blogHTML":"<p>woi</p>",...}]
      //Take note of the [] bracket. To access the values in this array, we have to use the form this.currentBlog[0]
      this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
        //return the 'post' object that has 'blogID' matched with 'routeID'
        return post.blogID === this.routeID
      })

      //call 'setBlogState' to assign values to variables in #anchorPostVariable in store. These variables store the current blog that is being created or edited.
      /*  Take note that we have to pass in as this.currentBlog[0] as this will extract out the object from the array and pass the object into "setBlogState" store function. */

      let obj = {
        currentBlogReady: true,
        blogTitle: this.currentBlog[0].blogTitle,
        blogShortDesc: this.currentBlog[0].blogShortDesc,
        blogHTML: this.currentBlog[0].blogHTML,
        blogPhotoFileURL: this.currentBlog[0].blogCoverPhoto,
        blogPhotoFileThumbnailURL: this.currentBlog[0].blogCoverPhotoThumb,
        blogPhotoName: this.currentBlog[0].blogCoverPhotoName,
        blogDate: this.currentBlog[0].blogDate,
      }
      this.$store.commit("updateState", obj)

      sessionStorage.setItem("currentBlogReady", "true")
      sessionStorage.setItem("blogTitle", this.currentBlog[0].blogTitle)
      sessionStorage.setItem("blogShortDesc", this.currentBlog[0].blogShortDesc)
      sessionStorage.setItem("blogHTML", this.currentBlog[0].blogHTML)
      sessionStorage.setItem(
        "blogPhotoFileURL",
        this.currentBlog[0].blogCoverPhoto
      )
      sessionStorage.setItem(
        "blogPhotoFileThumbnailURL",
        this.currentBlog[0].blogCoverPhotoThumb
      )
      sessionStorage.setItem(
        "blogPhotoName",
        this.currentBlog[0].blogCoverPhotoName
      )
      sessionStorage.setItem("blogDate", this.currentBlog[0].blogDate)

      const thumbnailStorageRef = firebase.storage().ref()

      const docRef = thumbnailStorageRef.child(
        `documents/BlogCoverPhotos_Thumbnail/${this.$store.state.blogPhotoName}`
      )

      docRef
        .getDownloadURL()
        .then((url) => {
          // This can be downloaded directly:
          const xhr = new XMLHttpRequest()
          xhr.responseType = "blob"
          xhr.onload = () => {
            const blob = xhr.response

            const file1 = new File([blob], this.$store.state.blogPhotoName, {
              type: blob.type,
            })
            this.imageLoadToCanvas(file1)
          }
          xhr.open("GET", url)
          xhr.send()
        })
        .catch((error) => {
          console.log(error)
        })

      const mainImageStorageRef = firebase.storage().ref()

      const docRef2 = mainImageStorageRef.child(
        `documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`
      )

      docRef2
        .getDownloadURL()
        .then((url) => {
          // This can be downloaded directly:
          const xhr = new XMLHttpRequest()
          xhr.responseType = "blob"
          xhr.onload = () => {
            const blob = xhr.response

            const file2 = new File([blob], this.$store.state.blogPhotoName, {
              type: blob.type,
            })
            this.file = file2
          }
          xhr.open("GET", url)
          xhr.send()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    loadImageFromBase64String(payload) {
      var canvas = document.getElementById("imageCanvas")
      var ctx = canvas.getContext("2d")

      var img = new Image()

      img.onload = function() {
        canvas.width = 400
        canvas.height = (img.height * canvas.width) / img.width
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      img.src = payload

      //return a promise that resolves with a File instance

      let base64Image = payload

      let obj = { blogPhotoFileURL: base64Image }
      this.$store.commit("updateState", obj)

      let thisPointer = this

      //Usage example:
      this.urltoFile(
        payload,
        sessionStorage.getItem("blogPhotoName"),
        base64Image.substring(
          "data:image/".length,
          base64Image.indexOf(";base64")
        )
      ).then(function(file) {
        thisPointer.file = file

        thisPointer.fileChange()
      })
    },

    fileChange() {
      /*'this.file' is the 'file' variable from data(). This variable will be assigned to the 'blogPhoto' uploaded first file object because of the files[0].
      Use '$refs' to reference to any element in the html in the template. */
      //#anchorFile

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
      let obj = { blogPhotoName: fileName }
      this.$store.commit("updateState", obj)

      sessionStorage.setItem("blogPhotoName", fileName)

      /*  URL.createObjectURL() is mostly used for input type file.
      This will create an URL location for the upload file.
      Below code is to enable the image preview button once 'blogPhotoFileURL' variable in store has a value.
      */
      let obj2 = { blogPhotoFileURL: URL.createObjectURL(this.file) }
      this.$store.commit("updateState", obj2)

      sessionStorage.setItem("blogPhotoFileURL", URL.createObjectURL(this.file))

      this.imageLoadToCanvas(this.file)
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

      const fileName = this.changeUploadedFileName(file.name)

      /*
      To access the folder in the root location, use '.child' and give the name of the folder name (in this case documents).
      If the folder or file do not exist, firebase will automatically create it.
      /To upload image to firebase, first will need to create a full path to the location of the image, INCLUDING the file name even though the file is not exist yet.
      E.g. documents/blogPostPhotos/testImage.jpg
      */
      //use '.name' to acces the name of the file object
      const docRef = storageRef.child(`documents/blogPostPhotos/${fileName}`)

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
          // get the full url of the uploaded image bu ysing '.getDownloadURL'
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
    async updateBlog() {
      //reference to the firebase document 'blogPosts' of property id based on routeID from #anchorID
      //#anchorDataBase
      const dataBase = await db.collection("blogPosts").doc(this.routeID)

      //reference to the firebase document 'gallery'
      const galleryDataBase = await db.collection("gallery")

      // Search for the blog id reference based on routeID using 'where'. Note that blog id in this collection is unique too.
      const galleryDataBaseFiltered = await galleryDataBase.where(
        "blogID",
        "==",
        this.routeID
      )

      //if title and textarea are filled, then pass the condition
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        //'this.file' is the cover photo. If a new photo is uploaded, then pass the condition.

        if (this.file) {
          //start loading animation
          this.loading = true

          const thisContextPointer = this

          // Use write batch to update a few firestore collection at one go
          var batch = db.batch()

          let blogData
          let galleryData

          //first half of the reference to the firebase storage
          const storageRef = firebase.storage().ref()
          /* concatenate the reference with 'child(...) to point to the image location with image name after loading complete.
          In this case it will be something like example 'documents/BlogCoverPhotos/blogPhoto.jpg'. */
          const docRef = storageRef.child(
            `documents/BlogCoverPhotos/${dataBase.id}/${this.$store.state.blogPhotoName}`
          )

          //this.file is the file objected assigned at #anchorFile.
          //execute the task to put the cover image in firebase storarge.
          docRef.put(this.file).on(
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

              var storePointer = this.$store.state.blogPhotoName

              canvas.toBlob(async function(blob) {
                const docRefThumbnail = await storageRef.child(
                  `documents/BlogCoverPhotos_Thumbnail/${dataBase.id}/${storePointer}`
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

                    //update the data document in firebase as refered by 'dataBase' in #anchorDataBase
                    //NOTE: '.set' will replace everything the document with whatever specified below.
                    ///use '.update' if want to only update a new record.
                    batch.update(dataBase, {
                      blogHTML: thisContextPointer.blogHTML,
                      blogCoverPhoto: downloadURL,
                      blogCoverPhotoThumbnail: thumbnailDownloadURL,
                      blogCoverPhotoName: thisContextPointer.blogCoverPhotoName,
                      blogTitle: thisContextPointer.blogTitle,
                      blogShortDescription: thisContextPointer.blogShortDesc,
                    })

                    blogData = {
                      blogHTML: thisContextPointer.blogHTML,
                      blogCoverPhoto: downloadURL,
                      blogCoverPhotoThumb: thumbnailDownloadURL,
                      blogTitle: thisContextPointer.blogTitle,
                      blogShortDesc: thisContextPointer.blogShortDesc,
                      blogCoverPhotoName: thisContextPointer.blogCoverPhotoName,
                    }

                    //update the updated data in 'blogPosts' collection to 'gallery' collection
                    await galleryDataBaseFiltered
                      .get()
                      .then(async (querySnapshot) => {
                        batch.update(
                          //get the id of the document in gallery collection with the matched blog id.
                          //'galleryDataBase' is pointing to the document that has the currently used 'blogID'.
                          //'querySnapshot.docs[0].id' will give the current document id (the name of the document).
                          galleryDataBase.doc(await querySnapshot.docs[0].id),
                          {
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoThumbnail: thumbnailDownloadURL,
                            blogCoverPhotoName:
                              thisContextPointer.blogCoverPhotoName,
                            blogTitle: thisContextPointer.blogTitle,
                            blogShortDescription:
                              thisContextPointer.blogShortDesc,
                          }
                        )

                        galleryData = {
                          photoURL: downloadURL,
                          thumbPhotoURL: thumbnailDownloadURL,
                          photoName: thisContextPointer.blogCoverPhotoName,
                          photoTitle: thisContextPointer.blogTitle,
                          photoShortDesc: thisContextPointer.blogShortDesc,
                        }

                        // Commit the batch
                        batch.commit().then(() => {
                          let payload = {
                            currentBlogReady: "",
                            blogTitle: "",
                            blogShortDesc: "",
                            blogHTML: "",
                            blogPhotoFileURL: "",
                            blogPhotoFileThumbnailURL: "",
                            blogPhotoName: "",
                            blogDate: "",
                          }
                          thisContextPointer.$store.commit(
                            "updateState",
                            payload
                          )

                          sessionStorage.clear()
                        })

                        /* we need to call 'updatePost' action in store to update the latest blog data changes in firestore to 'blogPosts' object in store.
                        'routeID' is to specify which blog to update in store's 'blogPosts'.
Await is used to make sure 'blogPosts' object in store is completely ready first before run the router redirect.
*/
                        /*  await thisContextPointer.$store.dispatch(
                          "updatePost",
                          thisContextPointer.routeID
                        ) */

                        thisContextPointer.$store.commit("updateArrayState", {
                          array: "blogPosts",
                          property: "blogID",
                          searchedValue: dataBase.id,
                          object: blogData,
                        })

                        thisContextPointer.$store.commit("updateArrayState", {
                          array: "galleryPhotos",
                          property: "photoId",
                          searchedValue: querySnapshot.docs[0].id,
                          object: galleryData,
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
          return
        }

        this.loading = true

        //update the title and textarea values to Firebase database
        await dataBase.update({
          blogHTML: this.blogHTML,
          blogTitle: this.blogTitle,
          blogShortDescription: this.blogShortDesc,
        })

        //run the 'updatePost' function in store.
        /*   'updatePost' will delete the post with id 'this.routeID' (which from the URL parameter) in state.blogPosts in store.
        Then it will grab any new post from Firebase 'blogPosts' document and update to state.blogPosts. */
        await this.$store.dispatch("updatePost", this.routeID)

        //stop the loading animation once the update work is done
        this.loading = false

        //redirect to 'ViewBlog.vue'
        this.$router.push({ name: "ViewBlog", params: { blogid: dataBase.id } })
      }

      this.error = true
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!"

      setTimeout(() => {
        this.error = false
      }, 5000)
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
    async deleteBlog() {
      //show loading icon
      this.loading = true
      await this.$store.dispatch("deletePost", this.routeID)

      this.loading = false

      this.$router.push({
        name: "Blogs",
      })
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
        if (!payload) {
          this.addErrorMessage("Please enter short description")
        } else {
          this.removeErrorMessage("Please enter short description")
        }

        /*  'payload' is the 'value' of the input element, hence it is a string.
        Update the value of payload in store. */
        let obj = { blogShortDesc: payload }
        this.$store.commit("updateState", obj)

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

        if (!this.leavingPage) {
          /*  'payload' is the 'value' of the textarea element, in this case it is a html string. */
          let obj = { blogHTML: payload }
          this.$store.commit("updateState", obj)

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
  async mounted() {
    //#anchorID
    this.routeID = this.$route.params.blogid

    //to check if the current blog information is ready to use, if not, load the data to the current blog variables (#anchorPostVariable) in store.
    if (!this.$store.state.currentBlogReady) {
      if (JSON.parse(sessionStorage.getItem("currentBlogReady"))) {
        this.loadImageFromBase64String(
          sessionStorage.getItem("coverImageTempFileObject")
        )

        let obj2 = {
          currentBlogReady: JSON.parse(
            sessionStorage.getItem("currentBlogReady")
          ),
          blogTitle: sessionStorage.getItem("blogTitle"),
          blogShortDesc: sessionStorage.getItem("blogShortDesc"),
          blogHTML: sessionStorage.getItem("blogHTML"),
          blogPhotoFileURL: sessionStorage.getItem("blogPhotoFileURL"),
          blogPhotoFileThumbnailURL: sessionStorage.getItem(
            "blogPhotoFileThumbnailURL"
          ),
          coverImageTempFileObject: sessionStorage.getItem(
            "coverImageTempFileObject"
          ),
          blogPhotoName: sessionStorage.getItem("blogPhotoName"),
          blogDate: sessionStorage.getItem("blogDate"),
        }

        this.$store.commit("updateState", obj2)

        //reassign values to 'blogTitle', 'blogShortDesc' and 'blogHTML' to trigger the error checking function in Computed everytime when the page reloaded.
        this.blogTitle = this.$store.state.blogTitle
        this.blogShortDesc = this.$store.state.blogShortDesc
        this.blogHTML = this.$store.state.blogHTML
      } else {
        this.loadFromDatabase()
      }
    } else {
      this.loadImageFromBase64String(this.$store.state.coverImageTempFileObject)
    }
  },
}
</script>

<style lang="scss">
/* when Quill is used, CSS has to be global and not scope because it will prevent Quill class from being modified */

.create-post {
  position: relative;
  height: 100%;

  .blog-info {
    label,
    .preview,
    .standardBtn,
    .router-button {
      @include formButton;
    }
  }

  #shortDesc {
    width: 100%;
    resize: none;
    height: 80px;
    background: #d9d8de;
    border: none;
    border-radius: 5px;
    @include inputFieldPadding;

    &:focus {
      outline: none !important;
      border: 1px solid $buttonColor1;
    }
  }

  #shortDesc::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: $inputColor2;
  }
  #shortDesc:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: $inputColor2;
  }
  #shortDesc::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: $inputColor2;
  }
  #shortDesc:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: $inputColor2;
  }

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: white;
  }

  .container {
    position: relative;
    height: 100%;
    padding: 50px 20px;

    & > h2 {
      @include pageTitle;
      margin-bottom: 10px;
    }
  }

  //error styling
  .invisible {
    visibility: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 0 !important;

    span {
      opacity: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 0 !important;
    }
  }

  .err-message {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: white;
    background-color: $errorColor1;
    opacity: 1;
    transition: 0.5s ease all;

    span {
      transition: 0.5s ease all;
      transition-delay: 0.3s;
      @include fluid-type($viewThreshold1, $viewThreshold2, 13px, 16px);
      font-weight: bold;
      opacity: 1;
    }
  }

  .blog-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      flex: 3;
      line-height: 0px;
      height: 40px;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid $inputColor3;

      &:focus {
        outline: none !important;
        border-bottom: 1px solid $buttonColor1;
      }
    }

    .upload-file {
      flex: 3;
      display: flex;
      margin: 20px 0;

      /* <-----Upload Cover Photo Button-----> */
      label {
        flex: 1;
        align-self: stretch;
        @include fluid-type(
          $viewThreshold1,
          $viewThreshold2,
          $buttonTextSizeMin,
          $buttonTextSizeMax
        );
        text-align: center;
        margin: 0 8px 0 16px;
      }

      input {
        display: none;
      }
      /* <-----Upload Cover Photo Button-----> */

      /* <-----Preview Cover Photo Button-----> */
      .preview {
        flex: 1;
        align-self: stretch;
        margin: 0 8px 0 8px;
        text-transform: initial;
        @include fluid-type(
          $viewThreshold1,
          $viewThreshold2,
          $buttonTextSizeMin,
          $buttonTextSizeMax
        );
      }

      /* </-----Preview Cover Photo Button-----> */

      /* <-----File name-----> */
      span {
        @include fluid-type(
          $viewThreshold1,
          $viewThreshold2,
          $buttonTextSizeMin,
          $buttonTextSizeMax
        );
        align-self: center;
        flex: 1;
        text-align: center;
      }
      /* </-----File name-----> */
    }

    .shortDescription {
      flex: 1;
    }

    //<-----Quill CSS----->
    .editor {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .quillWrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 250px;

        .ql-toolbar {
          border-radius: 5px 5px 0 0;
        }

        .ql-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          /*   to allow the textarea to scroll when user type in lengthy paragraph and goes over the limit */
          overflow: hidden;
          border-radius: 0 0 5px 5px;

          .ql-editor {
            @include inputFieldPadding;
            background: $inputColor1;

            &:before {
              font-style: normal;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              @include inputFieldPadding;
              color: $inputColor2;
            }

            &:focus {
              border: 1px solid $buttonColor1;
            }
          }
        }
      }
    }
    //<-----Quill CSS----->

    //<-----Bottom Button CSS----->
    .blog-actions {
      flex: 1;
      display: flex;
      margin-top: 25px;
      flex-wrap: wrap;

      & > button {
        margin-right: 16px;
        @include fluid-type(
          $viewThreshold1,
          $viewThreshold2,
          $buttonTextSizeMin,
          $buttonTextSizeMax
        );
        @media (max-width: 380px) {
          flex: 1;
          flex-basis: 100%;
          order: 3;
        }
      }

      a {
        text-align: center;
        margin-right: 16px;
        @include fluid-type(
          $viewThreshold1,
          $viewThreshold2,
          $buttonTextSizeMin,
          $buttonTextSizeMax
        );
        @media (max-width: 380px) {
          flex: 1;
          order: 1;
          margin-bottom: 16px;
        }
      }

      button:last-of-type {
        @media (max-width: 380px) {
          flex: 1;
          order: 2;
          margin-bottom: 16px;
        }
      }
    }
    //</-----Bottom Button CSS----->
  }

  .button-inactive {
    pointer-events: none;
    opacity: 0.6; /* Real browsers */
  }
}

//<-----Tooltip CSS----->
.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: $buttonColor2;
    color: white;
    border-radius: 5px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0 !important;
    height: 0 !important;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: $buttonColor2;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}
//</-----Tooltip CSS----->

//<-----Editor Toolbar CSS----->
.fontTypeContainer,
.fontSizeContainer {
  display: inline-block;
}

#toolbar-container {
  border-radius: 5px 5px 0 0;
}

#toolbar-container .ql-font span[data-label="Roboto"]::before {
  font-family: "Roboto";
}

#toolbar-container .ql-font span[data-label="Arial"]::before {
  font-family: "Arial";
}

#toolbar-container .ql-font span[data-label="Verdana"]::before {
  font-family: "Verdana";
}

#toolbar-container .ql-font span[data-label="sans-serif"]::before {
  font-family: "Sans Serif";
}

.ql-font-sans-serif {
  font-family: "sans-serif";
}

.ql-font-roboto {
  font-family: "Roboto";
}

.ql-font-verdana {
  font-family: "Verdana";
}

.ql-font-arial {
  font-family: "Arial";
}

#editor-container {
  height: 100px;
}
//</-----Editor Toolbar CSS----->
</style>
