<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useAchievements } from "@/composables/useAchievements";

const isAngry = ref(false);
const isHolding = ref(false);
const position = ref({ x: 0, y: 0 });
const dragStart = ref({ x: 0, y: 0, originX: 0, originY: 0 });
const petElement = ref<HTMLElement | null>(null);
const { unlock } = useAchievements();

const petStyle = computed(() => ({
  transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
}));

const stopHolding = () => {
  if (!isHolding.value) return;
  isHolding.value = false;
  isAngry.value = false;
};

const movePet = (event: PointerEvent) => {
  if (!isHolding.value) return;

  const rect = petElement.value?.getBoundingClientRect();
  if (!rect) return;

  const nextX = dragStart.value.originX + event.clientX - dragStart.value.x;
  const nextY = dragStart.value.originY + event.clientY - dragStart.value.y;
  const minX = -rect.left + position.value.x;
  const maxX = window.innerWidth - rect.right + position.value.x;
  const minY = -rect.top + position.value.y;
  const maxY = window.innerHeight - rect.bottom + position.value.y;

  position.value = {
    x: Math.min(maxX, Math.max(minX, nextX)),
    y: Math.min(maxY, Math.max(minY, nextY)),
  };
};

const startHolding = (event: PointerEvent) => {
  if (event.button !== 0) return;

  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  dragStart.value = {
    x: event.clientX,
    y: event.clientY,
    originX: position.value.x,
    originY: position.value.y,
  };
  isHolding.value = true;
  isAngry.value = true;

  unlock({
    id: "dont_touch_mascot",
    title: "MASCOTE EM PROTESTO",
    description: "Você segurou a Madoka. Ela não aprovou a experiência.",
    icon: "💢",
  });
};

onMounted(() => {
  const img = new Image();
  img.src = "/images/admin/madoka-no.gif";
  window.addEventListener("pointerup", stopHolding);
  window.addEventListener("pointercancel", stopHolding);
});

onBeforeUnmount(() => {
  window.removeEventListener("pointerup", stopHolding);
  window.removeEventListener("pointercancel", stopHolding);
});
</script>

<template>
  <div
    ref="petElement"
    class="admin-pet-container fixed bottom-22 left-0 z-40 flex flex-col items-end lg:bottom-12"
    :style="petStyle"
  >
    <div
      class="relative flex h-32 w-32 touch-none items-end justify-center overflow-visible select-none md:h-42 md:w-42"
      :class="isHolding ? 'cursor-grabbing' : 'cursor-grab'"
      role="button"
      tabindex="0"
      aria-label="Segure e arraste a Madoka"
      @pointerdown="startHolding"
      @pointermove="movePet"
      @pointerup="stopHolding"
      @pointercancel="stopHolding"
    >
      <span
        v-if="isHolding"
        class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap border-2 border-black bg-red-200 px-2 py-1 text-[10px] font-black text-black shadow-[2px_2px_0_black]"
      >
        Ei! Me solta!
      </span>
      <img
        :src="isAngry ? '/images/admin/madoka-no.gif' : '/images/admin/madoka.gif'"
        alt="Madoka, mascote arrastável"
        draggable="false"
        class="h-auto w-full pixelated transition-transform duration-150"
        :class="isAngry ? 'scale-100 drop-shadow-[4px_4px_0px_red] md:scale-125' : 'scale-80 drop-shadow-[2px_2px_0px_black] md:scale-100'"
      />
    </div>
  </div>
</template>
