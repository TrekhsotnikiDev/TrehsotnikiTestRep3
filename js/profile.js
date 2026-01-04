/* js/profile.js - Строгий режим */

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNo6sI41rRfupv-aV33z037Sftn1tuUkM",
  authDomain: "trehsotniki-base.firebaseapp.com",
  projectId: "trehsotniki-base",
  storageBucket: "trehsotniki-base.firebasestorage.app",
  messagingSenderId: "539981219404",
  appId: "1:539981219404:web:2d5824c2f8d44d4a0e16e9",
  measurementId: "G-C2HM2K9S5W"
};

const app = getFirestore().app;
const auth = getAuth(app);
const db = getFirestore(app);

// === 1. ЖЕСТКИЙ СПИСОК ЗВАНИЙ ===
// Меняй названия здесь, и они поменяются у всех
const MILITARY_RANKS = [
    "РЯДОВОЙ",              // 0
    "ЕФРЕЙТОР",             // 1
    "МЛ. СЕРЖАНТ",          // 2
    "СЕРЖАНТ",              // 3
    "СТ. СЕРЖАНТ",          // 4
    "СТАРШИНА",             // 5
    "ПРАПОРЩИК",            // 6
    "ЛЕЙТЕНАНТ",            // 7
    "СТ. ЛЕЙТЕНАНТ",        // 8
    "КАПИТАН",              // 9
    "МАЙОР",                // 10
    "ПОДПОЛКОВНИК",         // 11
    "ПОЛКОВНИК",            // 12
    "ГЕНЕРАЛ-МАЙОР",        // 13
    "ГЕНЕРАЛ-ЛЕЙТЕНАНТ",    // 14
    "ГЕНЕРАЛ-ПОЛКОВНИК",    // 15
    "МАРШАЛ БТВ",            // 16
    "РАЗРАБОТЧИК"            // 17
];

const AVATAR_LIST = [
    'img/gold_ico.jpg',
    'img/avatars/av1.png',
    'img/avatars/av2.png',
    'img/avatars/av3.png',
    'img/avatars/av4.png'
];
// === ОСНОВНАЯ ЛОГИКА ===
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                updateProfileUI(docSnap.data(), user.uid);
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

// === ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===
function updateProfileUI(data, uid) { 
    document.getElementById('profile-nickname').innerText = data.nickname || "Без имени";
    document.getElementById('profile-email').innerText = data.email || "";
    
    // Аватар
    const currentAvatar = data.avatar || 'img/gold_ico.jpg';
    document.getElementById('profile-avatar').style.backgroundImage = `url('${currentAvatar}')`;

    // Статистика
    const xp = data.xp || 0;
    document.getElementById('stat-xp').innerText = xp.toLocaleString();
    document.getElementById('stat-gold').innerText = (data.gold || 0).toLocaleString();
    const tanksCount = data.tanks ? data.tanks.length : 0;
    document.getElementById('stat-tanks').innerText = tanksCount;

    // --- ЛОГИКА ЗВАНИЯ (СЕРВЕРНАЯ ВЫДАЧА) ---
    // Берем цифру rankLevel из базы. Если её нет — ставим 0 (Рядовой)
    const level = data.rankLevel !== undefined ? data.rankLevel : 0;
    
    // Проверка, чтобы не вылететь за пределы массива
    const safeLevel = Math.min(Math.max(0, level), MILITARY_RANKS.length - 1);
    const rankName = MILITARY_RANKS[safeLevel];

    const roleEl = document.getElementById('profile-role');
    roleEl.innerText = rankName;
    
    // Если звание высокое (Офицерское, > 6), красим в золото
    if (safeLevel > 6) {
        roleEl.style.color = "#ffbb33"; 
    } else {
        roleEl.style.color = "var(--accent)";
    }

    // Дублируем в статистику справа
    const rankTextEl = document.getElementById('stat-rank-text');
    if(rankTextEl) rankTextEl.innerText = rankName;

    // Дней на службе
    if (data.regDate) {
        const diffDays = Math.ceil(Math.abs(new Date() - new Date(data.regDate)) / (1000 * 60 * 60 * 24)); 
        const daysEl = document.getElementById('stat-days');
        if(daysEl) daysEl.innerText = diffDays;
    }

    // Жетон
    const shortId = uid ? uid.slice(-5).toUpperCase() : "----";
    const uidEl = document.getElementById('stat-uid');
    if(uidEl) uidEl.innerText = "#" + shortId;
}

// === ЛОГИКА АВАТАРОК ===
window.openAvatarModal = function() {
    const modal = document.getElementById('avatar-selection-modal');
    const container = document.getElementById('avatars-container');
    container.innerHTML = ''; 
    AVATAR_LIST.forEach(path => {
        const div = document.createElement('div');
        div.className = 'avatar-option';
        div.style.backgroundImage = `url('${path}')`;
        div.onclick = () => saveAvatar(path);
        container.appendChild(div);
    });
    modal.classList.add('open');
};

window.closeAvatarModal = function() {
    document.getElementById('avatar-selection-modal').classList.remove('open');
};

async function saveAvatar(path) {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { avatar: path });
        window.closeAvatarModal();
    } catch (e) { alert("Ошибка сохранения."); }

}
