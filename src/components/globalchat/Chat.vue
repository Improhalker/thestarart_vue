<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  handle: { type: String, default: 'thestarartt' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '300px' }
})

onMounted(() => {
  const script = document.createElement('script')
  
  script.id = 'cid0020000438374339182'
  script.async = true
  script.src = '//st.chatango.com/js/gz/emb.js'
  script.style.width = props.width
  script.style.height = props.height

  script.textContent = JSON.stringify({
    handle: props.handle,
    arch: "js",
    styles: {
      a: "6600cc", b: 86, c: "FFFFFF", d: "FFFFFF",
      f: 86, i: 86, k: "6600cc", l: "6600cc",
      m: "6600cc", n: "FFFFFF", o: 86, p: "10",
      q: "6600cc", r: 86, fwtickm: 1
    }
  })

  const container = document.getElementById('chatango-container')
  if (container) {
    container.appendChild(script)
  }
})

onBeforeUnmount(() => {
  const script = document.getElementById('cid0020000438374339182')
  if (script) script.remove()
  
  const widget = document.querySelector('.chatango_embed')
  if (widget) widget.remove()
})
</script>

<template>
  <div id="chatango-container" class="chatango-wrapper">
    </div>
</template>

<style scoped>
.chatango-wrapper {
  display: flex;
  justify-content: center;
  min-height: 300px; 
}
</style>

