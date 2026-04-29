<template>
  <div
    class="max-w-[500px] h-[300px] relative overflow-hidden flex flex-col
    border-2 border-[var(--ui-border)]
    border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)]
    shadow-[8px_8px_0px_rgba(0,0,0,0.6)]
    animate-bounceSlow
    sparkle-bg">

    <!-- HEADER -->
    <div
      class="p-1 flex justify-between items-center animate-pulse
      bg-[var(--ui-accent)]">

      <img src="https://blob.gifcities.org/gifcities/BT657HZEG7Q2GKEXKA4RMKAA5T2W6EJ7.gif" class="h-5" />
      <img src="https://blob.gifcities.org/gifcities/BT657HZEG7Q2GKEXKA4RMKAA5T2W6EJ7.gif" class="h-5" />
      <img src="https://blob.gifcities.org/gifcities/BT657HZEG7Q2GKEXKA4RMKAA5T2W6EJ7.gif" class="h-5" />
      <img src="https://blob.gifcities.org/gifcities/BT657HZEG7Q2GKEXKA4RMKAA5T2W6EJ7.gif" class="h-5" />

      <span
        class="text-[10px] font-black tracking-widest
        text-black">
        ACTIVE_OFFER
      </span>
    </div>

    <!-- CONTENT -->
    <div class="p-4 flex-1 flex flex-col gap-3 backdrop-brightness-[0.95]">

      <!-- INFO -->
      <div
        class="bg-black/70 p-2 border
        border-[var(--ui-border)]/40
        text-[15px] text-white">

        <span class="text-[var(--ui-accent-soft)]">></span> Neomaker Papelaria<br>
        <span class="text-[var(--ui-accent-soft)]">></span> Materiais PROFISSIONAIS de desenho<br>
        <span class="text-[var(--ui-accent-soft)]">></span> Status:
        <span class="text-green-300 animate-pulse"> ATIVO</span>
      </div>

      <!-- CUPOM -->
      <div
        class="notranslate relative border-2 border-dashed border-white p-3 text-center
        bg-black/30 backdrop-blur-sm
        hover:scale-105 transition-transform">

        <p class="text-white text-[10px] uppercase mb-1">
          use o código:
        </p>

        <h3
          class="text-2xl font-sans! text-white font-black tracking-tighter uppercase italic
          drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]
          animate-pulse">
          ESTRELA5
        </h3>

        <!-- glow -->
        <div class="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
      </div>

      <!-- CTA -->
      <button
        class="mt-auto bg-white text-black font-black text-[12px] py-2
        hover:translate-x-1 hover:-translate-y-1
        hover:shadow-[-6px_6px_0px_var(--ui-accent)]
        transition-all duration-200
        relative overflow-hidden">

        <span class="relative z-10">RESGATAR AGORA _</span>

        <div
          class="absolute inset-0
          bg-gradient-to-r from-transparent via-[var(--ui-accent-soft)]/40 to-transparent
          opacity-0 hover:opacity-100 transition"></div>
      </button>

    </div>
  </div>
</template>

<style scoped>
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.animate-bounceSlow {
  animation: bounceSlow 2.5s ease-in-out infinite;
}

.sparkle-bg {
  background:
    url("https://blob.gifcities.org/gifcities/RAB63QVEAB73QGUZU6DNIMIIIRIYTYLQ.gif"),
    linear-gradient(
      135deg,
      var(--ui-accent),
      var(--ui-bg-secondary),
      var(--ui-bg-tertiary)
    );
  background-size: 120px, cover;
  background-repeat: repeat, no-repeat;
}
</style>