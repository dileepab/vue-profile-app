<template>
  <div class="avatar-section">
    <div
        class="avatar-upload-container"
        @click="isEditable && triggerFileUpload()"
        :class="{ 'editable': isEditable }"
    >
      <Avatar :image="imagePreview || imageUrl" size="xlarge" shape="circle" />
      <div v-if="isEditable" class="avatar-overlay">
        <i class="pi pi-upload"></i>
      </div>
    </div>
    <input
        v-if="isEditable"
        type="file"
        ref="fileInput"
        @change="onFileSelect"
        style="display: none;"
        accept="image/*"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Avatar from 'primevue/avatar';

const props = defineProps({
  imageUrl: String,
  isEditable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['image-selected']);

const fileInput = ref(null);
const imagePreview = ref(null);

const triggerFileUpload = () => {
  fileInput.value.click();
};

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    emit('image-selected', file);
  }
};
</script>

<style scoped>
.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avatar-upload-container {
  position: relative;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
}

.avatar-upload-container.editable {
  cursor: pointer;
}

.p-avatar-xl {
  width: 8rem;
  height: 8rem;
  align-self: center;
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
.avatar-upload-container.editable:hover .avatar-overlay {
  opacity: 1;
}
.avatar-overlay .pi {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .avatar-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
