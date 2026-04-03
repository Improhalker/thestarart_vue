<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string | number
  type?: string
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-col gap-1 w-full text-ts-black">
    <label class="text-[10px] font-black uppercase tracking-widest">{{ label }}</label>
    <input 
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="bg-white border-2 border-black p-2 text-xs font-bold focus:bg-ts-blue/5 outline-none shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_var(--ts-retro-shadow)] transition-all"
    />
  </div>
</template>