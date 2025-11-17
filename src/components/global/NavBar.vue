<script setup lang="ts">
import { ref, reactive } from "vue";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Menu } from "lucide-vue-next";
import { Headphones } from "lucide-vue-next";

const menuItems = [
  { label: "Home", href: "#" },
  { label: "Sobre", href: "#" },
  { label: "Portfólio", href: "#" },
  { label: "Contato", href: "#" },
  { label: "Blog", href: "#" },
];

const hoverImage = "https://png.pngtree.com/png-vector/20231227/ourlarge/pngtree-kawai-anime-girl-vector-png-image_11382225.png";

const isHovering = ref(false);
const hoverPosition = reactive({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  const imgWidth = 256; 
  const imgHeight = 256; 

  const padding = 20; 

  if (e.clientX + imgWidth + padding > window.innerWidth) {
    hoverPosition.x = window.innerWidth - imgWidth - padding;
  } else {
    hoverPosition.x = e.clientX;
  }

  if (e.clientY + imgHeight + padding > window.innerHeight) {
    hoverPosition.y = window.innerHeight - imgHeight - padding;
  } else {
    hoverPosition.y = e.clientY;
  }
};

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};
</script>

<template>
  <header class="w-full flex justify-between items-center p-4 bg-black text-white relative">
    <div class="text-xl font-bold">TheStarArt_</div>

    <Dialog>
      <DialogTrigger as-child>
        <button class="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition">
          Menu <Menu class="w-6 h-6" />
        </button>
      </DialogTrigger>

      <DialogContent class="bottom-18! left-0! translate-x-0! translate-y-0! w-screen h-screen p-0 bg-black text-white flex border-black flex-col justify-center items-center relative max-w-full!"
        >
        <div class="flex flex-col items-center gap-6 text-2xl lg:text-[50px] ts-font-main font-light text-white/80">
          <template v-for="item in menuItems" :key="item.label">
            <DialogClose as-child>
              <a
                :href="item.href"
                class="transition hover:text-white relative"
                @mouseenter="handleMouseEnter"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              >
                {{ item.label }}
              </a>
            </DialogClose>
          </template>
        </div>
        <h1 class="absolute top-4 left-4">TheStarArt_</h1>

        <!-- Imagem aparecendo instantaneamente -->
        <img
          v-if="isHovering"
          :src="hoverImage"
          alt="Hover Preview"
          class="w-64 h-64 rounded-lg shadow-lg pointer-events-none fixed transition-transform duration-50"
          :style="{ left: hoverPosition.x + 20 + 'px', top: hoverPosition.y + 20 + 'px' }"
        />

        <DialogClose as-child>
          <button class="absolute bottom-8 text-white text-lg transition">
            Fechar
          </button>
        </DialogClose>
         <div class="absolute bottom-4 right-4 flex sm:gap-8 ts-font-main text-3xl text-gray-100">
            <a>YT</a>
            <a>FB</a>
            <a>IG</a>
        </div>
        <div class="absolute left-4 bottom-4 text-white">
            <Headphones size="32"/>
        </div>
      </DialogContent>
    </Dialog>
  </header>
</template>
