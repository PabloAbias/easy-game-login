<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid";
import Credenciais from "./Credenciais.vue";
import { onMounted, ref } from "vue";
const dados = ref(null);
const delay = ref(2000);

function setDados(data) {
  window.electronAPI.saveData("usuario", data);
}

function attTudo() {
  getDados();
}

async function getDados() {
  dados.value = await window.electronAPI.getData("usuario");
}

async function novoItem() {
  const obj = {
    email: "",
    senha: "",
    nome: "",
    id: Date.now(),
  };

  dados.value.push(obj);
  const data = dados.value
  setDados(JSON.parse(JSON.stringify(data)));
}

onMounted(() => {
  getDados();
});
</script>

<template>
  <div class="flex items-center justify-center flex-1 flex-col gap-8">
    <div class="font-bold flex flex-col text-center text-blue-300">
      <h3 class="text-xl">Bem Vindo ao</h3>
      <h1 class="text-3xl">Easy Game Login</h1>
    </div>

    <div class="text-left flex flex-col w-3/4">
      <div class="flex pb-2 items-center">
        <h4 class="opacity-80">Credenciais:</h4>
        <div class="flex-1"></div>
        <button class="border rounded p-1 border-emerald-600" @click="novoItem">
          <PlusIcon class="w-3 h-3 text-emerald-600" />
        </button>
      </div>

      <div class="w-full flex flex-col gap-2">
        <Credenciais
          v-for="(dado) in dados"
          v-bind:key="dado.id"
          :dado="dado"
          :attTudo="attTudo"
          :delay="delay"
        />
      </div>
    </div>
  </div>
</template>
