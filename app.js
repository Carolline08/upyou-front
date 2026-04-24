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

async function addChallenge() {
    const title = prompt('Nome do novo hábito:');

    if (!title) return;

    try {
        await createChallenge({
            title,
            description: '',
            duration: 30,
            status: 'active'
        });

        playSuccess();
        await loadChallenges();
    } catch (error) {
        alert(error.message);
    }
}

async function completeHabit(id) {
    try {
        await updateChallenge(id, {
            status: 'completed'
        });

        await saveProgress({
            challengeId: id
        });

        state.xp += 10;

        playSuccess();
        await loadChallenges();
    } catch (error) {
        alert(error.message);
    }
}

async function removeHabit(id) {
    try {
        await deleteChallenge(id);
        await loadChallenges();
    } catch (error) {
        alert(error.message);
    }
}

function render() {
    document.getElementById('app').innerHTML = `
        <div class="p-6">

            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-black">
                    Olá, ${state.user}
                </h1>

                <button
                    onclick="addChallenge()"
                    class="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                >
                    + Novo
                </button>
            </div>

            ${state.habits.length === 0 ? `
                <div class="bg-white p-6 rounded-2xl shadow text-center">
                    <p class="text-gray-500">
                        Nenhum hábito cadastrado ainda
                    </p>
                </div>
            ` : state.habits.map(habit => `
                <div class="bg-white p-4 rounded-2xl shadow mb-4">

                    <p class="font-bold text-lg">
                        ${habit.name}
                    </p>

                    <p class="text-gray-500 mb-4">
                        ${habit.progress}% concluído
                    </p>

                    <div class="flex gap-2">
                        <button
                            onclick="completeHabit('${habit.id}')"
                            class="flex-1 bg-blue-500 text-white py-2 rounded-xl"
                        >
                            Concluir
                        </button>

                        <button
                            onclick="removeHabit('${habit.id}')"
                            class="flex-1 bg-red-500 text-white py-2 rounded-xl"
                        >
                            Excluir
                        </button>
                    </div>

                </div>
            `).join('')}
        </div>
    `;
}

renderAuth();