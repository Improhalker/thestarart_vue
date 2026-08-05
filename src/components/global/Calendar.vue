<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "TheStarArtCalendar" });

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(new Date(today));

const monthNames = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const calendar: (Date | null)[] = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    calendar.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    calendar.push(new Date(year, month, day));
  }

  return calendar;
}

const days = computed(() => getCalendarDays(currentYear.value, currentMonth.value));
const selectedDateLabel = computed(() => selectedDate.value.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}));

function isSameDay(first: Date, second: Date) {
  return first.getDate() === second.getDate()
    && first.getMonth() === second.getMonth()
    && first.getFullYear() === second.getFullYear();
}

function isToday(date: Date) {
  return isSameDay(date, today);
}

function isSelected(date: Date) {
  return isSameDay(date, selectedDate.value);
}

function isPast(date: Date) {
  const comparableDate = new Date(date);
  const comparableToday = new Date(today);
  comparableDate.setHours(0, 0, 0, 0);
  comparableToday.setHours(0, 0, 0, 0);

  return comparableDate < comparableToday;
}

function getDayLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function selectDay(date: Date) {
  selectedDate.value = new Date(date);
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
    return;
  }

  currentMonth.value -= 1;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
    return;
  }

  currentMonth.value += 1;
}

function goToToday() {
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
  selectedDate.value = new Date(today);
}
</script>

<template>
  <section
    class="calendar-shell overflow-hidden border-2 border-[var(--ui-border)] border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)] bg-[var(--ui-bg)] p-3 text-[var(--ui-text)] shadow-[6px_6px_0_var(--ts-retro-shadow)] sm:p-4"
    aria-labelledby="calendar-heading">
    <header
      class="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--ui-border)_65%,transparent)] pb-3">
      <div class="min-w-0">
        <p class="font-pixel text-[9px] tracking-[0.16em] text-[var(--ui-accent-soft)]">LOCAL_TIME // ACTIVE</p>
        <h2 id="calendar-heading" class="mt-1 truncate font-pixel text-sm tracking-wide text-white">
          Calendar.exe</h2>
      </div>
      <button type="button"
        class="calendar-today-control shrink-0 border border-[var(--ui-border)] px-2 py-1 font-pixel text-[9px] tracking-[0.08em] text-white"
        @click="goToToday">
        TODAY
      </button>
    </header>

    <div
      class="mt-3 flex items-center justify-between gap-2 rounded-sm border border-[color:color-mix(in_srgb,var(--ui-border)_55%,transparent)] bg-[var(--ui-bg-secondary)] p-1.5">
      <button type="button" class="calendar-nav-control" aria-label="Mês anterior" @click="prevMonth">
        <span aria-hidden="true">‹</span>
      </button>

      <p class="min-w-0 text-center font-pixel text-xs tracking-[0.1em] text-[var(--ui-text)]">
        {{ monthNames[currentMonth] }} <span class="text-white">{{ currentYear }}</span>
      </p>

      <button type="button" class="calendar-nav-control" aria-label="Próximo mês" @click="nextMonth">
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div class="mt-3 grid grid-cols-7 gap-1 text-center" role="grid"
      :aria-label="`Calendário de ${monthNames[currentMonth]} de ${currentYear}`">
      <div v-for="weekDay in weekDays" :key="weekDay"
        class="py-1 font-pixel text-[9px] tracking-wide text-[var(--ui-accent-soft)]" role="columnheader">
        {{ weekDay }}
      </div>

      <template v-for="(day, index) in days" :key="`${currentYear}-${currentMonth}-${index}`">
        <div v-if="!day" class="calendar-empty-day aspect-square" aria-hidden="true"></div>
        <button v-else type="button" class="calendar-day aspect-square" :class="{
          'calendar-day--past': isPast(day),
          'calendar-day--today': isToday(day),
          'calendar-day--selected': isSelected(day),
        }" :aria-label="getDayLabel(day)" :aria-current="isToday(day) ? 'date' : undefined"
          :aria-pressed="isSelected(day)" role="gridcell" @click="selectDay(day)">
          {{ day.getDate() }}
        </button>
      </template>
    </div>

    <footer
      class="mt-3 flex items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--ui-border)_45%,transparent)] pt-3 font-pixel text-[9px] tracking-[0.06em] text-white">
      <span class="text-[var(--ui-accent-soft)]">SELECTED</span>
      <time :datetime="selectedDate.toISOString().slice(0, 10)">{{ selectedDateLabel }}</time>
    </footer>
  </section>
</template>

<style scoped>
.calendar-shell {
  background: linear-gradient(135deg,
      var(--ts-primary-pink) 0%,
      #2d0240 100%);
  background-size: 18px 18px;
}

.calendar-today-control,
.calendar-nav-control,
.calendar-day {
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease, transform 160ms ease;
}

.calendar-today-control:hover,
.calendar-today-control:focus-visible {
  background: color-mix(in srgb, var(--ui-accent) 45%, var(--ui-bg));
  border-color: var(--ui-accent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--ui-glow-pink) 75%, transparent);
}

.calendar-nav-control {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ui-border) 70%, transparent);
  background: var(--ui-bg-tertiary);
  color: var(--ui-text);
  font-family: var(--font-pixel, monospace);
  font-size: 1.35rem;
  line-height: 1;
}

.calendar-nav-control:hover,
.calendar-nav-control:focus-visible {
  border-color: var(--ui-accent);
  background: color-mix(in srgb, var(--ui-accent) 38%, var(--ui-bg));
  box-shadow: 0 0 12px color-mix(in srgb, var(--ui-glow-pink) 72%, transparent);
  transform: translateY(-1px);
}

.calendar-day {
  display: grid;
  min-width: 0;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ui-border) 38%, transparent);
  background: color-mix(in srgb, var(--ui-bg) 78%, var(--ui-bg-secondary));
  color: var(--ui-text);
  font-family: var(--font-pixel, monospace);
  font-size: 0.7rem;
}

.calendar-day:hover,
.calendar-day:focus-visible {
  position: relative;
  z-index: 1;
  border-color: var(--ui-accent);
  background: color-mix(in srgb, var(--ui-accent) 42%, var(--ui-bg));
  box-shadow: 0 0 12px color-mix(in srgb, var(--ui-glow-pink) 65%, transparent);
  transform: scale(1.06);
}

.calendar-day--past {
  color: color-mix(in srgb, var(--ui-text) 43%, var(--ui-bg-tertiary));
}

.calendar-day--today {
  border-color: var(--ui-accent-soft);
  color: var(--ui-accent-soft);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-accent-soft) 40%, transparent);
}

.calendar-day--selected {
  border-color: var(--ui-accent);
  background: var(--ui-accent);
  color: var(--ui-text);
  box-shadow: 0 0 14px color-mix(in srgb, var(--ui-glow-pink) 85%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--ui-text) 28%, transparent);
}

.calendar-empty-day {
  border: 1px solid transparent;
  background: color-mix(in srgb, var(--ui-bg-tertiary) 52%, transparent);
}

.calendar-today-control:focus-visible,
.calendar-nav-control:focus-visible,
.calendar-day:focus-visible {
  outline: 2px solid var(--ui-text);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {

  .calendar-today-control,
  .calendar-nav-control,
  .calendar-day {
    transition: none;
  }
}
</style>
