import axios from "axios";

const url = 'https://8d9e0587e2b9a613419085575e8412ab.serveo.net'

export async function getStat() {
    try {
        await axios.get(`${url}/api/test`);
        return true;
    } catch (error) {
        return false;
    }
};
export async function kirimPesan(nomor, pesan) {
    try {
        const response = await axios.post(`${url}/api/kirim`, {
            nomor: nomor,
            pesan: `Kirim Pesan Langsung:\n\n${pesan}`
        });
        return response.message
    } catch (error) {
        return error
    }
}
export async function getSaran() {
    try {
        const response = await axios.get(`${url}/api/saran`);
        return response.data; // Mengembalikan data dari respons
    } catch (error) {
        console.error(error); 
        return null; 
    }
}
export async function kirimSaran(nama, no_wa, pesan) {
    try {
        const response = await axios.post(`${url}/api/kirimsaran`, {
            nama: nama,
            pesan: pesan,
            no_wa: no_wa
        });
        return response.data.message
    } catch (error) {
        return {message: "gagal"}   
    }
}

export async function broadcast(tujuan, pesan) {
    try {
        const response = await axios.post(`${url}/api/broadcast`, {
            tujuan: tujuan,
            pesan: pesan
        });
        return response.data.message
    } catch (error) {
        return error
    }
}
export async function kirimConfess(id, pesan){
    try {
      const dibuat = new Date()
      const response = await axios.post(`${url}/api/confess`, {
        id_users: id,
        pesan: pesan,
        dibuat: dibuat
      });
      return {
        status: response.status,
        message: response.data.message
      }
    } catch (error) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Gagal Mengirim Confess"
      }
    }
  }
  


