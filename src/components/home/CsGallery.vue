<script setup>
import CardWindowHeader from '../global/CardWindowHeader.vue';
</script>
<template>
    <div class="bg-black
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]">
        <CardWindowHeader title="Gallery_Viewer.exe" />

        <div class="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">

            <!-- THUMB -->
            <div class="relative overflow-hidden aspect-video
            border-2 border-[#1a0215]
            border-r-[var(--ts-primary-pink)]
            border-b-[var(--ts-primary-pink)]
            group bg-black">

                <iframe 
      src="https://www.youtube.com/embed/EcQeubZPH8U?autoplay=0&controls=0&modestbranding=1&rel=0"
      class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>

                <div
                    class="absolute inset-0 pointer-events-none bg-pink-900/10 mix-blend-color group-hover:bg-transparent transition-all">
                </div>

                <div
                    class="absolute bottom-0 left-0 bg-pink-600 text-white text-[14px] px-2 py-1 uppercase font-bold z-10 shadow-[2px_-2px_0px_black]">
                    LIVE_PREVIEW: PENEIRA AT0N GAMING
                </div>
            </div>
            <!-- TEXTO -->
            <div class="flex flex-col justify-center p-4
                 bg-[#13011a]
                 border-2 border-[#1a0215]
                 border-r-[var(--ts-primary-pink)]
                 border-b-[var(--ts-primary-pink)]">
                <span class="text-pink-500 text-[10px] font-bold uppercase mb-1">
                    Status: Rendering...
                </span>

                <p class="text-pink-100 text-[12px] leading-tight uppercase tracking-tight">
                    Explorando novas estéticas para conteúdo de esports e arte digital.
                </p>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div v-for="stat in ['Rank: 12', 'KDR: 1.2', 'Main: AWP', 'Map: Mirage']" :key="stat" class="p-2 text-center bg-[#13011a]
               border-2 border-[var(--ts-primary-pink)]
               border-r-[#2a0221] border-b-[#2a0221]">
            <span class="text-pink-400 text-[9px] font-bold uppercase">
                {{ stat }}
            </span>
        </div>
    </div>
</template>