/* js/workshop.js - V14.0 FREE LINES ARCHITECTURE */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- НОВЫЙ ИМПОРТ БАЗЫ ДАННЫХ ---
import { FULL_DB } from './tanks_db.js';

// --- В НАЧАЛО ФАЙЛА ---
const MILITARY_RANKS = [
    "РЯДОВОЙ", "ЕФРЕЙТОР", "МЛ. СЕРЖАНТ", "СЕРЖАНТ", "СТ. СЕРЖАНТ", "СТАРШИНА",
    "ПРАПОРЩИК", "ЛЕЙТЕНАНТ", "СТ. ЛЕЙТЕНАНТ", "КАПИТАН", "МАЙОР", "ПОДПОЛКОВНИК",
    "ПОЛКОВНИК", "ГЕНЕРАЛ-МАЙОР", "ГЕНЕРАЛ-ЛЕЙТЕНАНТ", "ГЕНЕРАЛ-ПОЛКОВНИК", "МАРШАЛ БТВ", "РАЗРАБОТЧИК"
];

const firebaseConfig = {
  apiKey: "AIzaSyDNo6sI41rRfupv-aV33z037Sftn1tuUkM",
  authDomain: "trehsotniki-base.firebaseapp.com",
  projectId: "trehsotniki-base",
  storageBucket: "trehsotniki-base.firebasestorage.app",
  messagingSenderId: "539981219404",
  appId: "1:539981219404:web:2d5824c2f8d44d4a0e16e9",
  measurementId: "G-C2HM2K9S5W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- ГЛОБАЛЬНЫЕ КОНСТАНТЫ ---
const NATIONS_LIST = [
    {id:'ussr', name:'СССР'}, {id:'germany', name:'Германия'}, {id:'usa', name:'США'}, 
    {id:'uk', name:'Британия'}, {id:'france', name:'Франция'}, {id:'japan', name:'Япония'}
];

const STARTER_TANKS = ['fiat', 'm1928', 't18_29', 't18', 'filler', 'st_pz_1', 'st_pz_2', 'ltr_k', 'ltr_r', 't2_29', 't1e1', 't1', 'mk1', 'mk1cs', 'mk2', 'mk3', 'nc31', 'nc27', 'ft', 'char_d1', 'otsu', 'type89', 'ko'];

// Элементы UI
const screenType = document.getElementById('screen-type');
const screenNation = document.getElementById('screen-nation');
const screenTree = document.getElementById('screen-tree');
const backBtn = document.getElementById('back-btn');
const treeContainer = document.getElementById('tree-container');

let currentUser = null;
let userTanks = []; 
let currentNation = null;

// --- ГЛОБАЛЬНЫЕ ФУНКЦИИ (ДЛЯ HTML) ---
window.openModal = function(mode) {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('open');
    const isLogin = mode === 'login';
    document.getElementById('form-login')?.classList.toggle('active', isLogin);
    document.getElementById('form-register')?.classList.toggle('active', !isLogin);
    document.getElementById('tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('tab-register')?.classList.toggle('active', !isLogin);
};

window.closeModal = function() {
    document.getElementById('auth-modal')?.classList.remove('open');
};

// --- АВТОРИЗАЦИЯ ---
onAuthStateChanged(auth, (user) => {
    const authButtons = document.querySelector('.auth-buttons');
    if (user) {
        currentUser = user;
        const userRef = doc(db, "users", user.uid);

        onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                userTanks = data.tanks || [];
                
                // Проверка стартового набора
                const needsUpdate = STARTER_TANKS.some(t => !userTanks.includes(t));
                if (needsUpdate) await updateDoc(userRef, { tanks: arrayUnion(...STARTER_TANKS) });

                // Обновление UI
                const goldEl = document.querySelector('.gold-stat span');
                const xpEl = document.querySelector('.xp-stat span');
                if(goldEl) goldEl.innerText = (data.gold || 0).toLocaleString();
                if(xpEl) xpEl.innerText = (data.xp || 0).toLocaleString();
                
                // --- ВНУТРИ onSnapshot (где if (authButtons)) ---
if (authButtons) {
    const avatarSrc = data.avatar || './img/gold_ico.jpg'; 
    
    // --- ЛОГИКА ---
    const level = data.rankLevel !== undefined ? data.rankLevel : 0;
    const safeLevel = Math.min(Math.max(0, level), MILITARY_RANKS.length - 1);
    const rankName = MILITARY_RANKS[safeLevel];
    const rankColor = safeLevel > 6 ? "#ffbb33" : "#888";

    authButtons.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="location.href='profile.html'">
            <div style="text-align:right; line-height:1.2;">
                <div style="font-size:10px; color:${rankColor}; font-weight:700;">${rankName}</div>
                <div style="color:#ffbb33; font-family:'Orbitron'; font-size:14px;">${data.nickname || user.email.split('@')[0]}</div>
            </div>
            
            <div style="width:35px; height:35px; background:#333; border-radius:50%; border:1px solid #ff9d00; background-image:url('${avatarSrc}'); background-size:cover; background-position: center;"></div>
        </div>`;
}
                if (currentNation) renderTechTree(currentNation);
            }
        });
    } else {
        if (authButtons) {
            authButtons.innerHTML = `
                <button class="login-btn-ghost" onclick="openModal('login')">ВХОД</button>
                <button class="reg-btn-modern" onclick="openModal('register')">РЕГИСТРАЦИЯ</button>`;
        }
    }
});

// --- ОБРАБОТКА ФОРМ ---
document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = formLogin.querySelectorAll('input');
            signInWithEmailAndPassword(auth, inputs[0].value, inputs[1].value)
                .then(() => closeModal())
                .catch(err => alert("Ошибка: " + err.message));
        });
    }
    const formReg = document.getElementById('form-register');
    if (formReg) {
        formReg.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = formReg.querySelectorAll('input');
            createUserWithEmailAndPassword(auth, inputs[1].value, inputs[2].value)
                .then(async (u) => {
                    await setDoc(doc(db, "users", u.user.uid), {
                        nickname: inputs[0].value, email: inputs[1].value, gold: 1000, xp: 500, tanks: STARTER_TANKS, regDate: new Date().toISOString()
                    });
                    closeModal();
                }).catch(err => alert("Ошибка: " + err.message));
        });
    }
});

// --- НАВИГАЦИЯ ---
window.selectType = (type) => {
    if (type === 'ground') {
        screenType.style.display = 'none';
        screenNation.style.display = 'flex';
        renderNationButtons();
        backBtn.style.display = 'block';
        backBtn.onclick = () => {
            screenNation.style.display = 'none';
            screenType.style.display = 'flex';
            backBtn.style.display = 'none';
        };
    }
};

window.selectNation = (nationId) => {
    if (!FULL_DB[nationId]) return alert("Ветка в разработке!");
    currentNation = nationId;
    screenNation.style.display = 'none';
    screenTree.style.display = 'flex';
    backBtn.onclick = () => {
        closePanel();
        screenTree.style.display = 'none';
        screenNation.style.display = 'flex';
        currentNation = null;
    };
    renderTechTree(nationId);
};

function renderNationButtons() {
    const grid = document.querySelector('.nations-grid');
    if(!grid) return; grid.innerHTML = '';
    NATIONS_LIST.forEach(nat => {
        const btn = document.createElement('div');
        btn.className = 'nation-btn';
        btn.innerText = nat.name;
        btn.onclick = () => selectNation(nat.id);
        grid.appendChild(btn);
    });
}

// --- НОВЫЙ ГЕНЕРАТОР ДЕРЕВА (БЕЗ ЗАГОЛОВКОВ КЛАССОВ) ---
function renderTechTree(nationId) {
    treeContainer.innerHTML = ''; 
    const tanks = FULL_DB[nationId];
    
    // Определяем максимальное количество линий (колонок) в этой нации
    const maxLines = Math.max(...Object.values(tanks).map(t => t.line || 1), 1);

    // Генерируем колонки
    for (let line = 1; line <= maxLines; line++) {
        const lineTanks = Object.entries(tanks).filter(([_, t]) => t.line === line);

        for (let r = 1; r <= 5; r++) { 
            let rankTanks = lineTanks.filter(([_, t]) => t.rank === r);
            // Сортировка: Родитель выше Потомка
            rankTanks.sort((a, b) => (a[1].req === b[0] ? 1 : b[1].req === a[0] ? -1 : 0));
            
            const rankBlock = document.createElement('div');
            rankBlock.className = 'rank-block';
            if (r === 1) rankBlock.classList.add('rank-center');
            rankBlock.style.gridColumn = line; 
            rankBlock.style.gridRow = r; 
            
            // --- ПРАВКА ЗДЕСЬ ---
            // Если линия 1-я, рисуем заголовок. Если нет — пустая строка.
            const headerHTML = (line === 1) 
                ? `<div class="rank-header">РАНГ ${toRoman(r)}</div>` 
                : '';

            let html = `${headerHTML}<div class="rank-content">`;
            // --------------------

            rankTanks.forEach(([id, t]) => { html += createCardHTML(id, t, tanks, r, nationId); });
            html += `</div>`;
            
            rankBlock.innerHTML = html;
            treeContainer.appendChild(rankBlock);
        }
    }
}

// --- СОЗДАНИЕ КАРТОЧКИ (ОБНОВЛЕННАЯ ВЕРСИЯ С ИКОНКАМИ) ---
function createCardHTML(id, t, allTanks, rank, nationId) {
    const isUnlocked = userTanks.includes(id) || t.cost === 0;
    
    // 1. Логика доступности (оставляем как было)
    let canResearch = false;
    if (!isUnlocked) {
        if (t.req) {
            if (userTanks.includes(t.req)) canResearch = true;
        } else {
            if (rank === 1) canResearch = true;
            else if (rank === 2) {
                const hasStarter = userTanks.some(tid => {
                    const tankData = FULL_DB[nationId][tid];
                    return tankData && tankData.rank === 1;
                });
                if (hasStarter) canResearch = true;
            }
        }
    }

    let status = isUnlocked ? 'unlocked' : (canResearch ? 'can-research' : 'locked');
    if (t.premium) status = 'premium';

    // 2. Логика стрелок (оставляем как было)
    let arrowClass = '';
    const follower = Object.entries(allTanks).find(([_, child]) => child.req === id && child.line === t.line);
    if (follower) {
        const [_, child] = follower;
        if (child.rank === rank) arrowClass = 'has-arrow-short';
        else if (child.rank > rank) arrowClass = 'has-arrow-long';
    }
    if (t.longLine) arrowClass = 'has-arrow-mega';
    if (t.midLine) arrowClass = 'has-arrow-mid';

    // 3. НОВОЕ: Определяем иконку класса
    const classIcons = {
        'light': '⬥',   // Лёгкий
        'medium': '■',  // Средний
        'heavy': '⬣',   // Тяжёлый
        'td': '▼',      // ПТ-САУ
        'spaa': '▲'     // ЗСУ
    };
    // Если класс не найден, ставим ромб по умолчанию
    const tankIcon = classIcons[t.class] || '⬥';

    // 4. Генерируем HTML
    // Обратите внимание: удалили старый div class-icon и добавили структуру visual-stack
    return `
    <div class="br-row">
        <div class="br-label">${t.br.toFixed(1)}</div>
        <div id="tank-${id}" class="wt-card ${status} ${arrowClass}" onclick="openTankInfo('${id}')">
            <div class="card-visual">
                <div class="visual-stack">
                    <div class="type-icon">${tankIcon}</div>
                    <div class="tank-name">${t.name}</div>
                </div>
            </div>
        </div>
    </div>`;
}

// --- ПАНЕЛЬ ИНФОРМАЦИИ (Осталась прежней) ---
window.openTankInfo = function(id) {
    let data = null;
    let nationKey = null;
    for (const nat in FULL_DB) { if (FULL_DB[nat][id]) { data = FULL_DB[nat][id]; nationKey = nat; break; } }
    if (!data) return;

    document.getElementById('panel-name').innerText = data.name;
    document.getElementById('panel-desc').innerText = data.desc || "Данные отсутствуют.";
    const classNames = { 'heavy': 'ТЯЖЕЛЫЙ ТАНК', 'medium': 'СРЕДНИЙ ТАНК', 'light': 'ЛЕГКИЙ ТАНК', 'td': 'ПТ-САУ' };
    document.getElementById('panel-class').innerText = classNames[data.class] || "ТЕХНИКА";
    
    const s = data.stats || {}; 
    document.getElementById('stat-armor').innerText = s.armor || "-";
    document.getElementById('stat-gun').innerText = s.gun || "-";
    document.getElementById('stat-engine').innerText = s.engine || "-";

    const parse = (str) => { const m = str.match(/(\d+)/g); return m ? Math.max(...m.map(Number)) : 0; };
    document.getElementById('bar-armor').style.width = Math.min(100, Math.max(5, (parse(s.armor)/300)*100)) + "%";
    document.getElementById('bar-gun').style.width = Math.min(100, Math.max(5, (parse(s.gun)/155)*100)) + "%";
    document.getElementById('bar-engine').style.width = Math.min(100, Math.max(5, (parse(s.engine)/1200)*100)) + "%";

    // ... (код заполнения статов выше) ...

    // --- ЛОГИКА КАРТИНКИ ---
    const previewImg = document.getElementById('panel-preview-img');
    
    // 1. Скрываем картинку перед загрузкой
    previewImg.style.opacity = '0';

    // === НОВОЕ: ПРОВЕРКА НА ЧЕРНО-БЕЛОЕ ===
    // Проверяем, есть ли танк в списке купленных у игрока (массив userTanks)
    const isOwned = userTanks.includes(id);

    if (isOwned) {
        // Если куплен — убираем фильтры (цветная)
        previewImg.style.filter = 'none';
    } else {
        // Если НЕ куплен (заблокирован или доступен для исследования) — делаем черно-белой
        previewImg.style.filter = 'grayscale(100%) contrast(1.1)'; 
        // contrast(1.1) добавил для четкости, чтобы ч/б не было слишком блеклым
    }
    // =====================================

    // 2. Формируем путь
    const imagePath = `img/tanks/${id}.jpg`; 

    // 3. Загружаем
    previewImg.src = imagePath;

    // 4. Когда загрузилась — показываем
    previewImg.onload = function() {
        // Для купленных ставим 0.9, для некупленных чуть темнее — 0.7
        this.style.opacity = isOwned ? '0.9' : '0.7';
    };

    // ... обработчик onerror ...

    // 5. Если картинки нет — ставим заглушку (чтобы не было битой иконки)
    previewImg.onerror = function() {
        // Укажите тут путь к картинке-заглушке, если хотите
        // Например: this.src = 'img/no_image.png'; 
        // Или просто ставим прозрачность 0.2, чтобы было темно
        this.src = 'img/background_main_menu.png'; 
        this.style.opacity = '0.3';
    };
    
    // ... (дальше идет const buyBtn = ...) ...
    const buyBtn = document.getElementById('buy-btn');
    const priceLabel = document.getElementById('panel-price');
    //const isOwned = userTanks.includes(id);

    let canBuy = false;
    // Повторяем логику проверки покупки для кнопки
    if (data.req) { 
        if (userTanks.includes(data.req)) canBuy = true; 
    } else { 
        if (data.rank === 1) canBuy = true;
        else if (data.rank === 2) canBuy = true; // Упрощено: если ранг 2, считаем доступным (при наличии стартеров)
    }

    if (isOwned) {
        priceLabel.innerText = "ИЗУЧЕНО"; priceLabel.style.color = "#00C851";
        buyBtn.innerText = "В АНГАРЕ"; buyBtn.disabled = true; buyBtn.style.background = "#333"; buyBtn.onclick = null;
    } else if (canBuy) {
        priceLabel.innerText = data.cost.toLocaleString() + " XP"; priceLabel.style.color = "#ffbb33";
        buyBtn.innerText = "ИССЛЕДОВАТЬ"; buyBtn.disabled = false; buyBtn.style.background = "linear-gradient(90deg, #ff9d00, #ffbb33)";
        buyBtn.onclick = () => buyTank(id, data.cost, data.name);
    } else {
        priceLabel.innerText = "НЕДОСТУПНО"; priceLabel.style.color = "#555";
        buyBtn.innerText = "ЗАБЛОКИРОВАНО"; buyBtn.disabled = true; buyBtn.style.background = "#222"; buyBtn.onclick = null;
    }
    document.getElementById('tank-panel').classList.add('open');
};

async function buyTank(id, cost, name) {
    if (!currentUser) return alert("Войдите!");
    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);
    const userData = snap.data();
    if (userData.xp >= cost) {
        await updateDoc(userRef, { xp: userData.xp - cost, tanks: arrayUnion(id) });
        alert(`Куплен: ${name}`);
        window.openTankInfo(id);
    } else { alert("Не хватает опыта!"); }
}

// --- ФУНКЦИЯ ЗАКРЫТИЯ ПАНЕЛИ ТАНКА ---
window.closePanel = function() {
    const panel = document.getElementById('tank-panel');
    if (panel) {
        panel.classList.remove('open');
    }
};

// --- ВСТАВИТЬ В КОНЕЦ ФАЙЛА workshop.js ---

window.switchTab = function(mode) {
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (mode === 'login') {
        if(formLogin) formLogin.classList.add('active');
        if(formRegister) formRegister.classList.remove('active');
        if(tabLogin) tabLogin.classList.add('active');
        if(tabRegister) tabRegister.classList.remove('active');
    } else {
        if(formLogin) formLogin.classList.remove('active');
        if(formRegister) formRegister.classList.add('active');
        if(tabLogin) tabLogin.classList.remove('active');
        if(tabRegister) tabRegister.classList.add('active');
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal(); // Закрыть окно авторизации
        closePanel(); // Закрыть панель танка
    }
});

function toRoman(num) { return {1:'I',2:'II',3:'III',4:'IV',5:'V'}[num]; }
