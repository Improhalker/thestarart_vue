<template>
  <div class="dashboard-view space-y-6">
    <div class="flex items-center gap-4 border-b-2 border-black pb-2">
       <span class="bg-ts-red text-white px-2 py-1 text-xs uppercase font-bold">System: Active</span>
       <h1 class="text-3xl font-black italic tracking-tighter uppercase text-ts-black">Painel de Controle</h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="border-2 border-black bg-ts-retro-gray shadow-[4px_4px_0px_0px_var(--ts-retro-shadow)]">
        <div class="bg-ts-retro-blue text-white p-1 px-2 text-sm font-bold flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-ts-pink border border-white"></div>
            <span>stats.exe</span>
          </div>
          <span class="cursor-pointer hover:bg-red-500 px-1">?</span>
        </div>
        <div class="p-4 bg-white m-1 border border-gray-400">
          <p class="text-xs font-bold uppercase text-ts-blue">Database Sync:</p>
          <p class="text-lg font-black mt-1">2 Músicas</p>
          <div class="w-full bg-gray-200 h-6 mt-2 border-2 border-black p-[2px]">
             <div class="bg-ts-pink h-full w-[40%]"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-ts-blue/10 border-l-4 border-ts-blue p-4 mt-8">
      <p class="text-sm leading-tight font-bold italic">
        > Bem-vindo, Gabriel. <br>
        > Aguardando entrada de dados no TheStarArt_...
      </p>
    </div>
  </div>
</template>

<!-- 
IDEAS, ICONS FOR DASHBOARD VIEW
2000S VIBES

https://cyber.dabamos.de/88x31/
https://gifcities.org/search?q=skyline&offset=0&page_size=200
https://www.webdesignmuseum.org/golden-age-of-web-design -->