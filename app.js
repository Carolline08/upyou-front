let state = {
    xp: 0,
    level: 1,
    streak: 0,
    habits: [],
    badges: [],
    currentView: 'auth',
    user: ''
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playSuccess() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}

function renderAuth() {
    document.getElementById('app').innerHTML = `
        <div class="p-6 flex items-center justify-center min-h-screen bg-gray-100">
            <div class="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm text-center">
                <h1 class="text-4xl font-black mb-6">UpYou</h1>

                <input
                    id="name"
                    placeholder="Seu nome"
                    class="w-full p-4 border rounded-2xl mb-4"
                >

                <button
                    onclick="login()"
                    class="w-full bg-green-600 text-white font-bold py-4 rounded-2xl mb-3"
                >
                    ENTRAR
                </button>

                <p class="text-xs text-gray-500">
                    Não tem conta?
                    <span
                        onclick="showRegister()"
                        class="text-green-600 font-bold cursor-pointer"
                    >
                        Cadastre-se
                    </span>
                </p>
            </div>
        </div>
    `;
}

function showRegister() {
    document.getElementById('app').innerHTML = `
        <div class="p-6 flex items-center justify-center min-h-screen bg-gray-100">
            <div class="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm text-center">
                <h1 class="text-4xl font-black mb-6">UpYou</h1>

                <input
                    id="name"
                    placeholder="Seu nome"
                    class="w-full p-4 border rounded-2xl mb-4"
                >

                <button
                    onclick="register()"
                    class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mb-3"
                >
                    CRIAR CONTA
                </button>

                <p
                    onclick="renderAuth()"
                    class="text-xs text-green-600 cursor-pointer"
                >
                    Voltar para login
                </p>
            </div>
        </div>
    `;
}

async function register() {
    const name = document.getElementById('name').value.trim();

    if (!name) {
        return alert('Digite seu nome');
    }

    try {
        await registerUser(name);
        alert('Conta criada com sucesso');
        renderAuth();
    } catch (error) {
        alert(error.message);
    }
}

async function login() {
    const name = document.getElementById('name').value.trim();

    if (!name) {
        return alert('Digite seu nome');
    }

    try {
        const user = await loginUser(name);

        state.user = user.name;
        state.currentView = 'home';

        await loadChallenges();
    } catch (error) {
        alert(error.message);
    }
}

async function loadChallenges() {
    try {
        const data = await getChallenges();

        state.habits = data.map(item => ({
            id: item._id,
            name: item.title,
            progress: item.status === 'completed' ? 100 : 0
        }));
    } catch (error) {
        state.habits = [];
    }

    render();
}

function render() {
    document.getElementById('app').innerHTML = `
        <div class="p-6">
            <h1 class="text-3xl font-black mb-4">
                Olá, ${state.user}
            </h1>

            ${state.habits.map(habit => `
                <div class="bg-white p-4 rounded-2xl shadow mb-3">
                    <p class="font-bold">${habit.name}</p>
                    <p>${habit.progress}% concluído</p>
                </div>
            `).join('')}
        </div>
    `;
}

renderAuth();
