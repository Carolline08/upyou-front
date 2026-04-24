let state = {
    xp: 0,
    level: 1,
    streak: 0,
    habits: [],
    badges: [],
    currentView: 'auth',
    user: ''
};

const API_URL = 'http://localhost:3000/api/challenges';



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

                <input id="name" placeholder="Seu nome"
                    class="w-full p-4 border rounded-2xl mb-4 outline-none focus:border-green-500">

                <button onclick="login()"
                    class="w-full bg-green-600 text-white font-bold py-4 rounded-2xl mb-3">
                    ENTRAR
                </button>

                <p class="text-xs text-gray-500">
                    Primeiro acesso? só digite seu nome e entre
                </p>

            </div>

        </div>
    `;
}

function login() {
    const name = document.getElementById('name').value.trim();

    if (!name) return alert('Digite seu nome');

    const user = JSON.parse(localStorage.getItem('upyouAuth'));

    if (!user) {
        localStorage.setItem('upyouAuth', JSON.stringify({ name }));
    }

    state.user = name;
    state.currentView = 'home';

    loadChallenges();
}



function goHome() {
    state.currentView = 'home';
    render();
}

function goEvolution() {
    state.currentView = 'evolution';
    render();
}



async function loadChallenges() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        state.habits = data.map(item => ({
            id: item._id,
            name: item.title,
            progress: item.status === 'completed' ? 100 : 0
        }));

    } catch (err) {
        state.habits = [
            { id: 1, name: "Academia", progress: 0 },
            { id: 2, name: "Água", progress: 0 }
        ];
    }

    render();
}



function progressHabit(id) {
    state.habits = state.habits.map(h => {
        if (h.id === id && h.progress < 100) {
            h.progress += 20;
            state.xp += 10;

            if (h.progress >= 100) {
                h.progress = 100;
                state.streak += 1;
                playSuccess();
            } else {
                playClick();
            }

            state.level = Math.floor(state.xp / 100) + 1;
        }
        return h;
    });

    checkBadges();
    render();
}

function removeHabit(id) {
    state.habits = state.habits.filter(h => h.id !== id);
    render();
}

function addHabit(e) {
    e.preventDefault();

    const input = document.getElementById('new-habit');
    if (!input.value) return;

    state.habits.push({
        id: Date.now(),
        name: input.value,
        progress: 0
    });

    input.value = '';
    playClick();
    render();
}



function checkBadges() {
    if (state.xp >= 50 && !state.badges.includes('Iniciante')) {
        state.badges.push('Iniciante');
        playSuccess();
    }
}



function render() {
    const app = document.getElementById('app');

    if (state.currentView === 'auth') {
        renderAuth();
        return;
    }

    const xpPercent = state.xp % 100;

    const header = `
    <div class="bg-purple-600 text-white p-8 rounded-b-3xl">

        <h1 class="text-4xl font-black">UpYou</h1>
        <p>Olá, ${state.user}</p>

        <div class="mt-4 bg-white/20 h-2 rounded">
            <div style="width:${xpPercent}%" class="bg-white h-2 rounded"></div>
        </div>

        <div class="grid grid-cols-3 gap-3 mt-6 text-center">
            <div>🔥 ${state.streak}</div>
            <div>⭐ ${state.level}</div>
            <div>⚡ ${state.xp}</div>
        </div>

    </div>
    `;

    let content = '';

    if (state.currentView === 'home') {
        content = `
        <div class="p-6">

            <form onsubmit="addHabit(event)" class="mb-6">
                <input id="new-habit"
                    placeholder="Novo hábito..."
                    class="w-full p-4 border rounded-2xl mb-3">

                <button class="w-full bg-green-600 text-white font-bold py-3 rounded-2xl">
                    Adicionar
                </button>
            </form>

            ${state.habits.map(h => `
                <div onclick="progressHabit(${h.id})"
                    class="bg-white p-5 rounded-3xl shadow-md mb-3 flex justify-between items-center cursor-pointer">

                    <div class="flex-1 mr-3">
                        <p class="font-bold">${h.name}</p>

                        <div class="w-full bg-gray-200 h-2 mt-2 rounded">
                            <div class="bg-green-500 h-2 rounded"
                                style="width:${h.progress}%"></div>
                        </div>

                        <p class="text-xs text-gray-400 mt-1">${h.progress}%</p>
                    </div>

                    <button onclick="event.stopPropagation(); removeHabit(${h.id})"
                        class="text-red-400 font-bold">
                        ✕
                    </button>

                </div>
            `).join('')}

        </div>
        `;
    }

    if (state.currentView === 'evolution') {
        content = `
        <div class="p-6 text-center">

            <h2 class="text-2xl font-black mb-4">Evolução</h2>

            <div class="text-5xl mb-2">🏆</div>
            <p class="text-3xl font-black text-green-600">${state.xp} XP</p>

            <div class="mt-6">
                ${state.badges.map(b => `
                    <span class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                        ${b}
                    </span>
                `).join('')}
            </div>

        </div>
        `;
    }

    const nav = `
    <div class="fixed bottom-4 left-4 right-4 bg-black text-white p-3 rounded-full flex justify-around">

        <button onclick="goHome()">Home</button>
        <button onclick="goEvolution()">Evolução</button>

    </div>
    `;

    app.innerHTML = header + content + nav;
}

/* INIT */

state.currentView = 'auth';
renderAuth();