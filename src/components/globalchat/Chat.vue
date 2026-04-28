<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  handle: { type: String, default: 'thestarartt' },
  width: { type: String, default: '199px' },
  height: { type: String, default: '300px' }
})

onMounted(() => {
  // 1. Cria o elemento de script
  const script = document.createElement('script')
  
  // 2. Define o ID e os atributos que o Chatango exige
  script.id = 'cid0020000438374339182'
  script.async = true
  script.src = '//st.chatango.com/js/gz/emb.js'
  script.style.width = props.width
  script.style.height = props.height

  // 3. Define as configurações do widget (o JSON que estava dentro da tag)
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

  // 4. Injeta no componente
  const container = document.getElementById('chatango-container')
  if (container) {
    container.appendChild(script)
  }
})

onBeforeUnmount(() => {
  // Limpeza: remove o script e o widget quando sair da página 
  // para não acumular lixo no DOM ou dar erro de ID duplicado
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
  min-height: 300px; /* Evita layout shift */
}
</style>