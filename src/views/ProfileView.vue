<template>
  <ProfileLayout>
    <!-- Default slot content, receives activeTabId from the layout -->
    <template #default="{ activeTabId }">
      <div v-if="userData" class="content-area">
        <!-- Basic Details Content -->
        <div v-show="activeTabId === 'basic'" class="basic-details-grid">
          <!-- USE THE NEW COMPONENT HERE -->
          <ProfileAvatar :imageUrl="userData.basic.profileImage" />
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
        <div v-show="activeTabId === 'additional'" class="details-fields">
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
        <div v-show="activeTabId === 'spouse'" class="details-fields">
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
        <div v-show="activeTabId === 'personal'" class="details-fields">
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
      <div v-else>
        <p>Loading profile...</p>
      </div>
    </template>
  </ProfileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUserProfile } from '../services/api';
import ProfileLayout from '../layouts/ProfileLayout.vue'; // Import the new layout
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import ProfileAvatar from "@/components/ProfileAvatar.vue";

const userData = ref(null);

onMounted(async () => {
  userData.value = await fetchUserProfile();
});
</script>

<style scoped>
.content-area {
  padding-left: 0;
}

.basic-details-grid {
  display: grid;
  grid-template-columns: 150px auto;
  gap: 2rem;
  align-items: start;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background-color: #aaa; /* fallback */
}

.details-fields {
  display: flex;
  flex-direction: column; /* Stack field pairs vertically */
  gap: 1.5rem; /* Space between each field pair */
}

.field-pair{
  text-align: left; /* Align text to the left */
}

.field-pair label {
  font-weight: bold;
  text-align: left;
  color: #212529;
  display: block;
  margin-bottom: 0.25rem;
}

.field-pair span {
  text-align: left;
  color: #212529;
  margin-top: 0.25rem;
}

.edit-button {
  background-color: transparent !important;
  border: 1px solid black !important;
  color: black !important;
  font-style: italic;
}

@media (max-width: 768px) {
  .basic-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
