import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';

// A simple in-memory check for authentication.
// In a real app, this would check a cookie or token.
const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Default route redirects to the user's profile if logged in.
    // If not logged in, the navigation guard will redirect to '/login'.
    {
      path: '/',
      redirect: '/profile',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { isGuest: true } // Mark this as a guest-only route
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { isGuest: true } // Mark this as a guest-only route
    },
    {
      path: '/home', // Added Home route as per requirements
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
    }
  ],
});

// Navigation Guard
// This runs before each navigation to protect routes.
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const authenticated = isAuthenticated();

  if (requiresAuth && !authenticated) {
    // If the route requires authentication and the user is not logged in,
    // redirect to the login page.
    next({ name: 'Login' });
  } else if (isGuest && authenticated) {
    // If the route is for guests (like login/register) and the user
    // is already logged in, redirect them to their profile.
    next({ name: 'Profile' });
  } else {
    // Otherwise, allow the navigation.
    next();
  }
});

export default router;
