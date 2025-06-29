import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';

// A more robust helper function to get a specific cookie's value
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0)===' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}


// Updated function to check for authentication state
const isAuthenticated = () => {
  // 1. Check for the persistent cookie
  const hasCookie = getCookie("isLoggedIn") === "true";
  // 2. Fallback to check sessionStorage for the current browser session
  const hasSessionStorage = sessionStorage.getItem('isLoggedIn') === 'true';

  return hasCookie || hasSessionStorage;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/profile',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { isGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { isGuest: true }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: () => import('../views/ProfileEdit.vue'),
      meta: { requiresAuth: true }
    },
    // Add a catch-all route to handle the 404 redirect
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: Login // Or a dedicated "Not Found" component
    }
  ],
});

// This code block handles the redirect from the 404.html page
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  // Use router.replace to go to the intended URL
  router.replace(redirect);
}


// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const authenticated = isAuthenticated();

  if (requiresAuth && !authenticated) {
    next({ name: 'Login' });
  } else if (isGuest && authenticated) {
    next({ name: 'Profile' });
  } else {
    next();
  }
});

export default router;
