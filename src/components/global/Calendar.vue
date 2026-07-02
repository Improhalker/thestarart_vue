<template>
  <div
    class="border-2 border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg)] p-2"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-2 border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg-secondary)] px-2 py-1 mb-2"
    >
      <button
        class="w-6 h-6 border border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg)] text-[var(--color-ts-ui-text)] hover:bg-[var(--color-ts-ui-bg-tertiary)] active:translate-y-px"
        @click="prevMonth"
      >
        ◀
      </button>

      <div
        class="text-[11px] font-black uppercase tracking-widest text-[var(--color-ts-ui-text)]"
      >
        Calendar.exe — {{ monthNames[currentMonth] }} {{ currentYear }}
      </div>

      <button
        class="w-6 h-6 border border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg)] text-[var(--color-ts-ui-text)] hover:bg-[var(--color-ts-ui-bg-tertiary)] active:translate-y-px"
        @click="nextMonth"
      >
        ▶
      </button>
    </div>

    <!-- Dias -->
    <div
      class="grid grid-cols-7 border border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg-secondary)] text-[9px] font-bold uppercase text-center text-[var(--color-ts-ui-text-soft)] mb-1"
    >
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">SU</div>
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">MO</div>
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">TU</div>
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">WE</div>
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">TH</div>
      <div class="py-1 border-r border-[var(--color-ts-ui-border-dark)]">FR</div>
      <div class="py-1">SA</div>
    </div>

    <!-- Calendário -->
    <div class="grid grid-cols-7 gap-px bg-[var(--color-ts-ui-border-dark)]">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="aspect-square flex items-center justify-center text-[10px] font-bold bg-[var(--color-ts-ui-bg)] transition-colors"
        :class="
          day
            ? [
                'cursor-pointer hover:bg-[var(--color-ts-ui-bg-tertiary)]',

                isToday(day)
                  ? 'bg-[var(--color-ts-ui-accent)] text-black'
                  : isPast(day)
                  ? 'text-[var(--color-ts-ui-text-soft)]'
                  : 'text-[var(--color-ts-ui-text)]',
              ]
            : 'bg-[var(--color-ts-ui-bg-secondary)]'
        "
      >
        <span v-if="day">
          {{ day.getDate() }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="mt-2 border border-[var(--color-ts-ui-border-dark)] bg-[var(--color-ts-ui-bg-secondary)] px-2 py-1 text-[9px] uppercase flex justify-between text-[var(--color-ts-ui-text-soft)]"
    >
      <span>System Calendar v1.0</span>
      <span>{{ today.toLocaleDateString("pt-BR") }}</span>
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
