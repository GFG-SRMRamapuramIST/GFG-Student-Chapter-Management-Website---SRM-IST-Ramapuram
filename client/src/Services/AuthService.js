import api from './api';

const AuthService = {
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};

export default AuthService;