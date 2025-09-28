<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";

const showLogChange = ref(false);
</script>

<template>
  <div class="">
    <b class="text-sky-400 opacity-10" @click="showLogChange = true">v1.2.0</b>
    <div
      class="fixed w-2/3 h-4/5 bg-zinc-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded flex flex-col"
      v-if="showLogChange"
    >
      <div class="flex">
        <div class="flex-1"></div>
        <button
          @click="showLogChange = false"
          class="bg-red-500 px-2 py-2 rounded"
        >
          <XMarkIcon class="w-4 h-4 text-white" />
        </button>
      </div>

      <div class="p-4 flex-col flex-1 flex gap-4">
        <div>
          <b>v.1.2.0</b>
          <ul class="list-disc pl-8">
            <li>Alerta visual, para complementar com o alerta sonoro</li>
            <li>Quadro de novidades por versão</li>
          </ul>
        </div>
        <div>
          <b>v.1.1.0</b>
          <ul class="list-disc pl-8">
            <li>Importar/Exportar</li>
          </ul>
        </div>
      </div>

      <div class="p-2 flex">
        <div class="flex-1"></div>
        <small>Ultima atualização: <b>28/09/2025</b></small>
      </div>
    </div>
  </div>
</template>
