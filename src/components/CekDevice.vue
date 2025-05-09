<template>
    <div v-if="showDesktopWarning" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <!-- Main Modal -->
      <div class="animate-scale-in bg-white rounded-2xl p-8 max-w-md text-center space-y-6 mx-4">
        <!-- Phone Animation -->
        <div class="relative inline-block animate-float">
          <div class="text-6xl">📱</div>
          <div class="absolute -right-12 top-8 text-4xl animate-bounce">👇</div>
        </div>
  
        <!-- Content -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800">Mohon gunakan HP!</h2>
          <p class="text-gray-600">
            Untuk pengalaman terbaik, silahkan buka di smartphone Anda <br>
            Atau perkecil layar browser anda.
            <span class="block mt-2">🔄 Putar device untuk mode landscape/portrait</span>
          </p>
        </div>
  
        <!-- QR Code Alternative (Optional) -->
        <div class="pt-4 border-t border-dashed">
          <p class="text-sm text-gray-500">Buka link ini untuk membukanya pada hp:</p>
          <div class="inline-block p-2 bg-gray-100 rounded-lg mt-2 animate-pulse">
            waifd.vercel.app
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const showDesktopWarning = ref(false)
  
  // Detect mobile device
  const checkDevice = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isSmallScreen = window.innerWidth < 1024
    showDesktopWarning.value = !isMobile && !isSmallScreen
  }
  
  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDevice)
  })
  </script>
  
  <style>
  /* Floating animation */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  /* Scale-in animation */
  @keyframes scale-in {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .animate-scale-in {
    animation: scale-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  
  /* Custom bounce */
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-bounce {
    animation: bounce 1.5s infinite;
  }
  </style>