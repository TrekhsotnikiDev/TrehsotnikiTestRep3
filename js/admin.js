/* js/admin.js - ПАНЕЛЬ УПРАВЛЕНИЯ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWqbVh-eFA0A9uPgAf_q8fg4jP7rNnQDk",
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

// === ВАЖНО: ТВОЙ UID АДМИНИСТРАТОРА ===
const ADMIN_UID = "YgeFs7B7n4hkfSG5mgJIL6utpo13"; 

let targetUserDocId = null; // ID найденного юзера
let currentGold = 0;

// 1. ПРОВЕРКА ДОСТУПА
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.uid !== ADMIN_UID) {
            alert("ДОСТУП ЗАПРЕЩЕН. ВЫ НЕ АДМИНИСТРАТОР.");
            window.location.href = 'index.html';
        } else {
            console.log("Добро пожаловать, Командир.");
        }
    } else {
        window.location.href = 'index.html';
    }
});

// 2. ПОИСК ПОЛЬЗОВАТЕЛЯ
window.findUser = async function() {
    const input = document.getElementById('search-input').value.trim();
    const status = document.getElementById('status-msg');
    
    if (!input) return;

    status.innerText = "Поиск в базе данных...";
    status.style.color = "#ffbb33";

    try {
        const usersRef = collection(db, "users");
        
        // Пробуем найти по email
        let q = query(usersRef, where("email", "==", input));
        let snapshot = await getDocs(q);

        // Если не нашли, пробуем по нику
        if (snapshot.empty) {
            q = query(usersRef, where("nickname", "==", input));
            snapshot = await getDocs(q);
        }

        if (snapshot.empty) {
            status.innerText = "БОЕЦ НЕ НАЙДЕН";
            status.style.color = "#ff4444";
            document.getElementById('user-card').classList.remove('active');
            return;
        }

        // Берем первого найденного (обычно он один)
        const userDoc = snapshot.docs[0];
        const data = userDoc.data();
        
        targetUserDocId = userDoc.id;
        currentGold = data.gold || 0;

        // Заполняем интерфейс
        document.getElementById('u-nick').innerText = data.nickname;
        document.getElementById('u-uid').innerText = userDoc.id;
        document.getElementById('u-gold').innerText = currentGold.toLocaleString();
        document.getElementById('u-rank').innerText = data.rankLevel !== undefined ? data.rankLevel : "0 (Рядовой)";
        document.getElementById('rank-select').value = data.rankLevel || 0;

        document.getElementById('user-card').classList.add('active');
        status.innerText = "ДАННЫЕ ЗАГРУЖЕНЫ";
        status.style.color = "#00C851";

    } catch (e) {
        console.error(e);
        status.innerText = "ОШИБКА БАЗЫ (См. консоль)";
        status.style.color = "#ff4444";
    }
};

// 3. НАЧИСЛЕНИЕ ЗОЛОТА
window.addGold = async function(amount) {
    if (!targetUserDocId) return;
    
    try {
        const newGold = currentGold + amount;
        await updateDoc(doc(db, "users", targetUserDocId), {
            gold: newGold
        });
        
        currentGold = newGold;
        document.getElementById('u-gold').innerText = newGold.toLocaleString();
        alert(`Начислено ${amount} золота!`);
    } catch (e) {
        alert("Ошибка: " + e.message);
    }
};

window.setCustomGold = async function() {
    if (!targetUserDocId) return;
    const val = prompt("Введите точное количество золота:");
    if (val === null) return;
    
    const amount = parseInt(val);
    if (isNaN(amount)) return alert("Нужно число!");

    try {
        await updateDoc(doc(db, "users", targetUserDocId), { gold: amount });
        currentGold = amount;
        document.getElementById('u-gold').innerText = amount.toLocaleString();
        alert("Баланс обновлен.");
    } catch (e) { alert("Ошибка"); }
};

// 4. СМЕНА ЗВАНИЯ
window.saveRank = async function() {
    if (!targetUserDocId) return;
    const level = parseInt(document.getElementById('rank-select').value);

    try {
        await updateDoc(doc(db, "users", targetUserDocId), {
            rankLevel: level
        });
        document.getElementById('u-rank').innerText = level;
        alert("Звание успешно присвоено!");
    } catch (e) {
        alert("Ошибка: " + e.message);
    }
};