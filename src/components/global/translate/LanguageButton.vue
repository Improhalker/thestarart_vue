<script setup lang="ts">
interface Props {
  lang: string
  label: string
}

const props = defineProps<Props>()
const emit = defineEmits(['select'])

function handleClick() {
  emit('select', props.lang)
}
</script>

<template>
  <button @click="handleClick" class="lang-btn">
    {{ label }}
  </button>
</template>

<style scoped>
.lang-btn {
  padding: 10px 16px;
  border: 2px solid black;
  background: #253342;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.lang-btn:hover {
  transform: scale(1.05);
  background: #3e5954;
}
</style>