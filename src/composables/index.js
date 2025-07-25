import axios from "axios";

const api_key = "CUKIMAYANJAY7778yhuyjhhguywdbaswu909u98";
const url = 'https://api.aliffajriadi.my.id/botwa';

const headers = {
  'x-api-key': api_key,
  'Content-Type': 'application/json',
};

export async function getStat() {
  try {
    await axios.get(`${url}/api/test`, { headers });
    return true;
  } catch (error) {
    return false;
  }
}

export async function kirimPesan(nomor, pesan) {
  try {
    const response = await axios.post(
      `${url}/api/kirim`,
      {
        nomor: nomor,
        pesan: `Kirim Pesan Langsung:\n\n${pesan}`
      },
      { headers }
    );
    return response.data.message;
  } catch (error) {
    return error?.response?.data || error;
  }
}

export async function getSaran() {
  try {
    const response = await axios.get(`${url}/api/saran`, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function kirimSaran(nama, no_wa, pesan) {
  try {
    const response = await axios.post(
      `${url}/api/kirimsaran`,
      {
        nama: nama,
        pesan: pesan,
        no_wa: no_wa
      },
      { headers }
    );
    return response.data.message;
  } catch (error) {
    return { message: "gagal" };
  }
}

export async function broadcast(tujuan, pesan) {
  try {
    const response = await axios.post(
      `${url}/api/broadcast`,
      {
        tujuan: tujuan,
        pesan: pesan
      },
      { headers }
    );
    return response.data.message;
  } catch (error) {
    return error?.response?.data || error;
  }
}

export async function kirimConfess(id, pesan) {
  try {
    const dibuat = new Date();
    const response = await axios.post(
      `${url}/api/confess`,
      {
        id_users: id,
        pesan: pesan,
        dibuat: dibuat
      },
      { headers }
    );
    return {
      status: response.status,
      message: response.data.message
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Gagal Mengirim Confess"
    };
  }
}
