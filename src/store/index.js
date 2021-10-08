import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase/app"
import "firebase/auth"
import db from "../firebase/firebaseInit"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //blogPosts hold the values of all blogs created.
    blogPosts: [],
    //store the gallery details from 'gallery' collection
    galleryPhotos: [],
    //store the 'order' array from 'galleryOrder' document
    galOrder: [],
    // pageStartPoint: null,
    pageLimit: 2,

    postLoaded: null,

    /*  <#anchorPostVariable> */
    //these variables are for "CreatePost.vue" and "EditBlog.vue" to store values. It is the current blog data that is being created or edited.
    currentBlogReady: false,
    tempBlogReady: false,
    blogTitle: "",
    blogShortDesc: "",
    blogHTML: "Write your blog title here...",
    blogPhotoName: "",
    blogPhotoFileURL: null,
    blogPhotoFileThumbnailURL: null,
    blogPhotoPreview: null,
    blogDate: "",
    /*  </#anchorPostVariable> */
    //These are variables to hold values for "CreatePost.vue" and "EditBlog.vue".
    editPost: null,
    user: null,
    profileAdmin: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUserName: null,
    profileSuperAdmin: null,
    profileId: null,
    profileInitials: null,
  },

  //use getter function when need to format the data in a certain way before sending it to the caller
  getters: {
    blogPostFeed(state) {
      //Use '.slice' method to get the object value from a start index to an end index. In this case is to get the value of state.blogPosts from index 0 to index 1 (putting number 2 specify until index 1 and not index 2), which is the first two post in the object. The first two posts will be shown as the big post for the page
      return state.blogPosts.slice(0, 2)
    },
    blogPostCards(state) {
      //Use '.slice' method to get the object value from a start index to an end index. In this case is to get the value of state.blogPosts from index 2 to index 4 (putting number 5 specify until index 4 and not index 5), which is the third post until fifth post in the object. The three posts will be shown as the bottom card section of the page.
      return state.blogPosts.slice(2, 6)
    },

    photoDataSorted(state) {
      let reference_array = state.galOrder

      let reference_object = {}

      for (var i = 0; i < reference_array.length; i++) {
        reference_object[reference_array[i]] = i
      }

      var array = [...state.galleryPhotos]

      array.sort(function(a, b) {
        return (
          Number(reference_object[a.photoId]) -
          Number(reference_object[b.photoId])
        )
      })

      return array
    },
    findBlog: (state) => (id) => {
      return state.blogPosts.find((post) => post.blogID === id)
    },
  },

  /* 'mutation' is used to update changes to the 'state'.
  'mutation' support only one way synchorous codes.
  any asyncronous codes such as call to server will need to be put in 'actions' and use the function in 'actions' to call the function in 'mutation'. */
  mutations: {
    toggleEditPost(state, payload) {
      state.editPost = payload
    },
    setProfileInfo(state, doc) {
      //'doc' refer to 'document' of current user
      state.profileId = doc.id

      //use '.data()' to convert the data to an object, then we can access the variables (e.g. email) inside this data
      state.profileEmail = doc.data().email

      state.profileFirstName = doc.data().firstName
      state.profileLastName = doc.data().lastName
      state.profileUserName = doc.data().userName
      state.profileSuperAdmin = doc.data().superAdmin
    },
    setProfileInitials(state) {
      state.profileInitials =
        state.profileFirstName.match(/(\b\S)?/g).join("") +
        state.profileLastName.match(/(\b\S)?/g).join("")
    },

    /* To check if the user is login or not.
The call is from App.vue under 'firebase.auth().onAuthStateChanged'.
The argument for this function is state follow by the payload from the caller e.g. updateUser(state, payload from caller). */
    //to perform store variable update
    updateState(state, payload) {
      for (const variable in payload) {
        state[variable] = payload[variable]
      }
    },
    //to perform store array update
    //Object.keys(payload)[0] = array name
    //Object.keys(payload)[1] = object to be pushed in the array
    addArrayState(state, payload) {
      state[Object.values(payload)[0]].unshift(Object.values(payload)[1])
    },

    updateArrayState(state, payload) {
      let item = state[Object.values(payload)[0]].find(
        (item) => item[Object.values(payload)[1]] === Object.values(payload)[2]
      )
      Object.assign(item, Object.values(payload)[3])
    },

    deleteArrayState(state, payload) {
      let item = state[Object.values(payload)[0]].findIndex(
        (item) => item[Object.values(payload)[1]] === Object.values(payload)[2]
      )

      state[Object.values(payload)[0]].splice(item, 1)
    },

    clearArrayState(state, payload) {
      state[payload] = []
    },
    changeFirstName(state, payload) {
      state.profileFirstName = payload
    },
    changeLastName(state, payload) {
      state.profileLastName = payload
    },
    changeUsername(state, payload) {
      state.profileUserName = payload
    },

    /*  To reverse the value of variable 'blogPhotoPreview' whenever function below is called.
    This function will be called by 'openPreview' function in 'CreatePost.vue' and in the modal 'BlogCoverPreview.vue'. */
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview
    },

    filterBlogPost(state, payload) {
      //'.filter' return an array of elements that passed the condition given
      state.blogPosts = state.blogPosts.filter(
        (post) => post.blogID !== payload
      )
    },

    /*  To handle post edit function. Caller is from 'EditBlog.vue' under 'mounted' section.
    To set the values for all the temporary 'create or edit' post variables (refer #anchorPostVariable).
    Once these variables are populated with values, the page "EditBlog.vue" will show the values. */
    setBlogState(state, payload) {
      state.currentBlogReady = true
      state.blogTitle = payload.blogTitle
      state.blogShortDesc = payload.blogShortDesc
      state.blogHTML = payload.blogHTML
      state.blogPhotoFileURL = payload.blogCoverPhoto
      state.blogPhotoFileThumbnailURL = payload.blogCoverPhotoThumb
      state.blogPhotoName = payload.blogCoverPhotoName
      state.blogDate = payload.blogDate
    },

    updateGalleryState(state, payload) {
      state.galleryPhotos.push(payload)
    },

    resetGalleryState(state) {
      state.galleryPhotos = []
    },

    updateGalleryOrderState(state, payload) {
      //update 'order' array from firestore 'galleryOrder' collection the the Store array 'galOrder.
      state.galOrder = [...payload]
    },
  },

  //<----------ACTIONS---------->
  //any required asynchronous codes will be put in 'actions' to call 'mutation' function using 'commit'
  actions: {
    /*The format of function in 'actions' is like below:

  actions: {
    FunctionNameForAction (context) {
      context.commit('FunctionNameMutation')
    }
  }

  or in simplify version as below

    actions: {
  FunctionNameForAction ({ commit }) {
    commit('FunctionNameMutation')
  }
}
    
{commit} is a Vuex destructuring format for function in 'actions'.
By writing like this, the method 'commit' of object 'context' can be used by writing 'commmit(...)', no need context.commit(...).
To use other methods of 'context', they can be written like this:

     FunctionNameForAction ({ commit, dispatch, state, getters,... }) {

*/
    async getCurrentUser({ commit }) {
      //reference to the collection 'users' in firestore and point to the currently logged in user
      const dataBase = await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid)

      const dbResult = await dataBase.get()

      commit("setProfileInfo", dbResult)
      commit("setProfileInitials")
    },

    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId)
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUserName,
      })

      commit("setProfileInitials")
    },

    //caller is from 'App.vue' and 'CreatePost'. To retrive the all the post data from Firebase collection and push them to state.blogPosts.
    /*   
  App.vue need to call this because it need state.blogPosts to have values before can render correctly.
  CreatePost.vue needs to call this when publish button is clicked because it needed state.blogPosts updated values to be ready before can redirect to 'ViewBlog.vue'  */
    async getPost({ commit, state }) {
      //reference to the collection 'blogPosts' in firestore.
      /*    
      Order the record by date in descending order.
      NOTE:

    Ascending order for date means earlier date take precedence over later date.
    E.g January 2021 show first, then February 2021

    Hence if the order is descending, then the order is
    February 2021 show first, then January 2021 
    '.orderBy' is a Firebase method.*/
      const dataBase = await db.collection("blogPosts").orderBy("date")

      //grab the data from collection and assign them to a temporary object named 'dbResults'
      const dbResults = await dataBase.get()

      //clear 'blogPosts' array before adding latest ones from Firestore
      commit("clearArrayState", "blogPosts")

      //Loop through each record in 'dbResults'
      dbResults.forEach((doc) => {
        /* 
        '.some' is a javascript method to check if ONE of record in state.blogPosts meet the condition of state.blogPosts.blogID equal to as the current iteration of doc.id (data from firebase). If yes, this means there a duplicate entry between state.blogPosts and firebase blogPosts.
        state.blogPosts.some((post) => post.blogID === doc.id) */

        /* 
        Putting ! in !(state.blogPosts.some((post) => post.blogID === doc.id)) evaluate as pass if no record in 'state.blogPosts' is the same as current iteration record in 'dbResults'. This means the current iteration record in Firebase database is not in state.blogPosts hence need to be put in.
        
        This will be evaluated again for the next 'dbResults' record */

        const data = {
          //id for current post
          blogID: doc.data().blogID,
          //the html code for current post
          blogHTML: doc.data().blogHTML,
          //the url of the cover photo for current post
          blogCoverPhoto: doc.data().blogCoverPhoto,
          //the url of the cover photo thumbnail for current post
          blogCoverPhotoThumb: doc.data().blogCoverPhotoThumbnail,
          //title for current post
          blogTitle: doc.data().blogTitle,
          //short description for current post
          blogShortDesc: doc.data().blogShortDescription,
          //date for current post. Note that firebase '.date' return a timestamp which has a different format than conventional date. E.g. 1627883023527 is the format.
          blogDate: doc.data().date,
          //the name of the cover photo
          blogCoverPhotoName: doc.data().blogCoverPhotoName,
          //author ID
          profileId: doc.data().profileId,
        }

        //add all the latest records to state.blogPosts
        commit("addArrayState", {
          blogPosts: "blogPosts",
          blogData: data,
        })

        /*
     NOTE: once added all the post data to state.blogPosts, this data will be used by 'Home.vue' and 'BlogPost.vue' to show the posts on page */
      })
      state.postLoaded = true
    },

    // delete post. Caller is from 'BlogCard.vue'.
    //deletePost({commit}, id of the post to delete)
    async deletePost({ commit }, payload) {
      // Use write batch to update a few firestore collection at one go
      var batch = db.batch()

      //reference to the firebase document 'blogPosts' of property id based on routeID from #anchorID
      //#anchorDataBase
      const dataBase = await db.collection("blogPosts").doc(payload.blogID)

      //add blog going to be deleted to batch
      batch.delete(dataBase)

      //reference to the firebase document 'gallery'
      const galleryDataBase = await db.collection("gallery")

      console.log(" payload.blogID=" + payload.blogID)

      // Search for the blog id reference based on routeID using 'where'. Note that blog id in this collection is unique too.
      const galleryDataBaseFiltered = await galleryDataBase.where(
        "blogID",
        "==",
        payload.blogID
      )

      let galleryDocumentId

      let tempArray
      console.log(
        "galleryDataBaseFiltered=" + JSON.stringify(galleryDataBaseFiltered)
      )
      ///////////////////////////
      //the variable to store gallery id corresponding to current blog id

      //update the updated data in 'blogPosts' collection to 'gallery' collection
      await galleryDataBaseFiltered.get().then(async (querySnapshot) => {
        if (querySnapshot.size > 0) {
          //get the id of the document in gallery collection with the matched blog id.
          //'galleryDataBase' is pointing to the document that has the currently used 'blogID'.
          //'querySnapshot.docs[0].id' will give the current document id (the name of the document).

          //assign gallery id to variable 'galleryDocumentId'
          galleryDocumentId = await querySnapshot.docs[0].id
          batch.delete(galleryDataBase.doc(galleryDocumentId))

          //reference to the firebase collection 'galleryOrder'
          const galleryOrderDatabase = await db.collection("galleryOrder")

          //variable to hold the reference to the firebase document 'galleryOrder'
          let galleryOrderDocument

          //to retrive the document id of the 'galleryOrder' collection
          await galleryOrderDatabase.get().then(async (docSnapshot) => {
            if (docSnapshot.size >= 1) {
              console.log("snapshot=")
              //assign the reference to the single document of 'galleryOrder' once the document id is identified
              galleryOrderDocument = await db
                .collection("galleryOrder")
                .doc(docSnapshot.docs[0].id)
            }
          })

          await galleryOrderDocument.get().then(async (snap) => {
            //tempArray = the array 'order' in document 'galleryOrder' of collection 'galleryOrder'
            tempArray = await snap.data().order

            const index = tempArray.indexOf(galleryDocumentId)
            if (index > -1) {
              tempArray.splice(index, 1)
            }

            console.log("tempArray after splice=" + tempArray)

            batch.update(galleryOrderDocument, {
              order: firebase.firestore.FieldValue.delete(),
            })

            batch.set(
              //get the id of the document in gallery collection with the matched blog id
              galleryOrderDocument,
              {
                order: firebase.firestore.FieldValue.arrayUnion(...tempArray),
              }
            )
          })
        }
      })
      ///////////////////

      batch.commit().then(() => {
        let obj = {
          currentBlogReady: "",
          blogTitle: "",
          blogShortDesc: "",
          blogHTML: "",
          blogPhotoFileURL: "",
          blogPhotoFileThumbnailURL: "",
          blogPhotoName: "",
          blogDate: "",
        }

        commit("updateState", obj)

        if (galleryDocumentId) {
          commit("deleteArrayState", {
            array: "galleryPhotos",
            property: "photoId",
            value: galleryDocumentId,
          })

          commit("updateGalleryOrderState", tempArray)
        }
      })

      //first half of the reference to the firebase storage
      const storageRef = firebase.storage().ref()
      /* concatenate the reference with 'child(...) to point to the image location with image name after loading complete.
          In this case it will be something like example 'documents/BlogCoverPhotos/blogPhoto.jpg'. */
      const docRef = storageRef.child(
        `documents/BlogCoverPhotos/${payload.blogID}/${payload.blogCoverPhotoName}`
      )

      docRef
        .getDownloadURL()
        .then(() => {
          docRef.delete().then(
            () => {
              console.log("cover file deleted")
            },
            (err) => {
              console.log(err)
            }
          )
        })
        .catch(() => {})

      const docRef2 = storageRef.child(
        `documents/BlogCoverPhotos_Thumbnail/${payload.blogID}/${payload.blogCoverPhotoName}`
      )

      docRef2
        .getDownloadURL()
        .then(() => {
          docRef2.delete().then(
            () => {
              console.log("thumb file deleted")
            },
            (err) => {
              console.log(err)
            }
          )
        })
        .catch(() => {})

      //remove the data from state.blogPosts that has the id indicated by 'payload'

      commit("deleteArrayState", {
        array: "blogPosts",
        property: "blogID",
        value: payload.blogID,
      })
    },

    async updatePost({ commit, dispatch }, payload) {
      //remove the data from state.blogPosts that has the id indicated by 'payload'
      commit("filterBlogPost", payload)

      //the purpose of 'getPost' is to cross check if there is any new record in firebase database. If there is, the record will be updated to store.blogPosts.
      await dispatch("getPost")
    },

    //load gallery data from Firestore to Store array variable 'galleryPhotos' and load gallery order data from Firestore to Store array variable 'galOrder'.
    async loadGalleryData({ commit }) {
      //reference to 'gallery' collection in firestore
      const dataBase = await db.collection("gallery")

      await dataBase.get().then((docSnapshot) => {
        if (docSnapshot.size >= 1) {
          for (const doc of docSnapshot.docs) {
            const data = {
              photoId: doc.id,
              blogId: doc.data().blogID,
              photoTitle: doc.data().blogTitle,
              photoURL: doc.data().blogCoverPhoto,
              thumbPhotoURL: doc.data().blogCoverPhotoThumbnail,
              photoName: doc.data().blogCoverPhotoName,
              photoShortDesc: doc.data().blogShortDescription,
              photoCreator: doc.data().userName,
            }
            //mutate each iteration of record from 'gallery' firestore to Store array variable 'galleryPhotos'
            commit("updateGalleryState", data)
          }
        } else {
          console.log("not exist")
        }
      })

      //reference to 'galleryOrder' collection in firestore
      const galleryOrderDatabase = await db.collection("galleryOrder")

      await galleryOrderDatabase.get().then((docSnapshot) => {
        if (docSnapshot.size >= 1) {
          let tempArray = docSnapshot.docs[0].data().order
          commit("updateGalleryOrderState", tempArray)
        }
      })

      console.log()
    },
  },
  modules: {},
})
