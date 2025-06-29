<template>
  <div class="profile-container">
    <header class="content-header">
      <h1>My <strong>Profile</strong></h1>
      <div class="header-separator"></div>
      <router-link
          v-if="!isEditable" to="/profile/edit" class="edit-link">
        Edit profile <i class="pi pi-pencil"></i>
      </router-link>
      <router-link
          v-if="isEditable" to="/profile" class="edit-link">
        <i class="pi pi-backward"></i> Cancel
      </router-link>
    </header>

    <div class="profile-tabs">
      <!-- Vertical Tabs -->
      <div class="desktop-tab-nav">
        <button
            v-for="tab in visibleTabs"
            :key="tab.id"
            type="button"
            @click="activeTabId = tab.id"
            :class="{ 'active': activeTabId === tab.id }"
            class="nav-button"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div class="mobile-tab-nav">
        <Select v-model="activeTabId" :options="visibleTabs" optionLabel="name" optionValue="id" class="w-full" />
      </div>

      <!-- Right Side Content -->
      <div class="profile-content">
        <!-- This slot will render the page-specific content -->
        <slot :activeTabId="activeTabId"></slot>
      </div>
    </div>

    <!-- The footer is now part of the layout -->
    <footer class="form-actions">
      <!-- The component using this layout will inject buttons here -->
      <slot name="actions"></slot>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Select from 'primevue/select';

const activeTabId = ref('basic');
const showSpouseTab = ref(false);

const props = defineProps({
  isEditable: {
    type: Boolean,
    default: false
  }
});

const allTabs = [
  { id: 'basic', name: 'Basic Details' },
  { id: 'additional', name: 'Additional Details' },
  { id: 'spouse', name: 'Spouse Details' },
  { id: 'personal', name: 'Personal Preferences' },
];

const visibleTabs = computed(() => {
  return allTabs.filter(tab => {
    if (tab.id === 'spouse') return showSpouseTab.value;
    return true;
  });
});

// This layout needs to know the user's marital status to show/hide the spouse tab.
// In a real app with state management, this would come from a global store.
// For now, we'll simulate a fetch. A child component could also emit this up.
import { fetchUserProfile } from '../services/api';
onMounted(async () => {
  const data = await fetchUserProfile();
  showSpouseTab.value = data.additional.maritalStatus === 'Married';
});

</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: black;
}

.content-header {
  display: flex;
  align-items: center;
  margin-left: calc(220px + 2rem);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.content-header h1 {
  font-size: 1.75rem;
  font-weight: 300;
  margin: 0;
  white-space: nowrap;
}
.content-header h1 strong {
  font-weight: 700;
}

.header-separator {
  flex: 1;
  height: 3px;
  background-color: black;
  margin-top: 1.3rem;
}

.edit-link {
  text-decoration: none;
  font-style: italic;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Tabs layout */
.profile-tabs {
  display: flex;
  width: 100%;
  gap: 2rem;
  background: transparent;
  flex-direction: row;
  padding-bottom: 4rem;
}

.desktop-tab-nav {
  display: flex;
  flex-direction: column;
  width: 220px;
  flex-shrink: 0;
}

.nav-button {
  background: transparent;
  border: none;
  border-bottom: 1px solid black;
  text-align: left;
  padding: 0.75rem 0;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
  cursor: pointer;
}
.nav-button.active {
  font-weight: bold;
  border-bottom-width: 3px;
}
.nav-button:hover {
  color: black;
}

.mobile-tab-nav {
  display: none;
}

.profile-content {
  flex-grow: 1;
}

.form-actions {
  margin-top: 2rem;
  margin-left: calc(220px + 2rem);
  padding-left: 1.125rem;
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .content-header {
    margin-left: 0;
  }
  .profile-tabs {
    flex-direction: column;
    gap: 1.5rem;
  }
  .desktop-tab-nav {
    display: none;
  }
  .mobile-tab-nav {
    display: block;
  }
  .form-actions {
    margin-left: 0;
    padding-left: 0;
  }
}
</style>
