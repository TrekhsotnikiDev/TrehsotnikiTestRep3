import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Получаем доступ к Firebase (так как скрипт module, переменные изолированы)
// Инициализация должна быть такая же как в main.js, Firebase сам подхватит app
const db = getFirestore();
const auth = getAuth();

const CASE_PRICE = 500;

// === ТАБЛИЦА ЛУТА ===
// rarity: влияет на цвет полоски внизу
const LOOT_TABLE = [
    // --- ТОП ПРИЗЫ ---
    { id: 'is7', name: 'IS-7 Object 260', rarity: 'legendary', img: 'img/br_logo.png', chance: 2 },
    { id: 'gold_5000', name: '5000 GOLD', rarity: 'legendary', img: 'img/Zoloto2.png', chance: 3 },
    
    // --- СРЕДНИЕ ---
    { id: 'camo_w', name: 'ЗИМНИЙ КАМУФЛЯЖ', rarity: 'rare', img: 'img/Camo2.png', chance: 10 },
    { id: 'gold_1000', name: '1000 GOLD', rarity: 'rare', img: 'img/Zoloto2.png', chance: 15 },

    // --- ОБЫЧНЫЕ ---
    { id: 'xp_5000', name: '5000 XP', rarity: 'common', img: 'img/xp_ico.png', chance: 20 },
    { id: 'xp_2000', name: '2000 XP', rarity: 'common', img: 'img/xp_ico.png', chance: 25 },
    { id: 'gold_100', name: '100 GOLD', rarity: 'common', img: 'img/Zoloto2.png', chance: 25 },
];

// Элементы
const tape = document.getElementById('tape');
const winDisplay = document.getElementById('win-display');
const spinBtn = document.getElementById('spin-btn');

// --- ФУНКЦИЯ ОТКРЫТИЯ ОКНА ---
window.openRoulette = function() {
    document.getElementById('roulette-modal').classList.add('open');
    winDisplay.style.display = 'none';
    tape.style.transition = 'none';
    tape.style.transform = 'translateX(0px)';
    tape.innerHTML = ''; // Чистим ленту
    // Генерируем "превью" ленту, чтобы не было пусто
    generateTape(getRandomItem(), 0); 
}

window.closeRoulette = function() {
    document.getElementById('roulette-modal').classList.remove('open');
}

// --- ГЛАВНАЯ ЛОГИКА ---
window.spinRoulette = async function() {
    const user = auth.currentUser;
    if (!user) return alert("Войдите в аккаунт!");

    // 1. ПРОВЕРКА БАЛАНСА И СПИСАНИЕ
    const userRef = doc(db, "users", user.uid);
    try {
        const snap = await getDoc(userRef);
        const userData = snap.data();
        
        if (userData.gold < CASE_PRICE) {
            return alert("Недостаточно золота!");
        }

        // Блокируем кнопку
        spinBtn.disabled = true;
        spinBtn.innerText = "КРУТИМ...";
        winDisplay.style.display = 'none';

        // СПИСЫВАЕМ ДЕНЬГИ (Это разрешено правилами: gold уменьшается)
        await updateDoc(userRef, {
            gold: userData.gold - CASE_PRICE
        });

    } catch (e) {
        console.error(e);
        spinBtn.disabled = false;
        return alert("Ошибка: " + e.message);
    }

    // 2. ВЫБОР ПОБЕДИТЕЛЯ (Визуальный)
    const winner = getWeightedRandom();
    console.log("Выпадет:", winner.name);

    // 3. ГЕНЕРАЦИЯ ЛЕНТЫ
    // Победитель всегда на 60-й позиции
    generateTape(winner, 60);

    // 4. ЗАПУСК АНИМАЦИИ
    setTimeout(() => {
        const CARD_WIDTH = 124; // 120px ширина + 10px margin
        // Смещаем ленту так, чтобы 60-я карточка встала по центру
        // Добавляем рандом +/- 40px, чтобы стрелка не всегда была ровно по центру карточки
        const randomOffset = Math.floor(Math.random() * 80) - 40;
        const centerPosition = (tape.parentElement.offsetWidth / 2) - (CARD_WIDTH / 2);
        const finalPosition = (60 * CARD_WIDTH) - centerPosition + randomOffset;

        tape.style.transition = "transform 6s cubic-bezier(0.15, 0, 0.10, 1)"; // Очень плавная остановка
        tape.style.transform = `translateX(-${finalPosition}px)`;
    }, 100);

    // 5. ПОКАЗ РЕЗУЛЬТАТА
    setTimeout(() => {
        document.getElementById('win-img').src = winner.img;
        document.getElementById('win-name').innerText = winner.name;
        document.getElementById('win-name').style.color = getRarityColor(winner.rarity);
        
        winDisplay.style.display = 'block';
        spinBtn.disabled = false;
        spinBtn.innerText = "КРУТИТЬ ЕЩЕ";
    }, 6500); // 6s анимация + 0.5s запас
};

// Генерация HTML ленты
function generateTape(winnerItem, winIndex) {
    tape.innerHTML = '';
    const totalCards = 75;
    
    for (let i = 0; i < totalCards; i++) {
        let item;
        if (i === winIndex) {
            item = winnerItem;
        } else {
            item = getRandomItem(); // Случайный мусор
        }

        const div = document.createElement('div');
        div.className = `loot-card rarity-${item.rarity}`;
        div.innerHTML = `<img src="${item.img}"><span>${item.name}</span>`;
        tape.appendChild(div);
    }
}

// Случайный предмет с учетом шанса
function getWeightedRandom() {
    let total = 0;
    LOOT_TABLE.forEach(i => total += i.chance);
    let rand = Math.random() * total;
    for (let item of LOOT_TABLE) {
        if (rand < item.chance) return item;
        rand -= item.chance;
    }
    return LOOT_TABLE[0];
}

// Просто случайный предмет (для массовки)
function getRandomItem() {
    return LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
}

function getRarityColor(rarity) {
    if (rarity === 'legendary') return '#ffbb33';
    if (rarity === 'rare') return '#9b59b6';
    return '#ccc';
}