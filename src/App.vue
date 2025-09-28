<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import Main from "./components/Main.vue";
import LogChanges from "./components/LogChanges.vue";

function fecharApp() {
  window.electronAPI.closeApp();
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-zinc-900 text-zinc-300 border-zinc-300"
  >
    <div class="absolute top-0 right-0 flex">
      <div class="flex-1"></div>
      <button @click="fecharApp" class="bg-red-500 px-2 py-2 rounded">
        <XMarkIcon class="w-4 h-4 text-white" />
      </button>
    </div>
    <Main />
    <div class="p-2 flex">
      <LogChanges />
      <div class="flex-1"></div>
      <div class="flex gap-2">
        <span class="opacity-25">Criado por</span>
        <b class="text-sky-400">Pablo Abias</b>
      </div>
    </div>
  </div>
</template>
