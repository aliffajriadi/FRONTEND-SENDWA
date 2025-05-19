<script setup>
import { ref, onMounted } from "vue";
import { broadcast } from "../composables";
import Notif from "../components/Notif.vue";

// Form dan UI state
const selectedGroup = ref("");
const message = ref("");
const isLoading = ref(false);
const isSent = ref(false);
const errorMessage = ref("");
const token = ref("");
const formShake = ref(false);

// Notifikasi state
const notif = ref({
    message: "",
    status: true, // true = success, false = error
    id: 0
});

// Grup WA
const groups = [
    { id: "120363319945608143@g.us", name: "Grup Kelas IF 2D Pagi" },
    { id: "120363324737971526@g.us", name: "Grup Kelas IF 2D COWOK" },
    { id: "120363030494134340@g.us", name: "DEMO TESTING" },
];

// Modal peringatan state
const showWarningModal = ref(false);
const fadeInModal = ref(false);

onMounted(() => {
    // Animation effect when component mounts
    setTimeout(() => {
        document.querySelector('.broadcast-container').classList.add('slide-in-active');
    }, 100);
    
    // Cek apakah modal sudah pernah ditampilkan sebelumnya
    if (!sessionStorage.getItem("warningModalShown")) {
        // Jika belum, tampilkan modal
        showWarningModal.value = true;
        // Animate modal in
        setTimeout(() => {
            fadeInModal.value = true;
        }, 50);
        // Simpan status bahwa modal sudah ditampilkan
        sessionStorage.setItem("warningModalShown", "true");
    }
});

const sendBroadcast = async () => {
    isLoading.value = true;

    try {
        // Error handling with animation effects
        if (!selectedGroup.value) {
            errorMessage.value = "Silakan pilih grup";
            shakeForm();
            isLoading.value = false;
            return;
        }
        if (token.value !== "ifdsolid" && token.value !== "menyala" || !token.value.trim()) {
            notif.value = {
                message: `Token Salah`,
                status: false,
                id: Date.now()
            }
            shakeForm();
            isLoading.value = false;
            return;
        }

        if (!message.value.trim()) {
            errorMessage.value = "Pesan tidak boleh kosong";
            shakeForm();
            isLoading.value = false;
            return;
        }

        const response = await broadcast(selectedGroup.value, message.value);
        notif.value = {
            message: `Berhasil, ${response}` || "Pesan broadcast berhasil dikirim!",
            status: true,
            id: Date.now()
        };

        // Success animation
        document.querySelector('.broadcast-container').classList.add('success-pulse');
        setTimeout(() => {
            document.querySelector('.broadcast-container').classList.remove('success-pulse');
        }, 1000);

        selectedGroup.value = "";
        token.value = '';
        message.value = "";
        isSent.value = true;

        setTimeout(() => {
            isSent.value = false;
        }, 3000);
    } catch (error) {
        notif.value = {
            message: `Gagal mengirim: ${error.message}`,
            status: false,
            id: Date.now()
        };
        shakeForm();
    } finally {
        isLoading.value = false;
    }

    errorMessage.value = "";
};

const shakeForm = () => {
    formShake.value = true;
    setTimeout(() => {
        formShake.value = false;
    }, 500);
};

const closeWarningModal = () => {
    fadeInModal.value = false;
    setTimeout(() => {
        showWarningModal.value = false;
    }, 300);
};
</script>

<template>
    <!-- Komponen Notifikasi -->
    <Notif :notif="notif" />
    
    <!-- Form Broadcast -->
    <div class="broadcast-container slide-in bg-white shadow-lg pb-32 rounded-lg p-8 transition-all duration-300" :class="{ 'shake': formShake }">
        <div class="flex items-center mb-6">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Fitur Broadcast</h1>
        </div>
    
        <div class="space-y-6">
            <div class="transform transition-all duration-500 hover:scale-[1.01]">
                <!-- Pilih Grup -->
                <div class="mb-4">
                    <label for="group" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pilih Grup
                    </label>
                    <select 
                        v-model="selectedGroup" 
                        id="group" 
                        class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300">
                        <option value="" disabled>-- Pilih Grup --</option>
                        <option v-for="group in groups" :key="group.id" :value="group.id" class="py-2">
                            {{ group.name }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label for="token" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Token Akses
                    </label>
                    <input 
                        v-model="token" 
                        type="text" 
                        id="token"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                        placeholder="Masukkan Token untuk Broadcast ....."
                    >
                </div>
                
                <!-- Pesan -->
                <div class="mb-6">
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Pesan Broadcast
                    </label>
                    <textarea 
                        v-model="message" 
                        id="message" 
                        rows="6" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                        placeholder="Ketik pesan broadcast..."
                    ></textarea>
                </div>
    
                <!-- Error -->
                <div v-if="errorMessage" class="mb-4 text-red-600 text-sm flex items-center bg-red-100 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {{ errorMessage }}
                </div>
    
                <!-- Tombol -->
                <button 
                    @click="sendBroadcast" 
                    class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md" 
                    :disabled="isLoading"
                >
                    <svg
                        v-if="isLoading"
                        class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span v-if="isLoading" class="flex items-center">
                        Mengirim...
                        <span class="ml-2 inline-block dot-flashing"></span>
                    </span>
                    <span v-else-if="isSent" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Terkirim!
                    </span>
                    <span v-else class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Kirim Broadcast
                    </span>
                </button>
            </div>
        </div>
        <p class="mt-5">Punya Pertanyaan seputar applikasi? <br> CP Developer <br> <span class="font-semibold">62895603792033 => Alif</span> <br> <span class="font-semibold">6289636951323 => Rafif</span></p>
    </div>

    <!-- Modal Peringatan -->
    <div v-if="showWarningModal" class="flex justify-center items-center inset-0 bg-black/50 backdrop-blur-sm z-40 fixed transition-all duration-300">
        <div class="bg-white p-6 rounded-lg shadow-xl transition-all duration-300 transform" :class="{ 'scale-100 opacity-100': fadeInModal, 'scale-90 opacity-0': !fadeInModal }">
            <div class="flex items-center mb-4 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h1 class="font-bold text-xl">Peringatan!!!</h1>
            </div>
            <p class="mb-4 text-gray-700">Fitur ini khusus yang punya token akses saja!</p>
            <button 
                type="button" 
                @click="closeWarningModal" 
                class="bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg text-sm py-2 px-4 mt-2 hover:from-amber-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center w-full shadow-md"
            >
                OK BOSSS
            </button>
        </div>
    </div>
</template>

<style scoped>
.slide-in {
    opacity: 0;
    transform: translateY(20px);
}

.slide-in-active {
    opacity: 1;
    transform: translateY(0);
}

.shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.success-pulse {
    animation: successPulse 1s ease-in-out;
}

@keyframes successPulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.dot-flashing {
    position: relative;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: white;
    animation: dotFlashing 1s infinite linear alternate;
    animation-delay: .5s;
}

.dot-flashing::before, .dot-flashing::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
}

.dot-flashing::before {
    left: -8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: white;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
}

.dot-flashing::after {
    left: 8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: white;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
}

@keyframes dotFlashing {
    0% { background-color: white; }
    50%, 100% { background-color: rgba(255, 255, 255, 0.2); }
}
</style>