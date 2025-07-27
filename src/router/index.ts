import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Posts from '../views/Posts.vue'
import Post from '../views/Post.vue'
import Tags from '../views/Tags.vue'
import Search from '../views/Search.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/posts/:slug',
      name: 'post',
      component: Post,
      props: true
    },
    {
      path: '/tags',
      name: 'tags',
      component: Tags
    },
    {
      path: '/tags/:tag',
      name: 'tag',
      component: Posts,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})

export default router
