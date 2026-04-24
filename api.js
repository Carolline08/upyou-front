const BASE_URL = 'https://upyou-backend.onrender.com/api';

async function apiRequest(endpoint, method = 'GET', body = null) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro API:', error.message);
        throw error;
    }
}

async function registerUser(name) {
    return await apiRequest('/users/register', 'POST', { name });
}

async function loginUser(name) {
    return await apiRequest('/users/login', 'POST', { name });
}

async function getChallenges() {
    return await apiRequest('/challenges');
}

async function createChallenge(data) {
    return await apiRequest('/challenges', 'POST', data);
}

async function saveProgress(data) {
    return await apiRequest('/progress', 'POST', data);
}

