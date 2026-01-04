/* js/hangar.js - Логика Ангара */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { FULL_DB } from './tanks_db.js';

const firebaseConfig = {
  apiKey: "AIzaSyDWqbVh-eFA0A9uPgAf_q8fg4jP7rNnQDk",
  authDomain: "trehsotniki-base.firebaseapp.com",
  projectId: "trehsotniki-base",
  storageBucket: "trehsotniki-base.firebasestorage.app",
  messagingSenderId: "539981219404",
  appId: "1:539981219404:web:2d5824c2f8d44d4a0e16e9",
  measurementId: "G-C2HM2K9S5W"
};

const MILITARY_RANKS = [
    "РЯДОВОЙ", "ЕФРЕЙТОР", "МЛ. СЕРЖАНТ", "СЕРЖАНТ", "СТ. СЕРЖАНТ", "СТАРШИНА",
    "ПРАПОРЩИК", "ЛЕЙТЕНАНТ", "СТ. ЛЕЙТЕНАНТ", "КАПИТАН", "МАЙОР", "ПОДПОЛКОВНИК",
    "ПОЛКОВНИК", "ГЕНЕРАЛ-МАЙОР", "ГЕНЕРАЛ-ЛЕЙТЕНАНТ", "ГЕНЕРАЛ-ПОЛКОВНИК", "МАРШАЛ БТВ"
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userTanksList = []; 
let currentFilter = 'all';

// --- АВТОРИЗАЦИЯ И ЗАГРУЗКА ---
onAuthStateChanged(auth, (user) => {
    const authButtons = document.querySelector('.auth-buttons');
    if (user) {
        const userRef = doc(db, "users", user.uid);
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                userTanksList = data.tanks || [];
                
                const goldEl = document.querySelector('.gold-stat span');
                const xpEl = document.querySelector('.xp-stat span');
                if(goldEl) goldEl.innerText = (data.gold || 0).toLocaleString();
                if(xpEl) xpEl.innerText = (data.xp || 0).toLocaleString();
                
                if (authButtons) {
                    const avatarSrc = data.avatar || './img/gold_ico.jpg'; 
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
                            <div style="width:35px; height:35px; background:#333; border-radius:50%; border:1px solid #ff9d00; background-image:url('${avatarSrc}'); background-size:cover;"></div>
                        </div>`;
                }

                renderHangar();
            }
        });
    } else {
        window.location.href = 'index.html'; 
    }
});

// --- ЛОГИКА ФИЛЬТРАЦИИ ---
window.filterHangar = function(nation) {
    currentFilter = nation;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active'); 
    renderHangar();
};

// --- ОСНОВНОЙ РЕНДЕР ---
function renderHangar() {
    const grid = document.getElementById('hangar-grid');
    grid.innerHTML = '';
    
    let displayedCount = 0;

    for (const nationId in FULL_DB) {
        if (currentFilter !== 'all' && currentFilter !== nationId) continue;

        const nationTanks = FULL_DB[nationId];

        for (const tankId in nationTanks) {
            if (userTanksList.includes(tankId)) {
                const tankData = nationTanks[tankId];
                grid.innerHTML += createOwnedCardHTML(tankId, tankData, nationId);
                displayedCount++;
            }
        }
    }

    if (displayedCount === 0) {
        grid.innerHTML = `<div class="empty-hangar">В этой категории у вас нет техники.</div>`;
    }
}

function createOwnedCardHTML(id, t, nationId) {
    const classIcons = { 'light': '⬥', 'medium': '■', 'heavy': '⬣', 'td': '▼', 'spaa': '▲' };
    const tankIcon = classIcons[t.class] || '⬥';
    let statusClass = t.premium ? 'premium' : 'unlocked';

    return `
    <div style="position:relative; margin-bottom: 20px;">
        <div class="br-row" style="justify-content:center;">
             <div class="br-label" style="position:absolute; left:0; top:0; background:#111; padding:2px 5px; border-radius:3px;">${t.br.toFixed(1)}</div>
             <div id="tank-${id}" class="wt-card ${statusClass}" onclick="openTankInfo('${id}')">
                <div class="card-visual">
                    <div class="visual-stack">
                        <div class="type-icon">${tankIcon}</div>
                        <div class="tank-name">${t.name}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// --- ОТКРЫТИЕ ПАНЕЛИ ---
window.openTankInfo = function(id) {
    let data = null;
    for (const nat in FULL_DB) { if (FULL_DB[nat][id]) { data = FULL_DB[nat][id]; break; } }
    if (!data) return;

    document.getElementById('panel-name').innerText = data.name;
    document.getElementById('panel-desc').innerText = data.desc || "Описание засекречено.";
    
    const classNames = { 'heavy': 'ТЯЖЕЛЫЙ ТАНК', 'medium': 'СРЕДНИЙ ТАНК', 'light': 'ЛЕГКИЙ ТАНК', 'td': 'ПТ-САУ' };
    document.getElementById('panel-class').innerText = classNames[data.class] || "ТЕХНИКА";

    const s = data.stats || {}; 
    const parse = (str) => { const m = str ? str.match(/(\d+)/g) : null; return m ? Math.max(...m.map(Number)) : 0; };
    
    document.getElementById('stat-armor').innerText = s.armor || "-";
    document.getElementById('bar-armor').style.width = Math.min(100, (parse(s.armor)/300)*100) + "%";

    document.getElementById('stat-gun').innerText = s.gun || "-";
    document.getElementById('bar-gun').style.width = Math.min(100, (parse(s.gun)/155)*100) + "%";

    document.getElementById('stat-engine').innerText = s.engine || "-";
    document.getElementById('bar-engine').style.width = Math.min(100, (parse(s.engine)/1200)*100) + "%";

    const previewImg = document.getElementById('panel-preview-img');
    previewImg.src = `img/tanks/${id}.jpg`;
    previewImg.style.filter = 'none';
    previewImg.style.opacity = '1';
    previewImg.onerror = function() { this.src = 'img/background_main_menu.png'; this.style.opacity = '0.3'; };

    // ОТКРЫВАЕМ ПАНЕЛЬ
    document.getElementById('tank-panel').classList.add('open');
    
    // --- ВАЖНО: ПРЯЧЕМ ШАПКУ САЙТА ---
    const header = document.querySelector('.main-header');
    if(header) header.classList.add('header-hidden');
};

window.closePanel = function() {
    document.getElementById('tank-panel').classList.remove('open');
    
    // --- ВАЖНО: ВОЗВРАЩАЕМ ШАПКУ САЙТА ---
    const header = document.querySelector('.main-header');
    if(header) header.classList.remove('header-hidden');
};

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") window.closePanel();
});