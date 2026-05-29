<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  handle: { type: String, default: 'thestarartcommunityt' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '347px' }
})

const SCRIPT_ID = 'cid0020000438378533753'

onMounted(() => {
  if (document.getElementById(SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.src = '//st.chatango.com/js/gz/emb.js'
  script.style.width = props.width
  script.style.height = props.height

  script.textContent = JSON.stringify({
    handle: props.handle,
    arch: "js",
    styles: {
      a: "6600cc",
      b: 78,
      c: "FFFFFF",
      d: "FFFFFF",
      f: 78,
      i: 78,
      k: "6600cc",
      l: "6600cc",
      m: "6600cc",
      n: "FFFFFF",
      o: 78,
      p: "10",
      q: "6600cc",
      r: 78,
      cnrs: "0.35"
    }
  })

  const container = document.getElementById('chatango-container')
  if (container) {
    container.appendChild(script)
  }
})

onBeforeUnmount(() => {
  const script = document.getElementById(SCRIPT_ID)
  if (script) script.remove()

  const widget = document.querySelector('.chatango_embed')
  if (widget) widget.remove()
})
</script>

<template>
  <div id="chatango-container" class="chatango-wrapper my-4 md:my-0 mb-6 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] ">
  </div>
</template>

<style scoped>
.chatango-wrapper {
  display: flex;
  justify-content: center;
  min-height: 347px;
}

@media screen and (max-width: 550px) {
  .chatango-wrapper {
    width: 326px;
    place-self: center;
  }
}
</style>