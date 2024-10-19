import api from "@/services/apiConfig";

const getPermissions = async () => {
    const response = await api.get(`/permissions`);
    return response.data;
};

export { getPermissions };
