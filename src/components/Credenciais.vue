<script setup>
import {
  Cog8ToothIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/vue/24/solid";
import { ref } from "vue";
import { TOTP, Secret } from "otpauth";

const audioUrl = new URL("@/assets/notificacao.mp3", import.meta.url);

const totp = new TOTP({
  algorithm: "SHA1",
  digits: 6,
  period: 30,
});

const props = defineProps({
  dado: {
    type: Object,
    required: true,
  },
  attTudo: {
    type: Function,
    required: true,
  },
  delay: {
    type: Number,
    required: true,
  },
  mostrarAvisoSucessoImport: {
    type: Function,
    required: true,
  },
});

const otpSecret = ref(props.dado.otpSecret || "");
const otpCode = ref("------");
const idUnico = ref(props.dado.id);
const email = ref("");
const senha = ref("");
const userName = ref(props.dado.nome);

const showConfig = ref();

function atualizarOTP() {
  if (otpSecret.value) {
    totp.secret = Secret.fromBase32(props.dado.otpSecret);
    const token = totp.generate();

    otpCode.value = token;
  } else {
    otpCode.value = "------";
  }
}

async function configurar() {
  email.value = "";
  senha.value = "";
  otpSecret.value = "";
  showConfig.value = !showConfig.value;
}

function PlayNotify() {
  const audio = new Audio(audioUrl);
  audio.volume = 0.1;
  audio.play();
}


function ShowOverlay() {
  window.electronAPI.showOverlay();
}
function HideOverlay() {
  window.electronAPI.hideOverlay();
}

async function copiarTudo() {
  ShowOverlay()
  await new Promise((resolve) => setTimeout(resolve, props.delay));

  PlayNotify();
  copiarEmail();
  await new Promise((resolve) => setTimeout(resolve, props.delay));

  PlayNotify();
  copiarSenha();
  await new Promise((resolve) => setTimeout(resolve, props.delay));

  PlayNotify();
  copiarOTP();
  await new Promise((resolve) => setTimeout(resolve, props.delay));

  HideOverlay();
}

function copiarEmail() {
  window.electronAPI.copyToClipboard(props.dado.email);
}

function copiarSenha() {
  window.electronAPI.copyToClipboard(props.dado.senha);
}

function copiarOTP() {
  atualizarOTP();
  window.electronAPI.copyToClipboard(otpCode.value);
}

async function puxarDados(params) {
  return await window.electronAPI.getData("usuario");
}

async function setDados(dados) {
  window.electronAPI.saveData("usuario", dados);
  props.attTudo();
}

async function exportar() {
  window.electronAPI.exportToClipboard(JSON.stringify(props.dado));
  props.mostrarAvisoSucessoImport()
}

async function salvarDados() {
  const obj = {
    email: email.value,
    senha: senha.value,
    nome: userName.value,
    otpSecret: otpSecret.value,
  };
  const dadosSalvos = await puxarDados();

  const jaTem = dadosSalvos.find((e) => e.id == idUnico.value);
  if (jaTem) {
    jaTem.nome = obj.nome;
    jaTem.senha = obj.senha;
    jaTem.email = obj.email;
    jaTem.id = idUnico.value;
    jaTem.otpSecret = otpSecret.value;
  } else {
    obj.id = Date.now();
    dadosSalvos.push(obj);
  }

  setDados(dadosSalvos);
}

async function deletar() {
  const dadosSalvos = await puxarDados();
  setDados(dadosSalvos.filter((e) => e.id != idUnico.value));
}
</script>

<template>
  <div class="border rounded p-2 flex flex-col border-zinc-800">
    <div class="flex-1 flex items-center">
      <div class="flex gap-2">
        <b class="text-zinc-600">Usuário: </b>
        <span class="text-sky-400">{{ dado.nome }}</span>
      </div>
      <div class="flex-1"></div>
      <div class="flex gap-3">
        <button
          class="border rounded p-1 border-pink-600"
          @click="exportar"
          title="Exportar Dados"
        >
          <ArrowUpTrayIcon class="w-3 h-3 text-pink-600" />
        </button>
        <div></div>
        <button
          class="border rounded p-1 border-purple-400"
          @click="configurar"
        >
          <Cog8ToothIcon class="w-3 h-3 text-purple-400" />
        </button>
        <button class="border rounded p-1 border-cyan-600" @click="copiarTudo">
          <ClipboardIcon class="w-3 h-3 text-sky-400" />
        </button>
      </div>
    </div>

    <div v-if="showConfig" class="flex flex-col gap-3 p-4">
      <div class="flex flex-col">
        <label for="" class="text-xs">Nome de Usuário</label>
        <input
          v-model="userName"
          type="text"
          class="bg-transparent border-b outline-none p-1"
        />
      </div>
      <div class="flex flex-col">
        <label for="" class="text-xs">E-mail</label>
        <input
          v-model="email"
          type="text"
          class="bg-transparent border-b outline-none p-1"
        />
      </div>
      <div class="flex flex-col">
        <label for="" class="text-xs">Senha</label>
        <input
          v-model="senha"
          type="password"
          class="bg-transparent border-b outline-none p-1"
        />
      </div>
      <div class="flex flex-col">
        <label for="" class="text-xs">Segredo OTP</label>
        <input
          v-model="otpSecret"
          type="password"
          class="bg-transparent border-b outline-none p-1"
        />
      </div>

      <div class="flex gap-2">
        <div class="flex-1"></div>

        <button
          class="border rounded px-2 py-1 border-pink-400 text-pink-400 text-xs"
          @click="deletar"
        >
          Deletar
        </button>
        <button
          class="border rounded px-2 py-1 border-emerald-400 text-emerald-400 text-xs"
          @click="salvarDados"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
