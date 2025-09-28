<script setup>
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/vue/24/solid";
import Credenciais from "./Credenciais.vue";
import { onMounted, ref } from "vue";
const dados = ref(null);
const delay = ref(2000);
const avisoImport = ref(null);
const successAvisoImport = ref(null);


function mostrarAvisoSucessoImport() {
  successAvisoImport.value.classList.add("animate-pulse");
  successAvisoImport.value.classList.remove("hidden");
  setTimeout(() => {
    successAvisoImport.value.classList.add("hidden");
    successAvisoImport.value.classList.remove("animate-pulse");
  }, 3000);
}

function mostrarAvisoImport() {
  avisoImport.value.classList.add("animate-pulse");
  avisoImport.value.classList.remove("hidden");
  setTimeout(() => {
    avisoImport.value.classList.add("hidden");
    avisoImport.value.classList.remove("animate-pulse");
  }, 3000);
}

function setDados(data) {
  window.electronAPI.saveData("usuario", data);
}

function attTudo() {
  getDados();
}

async function getDados() {
  dados.value = (await window.electronAPI.getData("usuario")) || [];
}

async function novoItem() {
  const obj = {
    email: "",
    senha: "",
    nome: "",
    otpSecret: "",
    id: Date.now(),
  };

  dados.value.push(obj);
  const data = dados.value;
  setDados(JSON.parse(JSON.stringify(data)));
}

async function importarDados() {
  const dadosImportados = await window.electronAPI.importData();
  try {
    const json = JSON.parse(dadosImportados);
    [json.email, json.senha, json.nome, json.otpSecret].forEach(
      (e) => {
        if (!e) throw new Error("Dados inválidos");
      }
    );
    
    json.id = Date.now();

    dados.value.push(json);
    const data = dados.value;
    setDados(JSON.parse(JSON.stringify(data)));
  } catch (error) {
    mostrarAvisoImport();
  }
  attTudo();
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
      <div
        ref="avisoImport"
        class="border border-red-800 rounded p-2 bg-red-900/20 mb-4 text-red-600 hidden"
      >
        Não foi possível importar os dados.
      </div>
      <div
        ref="successAvisoImport"
        class="border border-emerald-800 rounded p-2 bg-emerald-900/20 mb-4 text-emerald-600 hidden"
      >
        Dados importados com sucesso.
      </div>
      <div class="flex pb-2 items-center">
        <h4 class="opacity-80">Credenciais:</h4>
        <div class="flex-1"></div>
        <div class="flex gap-2">
          <button
            @click="importarDados"
            class="border rounded p-1 border-yellow-600"
            title="Importar Dados"
          >
            <ArrowDownTrayIcon class="w-3 h-3 text-yellow-600" />
          </button>
          <button
            class="border rounded p-1 border-emerald-600"
            @click="novoItem"
          >
            <PlusIcon class="w-3 h-3 text-emerald-600" />
          </button>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2">
        <Credenciais
          v-for="dado in dados"
          v-bind:key="dado.id"
          :dado="dado"
          :attTudo="attTudo"
          :delay="delay"
          :mostrarAvisoSucessoImport="mostrarAvisoSucessoImport"
        />
      </div>
    </div>
  </div>
</template>
