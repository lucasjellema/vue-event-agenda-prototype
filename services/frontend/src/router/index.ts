import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import EventListView from '../views/EventListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/calendar',
      name: 'calendarpage',
      // route level code-splitting
      // this generates a separate chunk (Calendar.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import('../views/CalendarView.vue')
      component: CalendarView

    },
    {
      path: '/list',
      name: 'list',
      component: EventListView
    },
  ]
})

export default router
