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

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.error ||
                `Erro ${response.status}: falha na requisição`
            );
        }

        return data;

    } catch (error) {
        console.error('Erro API real:', error.message);
        throw error;
    }
}

async function registerUser(name) {
    return apiRequest('/users/register', 'POST', { name });
}

async function loginUser(name) {
    return apiRequest('/users/login', 'POST', { name });
}

async function getChallenges() {
    return apiRequest('/challenges');
}

async function createChallenge(data) {
    return apiRequest('/challenges', 'POST', data);
}

async function updateChallenge(id, data) {
    return apiRequest(`/challenges/${id}`, 'PUT', data);
}

async function deleteChallenge(id) {
    return apiRequest(`/challenges/${id}`, 'DELETE');
}

async function saveProgress(data) {
    return apiRequest('/progress', 'POST', data);
}