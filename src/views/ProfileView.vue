<template>
  <div v-if="userData" class="profile-container">
    <!-- Header aligned with content area -->
    <header class="content-header">
      <h1>My <strong>Profile</strong></h1>
      <div class="header-separator"></div>
      <router-link to="/profile/edit" class="edit-link">
        Edit profile <i class="pi pi-pencil"></i>
      </router-link>
    </header>

    <!-- Mobile Dropdown -->
    <div class="mobile-tab-nav">
      <Select v-model="activeTabId" :options="visibleTabs" optionLabel="name" optionValue="id" class="w-full" />
    </div>

    <Tabs v-model:value="activeTabId" orientation="vertical" class="profile-tabs">
      <!-- Vertical Tabs for Desktop -->
      <TabList class="desktop-tab-nav">
        <Tab v-for="tab in visibleTabs" :key="tab.id" :value="tab.id">{{ tab.name }}</Tab>
      </TabList>

      <!-- Right Side Content -->
      <TabPanels class="profile-content">
        <TabPanel v-for="tab in visibleTabs" :key="tab.id" :value="tab.id">
          <div class="content-area">
            <div v-if="tab.id === 'basic'" class="details-grid">
              <Avatar :image="userData.basic.profileImage" class="profile-avatar" size="xlarge" shape="circle" />
              <div class="details-fields">
                <div class="field-pair">
                  <label>Salutation*</label>
                  <span>{{ userData.basic.salutation }}</span>
                </div>
                <div class="field-pair">
                  <label>First name*</label>
                  <span>{{ userData.basic.firstName }}</span>
                </div>
                <div class="field-pair">
                  <label>Last name*</label>
                  <span>{{ userData.basic.lastName }}</span>
                </div>
                <div class="field-pair">
                  <label>Email address*</label>
                  <span>{{ userData.basic.email }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Details Content -->
            <div v-if="tab.id === 'additional'" class="details-fields">
              <div class="field-pair">
                  <label>Home address*</label>
                  <span>{{ userData.additional.homeAddress }}</span>
              </div>
              <div class="field-pair">
                  <label>Country*</label>
                  <span>{{ userData.additional.country }}</span>
              </div>
              <div class="field-pair">
                  <label>Postal code*</label>
                  <span>{{ userData.additional.postalCode }}</span>
              </div>
              <div class="field-pair">
                  <label>Date of birth*</label>
                  <span>{{ userData.additional.dob }}</span>
              </div>
               <div class="field-pair">
                  <label>Gender</label>
                  <span>{{ userData.additional.gender }}</span>
              </div>
              <div class="field-pair">
                  <label>Marital status</label>
                  <span>{{ userData.additional.maritalStatus }}</span>
              </div>
            </div>

            <!-- Spouse Details Content -->
            <div v-if="tab.id === 'spouse'" class="details-fields">
               <div class="field-pair">
                  <label>Salutation</label>
                  <span>{{ userData.spouse.salutation }}</span>
              </div>
              <div class="field-pair">
                  <label>First name</label>
                  <span>{{ userData.spouse.firstName }}</span>
              </div>
              <div class="field-pair">
                  <label>Last name</label>
                  <span>{{ userData.spouse.lastName }}</span>
              </div>
            </div>

            <!-- Personal Preferences Content -->
            <div v-if="tab.id === 'personal'" class="details-fields">
               <div class="field-pair">
                  <label>Hobbies and interests</label>
                  <span>{{ userData.personal.hobbies }}</span>
              </div>
               <div class="field-pair">
                  <label>Favorite sport(s)</label>
                  <span>{{ userData.personal.sports }}</span>
              </div>
               <div class="field-pair">
                  <label>Preferred music genre(s)</label>
                  <span>{{ userData.personal.music }}</span>
              </div>
               <div class="field-pair">
                  <label>Preferred movie/TV show(s)</label>
                  <span>{{ userData.personal.movies }}</span>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <div v-else>
    <p>Loading profile...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchUserProfile } from '../services/api';

