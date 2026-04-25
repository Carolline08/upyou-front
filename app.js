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
            progress: Math.min((item.progressCount || 0) * 25, 100)
        }));
    } catch (error) {
        state.habits = [];
    }

    render();
}
// Criação do habito 
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
        await checkAchievements();
    } catch (error) {
        alert(error.message);
    }
}

// Bloco conquista
async function checkAchievements() {
    const achievements = await getAchievements();

    achievements.forEach(a => {

        if (a.condition === 'first_habit' && state.habits.length === 1) {
            unlockAchievement(a);
        }
        if (a.condition === 'xp_100' && state.xp >= 100) {
            unlockAchievement(a);
        }
        if (a.condition === 'streak_7' && state.streak >= 7) {
            unlockAchievement(a);
        }

    });
}

// função para quando o usuario desbloqueia uma conquista
function unlockAchievement(achievement) {
    const alreadyUnlocked = state.badges.find(b => b._id === achievement._id);

    if (alreadyUnlocked) return;

    state.badges.push(achievement);

    alert(`🏆 Conquista desbloqueada: ${achievement.title}`);
}
// 
// Bloco habito completo 
async function completeHabit(id) {
    try {
        await saveProgress({
            challengeId: id
        });

        state.xp += 10;

        playSuccess();

        await loadChallenges();
        await checkAchievements();

    } catch (error) {
        alert("Erro ao concluir progresso: " + error.message);
    }
}

// Editar habito
async function editHabit(id, currentName) {
    const newName = prompt('Novo nome do hábito:', currentName);
    if (!newName || newName === currentName) return;

    try {
        await updateChallenge(id, { title: newName });
        playSuccess();
        await loadChallenges();
    } catch (error) {
        alert("Erro ao editar: " + error.message);
    }
}

// Remove habito 
async function removeHabit(id) {
    try {
        await deleteChallenge(id);
        await loadChallenges();
    } catch (error) {
        alert(error.message);
    }
}
// Renderização da página 
function render() {
    const app = document.getElementById('app');

    if (state.currentView === 'auth') {
        renderAuth();
        return;
    }

    app.innerHTML = `
        <div class="header-card mb-8">
            <h1 class="text-4xl font-black mb-1">UpYou</h1>
            <p class="text-lg opacity-90">Olá, ${state.user}</p>
            
            <div class="xp-bar mt-4 mb-6">
                <div class="xp-fill" style="width: ${(state.xp % 100)}%"></div>
            </div>

            <div class="flex justify-between text-sm font-bold">
                <span>🔥 ${state.streak || 0}</span>
                <span>⭐ ${state.level || 1}</span>
                <span>⚡ ${state.xp || 0}</span>
            </div>
        </div>

        <div class="p-6 pb-24">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-black text-gray-800">Meus Hábitos</h1>
                <button onclick="addChallenge()" class="bg-green-600 text-white px-4 py-2 rounded-xl font-bold">+ Novo</button>
            </div>

        <div class="space-y-4">
            ${state.habits.length === 0 ? `
                <div class="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
                    Nenhum hábito cadastrado
                </div>
            ` : state.habits.map(habit => `
                <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <p class="font-bold text-gray-700 text-lg">${habit.name}</p>
                        <span class="text-xs font-black text-green-600">${habit.progress}%</span>
                    </div>

                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <div 
                            class="bg-green-500 h-full transition-all duration-700 ease-in-out" 
                            style="width: ${habit.progress}%">
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="completeHabit('${habit.id}')" 
                                class="${habit.progress >= 100 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'} py-2 rounded-xl text-xs font-black active:scale-95 transition-all">
                            ${habit.progress >= 100 ? 'Feito!' : 'Concluir'}
                        </button>

                        <button onclick="editHabit('${habit.id}', '${habit.name}')" 
                                class="bg-yellow-400 text-white py-2 rounded-xl text-xs font-black">
                            Editar
                        </button>

                        <button onclick="removeHabit('${habit.id}')" 
                                class="bg-red-500 text-white py-2 rounded-xl text-xs font-black">
                            Excluir
                        </button>
                    </div>
                </div>
            `).join('')}
            </div>
        </div>
        <div class="mb-6">
        
            <h2 class="text-lg font-bold mb-2">🏆 Conquistas</h2>
            <div class="flex gap-2 flex-wrap">
                    ${state.badges.length === 0 ? `
                        <span class="text-gray-400 text-sm">Nenhuma ainda</span>
                    ` : state.badges.map(b => `
                        <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                            ${b.title}
                        </div>
                    `).join('')}
                </div>
        </div>
        
        <div class="bottom-nav">
            <div onclick="state.currentView='home'; render();" class="cursor-pointer text-green-400 font-bold">Home</div>
            <div onclick="location.reload();" class="cursor-pointer opacity-70 text-red-400 font-bold">Sair</div>
        </div>
    `;
}

renderAuth();
