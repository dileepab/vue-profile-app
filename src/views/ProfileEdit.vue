<template>
  <div v-if="initialData" class="profile-container">
    <header class="content-header">
      <h1>My <strong>Profile</strong></h1>
      <div class="header-separator"></div>
    </header>

    <div class="profile-tabs">
      <!-- Vertical Tabs -->
      <div class="desktop-tab-nav">
        <button
            v-for="tab in allTabs"
            :key="tab.id"
            type="button"
            @click="activeTabId = tab.id"
            :class="{ 'active': activeTabId === tab.id }"
            class="nav-button"
            v-show="isTabVisible(tab.id)"
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
        <!-- Basic Details Form -->
        <div v-show="activeTabId === 'basic'" class="content-area">
          <Form @submit="handleUpdate" :initial-values="{ basic: initialData.basic }" :validation-schema="basicSchema" v-slot="{ meta }">
            <div class="basic-details-grid">
              <!-- Left Column: Avatar -->
              <div class="avatar-section">
                <div class="avatar-upload-container" @click="triggerFileUpload">
                  <Avatar :image="imagePreview || initialData.basic.profileImage" size="xlarge" shape="circle" />
                  <div class="avatar-overlay"><i class="pi pi-upload"></i></div>
                </div>
                <input type="file" ref="fileInput" @change="onFileSelect" style="display: none;" accept="image/*" />
              </div>
              <!-- Right Column: Fields -->
              <div class="fields-section">
                <div class="input-group">
                  <label>Salutation*</label>
                  <Field name="basic.salutation" v-slot="{ value, handleChange }">
                    <Select :model-value="value" @update:modelValue="handleChange" :options="['Mr.', 'Ms.', 'Mrs.']" />
                  </Field>
                </div>
                <div class="input-group">
                  <label>First name*</label>
                  <Field name="basic.firstName" v-slot="{ field }"><InputText v-bind="field" /></Field>
                </div>
                <div class="input-group">
                   <label>Last name*</label>
                   <Field name="basic.lastName" v-slot="{ field }"><InputText v-bind="field" /></Field>
                </div>
                <div class="input-group">
                  <label>Email address*</label>
                  <Field name="basic.email" v-slot="{ field }"><InputText v-bind="field" /></Field>
                </div>
              </div>
            </div>
            <footer class="form-actions">
                <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
                <Button type="button" label="CANCEL" class="cancel-button" @click="$router.push('/profile')" />
            </footer>
          </Form>
        </div>

        <!-- Additional Details Form -->
        <div v-show="activeTabId === 'additional'" class="content-area">
          <Form @submit="handleUpdate" :initial-values="{ additional: initialData.additional }" :validation-schema="additionalSchema" v-slot="{ errors, meta }">
            <div class="edit-form-layout">
              <!-- Form fields for Additional Details -->
              <div class="input-group">
                  <label>Home address*</label>
                  <Field name="additional.homeAddress" v-slot="{ field }"><InputText v-bind="field" /></Field>
              </div>
              <div class="input-group">
                  <label>Country*</label>
                  <Field name="additional.country" v-slot="{ field }"><InputText v-bind="field" /></Field>
              </div>
              <div class="input-group">
                  <label>Postal code*</label>
                  <Field name="additional.postalCode" v-slot="{ field }"><InputText v-bind="field" /></Field>
              </div>
              <div class="input-group">
                  <label>Date of Birth*</label>
                  <Field name="additional.dob" v-slot="{ value, handleChange }">
                     <DatePicker :model-value="value" @update:modelValue="handleChange" dateFormat="yy-mm-dd" :class="{ 'p-invalid': errors['additional.dob'] }" />
                  </Field>
                   <small v-if="errors['additional.dob']" class="p-error">{{ errors['additional.dob'] || '&nbsp;' }}</small>
              </div>
               <div class="input-group">
                  <label>Gender</label>
                  <Field name="additional.gender" v-slot="{ value, handleChange }">
                    <Select :model-value="value" @update:modelValue="handleChange" :options="['Male', 'Female']" />
                  </Field>
              </div>
               <div class="input-group">
                  <label>Marital Status*</label>
                  <Field name="additional.maritalStatus" v-slot="{ value, handleChange }">
                    <Select :model-value="value" @update:modelValue="v => { handleChange(v); onMaritalStatusChange(v); }" :options="['Single', 'Married']" />
                  </Field>
              </div>
            </div>
            <footer class="form-actions">
                <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
                <Button type="button" label="CANCEL" class="cancel-button" @click="$router.push('/profile')" />
            </footer>
          </Form>
        </div>

        <!-- Spouse Details Form -->
        <div v-show="activeTabId === 'spouse'" class="content-area">
           <Form @submit="handleUpdate" :initial-values="{ spouse: initialData.spouse }" :validation-schema="spouseSchema" v-slot="{ meta }">
                <div class="edit-form-layout">
                  <div class="input-group">
                    <label>Salutation</label>
                    <Field name="spouse.salutation" v-slot="{ value, handleChange }">
                      <Select :model-value="value" @update:modelValue="handleChange" :options="['Mr.', 'Ms.', 'Mrs.']" />
                    </Field>
                  </div>
                  <div class="input-group">
                    <label>First name</label>
                    <Field name="spouse.firstName" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                  <div class="input-group">
                    <label>Last name</label>
                    <Field name="spouse.lastName" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                </div>
                <footer class="form-actions">
                    <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
                    <Button type="button" label="CANCEL" class="cancel-button" @click="$router.push('/profile')" />
                </footer>
            </Form>
        </div>

        <!-- Personal Preferences Form -->
        <div v-show="activeTabId === 'personal'" class="content-area">
            <Form @submit="handleUpdate" :initial-values="{ personal: initialData.personal }" :validation-schema="personalSchema" v-slot="{ meta }">
                <div class="edit-form-layout">
                  <div class="input-group">
                    <label>Hobbies and interests</label>
                    <Field name="personal.hobbies" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                  <div class="input-group">
                    <label>Favorite sport(s)</label>
                    <Field name="personal.sports" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                  <div class="input-group">
                    <label>Preferred music genre(s)</label>
                    <Field name="personal.music" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                  <div class="input-group">
                    <label>Preferred movie/TV show(s)</label>
                    <Field name="personal.movies" v-slot="{ field }"><InputText v-bind="field" /></Field>
                  </div>
                </div>
                 <footer class="form-actions">
                    <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
                    <Button type="button" label="CANCEL" class="cancel-button" @click="$router.push('/profile')" />
                </footer>
            </Form>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading form...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import { fetchUserProfile, updateUserProfile } from '../services/api';

