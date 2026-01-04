/* --- js/main.js (Версия 5.3: Silent Auto-Update) --- */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWqbVh-eFA0A9uPgAf_q8fg4jP7rNnQDk",
  authDomain: "trehsotniki-base.firebaseapp.com",
  projectId: "trehsotniki-base",
  storageBucket: "trehsotniki-base.firebasestorage.app",
  messagingSenderId: "539981219404",
  appId: "1:539981219404:web:2d5824c2f8d44d4a0e16e9",
  measurementId: "G-C2HM2K9S5W"
};

// --- ВСТАВЬ ЭТО В НАЧАЛО ФАЙЛА (после const db = ...) ---
const MILITARY_RANKS = [
    "РЯДОВОЙ", "ЕФРЕЙТОР", "МЛ. СЕРЖАНТ", "СЕРЖАНТ", "СТ. СЕРЖАНТ", "СТАРШИНА",
    "ПРАПОРЩИК", "ЛЕЙТЕНАНТ", "СТ. ЛЕЙТЕНАНТ", "КАПИТАН", "МАЙОР", "ПОДПОЛКОВНИК",
    "ПОЛКОВНИК", "ГЕНЕРАЛ-МАЙОР", "ГЕНЕРАЛ-ЛЕЙТЕНАНТ", "ГЕНЕРАЛ-ПОЛКОВНИК", "МАРШАЛ БТВ", "РАЗРАБОТЧИК"
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// === СПИСОК СТАРТОВОЙ ТЕХНИКИ (БР 1.0) ===
// Если ты добавишь сюда новый танк, он появится у всех при обновлении страницы!
const STARTER_TANKS = [
    // СССР
    'fiat', 'm1928', 't18_29', 't18', 'filler',
    // Германия
    'st_pz_1', 'st_pz_2', 'ltr_k', 'ltr_r',
    // США
    't2_29', 't1e1', 't1', 
    // Британия
    'mk1', 'mk1cs', 'mk2', 'mk3',
    // Франция
    'nc31', 'nc27', 'ft', 'char_d1',
    // Япония
    'otsu', 'type89', 'ko'
];

// --- ВНУТРИ onAuthStateChanged (замени старый блок на этот) ---
onAuthStateChanged(auth, async (user) => {
    const authBlock = document.querySelector('.auth-buttons');
    
    if (user) {
        const docRef = doc(db, "users", user.uid);
        
        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // === АВТО-ЛЕЧЕНИЕ: Если звания нет в базе, создаем его ===
                if (userData.rankLevel === undefined) {
                    await updateDoc(docRef, { rankLevel: 0 });
                    userData.rankLevel = 0; // Обновляем локально, чтобы сразу отобразилось
                }
                // ========================================================

                await checkStarterPack(docRef, userData.tanks);
                renderProfile(authBlock, userData);
                updateStats(userData.gold, userData.xp);

            } else {
                // Восстановление профиля
                const autoNick = user.email.split('@')[0];
                const defaultData = {
                    nickname: autoNick,
                    email: user.email,
                    gold: 1000,
                    xp: 0,
                    tanks: STARTER_TANKS,
                    rankLevel: 0, // <--- ДОБАВИЛИ ЗВАНИЕ ПО УМОЛЧАНИЮ
                    regDate: new Date().toISOString()
                };
                await setDoc(docRef, defaultData);
                renderProfile(authBlock, defaultData);
                updateStats(1000, 0);
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    } else {
        if (authBlock) {
            authBlock.innerHTML = `
                <button class="login-btn-ghost" onclick="openModal('login')">ВХОД</button>
                <button class="reg-btn-modern" onclick="openModal('register')">РЕГИСТРАЦИЯ</button>
            `;
        }
    }
});

// --- ВНИЗУ, В ОБРАБОТЧИКЕ РЕГИСТРАЦИИ (form-register) ---
// Найди formRegister.addEventListener и убедись, что в setDoc есть rankLevel: 0
/*
    await setDoc(doc(db, "users", userCredential.user.uid), {
        nickname: nickname, 
        email: email, 
        gold: 1000, 
        xp: 500,
        tanks: STARTER_TANKS,
        rankLevel: 0,           // <--- ВАЖНО: ДОБАВИТЬ СЮДА
        regDate: new Date().toISOString()
    });
*/

// --- ФУНКЦИЯ ТИХОГО ОБНОВЛЕНИЯ (БЕЗ ALERT) ---
async function checkStarterPack(userRef, currentTanks = []) {
    // Проверяем, есть ли в STARTER_TANKS что-то, чего нет у юзера
    const needsUpdate = STARTER_TANKS.some(tankId => !currentTanks.includes(tankId));

    if (needsUpdate) {
        console.log("Обнаружена новая стартовая техника. Начисляем...");
        try {
            // arrayUnion добавляет только уникальные значения (не дублирует)
            await updateDoc(userRef, {
                tanks: arrayUnion(...STARTER_TANKS)
            });
            console.log("Техника успешно начислена.");
        } catch (e) {
            console.error("Ошибка при авто-выдаче техники:", e);
        }
    }
}

// --- ЗАМЕНИ ФУНКЦИЮ RENDERPROFILE (ВНИЗУ ФАЙЛА) ---
function renderProfile(container, userData) {
    if (container) {
        const userAvatar = userData.avatar || 'img/gold_ico.jpg'; 
        const nickname = typeof userData === 'object' ? userData.nickname : userData;

        // 1. ОПРЕДЕЛЯЕМ ЗВАНИЕ
        const level = userData.rankLevel !== undefined ? userData.rankLevel : 0;
        const safeLevel = Math.min(Math.max(0, level), MILITARY_RANKS.length - 1);
        const rankName = MILITARY_RANKS[safeLevel];

        // 2. ЦВЕТ (Золотой для офицеров > 6 ранга, серый для остальных)
        const rankColor = safeLevel > 6 ? "#ffbb33" : "#888";

        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="text-align:right; line-height:1.2;">
                    <div style="font-size:10px; color:${rankColor}; font-weight:700;">${rankName}</div>
                    
                    <div style="color:var(--accent); font-family:'Orbitron'; font-size:14px;">
                        <a href="profile.html" style="text-decoration:none; color:inherit;">${nickname}</a>
                    </div>
                </div>
                
                <a href="profile.html" style="display:block;">
                    <div style="
                        width:35px; height:35px; 
                        background:#333; 
                        border-radius:50%; 
                        border:1px solid #555; 
                        background-image:url('${userAvatar}'); 
                        background-size:cover;
                        background-position: center;
                        transition: 0.2s;
                    " onmouseover="this.style.borderColor='#ff9d00'" onmouseout="this.style.borderColor='#555'"></div>
                </a>

                <button onclick="window.logoutUser()" style="background:none; border:none; color:#555; cursor:pointer; font-size:18px; margin-left:5px;" title="Выйти">✕</button>
            </div>
        `;
    }
}

function updateStats(gold, xp) {
    const goldEl = document.querySelector('.gold-stat span') || document.querySelector('.stat span');
    if(goldEl) goldEl.innerText = gold.toLocaleString();

    const xpEl = document.querySelector('.xp-stat span');
    if (xpEl && xp !== undefined) xpEl.innerText = xp.toLocaleString();
}

// --- ИССЛЕДОВАНИЕ ТЕХНИКИ ---
window.researchTank = async function(tankName, cost) {
    const user = auth.currentUser;
    if (!user) { alert("Ошибка: Вы не вошли в систему!"); openModal('login'); return; }

    const userRef = doc(db, "users", user.uid);
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            const currentXP = data.xp || 0;
            const currentTanks = data.tanks || [];

            if (currentTanks.includes(tankName)) {
                alert(`Техника "${tankName}" уже исследована!`);
                return;
            }

            if (currentXP >= cost) {
                await updateDoc(userRef, {
                    xp: currentXP - cost,
                    tanks: arrayUnion(tankName)
                });
                updateStats(data.gold, currentXP - cost);
                alert(`УСПЕШНО! Вы исследовали "${tankName}".`);
            } else {
                alert(`НЕДОСТАТОЧНО ОПЫТА!\nНужно: ${cost}\nУ вас: ${currentXP}`);
            }
        }
    } catch (error) {
        console.error("Ошибка при исследовании:", error);
        alert("Сбой связи с штабом (ошибка БД).");
    }
};

// --- ФОРМЫ И МОДАЛКИ ---
document.addEventListener("DOMContentLoaded", function() {
    if (!document.getElementById('auth-modal')) createModalHTML();
    initAnimations();

    const modal = document.getElementById('auth-modal');
    if(modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    // ВХОД
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = formLogin.querySelectorAll('input');
            signInWithEmailAndPassword(auth, inputs[0].value, inputs[1].value)
                .then(() => { window.location.reload(); })
                .catch((error) => { alert("Ошибка: Проверьте почту и пароль."); });
        });
    }

    // РЕГИСТРАЦИЯ
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = formRegister.querySelectorAll('input');
            const nickname = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        nickname: nickname, email: email, gold: 1000, xp: 500,
                        tanks: STARTER_TANKS,
                        regDate: new Date().toISOString()
                    });
                    window.location.reload();
                })
                .catch((error) => { alert("Ошибка регистрации: " + error.message); });
        });
    }
});

// Глобальные функции
window.openModal = function(mode) {
    const modal = document.getElementById('auth-modal');
    if (modal) { modal.classList.add('open'); window.switchTab(mode); }
};
window.closeModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
};
window.logoutUser = function() {
    if(confirm("Покинуть расположение части?")) { signOut(auth).then(() => location.reload()); }
};
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
function createModalHTML() {} 
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}