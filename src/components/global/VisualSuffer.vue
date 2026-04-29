<template>
    <div class="bg-[#13011a] shadow-[10px_10px_0px_rgba(0,0,0,0.5)]
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]">
        <CardWindowHeader title="Visual_Buffer.sys" />

        <div class="p-3 space-y-3">

            <img src="https://blob.gifcities.org/gifcities/KPLVCIAWFP622ITISPJUGSC3TBKYOWOW.gif"
                class="w-full h-auto pixelated" />

            <div class="grid grid-cols-4 gap-2">
                <img v-for="gif in gifs" :key="gif" :src="gif"
                    class="pixelated w-full opacity-90 hover:opacity-100 transition" />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
const gifs = [
    "https://blob.gifcities.org/gifcities/PMFQYNMSGG2B7BZDN7VFMTD7NLD4M4ZK.gif",
    "https://cyber.dabamos.de/88x31/vim.gif",
    "https://cyber.dabamos.de/88x31/css.gif",
    "https://cyber.dabamos.de/88x31/html.gif",
    "https://cyber.dabamos.de/88x31/javascript.gif",
    "https://blob.gifcities.org/gifcities/X55TM3Q2IIIIM3XKSQHIDF3IEUJGIJPY.gif",
    "https://blob.gifcities.org/gifcities/WRYLFERW2IDWJXUIBQQEFX75C2UH7NS4.gif",
    "https://cyber.dabamos.de/88x31/netscape.gif"
];

</script>