<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSaran, kirimConfess } from '../composables'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import Notif from '../components/Notif.vue';

const selectedName = ref(null)
const currentCount = ref(0)
const targetCount = ref(0)

const notif = ref({
    message: "",
    status: true,
    id: 0
});
const message = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isSent = ref(false)

const names = [
    { id: '6282362052767@s.whatsapp.net', label: 'Bastian' },
    { id: '6288806539990@s.whatsapp.net', label: 'Naufal' },
    { id: '6282283585589@s.whatsapp.net', label: 'Zahra' },
    { id: '62895603792033@s.whatsapp.net', label: 'Alif' },
    { id: '6281261309525@s.whatsapp.net', label: 'Adrian' },
    { id: '6281235616582@s.whatsapp.net', label: 'Alamsyah' },
    { id: '628983704948@s.whatsapp.net', label: 'Andre' },
    { id: '6285182954744@s.whatsapp.net', label: 'Anisa' },
    { id: '6282285455631@s.whatsapp.net', label: 'Dwiky' },
    { id: '6282392636883@s.whatsapp.net', label: 'Elbryan' },
    { id: '6281379406190@s.whatsapp.net', label: 'Farisa' },
    { id: '6281363494443@s.whatsapp.net', label: 'Gadiza' },
    { id: '6281364591170@s.whatsapp.net', label: 'Gisella' },
    { id: '6282271287753@s.whatsapp.net', label: 'Marwan' },
    { id: '6282384848815@s.whatsapp.net', label: 'Auriel' },
    { id: '6282388216902@s.whatsapp.net', label: 'Putri' },
    { id: '6282392299581@s.whatsapp.net', label: 'Rafa' },
    { id: '6289636951323@s.whatsapp.net', label: 'Rafif' },
    { id: '6282286430352@s.whatsapp.net', label: 'Raymond' },
    { id: '628994857150@s.whatsapp.net', label: 'Rio' },
    { id: '6282268660185@s.whatsapp.net', label: 'Rivaldo' },
    { id: '6287878551249@s.whatsapp.net', label: 'Suci' },
    { id: '6281364650118@s.whatsapp.net', label: 'Syahriandi' },
    { id: '6282172300825@s.whatsapp.net', label: 'Zetta' },
    { id: '6287794519131@s.whatsapp.net', label: 'Zhari' },
    { id: '6281993151267@s.whatsapp.net', label: 'Kristiani' },
]

const animateCount = () => {
    const step = Math.ceil(targetCount.value / 100)
    const interval = setInterval(() => {
        if (currentCount.value < targetCount.value) {
            currentCount.value += step
        } else {
            currentCount.value = targetCount.value
            clearInterval(interval)
        }
    }, 20)
}

const countConfess = async () => {
    const response = await getSaran()
    targetCount.value = response.countConfessTotal + 40
    animateCount()
}

const sendConfess = async () => {
    if (!selectedName.value || !message.value.trim()) {
        errorMessage.value = 'Nama dan pesan tidak boleh kosong!'
        notif.value = {
            message: "Nama dan pesan tidak boleh kosong!",
            status: false,
            id: Date.now()
        }
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const result = await kirimConfess(selectedName.value.id, message.value) // pakai .id untuk ID WhatsApp
        if (result.status === 200) {
            notif.value = {
                message: result.message,
                status: true,
                id: Date.now()
            }
            isSent.value = true
            message.value = ''
            selectedName.value = null
            countConfess()
        } else {
          notif.value = {
                message: result.message,
                status: false,
                id: Date.now()
            }
        }
    } catch (e) {
        errorMessage.value = 'Gagal mengirim. Coba lagi.'
        notif.value = {
            message: "Gagal Mengirim, Silahkan Hubungi Developer untk Mengatasi ini",
            status: false,
            id: Date.now()
        }
    } finally {
        isLoading.value = false
        setTimeout(() => isSent.value = false, 3000)
    }

}

onMounted(() => {
    countConfess()
})
</script>

<template>
    <Notif :notif="notif" />
    <section class="px-4 py-6 max-w-xl mx-auto pb-60">
        <div class="text-center mb-10">
            <h1 class="text-3xl font-bold text-gray-800">Confess ke IF D Class yukk 💌</h1>
            <h2 class="text-7xl font-extrabold text-green-500 mt-4">{{ currentCount }}</h2>
            <p class="text-gray-500">Total Confess yang sudah dikirim</p>
        </div>
    
        <div class="bg-white shadow-md rounded-lg p-6 space-y-6 transition-all duration-300 border border-gray-200">
            <div>
                <label class="block text-gray-700 font-medium mb-1">Mau Confess ke siapa nichhh</label>
                <Multiselect v-model="selectedName" :options="names" :searchable="true" :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Ketik nama untuk cari dan pilih..." label="label" track-by="id" class="multiselect-custom" />
            </div>
    
            <div>
                <label class="block text-gray-700 font-medium mb-1">Pesan kmuu</label>
                <textarea v-model="message" rows="5" placeholder="Tulis isi confessmu..." class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"></textarea>
            </div>
    
            <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
            <div v-if="isSent" class="text-green-600 font-semibold">Berhasil dikirim! 🎉</div>
    
            <button @click="sendConfess" :disabled="isLoading" class="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-all duration-200">
            {{ isLoading ? 'Mengirim...' : 'Kirim Confess Sekarang' }}
          </button>
        </div>
        <div class="text-slate-500 mt-5 space-y-2">
          <h3 class="text-2xl">Notes:</h3>
          <p>* Confess ini bersifat <b>Anonim</b> dan tidak dapat dilihat oleh siapapun pengirimnya.</p>
          <p>* Penerima pesan akan dapat melihat notifikasi realtime lewat whatsapp</p>
          <p>* Pengirim Dilarang Menggunakan Kata kata kasar dan tidak sopan.</p>
        </div>
    </section>
</template>

<style scoped>
/* Optional: styling tambahan multiselect */

.multiselect-custom ::v-deep .multiselect {
    min-height: 48px;
}
</style>
