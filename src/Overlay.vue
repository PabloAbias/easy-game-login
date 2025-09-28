<script setup>
import { ref, onMounted } from "vue";

const numero = ref(0);

const copiado = ref(["", "E-mail", "Senha", "OPT"]);

onMounted(() => {
  window.electronAPI.onNumero(() => {
    numero.value = numero.value + 1;
  });
});
</script>

<template>
  <div
    class="min-h-screen bg-zinc-900 rounded flex"
  >
    <div class="flex-1 flex items-center justify-center border rounded"
      :class="{
        'border-emerald-400': numero == 0,
        'border-sky-400': numero == 1,
        'border-amber-400': numero == 2,
        'border-purple-400': numero == 3,
      }"
    >
      <span :class="{
        'text-sky-400': numero == 1,
        'text-amber-400': numero == 2,
        'text-purple-400': numero == 3,
      }">
        {{ copiado[numero] }}
      </span>
    </div>
  </div>
</template>
