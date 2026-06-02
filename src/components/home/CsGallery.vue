<script setup>
import CardWindowHeader from '../global/CardWindowHeader.vue';
</script>
<template>
    <div class="container-style-dark">
        <CardWindowHeader title="Gallery_Viewer.exe" />

        <div class="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">

            <!-- THUMB -->
            <div class="relative overflow-hidden aspect-video">

                <iframe
                    src="https://www.youtube.com/embed/R8IOZNWQqDg?si=FdCJ17geaRKsHiSS&autoplay=0&controls=0&modestbranding=1&rel=0"
                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>

                <div
                    class="absolute inset-0 pointer-events-none bg-pink-900/10 mix-blend-color group-hover:bg-transparent transition-all">
                </div>

                <div
                    class="absolute bottom-0 left-0 bg-pink-600 text-white text-[14px] px-2 py-1 uppercase font-bold z-10 shadow-[2px_-2px_0px_black]">
                    LIVE_PREVIEW: HIGHLIGHTS AT0N Gaming
                </div>
            </div>
            <!-- TEXTO -->
            <div class="container-style-light flex flex-col justify-center p-4">
                <span class="text-pink-500 text-[10px] font-bold uppercase mb-1">
                    Status: Rendering...
                </span>

                <p class="text-pink-100 text-[12px] leading-tight uppercase tracking-tight">
                    Alguns melhores momentos dos ultimos campeonatos representanod a AT0N Gaming, foram alguns
                    campeonatos com menos de 1 mes de time, entao ja estou bem orgulhoso.
                </p>
            </div>
        </div>
    </div>
</template>