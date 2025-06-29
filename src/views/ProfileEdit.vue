<template>
  <ProfileLayout
      :isEditable="true">
    <!-- Default slot for the main content, receives activeTabId from the layout -->
    <template #default="{ activeTabId }">
      <div v-if="initialData" class="profile-content-wrapper">
        <!-- Basic Details Form -->
        <div v-show="activeTabId === 'basic'" class="content-area">
          <Form @submit="handleUpdate" :initial-values="{ basic: initialData.basic }" :validation-schema="basicSchema" v-slot="{ meta }">
            <div class="basic-details-grid">
              <!-- USE THE NEW COMPONENT HERE -->
              <ProfileAvatar
                  :isEditable="true"
                  :imageUrl="initialData.basic.profileImage"
                  @image-selected="handleImageSelected"
              />
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
            <footer class="form-actions-inline">
              <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
            </footer>
          </Form>
        </div>

        <!-- Additional Details Form -->
        <div v-show="activeTabId === 'additional'" class="content-area">
          <Form @submit="handleUpdate" :initial-values="{ additional: initialData.additional }" :validation-schema="additionalSchema" v-slot="{ errors, meta }">
            <div class="edit-form-layout">
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
                  <Select :model-value="value" @update:modelValue="handleChange" :options="['Single', 'Married']" />
                </Field>
              </div>
            </div>
            <footer class="form-actions-inline">
              <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
            </footer>
          </Form>
        </div>

        <!-- Other forms would follow the same pattern -->
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
            <footer class="form-actions-inline">
              <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
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
            <footer class="form-actions-inline">
              <Button type="submit" label="SAVE & UPDATE" class="save-button" :disabled="!meta.valid" />
            </footer>
          </Form>
        </div>
      </div>
      <div v-else>
        <p>Loading form...</p>
      </div>
    </template>
  </ProfileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import { fetchUserProfile, updateUserProfile } from '../services/api';

// Reusable Components
import ProfileLayout from '../layouts/ProfileLayout.vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import ProfileAvatar from "@/components/ProfileAvatar.vue";


const router = useRouter();
const emit = defineEmits(['show-message']);
const initialData = ref(null);
const fileInput = ref(null);
const imagePreview = ref(null);

// Schemas for each form
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

const triggerFileUpload = () => fileInput.value.click();

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
};

onMounted(async () => {
  initialData.value = await fetchUserProfile();
});

const handleUpdate = async (values) => {
  try {
    const fullData = JSON.parse(JSON.stringify(initialData.value));
    Object.assign(fullData.basic, values.basic);
    Object.assign(fullData.additional, values.additional);

    await updateUserProfile(fullData);
    initialData.value = fullData;
    emit('show-message', { message: 'Profile updated successfully!', type: 'success' });
  } catch (error) {
    emit('show-message', { message: 'Failed to update profile.', type: 'error' });
  }
};
</script>

<style scoped>
.content-area {
  padding-left: 0;
}

.basic-details-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  align-items: flex-start;
}
.fields-section, .edit-form-layout {
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

.form-actions-inline {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.save-button {
  background-color: #212529 !important;
  border: 1px solid #212529 !important;
  color: white !important;
  min-width: 150px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 0; /* Changed to left-align the button */
  display: block;
  border-radius: 0.25rem;
  transition: background-color 0.2s; /* Added for smooth transition */
}
.save-button:hover:not(:disabled) {
  background-color: #343a40 !important; /* Slightly lighter */
  border-color: #343a40 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}
.save-button:disabled {
  background-color: #373c40 !important;
  border: 1px solid #373c40 !important;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .basic-details-grid {
    grid-template-columns: 1fr;
  }
  .save-button {
    grid-column: 1 / -1; /* Make button span the full width */
    margin-top: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    min-width: 100%;
  }
}
</style>
