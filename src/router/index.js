import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Blogs from "../views/Blogs.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import ForgotPassword from "../views/ForgotPassword.vue"
import Profile from "../views/Profile.vue"
import Gallery from "../views/Gallery.vue"
import EditGallery from "../views/EditGallery.vue"
import CreatePost from "../views/CreatePost.vue"
import BlogPreview from "../views/BlogPreview.vue"
import ViewBlog from "../views/ViewBlog.vue"
import EditBlog from "../views/EditBlog.vue"
import firebase from "firebase/app"
import "firebase/auth"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home", requiresAuth: false },
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
    meta: { title: "Blogs", requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "Register", requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: { title: "Forgot Password", requiresAuth: false },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Profile", requiresAuth: true },
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
    meta: { title: "Gallery", requiresAuth: false },
  },
  {
    path: "/edit-gallery",
    name: "EditGallery",
    component: EditGallery,
    meta: { title: "Edit Gallery", requiresAuth: false },
  },
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
    meta: { title: "Create Post", requiresAuth: true },
    beforeEnter: (to, from, next) => {
      next((vm) => {
        vm.prevRoute = from
      })
    },
  },
  {
    path: "/post-preview/:blogid",
    name: "BlogPreview",
    component: BlogPreview,
    meta: { title: "Blog Preview", requiresAuth: true },
  },
  {
    path: "/view-blog/:blogid",
    name: "ViewBlog",
    component: ViewBlog,
    meta: { title: "Preview Blog Post", requiresAuth: false },
  },
  {
    path: "/edit-blog/:blogid",
    name: "EditBlog",
    component: EditBlog,
    meta: { title: "Edit Blog Post", requiresAuth: true },
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  //scroll back up on each page load
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

/* route guard - to execute a check before a new page is loaded in the website
beforeEach('the page to go to','current page the user at', 'next' command for certain function) */
router.beforeEach((to, from, next) => {
  //add the title to page before the page loaded
  document.title = `${to.meta.title} | The Missing Piece`

  /*
firebase 'onAuthStateChanged' will check and confirm if the user is either sign in or sign out, and not unsure. 
Once identified it is either sign in or sign out, then the app can be rendered, regardless of whether is sign in or out. 
*/
  firebase.auth().onAuthStateChanged(async () => {
    /*  if (
      to.name != "CreatePost" &&
      to.name != "BlogPreview" &&
      to.name != "EditBlog" &&
      to.name != "ViewBlog"
    ) {
      console.log("been here")
      localStorage.removeItem("blogHTML")
    } */

    //next() = end the checking
    next()
  })
})

router.beforeEach(async (to, from, next) => {
  let user = firebase.auth().currentUser
  /*     
'to.matched' return an array of all routes that matched the request in URL.

    For example for below, the URL /foo/bar will match both the parent route (/foo) record and the child route (/foo/bar) record.
    Hend 'to.matched' will return something like ['/foo','/foo/bar'].

    routes: [
      {
        path: '/foo',
        component: Foo,
        children: [
          {
            path: 'bar',
            component: Bar,
            // a meta field
            meta: { requiresAuth: true }
          }
        ]
      }
    ] */

  //'to.matched.some' means to check if the current requested routes have the 'meta.requiresAuth' with it. If yes then this route require user login to access.
  if (to.matched.some((res) => res.meta.requiresAuth)) {
    if (user) {
      return next()
    }

    return next({ name: "Home" })
  }

  return next()
})

//this router file will be exported to src/main.js to use
export default router
