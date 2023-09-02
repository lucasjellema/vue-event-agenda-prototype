import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import EventListView from '../views/EventListView.vue'
import EditEventDetails from '../components/EditEventDetails.vue'
import Event from '../views/Event.vue'

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
    },    {
      path: '/event/:eventSlug',
      name: 'eventpage',
      component: Event
    },{
      path: '/editEvent',
      name: 'editEvent',
      component: EditEventDetails
    }
  ]
})


router.beforeEach((to, from, next) => {
  // Check if the route exists (e.g., by comparing to a list of known routes)
  console.log(`router says ${to.path}`)
  if (to.path.indexOf('event-details')>-1){
    // the part after "event-details/" is the eventSlug
    next(
    { name: 'eventpage', params: { eventSlug: to.path.substring(to.path.indexOf('event-details')+14 ) } })
  } else {
  next()
  }
  // const knownRoutes = ['/home', '/about', '/contact']; // Replace with your known routes
  // if (knownRoutes.includes(to.path)) {
  //   // Route is known, proceed with navigation
  //   next();
  // } else {
  //   // Route is unknown, handle it (e.g., redirect to a 404 page)
  //   next('/not-found'); // Redirect to a 404 page or any other route
  // }
});


export default router
