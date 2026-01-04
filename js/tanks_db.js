/* js/tanks_db.js — БАЗА ДАННЫХ ТЕХНИКИ */

export const FULL_DB = {
    'ussr': {
        // --- РАНГ 1 (Стартовый набор, без связей) ---
        'fiat': { name: 'Фиат-Ижорский', rank: 1, br: 1.0, cost: 0, class: 'light', line: 1, desc: 'Легкий бронеавтомобиль.', stats: { armor: '6 мм', gun: '7.62 мм', engine: '45 л.с.' } },
        'm1928': { name: 'M.1928', rank: 1, br: 1.0, cost: 250, class: 'light', line: 2, desc: 'Прототип легкого танка.', stats: { armor: '10 мм', gun: '37 мм', engine: '60 л.с.' } },
        't18_29': { name: 'Т-18 Обр. 1929', rank: 1, br: 1.0, cost: 300, class: 'light', line: 3, desc: 'Модернизированный МС-1.', stats: { armor: '16 мм', gun: '37 мм', engine: '40 л.с.' } },
        't18': { name: 'Т-18', rank: 1, br: 1.0, cost: 500, class: 'light', line: 4, desc: 'Первый серийный танк.', stats: { armor: '16 мм', gun: '37 мм', engine: '35 л.с.' } },
        
        // --- ЦЕПОЧКА РАЗВИТИЯ (Начинается с 2.1, требует друг друга) ---
        
        // Начало ветки (Нет требования к 1 рангу)
        't12': { name: 'Т-12', rank: 2, br: 2.1, cost: 1500, class: 'medium', line: 1, 
            desc: 'Экспериментальный маневренный танк.', stats: { armor: '22 мм', gun: '45 мм', engine: '180 л.с.' } },
            
        't24': { name: 'Т-24', rank: 2, br: 2.2, cost: 2500, class: 'medium', req: 't12', line: 1, 
            desc: 'Средний танк межвоенного периода.', stats: { armor: '20 мм', gun: '45 мм', engine: '250 л.с.' } },
            
        't35_1': { name: 'Т-35-1', rank: 2, br: 2.4, cost: 4000, class: 'heavy', req: 't24', line: 1, 
            desc: 'Прототип пятибашенного монстра.', stats: { armor: '30 мм', gun: '76 мм', engine: '500 л.с.' } },
            
        't35_2': { name: 'Т-35-2', rank: 2, br: 2.5, cost: 5500, class: 'heavy', req: 't35_1', line: 1, 
            desc: 'Вторая серийная версия.', stats: { armor: '30 мм', gun: '76 мм', engine: '500 л.с.' } },
            
        't35_a': { name: 'Т-35-А', rank: 2, br: 2.7, cost: 7000, class: 'heavy', req: 't35_2', line: 1, 
            desc: 'Финальная версия "сухопутного линкора".', stats: { armor: '50 мм', gun: '76 мм', engine: '580 л.с.' } },
            
        'kv1_l11': { name: 'КВ-1 с Л-11', rank: 3, br: 3.0, cost: 12000, class: 'heavy', req: 't35_a', line: 1, 
            desc: 'Неуязвимая крепость начала войны.', stats: { armor: '75 мм', gun: '76 мм', engine: '500 л.с.' } },
            
        'kv1_zis': { name: 'КВ-1 ЗиС-5', rank: 3, br: 3.1, cost: 18000, class: 'heavy', req: 'kv1_l11', line: 1, 
            desc: 'Экранированная версия.', stats: { armor: '100 мм', gun: '76 мм', engine: '600 л.с.' } },
            
        'kv1s': { name: 'КВ-1С', rank: 3, br: 3.3, cost: 25000, class: 'heavy', req: 'kv1_zis', line: 1, 
            desc: 'Облегченная скоростная версия.', stats: { armor: '82 мм', gun: '76 мм', engine: '600 л.с.' } },
            
        'is1': { name: 'ИС-1', rank: 3, br: 3.4, cost: 35000, class: 'heavy', req: 'kv1s', line: 1, 
            desc: 'Переходная модель к серии ИС.', stats: { armor: '120 мм', gun: '85 мм', engine: '520 л.с.' } },
            
        'is2': { name: 'ИС-2', rank: 3, br: 3.5, cost: 50000, class: 'heavy', req: 'is1', line: 1, 
            desc: 'Танк Победы с 122-мм орудием.', stats: { armor: '120 мм', gun: '122 мм', engine: '520 л.с.' } },
            
        'is3': { name: 'ИС-3', rank: 3, br: 3.6, cost: 80000, class: 'heavy', req: 'is2', line: 1, 
            desc: 'Революционный дизайн "Щучий нос".', stats: { armor: '110 мм', gun: '122 мм', engine: '520 л.с.' } },
            
        'is7': { name: 'ИС-7', rank: 3, br: 3.9, cost: 150000, class: 'heavy', req: 'is3', line: 1, 
            desc: 'Вершина советского танкостроения.', stats: { armor: '150 мм', gun: '130 мм', engine: '1050 л.с.' } }
    },

    'germany': {
        // --- РАНГ 1 ---
        'st_pz_1': { name: 'St. Pz. Ober I', rank: 1, br: 1.0, cost: 0, class: 'heavy', line: 1, desc: 'Штурмовой танк ПМВ.', stats: { armor: '30 мм', gun: '57 мм', engine: '200 л.с.' } },
        'st_pz_2': { name: 'St. Pz. Ober II', rank: 1, br: 1.0, cost: 500, class: 'heavy', line: 2, desc: 'Улучшенная версия.', stats: { armor: '40 мм', gun: '57 мм', engine: '220 л.с.' } },
        'ltr_k': { name: 'L. Tr. (K)', rank: 1, br: 1.0, cost: 0, class: 'light', line: 3, desc: 'Leichttraktor Krupp.', stats: { armor: '14 мм', gun: '37 мм', engine: '85 л.с.' } },
        'ltr_r': { name: 'L. Tr. (R)', rank: 1, br: 1.0, cost: 500, class: 'light', line: 4, desc: 'Leichttraktor Rheinmetall.', stats: { armor: '14 мм', gun: '37 мм', engine: '100 л.с.' } },

        // --- ЦЕПОЧКА ---
        'gr_tr_1': { name: 'Gr. Tr. I', rank: 2, br: 2.1, cost: 2500, class: 'medium', line: 1, // Start
            desc: 'Grosstraktor I.', stats: { armor: '14 мм', gun: '75 мм', engine: '250 л.с.' } },
            
        'gr_tr_2': { name: 'Gr. Tr. II', rank: 2, br: 2.3, cost: 4000, class: 'medium', req: 'gr_tr_1', line: 1, 
            desc: 'Grosstraktor II.', stats: { armor: '20 мм', gun: '75 мм', engine: '260 л.с.' } },
            
        'nb_fz': { name: 'Nb. Fz.', rank: 2, br: 2.5, cost: 6000, class: 'medium', req: 'gr_tr_2', line: 1, 
            desc: 'Трехбашенный танк пропаганды.', stats: { armor: '20 мм', gun: '75 мм', engine: '290 л.с.' } },
            
        'dw1': { name: 'D.W. I', rank: 2, br: 2.6, cost: 8000, class: 'heavy', req: 'nb_fz', line: 1, 
            desc: 'Прототип прорыва.', stats: { armor: '50 мм', gun: '75 мм', engine: '280 л.с.' } },
            
        'dw2': { name: 'D.W. II', rank: 2, br: 2.9, cost: 10000, class: 'heavy', req: 'dw1', line: 1, 
            desc: 'Улучшенная башня.', stats: { armor: '50 мм', gun: '75 мм', engine: '300 л.с.' } },
            
        'pz6': { name: 'Pz. VI Tiger', rank: 3, br: 3.1, cost: 15000, class: 'heavy', req: 'dw2', line: 1, 
            desc: 'Легендарный Тигр.', stats: { armor: '100 мм', gun: '88 мм', engine: '650 л.с.' } },
            
        'pz6b': { name: 'Pz. VI B', rank: 3, br: 3.2, cost: 20000, class: 'heavy', req: 'pz6', line: 1, 
            desc: 'Ранняя версия Королевского Тигра (Порше).', stats: { armor: '150 мм', gun: '88 мм', engine: '700 л.с.' } },
            
        'pz6h1': { name: 'Pz. VI H1', rank: 3, br: 3.3, cost: 30000, class: 'heavy', req: 'pz6b', line: 1, 
            desc: 'Модернизированный Тигр.', stats: { armor: '102 мм', gun: '88 мм', engine: '700 л.с.' } },
            
        'pz6e': { name: 'Pz. VI E', rank: 3, br: 3.4, cost: 45000, class: 'heavy', req: 'pz6h1', line: 1, 
            desc: 'Поздний Тигр с циммеритом.', stats: { armor: '110 мм', gun: '88 мм', engine: '700 л.с.' } },
            
        'tiger2': { name: 'Tiger II (H)', rank: 3, br: 3.5, cost: 70000, class: 'heavy', req: 'pz6e', line: 1, 
            desc: 'Королевский Тигр (Хеншель).', stats: { armor: '185 мм', gun: '88 мм', engine: '700 л.с.' } },
            
        'e100': { name: 'E-100', rank: 3, br: 3.7, cost: 150000, class: 'heavy', req: 'tiger2', line: 1, 
            desc: 'Сверхтяжелый проект серии E.', stats: { armor: '200 мм', gun: '128 мм', engine: '1200 л.с.' } }
    },

    'usa': {
        // --- РАНГ 1 ---
        't2_29': { name: 'T2 1929', rank: 1, br: 1.0, cost: 0, class: 'light', line: 1, desc: 'Экспериментальный танк.', stats: { armor: '15 мм', gun: '12.7 мм', engine: '250 л.с.' } },
        't1e1': { name: 'T1E1', rank: 1, br: 1.0, cost: 400, class: 'light', line: 2, desc: 'Танк Каннингхэма.', stats: { armor: '10 мм', gun: '37 мм', engine: '110 л.с.' } },
        't1': { name: 'T1 Cunningham', rank: 1, br: 1.0, cost: 600, class: 'light', line: 3, desc: 'Серийная версия T1.', stats: { armor: '12 мм', gun: '37 мм', engine: '120 л.с.' } },
        'm1928': { name: 'M.1928', rank: 1, br: 1.0, cost: 800, class: 'light', line: 4, desc: 'Модификация T1.', stats: { armor: '15 мм', gun: '37 мм', engine: '130 л.с.' } },

        // --- ЦЕПОЧКА ---
        't1e5': { name: 'T1E5', rank: 2, br: 2.1, cost: 2000, class: 'light', line: 1, // Start
            desc: 'Попытка установить более мощный двигатель.', stats: { armor: '15 мм', gun: '37 мм', engine: '150 л.с.' } },
            
        't2_med': { name: 'T2', rank: 2, br: 2.2, cost: 3000, class: 'medium', req: 't1e5', line: 1, 
            desc: 'Средний танк 30-х годов.', stats: { armor: '22 мм', gun: '37 мм', engine: '220 л.с.' } },
            
        'm1_comb': { name: 'M1 Combat Car', rank: 2, br: 2.4, cost: 4500, class: 'light', req: 't2_med', line: 1, 
            desc: 'Кавалерийский танк.', stats: { armor: '16 мм', gun: '12.7 мм', engine: '250 л.с.' } },
            
        'm1': { name: 'M1', rank: 2, br: 2.6, cost: 5500, class: 'light', req: 'm1_comb', line: 1, 
            desc: 'Ранний вариант легкого танка.', stats: { armor: '16 мм', gun: '37 мм', engine: '260 л.с.' } },
            
        't7': { name: 'T7 Combat Car', rank: 2, br: 2.8, cost: 7000, class: 'light', req: 'm1', line: 1, 
            desc: 'Экспериментальная колесно-гусеничная машина.', stats: { armor: '15 мм', gun: '12.7 мм', engine: '200 л.с.' } },
            
        'm2': { name: 'M2', rank: 3, br: 3.0, cost: 12000, class: 'medium', req: 't7', line: 1, 
            desc: 'Серийный средний танк.', stats: { armor: '32 мм', gun: '37 мм', engine: '350 л.с.' } },
            
        'm3': { name: 'M3 Lee', rank: 3, br: 3.1, cost: 18000, class: 'medium', req: 'm2', line: 1, 
            desc: 'Многобашенный танк.', stats: { armor: '51 мм', gun: '75 мм', engine: '400 л.с.' } },
            
        't1e1_h': { name: 'T1E1 Heavy', rank: 3, br: 3.2, cost: 25000, class: 'heavy', req: 'm3', line: 1, 
            desc: 'Ранний прототип М6.', stats: { armor: '70 мм', gun: '76 мм', engine: '800 л.с.' } },
            
        'm6a1': { name: 'M6A1', rank: 3, br: 3.4, cost: 35000, class: 'heavy', req: 't1e1_h', line: 1, 
            desc: 'Американский тяжеловес.', stats: { armor: '83 мм', gun: '76 мм', engine: '960 л.с.' } },
            
        't26e1': { name: 'T26E1', rank: 3, br: 3.6, cost: 50000, class: 'heavy', req: 'm6a1', line: 1, 
            desc: 'Супер Першинг.', stats: { armor: '102 мм', gun: '90 мм', engine: '500 л.с.' } },
            
        't32': { name: 'T32', rank: 3, br: 3.7, cost: 70000, class: 'heavy', req: 't26e1', line: 1, 
            desc: 'Тяжелый танк с крепкой башней.', stats: { armor: '298 мм', gun: '90 мм', engine: '770 л.с.' } },
            
        't29': { name: 'T29', rank: 3, br: 3.8, cost: 90000, class: 'heavy', req: 't32', line: 1, 
            desc: 'Танк с 105-мм пушкой.', stats: { armor: '279 мм', gun: '105 мм', engine: '770 л.с.' } },
            
        't30': { name: 'T30', rank: 3, br: 3.9, cost: 120000, class: 'heavy', req: 't29', line: 1, 
            desc: 'Вариант T29 с 155-мм орудием.', stats: { armor: '279 мм', gun: '155 мм', engine: '810 л.с.' } }
    },

    'uk': {
        // --- РАНГ 1 ---
        'mk1': { name: 'Medium Mk. I', rank: 1, br: 1.0, cost: 0, class: 'medium', line: 1, desc: 'Первый серийный.', stats: { armor: '12 мм', gun: '47 мм', engine: '90 л.с.' } },
        'mk1cs': { name: 'Mk. I CS', rank: 1, br: 1.0, cost: 400, class: 'medium', line: 2, desc: 'Гаубичная версия.', stats: { armor: '12 мм', gun: '3.7-inch', engine: '90 л.с.' } },
        'mk2': { name: 'Medium Mk. II', rank: 1, br: 1.0, cost: 600, class: 'medium', line: 3, desc: 'Доработанная версия.', stats: { armor: '14 мм', gun: '47 мм', engine: '90 л.с.' } },
        'mk3': { name: 'Medium Mk. III', rank: 1, br: 1.0, cost: 900, class: 'medium', line: 4, desc: 'Трехбашенный.', stats: { armor: '14 мм', gun: '47 мм', engine: '180 л.с.' } },

        // --- ЦЕПОЧКА ---
        'vic_a': { name: 'Vickers Mk. E A', rank: 2, br: 2.1, cost: 2000, class: 'light', line: 1, // Start
            desc: 'Двухбашенный Виккерс.', stats: { armor: '13 мм', gun: '2x MG', engine: '80 л.с.' } },
            
        'vic_b': { name: 'Vickers Mk. E B', rank: 2, br: 2.2, cost: 3000, class: 'light', req: 'vic_a', line: 1, 
            desc: 'Однобашенный Виккерс.', stats: { armor: '13 мм', gun: '47 мм', engine: '80 л.с.' } },
            
        'a9': { name: 'A9', rank: 2, br: 2.5, cost: 4500, class: 'medium', req: 'vic_b', line: 1, 
            desc: 'Крейсерский танк.', stats: { armor: '14 мм', gun: '40 мм', engine: '150 л.с.' } },
            
        'a10': { name: 'A10E1', rank: 2, br: 2.8, cost: 5500, class: 'medium', req: 'a9', line: 1, 
            desc: 'Тяжелый крейсер.', stats: { armor: '30 мм', gun: '40 мм', engine: '150 л.с.' } },
            
        'a13': { name: 'A13E1', rank: 2, br: 2.9, cost: 7000, class: 'medium', req: 'a10', line: 1, 
            desc: 'Подвеска Кристи.', stats: { armor: '14 мм', gun: '40 мм', engine: '340 л.с.' } },
            
        'cruiser4': { name: 'Cruiser IV', rank: 3, br: 3.1, cost: 12000, class: 'medium', req: 'a13', line: 1, 
            desc: 'Улучшенная броня.', stats: { armor: '30 мм', gun: '40 мм', engine: '340 л.с.' } },
            
        'church1': { name: 'Churchill I', rank: 3, br: 3.2, cost: 20000, class: 'heavy', req: 'cruiser4', line: 1, 
            desc: 'Пехотный танк.', stats: { armor: '89 мм', gun: '40 мм', engine: '350 л.с.' } },
            
        'church3': { name: 'Churchill III', rank: 3, br: 3.3, cost: 30000, class: 'heavy', req: 'church1', line: 1, 
            desc: 'Сварная башня.', stats: { armor: '89 мм', gun: '57 мм', engine: '350 л.с.' } },
            
        'church_avre': { name: 'Churchill AVRE', rank: 3, br: 3.4, cost: 40000, class: 'heavy', req: 'church3', line: 1, 
            desc: 'Инженерный танк.', stats: { armor: '89 мм', gun: '290 мм', engine: '350 л.с.' } },
            
        'a43': { name: 'A43', rank: 3, br: 3.5, cost: 55000, class: 'heavy', req: 'church_avre', line: 1, 
            desc: 'Черный Принц.', stats: { armor: '152 мм', gun: '76 мм', engine: '350 л.с.' } },
            
        'a45': { name: 'A45', rank: 3, br: 3.6, cost: 70000, class: 'heavy', req: 'a43', line: 1, 
            desc: 'Прототип Конкерора.', stats: { armor: '130 мм', gun: '84 мм', engine: '800 л.с.' } },
            
        'a39': { name: 'A39', rank: 3, br: 3.7, cost: 100000, class: 'td', req: 'a45', line: 1, 
            desc: 'Штурмовая САУ Черепаха.', stats: { armor: '228 мм', gun: '94 мм', engine: '600 л.с.' } }
    },

    'france': {
        // --- РАНГ 1 ---
        'nc31': { name: 'NC31', rank: 1, br: 1.0, cost: 0, class: 'light', line: 1, desc: 'Экспортный FT.', stats: { armor: '16 мм', gun: '37 мм', engine: '60 л.с.' } },
        'nc27': { name: 'NC27', rank: 1, br: 1.0, cost: 400, class: 'light', line: 2, desc: 'Развитие NC.', stats: { armor: '30 мм', gun: '37 мм', engine: '60 л.с.' } },
        'ft': { name: 'FT', rank: 1, br: 1.0, cost: 600, class: 'light', line: 3, desc: 'Легенда ПМВ.', stats: { armor: '16 мм', gun: '37 мм', engine: '39 л.с.' } },
        'char_d1': { name: 'Char D1', rank: 1, br: 1.0, cost: 900, class: 'medium', line: 4, desc: 'Основной боевой.', stats: { armor: '30 мм', gun: '47 мм', engine: '74 л.с.' } },

        // --- ЦЕПОЧКА ---
        'amr33': { name: 'AMR 33', rank: 2, br: 2.3, cost: 2500, class: 'light', line: 1, // Start
            desc: 'Разведчик.', stats: { armor: '13 мм', gun: '7.5 мм', engine: '84 л.с.' } },
            
        'd2': { name: 'D2', rank: 2, br: 2.5, cost: 4000, class: 'medium', req: 'amr33', line: 1, 
            desc: 'Развитие D1.', stats: { armor: '40 мм', gun: '47 мм', engine: '150 л.с.' } },
            
        's35': { name: 'S35', rank: 2, br: 2.6, cost: 5500, class: 'medium', req: 'd2', line: 1, 
            desc: 'Лучший французский танк 1940.', stats: { armor: '47 мм', gun: '47 мм', engine: '190 л.с.' } },
            
        'b1': { name: 'B1', rank: 2, br: 2.7, cost: 8000, class: 'heavy', req: 's35', line: 1, 
            desc: 'Символ мощи.', stats: { armor: '60 мм', gun: '47+75 мм', engine: '307 л.с.' } },
            
        'amx38': { name: 'AMX 38', rank: 2, br: 2.9, cost: 9000, class: 'light', req: 'b1', line: 1, 
            desc: 'Прототип легкого танка.', stats: { armor: '40 мм', gun: '37 мм', engine: '130 л.с.' } },
            
        'r38': { name: 'R 38', rank: 3, br: 3.0, cost: 12000, class: 'light', req: 'amx38', line: 1, 
            desc: 'Модификация R35.', stats: { armor: '40 мм', gun: '37 мм', engine: '82 л.с.' } },
            
        's40': { name: 'S40', rank: 3, br: 3.1, cost: 15000, class: 'medium', req: 'r38', line: 1, 
            desc: 'Улучшенная версия.', stats: { armor: '60 мм', gun: '47 мм', engine: '220 л.с.' } },
            
        'fcm_f1': { name: 'FCM F1', rank: 3, br: 3.2, cost: 25000, class: 'heavy', req: 's40', line: 1, 
            desc: 'Сверхтяжелый двухбашенный.', stats: { armor: '100 мм', gun: '90 мм', engine: '700 л.с.' } },
            
        'sarl42': { name: 'SARL 42', rank: 3, br: 3.3, cost: 35000, class: 'medium', req: 'fcm_f1', line: 1, 
            desc: 'Проект оккупации.', stats: { armor: '60 мм', gun: '75 мм', engine: '230 л.с.' } },
            
        'fcm50t': { name: 'FCM 50 t', rank: 3, br: 3.5, cost: 50000, class: 'heavy', req: 'sarl42', line: 1, 
            desc: 'Послевоенный проект.', stats: { armor: '120 мм', gun: '90 мм', engine: '1000 л.с.' } },
            
        'arl44_acl': { name: 'ARL 44 ACL-1', rank: 3, br: 3.6, cost: 70000, class: 'heavy', req: 'fcm50t', line: 1, 
            desc: 'Ранний прототип.', stats: { armor: '60 мм', gun: '75 мм', engine: '575 л.с.' } },
            
        'arl44': { name: 'ARL 44', rank: 3, br: 3.7, cost: 100000, class: 'heavy', req: 'arl44_acl', line: 1, 
            desc: 'Серийный тяж.', stats: { armor: '120 мм', gun: '90 мм', engine: '575 л.с.' } }
    },

    'japan': {
        // --- РАНГ 1 ---
        'otsu': { name: 'Otsu-Gata', rank: 1, br: 1.0, cost: 0, class: 'light', line: 1, desc: 'Японский NC-27.', stats: { armor: '22 мм', gun: '37 мм', engine: '75 л.с.' } },
        'type89': { name: 'Type 89', rank: 1, br: 1.0, cost: 400, class: 'medium', line: 2, desc: 'Первый серийный.', stats: { armor: '17 мм', gun: '57 мм', engine: '120 л.с.' } },
        'ko': { name: 'Ko Gata', rank: 1, br: 1.0, cost: 600, class: 'light', line: 3, desc: 'Импортный FT.', stats: { armor: '16 мм', gun: '37 мм', engine: '39 л.с.' } },

        // --- ЦЕПОЧКА ---
        'type91': { name: 'Type 91', rank: 2, br: 2.2, cost: 3000, class: 'heavy', line: 1, // Start
            desc: 'Многобашенный тяжелый танк.', stats: { armor: '20 мм', gun: '57 мм', engine: '224 л.с.' } },
            
        'type95': { name: 'Type 95', rank: 2, br: 2.5, cost: 5000, class: 'heavy', req: 'type91', line: 1, 
            desc: 'Укрупненная версия.', stats: { armor: '35 мм', gun: '70 мм', engine: '290 л.с.' } },
            
        'type100': { name: 'Type 100', rank: 3, br: 3.4, cost: 30000, class: 'heavy', req: 'type95', line: 1, 
            desc: 'Сухопутный крейсер O-I.', stats: { armor: '150 мм', gun: '105 мм', engine: '1100 л.с.' } },
            
        'type2604': { name: 'Type 2604', rank: 3, br: 3.7, cost: 60000, class: 'heavy', req: 'type100', line: 1, 
            desc: 'Аналог Пантеры (Chi-To).', stats: { armor: '75 мм', gun: '75 мм', engine: '400 л.с.' } },
            
        'type2605': { name: 'Type 2605', rank: 3, br: 3.9, cost: 100000, class: 'heavy', req: 'type2604', line: 1, 
            desc: 'Средний танк с автоматом заряжания (Chi-Ri).', stats: { armor: '75 мм', gun: '75 мм', engine: '550 л.с.' } }
    }
};