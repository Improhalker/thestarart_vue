<script setup>
import CardWindowHeader from '../global/CardWindowHeader.vue';
</script>
<template>

     <div class="bg-[#03010e]
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]">
            <CardWindowHeader title="Thought_Terminal.exe" />

            <div class="p-4 font-mono space-y-4 text-sm">
                <div>
                    <p class="text-pink-600">>> WHOAMI</p>
                    <p class="text-pink-100 pl-3 border-l border-pink-900">
                        Gabriel Estrela — dev, artista e player de CS.
                        Curto misturar código com estética retrô e caótica.
                    </p>
                </div>

                <div>
                    <p class="text-pink-600">>> CURRENT_INTERESTS</p>
                    <ul class="text-pink-100 pl-3 space-y-1">
                        <li>- Análise de demos de CS2</li>
                        <li>- UI retro / pixel / industrial</li>
                        <li>- Sistemas SaaS próprios</li>
                    </ul>
                </div>

                <div class="text-pink-500 animate-pulse text-xs">
                    _ aguardando input...
                </div>
            </div>
        </div>

</template>