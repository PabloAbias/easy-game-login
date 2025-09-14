<script setup>
import { onMounted } from 'vue'
import Main from "./components/Main.vue";

function fecharApp() {
  window.electronAPI.closeApp();
}

function setDados() {
  window.electronAPI.saveData("usuario", {
    nome: "Pablo",
    email: "teste@teste.com",
    senha: "123",
  });
}

async function getDados() {
  const dados = await window.electronAPI.getData("usuario");
  console.log("Dados do storage:", dados);
}

onMounted(() => {
  getDados()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-900">
    <div class="absolute top-0 right-0 flex">
      <div class="flex-1"></div>
      <button
        @click="fecharApp"
        class="bg-red-500 text-white px-4 py-2 rounded"
      >
        X
      </button>
    </div>
    <Main />
  </div>
</template>
