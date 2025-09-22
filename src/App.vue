<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import Main from "./components/Main.vue";

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
      <button
        @click="fecharApp"
        class="bg-red-500 px-2 py-2 rounded"
      >
        <XMarkIcon class="w-4 h-4 text-white" />
      </button>
    </div>
    <Main />
    <div class='p-2 flex'>
      <small><b>v1.0.0</b> </small>
      <div class='flex-1'></div>
      <div>Criado por <b>Pablo Abias</b> </div>
    </div>
  </div>
</template>
