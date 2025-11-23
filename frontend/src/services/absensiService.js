import axiosToken from "../utils/axiosToken";

export const absensiService = {
    getKelasForAbsensi: async () => {
        try {
            const response = await axiosToken.get('/kelas');
            return response.data[0].payload || [];
        } catch (error) {
            console.error('Error fetching kelas for absensi:', error);
            throw error;
        }
    },

    getMuridByKelas: async (kelas_id) => {
        try {
            const response = await axiosToken.get(`/kelas/${kelas_id}/murid`);
            return response.data[0].payload || [];
        } catch (error) {
            console.error('Error fetching murid by kelas:', error);
            throw error;
        }
    },

    getAbsensiToday: async (kelas_id) => {
        try {
            const response = await axiosToken.get(`/kelas/${kelas_id}/absensi/hari-ini`);
            return response.data[0].payload || [];
        } catch (error) {
            console.error('Error fetching absensi today', error);
            throw error;
        }
    },

    createAbsensi: async (absensiData) => {
        try {
            const response = await axiosToken.post('/absensi', absensiData);
            return response.data;
        } catch (error) {
            console.error('Error creating absensi:', error);
            throw error;
        }
    },

    createAbsensiMurid : async (absensiData) => {
        try {
            const response = await axiosToken.post('/absensi/bulk', {absensi: absensiData});
            return response.data
        } catch (error) {
            console.error('Error creating absensi murid', error);
            throw error;
        }
    }
}