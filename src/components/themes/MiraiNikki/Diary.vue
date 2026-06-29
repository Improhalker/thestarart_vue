<template>
  <div
    class="py-8 bg-cover bg-no-repeat"
    style="background: url('/images/mirainikkibackground.jpg')"
  >
    <div
      class="flex flex-col w-72 h-[980px] diary-blue rounded-3xl border-4 border-[#21454c] place-self-center mx-auto my-10"
    >
      <div
        class="h-full px-5 pt-8 pb-0 border-4 rounded-2xl border-[#21454c] rounded-b-none"
      >
        <div
          class="bg-gray-800 w-full h-full rounded-b-none py-4 px-2 border-black border-2"
        >
          <div
            class="flex flex-col bg-gray-300 w-full h-full max-h-[400px] overflow-y-auto scrollbar-subtle"
          >
            <div class="bg-[#2e592c] relative flex items-center text-center w-full h-10">
              <MailIcon class="absolute left-2" />
              <span class="text-2xl mx-auto">Diary</span>
            </div>
            <div class="content text-sm font-mono text-black p-2">
              <div v-for="entry in diaryEntries" :key="entry.id" class="mb-4">
                <span class="font-bold">
                  {{ entry.date }}
                </span>

                <span class="ml-2">
                  {{ entry.time }}
                </span>

                <p class="hyphens-auto font-mono">{{ entry.content }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white w-16 h-2 place-self-center mt-1"></div>
        </div>
      </div>
      <div class="border-[#21454c] border-2 flex h-[200px] bg-[#21454c] pb-2">
        <div class="w-16 bg-[#4596a9] rounded-2xl rounded-t-none border-t-0"></div>
        <div class="relative w-full h-full bg-[#4596a9]">
          <div
            class="absolute grid grid-cols-3 -bottom-4 w-full h-1/2 bg-[#4c99ab] border-4 border-[#21454c]"
          >
            <div class="bg-white bg-flex border-1 border-gray-900">
              <div class="h-2 bg-[#87b2bc]"></div>
              <div class="h-5 bg-[#4596a9]"></div>
              <div class="h-2 bg-[#537175]"></div>
            </div>
            <div class="bg-white bg-flex border-1 border-gray-900">
              <div class="h-2 bg-[#87b2bc]"></div>
              <div class="h-5 bg-[#4596a9]"></div>
              <div class="h-2 bg-[#537175]"></div>
            </div>
            <div class="bg-white bg-flex border-1 border-gray-900">
              <div class="h-2 bg-[#87b2bc]"></div>
              <div class="h-5 bg-[#4596a9]"></div>
              <div class="h-2 bg-[#537175]"></div>
            </div>
          </div>
        </div>
        <div class="w-16 bg-[#4596a9] rounded-2xl rounded-t-none border-t-0"></div>
      </div>
      <div class="h-full diary-blue rounded-3xl">
        <div class="p-8 text-black space-y-4 mt-10 lg:mt-4">
          <div class="flex justify-around">
            <div class="flex justify-center items-center flex-col gap-4">
              <CornerUpLeft
                class="text-black border-black p-1 rounded-full bg-white border-1"
                :size="32"
              />
              <PhoneOutgoing
                class="text-black border-black p-1 rounded-full bg-white border-1"
                :size="32"
              />
            </div>
            <div class="scale-120">
              <div
                class="p-3 relative w-24 h-24 bg-white rounded-full border-1 border-black"
              >
                <div class="absolute inset-0 rounded-full border m-1"></div>

                <button class="absolute top-3 left-1/2 -translate-x-1/2">
                  <ChevronUp />
                </button>

                <button class="absolute left-3 top-1/2 -translate-y-1/2">
                  <ChevronLeft />
                </button>

                <button class="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronRight />
                </button>

                <button class="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <ChevronDown />
                </button>

                <button
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  OK
                </button>
              </div>
            </div>
            <div class="flex flex-col justify-center items-center gap-4">
              <Mail
                class="text-black border-black p-1 rounded-full bg-white border-1"
                :size="32"
              />
              <PhoneOff
                class="text-black border-black p-1 rounded-full bg-white border-1"
                :size="32"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="key in keypad"
              :key="key"
              class="bg-gray-100 text-sm text-center px-2 py-1 border-2 border-gray-500"
            >
              {{ key }}
            </button>
          </div>

          <div
            class="w-16 h-2 bg-[#3f8a9b] border-1 border-black rounded-3xl place-self-center"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.diary-blue {
  background-color: #64adcd;
}

.diary-blue-dark-1 {
  background-color: #4d8497;
}

.diary-blue-dark-2 {
  background-color: #538f90;
}

.scrollbar-subtle::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-subtle::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-subtle::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
}

.scrollbar-subtle::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
</style>

<script setup lang="ts">
import {
  Mail,
  PhoneOutgoing,
  PhoneOff,
  CornerUpLeft,
  ChevronUp,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  MailIcon,
} from "lucide-vue-next";

const keypad = [
  "clear",
  "memmo",
  "manner",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "*",
  "0",
  "#",
];

const diaryEntries = [
  {
    date: "Jun 23, 2026",
    time: "09:06 AM",
    content:
      "Na verdade deu tudo errado, a Furia perdeu a final de um major, eu e meu time perdemos na semifinal de um campeonato que queriamos muito ganhar. Estive conversansdo ontem na terapia sobre muita coisa, tenho bastante coisa a melhorar.",
  },
  {
    date: "Jun 18, 2026",
    time: "13:06 PM",
    content:
      "Hoje esta para ser um dia bem divertido, vou assistir a Furia CS disputar as quartas de finais no Major, amanha terei um churras com os crias, sabado cinema com minha namorada... enfim, vai ser um final de semana bem divertido, Deus nos abencoe.",
  },
  {
    date: "Jun 9, 2026",
    time: "15:56 PM",
    content:
      "Essa é minha primeira anotação nesse diário e inclusive uma previa do sistema do diario sera lancada",
  },
  {
    date: "Jun 08, 2026",
    time: "08:12 AM",
    content: "Sem muitas anotacoes para dias anteriores, apenas visualizacao de layout.",
  },
  {
    date: "Jun 11, 2026",
    time: "23:48 PM",
    content: "DEAD END",
  },
];
</script>
