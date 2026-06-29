<template>
  <div
    class="border-2 border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg)] p-3"
  >
    <!-- Header -->
    <div class="flex text-[var(--color-ts-ui-text)] items-center justify-between mb-3">
      <button class="text-xs font-bold uppercase hover:opacity-70" @click="prevMonth">
        ◀
      </button>

      <div class="text-xs font-black tracking-widest">
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </div>

      <button class="text-xs font-bold uppercase hover:opacity-70" @click="nextMonth">
        ▶
      </button>
    </div>

    <!-- Dias da semana -->
    <div
      class="grid grid-cols-7 text-[var(--color-ts-ui-text)] text-[9px] text-center mb-2 opacity-70"
    >
      <div>SU</div>
      <div>MO</div>
      <div>TU</div>
      <div>WE</div>
      <div>TH</div>
      <div>FR</div>
      <div>SA</div>
    </div>

    <!-- Calendário -->
    <div class="grid grid-cols-7 gap-1 text-[10px]">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="h-8 flex items-center justify-center border transition"
        :class="
          day
            ? [
                'border-[var(--color-ts-ui-border-dark)] cursor-pointer hover:bg-[var(--color-ts-ui-bg-tertiary)]',
                isToday(day)
                  ? 'bg-[var(--color-ts-ui-accent)] text-white font-black shadow-md'
                  : isPast(day)
                  ? 'bg-[var(--color-ts-ui-bg-tertiary)] text-[var(--color-ts-ui-text-soft)] opacity-70'
                  : 'text-[var(--color-ts-ui-text)]',
              ]
            : 'border-transparent'
        "
      >
        {{ day ? day.getDate() : "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const today = new Date();

const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendar: (Date | null)[] = [];

  // Espaços vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.push(null);
  }

  // Dias do mês
  for (let day = 1; day <= lastDay.getDate(); day++) {
    calendar.push(new Date(year, month, day));
  }

  return calendar;
}

const days = computed(() => getCalendarDays(currentYear.value, currentMonth.value));

function isToday(date: Date) {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isPast(date: Date) {
  const d = new Date(date);
  const t = new Date(today);

  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);

  return d < t;
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}
</script>
