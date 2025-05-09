<script setup>
import { getStat } from '../composables';
import { onMounted, ref } from 'vue';

const stat = ref(false);
const loading = ref(true); // Tambahkan state loading

const getFetch = async () => {
    try {
        stat.value = await getStat();
    } catch (error) {
        console.error('Error fetching status:', error);
    } finally {
        loading.value = false; // Matikan loading setelah selesai
    }
};

onMounted(() => {
    getFetch();
});
</script>

<template>
  <!-- Loading Indicator -->
  <div v-if="loading" class="z-50 fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div class="relative bg-white rounded-2xl p-8 flex flex-col items-center max-w-xs">
      <!-- Animasi Chat Bubbles -->
      <div class="flex flex-col items-center space-y-2 mb-4">
        <div class="p-3 rounded-2xl shadow-md bg-blue-100 animate-[chat-bubble_0.8s_ease-in-out_infinite_alternate]">
          💌 Haii selamat datang di IFD...
        </div>
        <div class="p-3 rounded-2xl shadow-md bg-pink-100 animate-[chat-bubble_0.8s_ease-in-out_0.4s_infinite_alternate]">
          🫣 Tunggu sebentar yaa~
        </div>
      </div>

      <!-- Animasi Floating Hearts -->
      <div class="absolute -top-8 flex gap-2">
        <span class="text-2xl animate-float-heart">🔥</span>
        <span class="text-2xl animate-float-heart animation-delay-300">💖</span>
        <span class="text-2xl animate-float-heart animation-delay-600">👋</span>
      </div>

      <p class="text-gray-600 mt-4 font-medium animate-pulse">
        Memeriksa status BOT ...
      </p>
    </div>
  </div>

  <!-- Offline Message (hanya muncul setelah loading selesai) -->
  <div v-else-if="stat === false"
    class="z-50 fixed items-center flex justify-center flex-col inset-0 bg-black/50 backdrop-blur-sm">
    <div class="text-start bg-white rounded px-7 py-7 space-y-2">
      <p class="text-xl font-semibold">Duh Bot Nya Lagi <span class="bg-red-500 p-1 text-white rounded">Offline</span></p>
      <p>Silahkan Contact Ke Nomor Berikut</p>
      <ol class="text-start list-disc pl-4">
        <li>0895-6037-92033 / Alif</li>
        <li>0896-3695-1323 / Rafif</li>
      </ol>
    </div>
  </div>
</template>
<style>
@keyframes chat-bubble {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes float-heart {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-100px) scale(0); opacity: 0; }
}

.animate-float-heart {
  animation: float-heart 1.5s ease-out infinite;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}
</style>