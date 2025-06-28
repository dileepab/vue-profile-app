<template>
  <div class="register-form-container">
    <div class="register-header">
      <h2>Register <strong>myApp</strong></h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleRegister" :validation-schema="schema" v-slot="{ errors, meta }">
      <div class="form-grid-layout">
        <!-- User ID Row -->
        <label for="userId" class="form-label">User ID*</label>
        <div class="input-wrapper">
          <Field name="userId" v-slot="{ field, value }">
            <InputText id="userId" v-bind="field" :model-value="value" :class="{'p-invalid': errors.userId}" />
          </Field>
          <small class="p-error error-message">{{ errors.userId }}</small>
        </div>

        <!-- Password Row -->
        <label for="password" class="form-label">Password*</label>
        <div class="input-wrapper">
          <Field name="password" v-slot="{ field, value }">
            <Password inputId="password" v-bind="field" :model-value="value" :feedback="false" toggleMask :class="{'p-invalid': errors.password}" />
          </Field>
          <small class="p-error error-message">{{ errors.password }}</small>
        </div>

        <!-- Confirm Password Row -->
        <label for="confirmPassword" class="form-label">Confirm Password*</label>
        <div class="input-wrapper">
          <Field name="confirmPassword" v-slot="{ field, value }">
            <Password inputId="confirmPassword" v-bind="field" :model-value="value" :feedback="false" :toggleMask="false" :class="{'p-invalid': errors.confirmPassword}" />
          </Field>
          <small class="p-error error-message">{{ errors.confirmPassword }}</small>
        </div>

        <div class="grid-placeholder"></div>
        <div>
          <Button type="submit" label="REGISTER" class="register-button" :disabled="!meta.valid" />
        </div>
      </div>

      <div class="login-link">
        <span>Already have an account? </span><router-link to="/login">Login here.</router-link>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

// PrimeVue Components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const router = useRouter();
const emit = defineEmits(['show-message']);

const schema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

const handleRegister = async (values) => {
    try {
        console.log("Registering user:", values);
        // In a real app, you would call your registration API here.
        // We'll simulate a success.

        // Emit success message to be displayed in the global banner
        emit('show-message', { message: 'Registration successful! Redirecting to login...', type: 'success' });

        // Navigate to the login page after a short delay
        setTimeout(() => {
            router.push('/login');
        }, 2000); // 2-second delay

    } catch (error) {
        // On failure, emit an error message to be displayed in the global banner
        emit('show-message', { message: error.message || 'Registration failed. Please try again.', type: 'error' });
    }
};
</script>

<style scoped>
.register-form-container {
  width: 100%;
  max-width: 550px;
  text-align: center;
  color: black;
}

.register-header h2 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.register-header h2 strong{
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
  align-items: start;
  margin-bottom: 2rem;
}

.form-label {
  text-align: right;
  font-weight: 500;
  padding-top: 0.5rem;
}

.login-link {
  margin-top: 1.5rem;
}
.login-link a {
  color: black;
}

.input-wrapper {
  text-align: left;
}

.error-message {
    line-height: 1.25;
    display: block;
    margin-top: 0.25rem;
    color: #cd0202;
}

.error-message:not(:empty) {
    min-height: 1.25em;
}


:deep(.p-inputtext),
:deep(.p-password-input) {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: black;
  width: 100%;
  border-radius: 0.25rem;
}

:deep(.p-password) {
    width: 100%;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
    -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.05) inset !important;
    -webkit-text-fill-color: black !important;
    transition: background-color 5000s ease-in-out 0s;
}

.register-button {
  background-color: #212529 !important;
  border: 1px solid #212529 !important;
  color: white !important;
  min-width: 150px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 0;
  display: block;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.register-button:disabled {
  background-color: #373c40 !important;
  border: 1px solid #373c40 !important;
  cursor: not-allowed;
}

@media (max-width: 576px) {
  .form-grid-layout {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    align-items: center;
  }

  .form-label {
    text-align: left;
    margin-bottom: 0.25rem;
    padding-top: 0;
  }

  .grid-placeholder {
      display: none;
  }

  .register-button {
    grid-column: 1 / -1;
    margin-top: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    min-width: 100%;
  }

  :deep(.p-inputtext),
  :deep(.p-password-input) {
    padding-top: 0.85rem;
    padding-bottom: 0.85rem;
    font-size: 16px;
  }
}
</style>
