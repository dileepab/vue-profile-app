<template>
  <div class="login-form-container">
    <div class="login-header">
      <h2>Welcome to <strong>myApp</strong></h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ errors, meta }">
      <div class="form-grid-layout">
        <!-- User ID Row -->
        <label for="userId" class="form-label">User ID*</label>
        <Field name="userId" v-slot="{ field, value }">
          <InputText id="userId" v-bind="field" :model-value="value" />
        </Field>

        <!-- Password Row -->
        <label for="password" class="form-label">Password*</label>
        <Field name="password" v-slot="{ field, value }">
          <!-- Use 'inputId' to correctly link the label for focus -->
          <Password inputId="password" v-bind="field" :model-value="value" :feedback="false" toggleMask />
        </Field>

        <!-- Checkbox Row -->
        <div class="grid-placeholder"></div> <!-- Empty cell for alignment -->
        <div class="field-checkbox">
          <Field name="keepLoggedIn" type="checkbox" :value="true" v-slot="{ field, value }">
            <!-- Use 'inputId' to link the label for toggling -->
            <Checkbox :inputId="field.name" :name="field.name" :value="true" v-model="field.value" />
            <label :for="field.name" class="ml-2"> Keep me logged in</label>
          </Field>
        </div>

        <div class="grid-placeholder"></div>
        <div>
          <Button type="submit" label="LOGIN" class="login-button" :disabled="!meta.valid" />
        </div>
      </div>

      <div class="register-link">
        <span>No account? </span><router-link to="/register">Register here.</router-link>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import { loginUser } from '../services/api';

// PrimeVue Components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';

const router = useRouter();
const emit = defineEmits(['show-message']);

const schema = yup.object({
  userId: yup.string().required(),
  password: yup.string().required(),
  keepLoggedIn: yup.boolean()
});

const handleLogin = async (values) => {
  try {
    await loginUser(values.userId, values.password);

    if (values.keepLoggedIn) {
      // Set a persistent 1-year cookie
      const date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `isLoggedIn=true; expires=${expires}; path=/`;
      sessionStorage.removeItem('isLoggedIn'); // Clear any session storage
    } else {
      // Use sessionStorage for the current browser session only
      sessionStorage.setItem('isLoggedIn', 'true');
       // Ensure any persistent cookie is removed if the user unchecks the box
      document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    emit('show-message', { message: 'Login successful! Redirecting...', type: 'success' });

    setTimeout(() => {
        router.push('/profile');
    }, 1500);

  } catch (error) {
    emit('show-message', { message: error.message, type: 'error' });
  }
};
</script>

<style scoped>
.login-form-container {
  width: 100%;
  max-width: 550px;
  text-align: center;
  color: black;
}

.login-header h2 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.login-header h2 strong{
  font-weight: bold;
}

.title-separator {
  height: 3px;
  width: 150px;
  background-color: black;
  margin: 0 auto 2.5rem;
}

.form-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.form-label {
  text-align: right;
  font-weight: 500;
}

.register-link {
  margin-top: 1.5rem;
}
.register-link a {
  color: black;
}

.field-checkbox {
  display: flex; /* Added for vertical alignment */
  align-items: center; /* Added for vertical alignment */
  justify-content: flex-start; /* Aligns items to the left */
}

.field-checkbox label {
  color: black;
  cursor: pointer; /* Makes it clear the label is clickable */
  margin-left: .5rem;
}

:deep(.p-inputtext),
:deep(.p-password-input) {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: black;
  width: 100%;
  border-radius: 0.25rem;
}

/* Override browser autofill styles */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.05) inset !important;
  -webkit-text-fill-color: black !important;
  transition: background-color 5000s ease-in-out 0s;
}

.login-button {
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

.login-button:disabled {
    background-color: #373c40 !important;
  border: 1px solid #373c40 !important;
    cursor: not-allowed;
}


:deep(.p-checkbox .p-checkbox-box) {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

:deep(.p-checkbox .p-checkbox-box .p-checkbox-icon) {
  color: black;
}

/* Responsive Styles for Mobile */
@media (max-width: 576px) {
  .form-grid-layout {
    grid-template-columns: 1fr; /* Stack into a single column */
    gap: 0.5rem;
  }

  .form-label {
    text-align: left; /* Align labels to the left */
    margin-bottom: 0.25rem;
  }

  .form-grid-layout .field-checkbox {
    grid-column: 1 / -1; /* Make checkbox span the full width */
    margin-top: 1rem;
  }

  .grid-placeholder {
    display: none; /* Hide the empty placeholders on mobile */
  }

  .login-button {
    grid-column: 1 / -1; /* Make button span the full width */
    margin-top: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    min-width: 100%;
  }
}
</style>
