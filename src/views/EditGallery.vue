<template>
  <div>
    <Loading v-show="loading" />
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <draggable v-model="requiredPhotoData" ghost-class="ghost" @end="onEnd">
        <!--  <draggable ghost-class="ghost" @end="onEnd"> -->
        <transition-group type="transition" name="flip-list">
          <div
            class="accordion-item"
            v-bind:key="item.photoId"
            v-for="item in requiredPhotoData"
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
                <input type="text" v-model="item.photoTitle" />
              </button>
            </h2>

            <div
              :id="`flush-collapse-${item.photoId}`"
              class="accordion-collapse collapse"
              :aria-labelledby="`flush-heading-${item.photoId}`"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <span><img :src="item.photoURL"/></span>
                <span>{{ item.photoName }}</span>

                <span>{{ item.photoCreator }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <!-- 
    <ul class="list-group gallery-list">
      <draggable v-model="photoDataSorted" ghost-class="ghost" @end="onEnd">
        <transition-group type="transition" name="flip-list">
          <li
            class="list-group-item sortable"
            v-bind:key="item.photoId"
            v-for="item in photoDataSorted"
          >
            <span>{{ item.photoId }}</span>

            <span><input type="text" v-model="item.photoTitle"/></span>

            <span>{{ item.photoURL }}</span>
            <span>{{ item.photoName }}</span>

            <span>{{ item.photoCreator }}</span>
          </li>
        </transition-group>
      </draggable>
      <p><strong>Previous Index:</strong>{{ oldIndex }}</p>
      <p><strong>new Index:</strong>{{ newIndex }}</p>
    </ul> -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
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
          <a class="page-link" @click="loadRecord(index)">{{ index }}</a>
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
      <ul class="page-number pagination">
        <li class="page-item">
          <a class="page-link" @click="changeRecordNumber(2)" aria-label="2">
            <span aria-hidden="true">2</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="changeRecordNumber(5)" aria-label="5">
            <span aria-hidden="true">5</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="changeRecordNumber(7)" aria-label="7">
            <span aria-hidden="true">7</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="collapse py-2" id="collapseTarget">
      This is the toggle-able content!
    </div>

    <p><strong>Previous Index:</strong>{{ oldIndex }}</p>
    <p><strong>new Index:</strong>{{ newIndex }}</p>
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

    <button @click="saveGallery">Save</button>
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

//import sortGallery from "../mixins/sortGalleryData"

export default {
  name: "EditGallery",
  components: { draggable, Loading },
  // mixins: [sortGallery],
  data() {
    return {
      oldIndex: "",
      testing: [{ test: 0 }, { test: 1 }],
      newIndex: "",
      galleryCurrentOrder: [],
      paginationStartIndex: 0,
      paginationRecordPerPage: 3,
      paginationCurrentPageNumber: 1,
      loading: null,
    }
  },
  destroyed() {
    console.log("destroyed")
  },
  mounted: function() {
    this.updateDatabaseBatch()
  },

  methods: {
    onEnd: async function(evt) {
      // this.loading = true

      this.oldIndex = evt.oldIndex
      this.newIndex = evt.newIndex

      this.galleryCurrentOrder = this.$store.state.galOrder

      let elementToMove = this.galleryCurrentOrder[evt.oldIndex]

      this.galleryCurrentOrder.splice(evt.oldIndex, 1)
      this.galleryCurrentOrder.splice(evt.newIndex, 0, elementToMove)

      /*    const galleryOrderDatabase = await db
        .collection("galleryOrder")
        .doc("galleryOrder")
 */
      /*  var self = this

      galleryOrderDatabase
        .set({
          order: firebase.firestore.FieldValue.arrayUnion(
            ...this.galleryCurrentOrder
          ),
        })
        .then(function() {
          console.log("Document successfully written!")
          self.loading = false
        })
        .catch(function(error) {
          console.error("Error writing document: ", error)
        }) */
    },

    loadRecord(index) {
      console.log("this.countTotalPage=" + this.countTotalPage)
      this.paginationCurrentPageNumber = index

      console.log(
        "this.paginationCurrentPageNumber start=" +
          this.paginationCurrentPageNumber
      )

      if (this.paginationCurrentPageNumber > this.countTotalPage) {
        this.paginationCurrentPageNumber = this.countTotalPage
      }

      if (this.paginationCurrentPageNumber <= 0) {
        this.paginationCurrentPageNumber = 1
      }

      console.log(
        "this.paginationCurrentPageNumber end=" +
          this.paginationCurrentPageNumber
      )

      this.paginationStartIndex =
        this.paginationCurrentPageNumber * this.paginationRecordPerPage -
        this.paginationRecordPerPage

      console.log(" this.paginationStartIndex=" + this.paginationStartIndex)
    },

    changeRecordNumber(num) {
      this.paginationRecordPerPage = num
      this.paginationStartIndex = 0
    },

    /*  async updateOrder(){

        let reference_array = this.$store.state.galOrder


    }, */

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
            console.log("size=" + docSnapshot.size)
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
  },
  computed: {
    countTotalPage() {
      return Math.ceil(
        this.galleryCurrentOrder.length / this.paginationRecordPerPage
      )
    },

    requiredPhotoData() {
      //get all the gallery data after sorted in the Store's getter 'photoDataSorted'
      let allPhotoData = this.$store.getters.photoDataSorted

      // show only the ones needed
      allPhotoData = allPhotoData.slice(
        this.paginationStartIndex,
        this.paginationStartIndex + this.paginationRecordPerPage
      )
      return allPhotoData
    },
  },

  watch: {},
}
</script>

<style lang="scss" scoped>
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
</style>
