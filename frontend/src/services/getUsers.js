import axiosToken from "../utils/axiosToken";

export const getUsers = {
    getUserLogin: async () => {
        try {
            const response = await axiosToken.get('/users');
            return response.data[0]?.payload || [] ;
        } catch (error) {
            console.error('Error fetching user login',error);
            throw error;
        }
    }
}