// PrimeVue Components
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';

const router = useRouter();
const emit = defineEmits(['show-message']);
const initialData = ref(null);
const activeTabId = ref('basic');
const fileInput = ref(null);
const imagePreview = ref(null);
const showSpouseTab = ref(false);


// --- Schemas for each form ---
const basicSchema = yup.object({
  basic: yup.object({
    salutation: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required().email(),
  })
});

const additionalSchema = yup.object({
  additional: yup.object({
    homeAddress: yup.string().required(),
    country: yup.string().required(),
    postalCode: yup.string().required(),
    dob: yup.date().required().max(new Date(Date.now() - 536112000000), "You must be at least 17 years old"),
    gender: yup.string(),
    maritalStatus: yup.string().required()
  })
});

const spouseSchema = yup.object({
  spouse: yup.object({
    salutation: yup.string(),
    firstName: yup.string(),
    lastName: yup.string(),
  })
});

const personalSchema = yup.object({
  personal: yup.object({
     hobbies: yup.string(),
     sports: yup.string(),
     music: yup.string(),
     movies: yup.string(),
  })
});


const allTabs = [
  { id: 'basic', name: 'Basic Details' },
  { id: 'additional', name: 'Additional Details' },
  { id: 'spouse', name: 'Spouse Details' },
  { id: 'personal', name: 'Personal Preferences' },
];

const visibleTabs = computed(() => {
    return allTabs.filter(tab => isTabVisible(tab.id));
});

const isTabVisible = (tabId) => {
    if (tabId === 'spouse') return showSpouseTab.value;
    return true;
};

const onMaritalStatusChange = (status) => {
    showSpouseTab.value = status === 'Married';
};

const triggerFileUpload = () => { fileInput.value.click(); };

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
};

onMounted(async () => {
  const data = await fetchUserProfile();
  initialData.value = data;
  showSpouseTab.value = data.additional.maritalStatus === 'Married';
});

const handleUpdate = async (values) => {
  try {
    const fullData = JSON.parse(JSON.stringify(initialData.value));
    // Merge the updated tab data into the full data object
    Object.assign(fullData.basic, values.basic);
    Object.assign(fullData.additional, values.additional);
    Object.assign(fullData.spouse, values.spouse);
    Object.assign(fullData.personal, values.personal);


    await updateUserProfile(fullData);
    initialData.value = fullData; // Refresh initial data with saved values
    emit('show-message', { message: 'Profile updated successfully!', type: 'success' });
    // Optionally redirect, or stay on the page
  } catch (error) {
    emit('show-message', { message: 'Failed to update profile.', type: 'error' });
  }
};
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

/* Tabs layout */
.profile-tabs {
  display: flex;
  width: 100%;
  gap: 2rem;
  background: transparent;
  flex-direction: row;
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
  color: black;
}
.nav-button:hover {
  color: black;
}

.mobile-tab-nav {
  display: none;
}

.profile-content {
  flex-grow: 1;
  padding-bottom: 50px;
}

.content-area {
  padding-left: 0;
}

.basic-details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* New styles for clickable avatar */
.avatar-upload-container {
  position: relative;
  cursor: pointer;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
}
.avatar-upload-container .p-avatar {
  width: 8rem;
  height: 8rem;
}
.avatar-overlay {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 100% 200%;
  border-bottom-right-radius: 100% 200%;
  background: rgba(0,0,0,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.avatar-upload-container:hover .avatar-overlay {
  opacity: 1;
}
.avatar-overlay .pi {
  font-size: 2rem;
}

.fields-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}
.input-group label {
  font-weight: bold;
}
.input-group .p-error {
  font-size: 0.875rem;
  height: 1em;
  color: #cd0202;
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

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.save-button {
  background-color: #212529 !important;
  border: 1px solid #212529 !important;
  color: white !important;
}

.cancel-button {
  background-color: transparent !important;
  border: 1px solid #212529 !important;
  color: #212529 !important;
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
  .basic-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
