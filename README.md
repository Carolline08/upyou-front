# UpYou Frontend 

## Sobre o Projeto

O **UpYou** é uma aplicação web com proposta de gamificação de hábitos e evolução pessoal.

A ideia principal é transformar desafios do dia a dia em pequenas missões, incentivando o usuário a manter constância, acompanhar progresso e evoluir como se estivesse dentro de um jogo.

Inspirado em apps como **Duolingo**, **Habitica** e **Streaks**, o sistema utiliza elementos visuais modernos, feedback sonoro e progressão por XP para tornar a experiência mais motivadora.

---

## Funcionalidades

### Dashboard Principal

- Exibição de XP total
- Sistema de nível (Level)
- Controle de Streak diário
- Barra de progresso de XP

### Gerenciamento de Desafios

- Criar novo desafio
- Adicionar desafios rápidos por sugestão
- Remover desafios
- Atualizar progresso diário

### Sistema Gamificado

- Ganho de XP ao avançar nos desafios
- Subida de nível automática
- Sistema de conquitas (Badges)
- Feedback visual com animações
- Feedback sonoro estilo game/app moderno

### PWA (Progressive Web App)

- Estrutura preparada para instalação como aplicativo
- Manifest configurado
- Service Worker com cache básico
- Experiência mobile-first

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Tailwind CSS
- Web Audio API
- LocalStorage (estrutura inicial)
- Progressive Web App (PWA)

---

## Estrutura de Arquivos


´´´
frontend/
├── index.html
├── app.js
├── style.css
├── manifest.json
└── service-worker.js
´´´
---

## 🎨 Design da Interface

**Inspiração:** Duolingo, Habitica, Streaks.

**Estilo:**
* Visual energético e motivador.
* Cores vibrantes, cards arredondados e sombras suaves.

**Paleta Principal:** * 🟢 **Verde:** Progresso e ação.
* 🟠 **Laranja:** Streak e constância.
* 🟣 **Roxo:** Conquistas e badges.
* 🟡 **Amarelo:** XP e evolução.

---

## ⚙️ Como Executar

**1. Clonar o Projeto:**
`git clone <(https://github.com/Carolline08/upyou-front.git)>`

**2. Abrir a pasta do frontend:**
`cd frontend`

**3. Executar:**
* Basta abrir o arquivo `index.html` no navegador.
* **Recomendado:** Utilize a extensão **Live Server** no VS Code.

---

## 🔗 Integração com Backend

O projeto foi preparado para integração com API REST, podendo consumir rotas como:

* `GET /api/challenges`
* `POST /api/challenges`
* `DELETE /api/challenges/:id`
* `POST /api/progress`

---

## 🔮 Melhorias Futuras

* Login e autenticação de usuário.
* Ranking entre usuários.
* Sistema de notificações.
* Confetti ao completar desafios.
* Dashboard avançado de evolução.

---

## 🎓 Objetivo Acadêmico

Este projeto foi desenvolvido com foco em aprendizado prático de:

* Frontend moderno.
* Consumo de API.
* Experiência do Usuário (UX).
* Gamificação de sistemas.
* Progressive Web Apps (PWA).

---

## Link de Acesso

[UpYou Evolução](https://upyouevolucao.netlify.app/?classId=3be02262-9689-4da2-a8c8-0401b0b558b9&assignmentId=0ac2d529-9739-4865-9b22-dfb2096917e5&submissionId=d562c5b6-57b8-12b3-2fba-abce0040cd2a)

**Autora:** Carolline Barbosa Ferreira  
*UpYou — Evolua todos os dias. ✨*