import Avatar from 'primevue/avatar';
import Dropdown from 'primevue/dropdown';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Select from "primevue/select";

const userData = ref(null);
const activeTabId = ref('basic');

const allTabs = [
  { id: 'basic', name: 'Basic Details' },
  { id: 'additional', name: 'Additional Details' },
  { id: 'spouse', name: 'Spouse Details' },
  { id: 'personal', name: 'Personal Preferences' },
];

const visibleTabs = computed(() => {
  if (!userData.value) return [];
  if (userData.value.additional.maritalStatus !== 'Married') {
    if (activeTabId.value === 'spouse') activeTabId.value = 'basic';
    return allTabs.filter(tab => tab.id !== 'spouse');
  }
  return allTabs;
});

onMounted(async () => {
  userData.value = await fetchUserProfile();
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
  padding-left: 1.125rem;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.content-header h1 {
  font-size: 1.75rem;
  font-weight: 400;
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

/* Initially hide the mobile dropdown */
.mobile-tab-nav {
    display: none;
}

/* Tabs layout */
.profile-tabs {
  display: flex;
  width: 100%;
  gap: 2rem;
  background: transparent;
  flex-direction: row;
}

:deep(.p-tablist) {
  display: flex;
  flex-direction: column;
  width: 220px;
  background: transparent;
  border: none;
  padding-top: 0;
}

:deep(.p-tablist .p-tablist-tab-list) {
  display: flex;
  flex-direction: column;
  background: transparent;
  border-bottom-color: black;
}

:deep(.p-tablist .p-tablist-tab-list .p-tab) {
  text-align: left;
  padding-left: 0;
  font-weight: 300;
  color: #373737;
  border-bottom-color: black;
  font-size: 18px;
}
:deep(.p-tablist .p-tablist-tab-list .p-tab:hover) {
  color: black;
}
:deep(.p-tablist .p-tablist-tab-list .p-tab.p-tab-active) {
  font-weight: bold;
  border-bottom-width: 3px;
}
:deep(.p-tablist .p-tablist-tab-list .p-tablist-active-bar) {
  display: none;
}

:deep(.p-tab-header) {
  background: transparent;
  border-bottom: 1px solid black;
  margin: 0;
}

:deep(.p-tab-header.p-highlight .p-tab-header-action) {
  font-weight: bold;
}

:deep(.p-tab-header-action) {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  font-size: 1rem;
  text-align: left;
  color: black;
  box-shadow: none !important;
}

:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-datepicker) {
  width: 100%;
  max-width: 400px;
  background: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  color: black !important;
  border-radius: 0.25rem;
}

/* Ensure selected text in Select component is black */
:deep(.p-select .p-select-label) {
  color: black !important;
}

:deep(.p-tabpanels) {
  background: transparent;
  flex-grow: 1;
}

.profile-content {
  flex-grow: 1;
}

.content-area {
  padding-left: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 100px auto;
  gap: 2rem;
  align-items: start;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background-color: #aaa; /* fallback */
}

.details-fields {
  display: grid;
  grid-template-columns: auto;
  gap: 1rem 2rem;
  align-items: center;
}

.field-pair{
  display: grid;
  grid-template-columns: auto;
}

.field-pair label {
  font-weight: bold;
  text-align: left;
  color: #212529;
}

.field-pair span {
  text-align: left;
  color: #212529;
  margin: 1rem 0;
}

@media (max-width: 768px) {
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
    margin-left: 0;
  }

  /* Hide desktop tabs and show mobile dropdown */
  .desktop-tab-nav {
      display: none;
  }
  .mobile-tab-nav {
      display: block;
  }

  .profile-tabs {
    flex-direction: column;
    gap: 0; /* Remove gap for mobile */
  }

  :deep(.p-tablist) {
    flex-direction: row;
    overflow-x: auto;
    border-bottom: 1px solid #ccc;
  }

  :deep(.p-tab-header) {
    border-bottom: none;
  }

  :deep(.p-tab-header-action) {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }

  .content-area {
    padding-left: 0;
  }
}
</style>
