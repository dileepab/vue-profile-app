<template>
  <div class="app-container">
    <!-- The new header bar is a single fixed element -->
    <header class="global-header">
      <div class="global-logo">LOGO</div>
      <i v-if="isLoggedIn" class="pi pi-bars global-hamburger-menu" @click="sidebarVisible = true"></i>
    </header>

    <!-- The Navigation Drawer (now using Drawer component) -->
    <Drawer v-model:visible="sidebarVisible" position="right" class="p-sidebar-md">
        <h3>Menu</h3>
        <ul class="nav-list">
            <li><router-link to="/home" class="nav-link" @click="sidebarVisible = false">Home</router-link></li>
            <li><router-link to="/profile" class="nav-link" @click="sidebarVisible = false">My Profile</router-link></li>
            <li><router-link to="/profile/edit" class="nav-link" @click="sidebarVisible = false">Edit Profile</router-link></li>
            <li><a href="#" class="nav-link" @click.prevent="handleLogout">Logout</a></li>
        </ul>
    </Drawer>

    <!-- The banner remains fixed at the bottom -->
    <div v-if="banner.message" :class="['global-banner', banner.type === 'success' ? 'global-success-banner' : 'global-error-banner']">
      {{ banner.message }}
    </div>

    <!-- This wrapper still handles scrolling -->
    <main class="content-wrapper" :class="layoutClass">
        <router-view @show-message="handleShowMessage" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// PrimeVue Component (Updated)
import Drawer from 'primevue/drawer';

const route = useRoute();
const router = useRouter();

const sidebarVisible = ref(false);
const banner = reactive({
    message: '',
    type: '' // 'success' or 'error'
});
let bannerTimeout = null;

const isLoggedIn = computed(() => {
    return route.meta.requiresAuth === true;
});

// This computed property now applies a specific class for the layout
const layoutClass = computed(() => {
  return (route.name === 'Login' || route.name === 'Register') ? 'layout-centered' : 'layout-default';
});

const handleShowMessage = ({ message, type = 'error' }) => {
  banner.message = message;
  banner.type = type;

  if (bannerTimeout) clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => {
    banner.message = '';
    banner.type = '';
  }, 5000);
};

const handleLogout = () => {
    sidebarVisible.value = false;
    // Clear all forms of session persistence
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
};

// Clear banner message on route change
watch(route, () => {
    banner.message = '';
    banner.type = '';
    if(bannerTimeout) clearTimeout(bannerTimeout);
});
</script>

<style>
/* Global styles */
body, html {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

.app-container {
  background-image: url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1912&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Fixes background during scroll */
  width: 100%;
  height: 100%;
  position: relative;
}

/* This is the new header bar */
.global-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 6rem; /* Set a fixed height for the header */
    padding: 0 2rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* This new wrapper is now the scrolling container */
.content-wrapper {
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Layout for Login/Register pages */
.layout-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Default layout for all other pages (Profile, Edit, etc.) */
.layout-default {
  /* Padding-top now ensures content starts below the fixed header */
  padding: 8rem 4rem;
  display: flex;
  justify-content: center;
}

/* Logo and Menu no longer need fixed positioning */
.global-logo {
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  color: black;
  border: 2px solid black;
  position: relative; /* Remove fixed positioning */
}

.global-hamburger-menu {
  font-size: 2rem !important;
  color: black;
  cursor: pointer;
  position: relative; /* Remove fixed positioning */
}

/* Navigation Drawer (Sidebar) Styles */
.nav-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0 0;
}
.nav-link {
    display: block;
    text-decoration: none;
    background: transparent;
    border: none;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
    padding: 1rem;
    font-size: 18px;
    font-weight: 300;
    color: #000000;
    cursor: pointer;
    transition: color 0.2s;
}
.nav-link:hover {
    color: black;
}
.nav-link.router-link-active {
    font-weight: bold;
  border-bottom: 3px solid black;
}

.global-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  text-align: center;
  max-width: 90%;
  font-style: italic;
}

.global-error-banner {
  background-color: rgba(33, 37, 41, 0.9);
}

.global-success-banner {
    background-color: #004e11;
}

@media (max-width: 768px) {
    .global-header {
        height: 5rem;
        padding: 0 1rem;
    }
    .layout-default {
        padding: 6rem 1rem;
    }
}
</style>
