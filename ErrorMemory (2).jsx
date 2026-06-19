import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: deep navy (#0F1B2D) + electric teal (#00C9A7) + soft amber (#F5A623)
// + off-white (#F0F4F8) + muted slate (#6B7A99)
// Typography: display = "Sora", body = "Inter"
// Signature: animated neon underline on active nav + glowing score badge

const LANG = {
  en: {
    appName: "ErrorMemory",
    tagline: "Master IELTS Writing with AI-powered feedback",
    nav: { home: "Home", practice: "Practice", bank: "Word Bank", profile: "Profile" },
    diag: {
      title: "Quick Diagnostic",
      subtitle: "Let's find your weak areas",
      start: "Start Diagnostic",
      q: [
        { q: "Which part of IELTS Writing do you struggle with most?", opts: ["Vocabulary", "Grammar", "Generating ideas", "Essay structure"] },
        { q: "How often do you practice writing?", opts: ["Daily", "A few times a week", "Once a week", "Rarely"] },
        { q: "What is your current IELTS Writing target?", opts: ["Band 5–5.5", "Band 6–6.5", "Band 7–7.5", "Band 8+"] },
      ],
      done: "See My Results",
      result: "Your profile is ready!",
      weak: "Focus area:",
    },
    task: { title: "Choose Your Task", t1: "Task 1", t2: "Task 2", t1d: "Describe a graph, chart, or diagram", t2d: "Write an argumentative essay" },
    topics: {
      label: "Choose a Topic",
      t1: ["CO₂ Emissions (1990–2020)", "Internet usage by age group", "Water consumption by sector", "Global tourism statistics"],
      t2: ["Technology & society", "Environment & climate", "Education & youth", "Health & lifestyle"],
    },
    resources: {
      title: "Learning Resources",
      chunks: "Useful Chunks",
      grammar: "Grammar Structures",
      save: "Save",
      saved: "Saved ✓",
    },
    write: { title: "Write Your Essay", placeholder: "Start writing here… aim for 250+ words for Task 2, 150+ for Task 1.", submit: "Submit for Feedback", words: "words", timer: "Timer" },
    feedback: {
      title: "AI Feedback",
      loading: "Analysing your essay…",
      score: "Predicted Band Score",
      back: "Back to Main Menu",
      retry: "Write Another Essay",
    },
    bank: { title: "My Word Bank", empty: "No saved words yet. Save vocabulary from the resources panel.", vocab: "Vocabulary", grammar: "Grammar Structures", remove: "Remove" },
    profile: {
      title: "My Profile",
      essays: "Essays Written",
      avgScore: "Average Band",
      streak: "Day Streak",
      words: "Words Saved",
      history: "Essay History",
      noHistory: "No essays yet. Start practising!",
      viewFeedback: "View Feedback",
    },
    misc: { back: "← Back", close: "Close", loading: "Loading…" },
  },
  ru: {
    appName: "ErrorMemory",
    tagline: "Освойте IELTS Writing с помощью ИИ-обратной связи",
    nav: { home: "Главная", practice: "Практика", bank: "Словарь", profile: "Профиль" },
    diag: {
      title: "Быстрая диагностика",
      subtitle: "Определим ваши слабые стороны",
      start: "Начать диагностику",
      q: [
        { q: "Что вам даётся труднее всего?", opts: ["Словарный запас", "Грамматика", "Генерация идей", "Структура эссе"] },
        { q: "Как часто вы практикуете письмо?", opts: ["Каждый день", "Несколько раз в неделю", "Раз в неделю", "Редко"] },
        { q: "Какой у вас целевой балл?", opts: ["Balл 5–5.5", "Balл 6–6.5", "Balл 7–7.5", "Balл 8+"] },
      ],
      done: "Показать результаты",
      result: "Ваш профиль готов!",
      weak: "Фокус обучения:",
    },
    task: { title: "Выберите задание", t1: "Задание 1", t2: "Задание 2", t1d: "Опишите график или диаграмму", t2d: "Напишите аргументативное эссе" },
    topics: {
      label: "Выберите тему",
      t1: ["Выбросы CO₂ (1990–2020)", "Интернет по возрастам", "Потребление воды", "Мировой туризм"],
      t2: ["Технологии и общество", "Экология и климат", "Образование и молодёжь", "Здоровье и образ жизни"],
    },
    resources: {
      title: "Учебные материалы",
      chunks: "Полезные выражения",
      grammar: "Грамматические структуры",
      save: "Сохранить",
      saved: "Сохранено ✓",
    },
    write: { title: "Напишите эссе", placeholder: "Начните писать здесь… стремитесь к 250+ слов для Задания 2, 150+ для Задания 1.", submit: "Отправить на проверку", words: "слов", timer: "Таймер" },
    feedback: {
      title: "Обратная связь ИИ",
      loading: "Анализируем ваше эссе…",
      score: "Прогнозируемый балл IELTS",
      back: "Вернуться в главное меню",
      retry: "Написать ещё одно эссе",
    },
    bank: { title: "Мой словарный банк", empty: "Слова ещё не сохранены. Сохраните лексику из панели материалов.", vocab: "Лексика", grammar: "Грамматические структуры", remove: "Удалить" },
    profile: {
      title: "Мой профиль",
      essays: "Эссе написано",
      avgScore: "Средний балл",
      streak: "Дней подряд",
      words: "Слов сохранено",
      history: "История эссе",
      noHistory: "Эссе пока нет. Начните практиковаться!",
      viewFeedback: "Посмотреть отзыв",
    },
    misc: { back: "← Назад", close: "Закрыть", loading: "Загрузка…" },
  },
  kz: {
    appName: "ErrorMemory",
    tagline: "IELTS Writing-ті жасанды интеллектпен жетілдіріңіз",
    nav: { home: "Басты", practice: "Жаттығу", bank: "Сөздік", profile: "Профиль" },
    diag: {
      title: "Жылдам диагностика",
      subtitle: "Әлсіз жақтарыңызды анықтайық",
      start: "Диагностиканы бастау",
      q: [
        { q: "Сізге не қиын?", opts: ["Сөздік қор", "Грамматика", "Идея генерациясы", "Эссе құрылымы"] },
        { q: "Жазуды қаншалықты жиі жаттықтырасыз?", opts: ["Күн сайын", "Аптасына бірнеше рет", "Аптасына бір рет", "Сирек"] },
        { q: "Мақсатты балыңыз қандай?", opts: ["Band 5–5.5", "Band 6–6.5", "Band 7–7.5", "Band 8+"] },
      ],
      done: "Нәтижелерді көру",
      result: "Профиліңіз дайын!",
      weak: "Фокус бағыты:",
    },
    task: { title: "Тапсырма таңдаңыз", t1: "1-тапсырма", t2: "2-тапсырма", t1d: "График немесе диаграмманы сипаттаңыз", t2d: "Аргументативтік эссе жазыңыз" },
    topics: {
      label: "Тақырып таңдаңыз",
      t1: ["CO₂ шығарындылары (1990–2020)", "Жас топтары бойынша интернет", "Су тұтыну", "Дүниежүзілік туризм"],
      t2: ["Технология және қоғам", "Экология және климат", "Білім және жастар", "Денсаулық және өмір салты"],
    },
    resources: {
      title: "Оқу материалдары",
      chunks: "Пайдалы тіркестер",
      grammar: "Грамматикалық құрылымдар",
      save: "Сақтау",
      saved: "Сақталды ✓",
    },
    write: { title: "Эссе жазыңыз", placeholder: "Мұнда жазуды бастаңыз… 2-тапсырма үшін 250+ сөз, 1-тапсырма үшін 150+ сөз.", submit: "Тексеруге жіберу", words: "сөз", timer: "Таймер" },
    feedback: {
      title: "ЖИ кері байланысы",
      loading: "Эссеңіз талдануда…",
      score: "Болжалды IELTS балы",
      back: "Басты мәзірге оралу",
      retry: "Тағы бір эссе жазу",
    },
    bank: { title: "Менің сөздік банкім", empty: "Сақталған сөздер жоқ. Материалдар тақтасынан лексиканы сақтаңыз.", vocab: "Лексика", grammar: "Грамматикалық құрылымдар", remove: "Жою" },
    profile: {
      title: "Менің профилім",
      essays: "Жазылған эссе",
      avgScore: "Орташа балл",
      streak: "Күн қатарынан",
      words: "Сақталған сөздер",
      history: "Эссе тарихы",
      noHistory: "Эссе әлі жоқ. Жаттығуды бастаңыз!",
      viewFeedback: "Пікірді көру",
    },
    misc: { back: "← Артқа", close: "Жабу", loading: "Жүктелуде…" },
  },
};

const CHUNKS = {
  t1: [
    "The graph illustrates…", "According to the data…", "There was a significant increase in…",
    "The figures peaked at…", "Overall, it is clear that…", "This was followed by a sharp decline…",
    "The proportion of… rose steadily", "Compared to…, the figure for… was considerably higher",
  ],
  t2: [
    "It is widely argued that…", "There are compelling reasons to believe…", "On the other hand…",
    "This essay will examine both sides of the argument", "A notable advantage of… is…",
    "Critics of this view contend that…", "In conclusion, the evidence suggests…",
    "This can be attributed to the fact that…",
  ],
};

const GRAMMAR = [
  "Passive voice: 'It can be seen that…'",
  "Concession: 'Although… , it is clear that…'",
  "Conditional: 'If… were to…, the result would be…'",
  "Cleft sentence: 'It is technology that has transformed…'",
  "Nominalization: 'The development of… has led to…'",
  "Relative clause: '…, which suggests that…'",
  "Inversion: 'Not only does… but also…'",
  "Participle clause: 'Having considered both sides…'",
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0F1B2D;
    --navy2: #162336;
    --navy3: #1E2F47;
    --teal: #00C9A7;
    --teal2: #00A88D;
    --amber: #F5A623;
    --offwhite: #F0F4F8;
    --slate: #6B7A99;
    --white: #FFFFFF;
    --danger: #FF5A5F;
    --card: #1A2940;
    --border: #243552;
  }

  body { font-family: 'Inter', sans-serif; background: var(--navy); color: var(--offwhite); min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(15,27,45,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    height: 64px;
  }
  .nav-brand { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.25rem; color: var(--teal); letter-spacing: -0.5px; }
  .nav-brand span { color: var(--amber); }
  .nav-links { display: flex; gap: 4px; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 500;
    color: var(--slate); padding: 8px 14px; border-radius: 8px;
    transition: color 0.2s, background 0.2s; position: relative;
  }
  .nav-btn:hover { color: var(--offwhite); background: var(--navy3); }
  .nav-btn.active { color: var(--teal); }
  .nav-btn.active::after {
    content: ''; position: absolute; bottom: 2px; left: 14px; right: 14px;
    height: 2px; background: var(--teal);
    border-radius: 2px;
    box-shadow: 0 0 8px var(--teal);
  }
  .nav-right { display: flex; gap: 8px; align-items: center; }
  .lang-btn {
    background: var(--navy3); border: 1px solid var(--border); color: var(--slate);
    font-size: 0.75rem; font-family: 'Inter', sans-serif; font-weight: 600;
    padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
  }
  .lang-btn:hover, .lang-btn.active { border-color: var(--teal); color: var(--teal); }

  /* MAIN */
  .main { flex: 1; padding: 32px 24px; max-width: 900px; margin: 0 auto; width: 100%; }

  /* CARDS */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
  }
  .card + .card { margin-top: 20px; }

  /* HOME HERO */
  .hero { text-align: center; padding: 60px 24px 40px; }
  .hero-title {
    font-family: 'Sora', sans-serif; font-size: 2.8rem; font-weight: 800;
    line-height: 1.1; color: var(--white);
    margin-bottom: 16px;
  }
  .hero-title .accent { color: var(--teal); }
  .hero-tagline { color: var(--slate); font-size: 1.1rem; margin-bottom: 36px; }
  .hero-cta {
    display: inline-block; background: var(--teal); color: var(--navy);
    font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem;
    padding: 14px 36px; border-radius: 50px; border: none; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0 24px rgba(0,201,167,0.35);
  }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(0,201,167,0.5); }

  /* DIAG */
  .diag-q { font-size: 1.1rem; font-weight: 600; color: var(--white); margin-bottom: 20px; }
  .diag-opts { display: flex; flex-direction: column; gap: 10px; }
  .diag-opt {
    background: var(--navy3); border: 1px solid var(--border);
    color: var(--offwhite); font-family: 'Inter', sans-serif; font-size: 0.95rem;
    padding: 14px 18px; border-radius: 10px; cursor: pointer; text-align: left;
    transition: border-color 0.2s, background 0.2s;
  }
  .diag-opt:hover { border-color: var(--teal); background: rgba(0,201,167,0.07); }
  .diag-progress { display: flex; gap: 8px; margin-bottom: 28px; }
  .diag-dot { height: 4px; flex: 1; background: var(--border); border-radius: 2px; transition: background 0.3s; }
  .diag-dot.done { background: var(--teal); }

  /* TASK PICKER */
  .task-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .task-cards { grid-template-columns: 1fr; } }
  .task-card {
    background: var(--navy3); border: 2px solid var(--border);
    border-radius: 14px; padding: 28px 22px; cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;
    text-align: center;
  }
  .task-card:hover { border-color: var(--teal); transform: translateY(-2px); }
  .task-card .task-num {
    font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: var(--teal);
    margin-bottom: 8px;
  }
  .task-card .task-label { font-weight: 600; color: var(--white); margin-bottom: 8px; }
  .task-card .task-desc { color: var(--slate); font-size: 0.875rem; }

  /* TOPICS */
  .topic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
  @media (max-width: 500px) { .topic-grid { grid-template-columns: 1fr; } }
  .topic-btn {
    background: var(--navy3); border: 1px solid var(--border); color: var(--offwhite);
    font-family: 'Inter', sans-serif; font-size: 0.875rem; padding: 12px 14px;
    border-radius: 10px; cursor: pointer; text-align: left; transition: all 0.2s;
  }
  .topic-btn:hover, .topic-btn.selected { border-color: var(--amber); color: var(--amber); background: rgba(245,166,35,0.07); }

  /* RESOURCES */
  .res-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .res-tab {
    background: var(--navy3); border: 1px solid var(--border); color: var(--slate);
    font-size: 0.8rem; font-weight: 600; padding: 7px 14px; border-radius: 8px;
    cursor: pointer; transition: all 0.2s;
  }
  .res-tab.active { border-color: var(--teal); color: var(--teal); }
  .res-list { display: flex; flex-direction: column; gap: 8px; }
  .res-item {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--navy3); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; gap: 12px;
  }
  .res-text { font-size: 0.875rem; color: var(--offwhite); flex: 1; }
  .save-btn {
    background: none; border: 1px solid var(--border); color: var(--slate);
    font-size: 0.75rem; font-weight: 600; padding: 5px 10px; border-radius: 6px;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .save-btn:hover { border-color: var(--teal); color: var(--teal); }
  .save-btn.saved { border-color: var(--teal); color: var(--teal); }

  /* WRITE */
  .essay-area {
    width: 100%; background: var(--navy3); border: 1px solid var(--border);
    color: var(--offwhite); font-family: 'Inter', sans-serif; font-size: 0.95rem;
    line-height: 1.7; padding: 18px; border-radius: 12px;
    resize: vertical; min-height: 260px; outline: none;
    transition: border-color 0.2s;
  }
  .essay-area:focus { border-color: var(--teal); }
  .write-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .word-count { font-size: 0.8rem; color: var(--slate); }
  .timer-display { font-family: 'Sora', sans-serif; font-size: 0.9rem; color: var(--amber); font-weight: 700; }

  /* BUTTONS */
  .btn-primary {
    background: var(--teal); color: var(--navy); font-family: 'Sora', sans-serif;
    font-weight: 700; font-size: 0.95rem; padding: 12px 28px; border-radius: 50px;
    border: none; cursor: pointer; transition: all 0.15s;
    box-shadow: 0 0 16px rgba(0,201,167,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 28px rgba(0,201,167,0.45); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary {
    background: none; border: 1px solid var(--border); color: var(--slate);
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.9rem;
    padding: 11px 24px; border-radius: 50px; cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--teal); color: var(--teal); }

  /* FEEDBACK */
  .score-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 100px; height: 100px; border-radius: 50%;
    border: 4px solid var(--teal);
    box-shadow: 0 0 40px rgba(0,201,167,0.5), inset 0 0 20px rgba(0,201,167,0.1);
    font-family: 'Sora', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--teal);
    margin: 0 auto 24px;
  }
  .feedback-section { margin-top: 20px; }
  .feedback-section h4 { font-size: 0.8rem; font-weight: 700; color: var(--slate); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .feedback-text { font-size: 0.9rem; color: var(--offwhite); line-height: 1.7; }
  .feedback-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }

  /* BANK */
  .bank-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .bank-item {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--navy3); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 8px;
  }
  .bank-text { font-size: 0.875rem; color: var(--offwhite); }
  .remove-btn {
    background: none; border: 1px solid var(--border); color: var(--slate);
    font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; cursor: pointer;
    transition: all 0.2s;
  }
  .remove-btn:hover { border-color: var(--danger); color: var(--danger); }

  /* PROFILE */
  .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 28px; }
  @media (min-width: 600px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
  .stat-card {
    background: var(--navy3); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px 14px; text-align: center;
  }
  .stat-num { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: var(--teal); }
  .stat-label { font-size: 0.75rem; color: var(--slate); margin-top: 4px; }
  .history-item {
    background: var(--navy3); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  .history-meta { font-size: 0.8rem; color: var(--slate); }
  .history-score { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.4rem; color: var(--amber); }

  /* SECTION HEADER */
  .section-title {
    font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700;
    color: var(--white); margin-bottom: 8px;
  }
  .section-sub { color: var(--slate); font-size: 0.875rem; margin-bottom: 24px; }

  /* LOADING */
  .loading-ring {
    width: 48px; height: 48px; border: 4px solid var(--border);
    border-top-color: var(--teal); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 48px auto 24px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px;
  }
  .modal { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 28px; max-width: 560px; width: 100%; max-height: 80vh; overflow-y: auto; }
  .modal-title { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.15rem; color: var(--white); margin-bottom: 16px; }

  /* MISC */
  .badge {
    display: inline-block; background: rgba(0,201,167,0.12); color: var(--teal);
    font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; margin-left: 8px;
  }
  .weak-badge {
    display: inline-block; background: rgba(245,166,35,0.12); color: var(--amber);
    font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 20px;
  }
  .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
  .empty-state { text-align: center; color: var(--slate); padding: 40px 20px; font-size: 0.9rem; }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
}

function wordCount(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useStorage("em_lang", "en");
  const [page, setPage] = useStorage("em_page", "home");
  const [diagDone, setDiagDone] = useStorage("em_diag_done", false);
  const [weakArea, setWeakArea] = useStorage("em_weak", "");
  const [savedVocab, setSavedVocab] = useStorage("em_vocab", []);
  const [savedGrammar, setSavedGrammar] = useStorage("em_grammar", []);
  const [essayHistory, setEssayHistory] = useStorage("em_history", []);
  const [streak, setStreak] = useStorage("em_streak", 1);
  const [modalFeedback, setModalFeedback] = useState(null);

  const t = LANG[lang];

  const avgScore = essayHistory.length
    ? (essayHistory.reduce((a, e) => a + e.score, 0) / essayHistory.length).toFixed(1)
    : "—";

  function addEssay(entry) {
    const updated = [entry, ...essayHistory].slice(0, 20);
    setEssayHistory(updated);
    setStreak(streak + 1);
  }

  return (
    <>
      <style>{css}</style>
      {modalFeedback && (
        <div className="modal-overlay" onClick={() => setModalFeedback(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t.feedback.title}</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div className="score-badge">{modalFeedback.score}</div>
            </div>
            <div className="feedback-text" style={{ whiteSpace: "pre-wrap" }}>{modalFeedback.text}</div>
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button className="btn-secondary" onClick={() => setModalFeedback(null)}>{t.misc.close}</button>
            </div>
          </div>
        </div>
      )}
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">Error<span>Memory</span></div>
          <div className="nav-links">
            {["home", "practice", "bank", "profile"].map((p, i) => (
              <button key={p} className={`nav-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                {Object.values(t.nav)[i]}
              </button>
            ))}
          </div>
          <div className="nav-right">
            {["en", "ru", "kz"].map(l => (
              <button key={l} className={`lang-btn${lang === l ? " active" : ""}`} onClick={() => setLang(l)}>
                {l === "en" ? "🇬🇧" : l === "ru" ? "🇷🇺" : "🇰🇿"}
              </button>
            ))}
          </div>
        </nav>
        <main className="main">
          {page === "home" && <HomePage t={t} diagDone={diagDone} weakArea={weakArea} setDiagDone={setDiagDone} setWeakArea={setWeakArea} setPage={setPage} essayHistory={essayHistory} />}
          {page === "practice" && <PracticePage t={t} lang={lang} savedVocab={savedVocab} setSavedVocab={setSavedVocab} savedGrammar={savedGrammar} setSavedGrammar={setSavedGrammar} addEssay={addEssay} setPage={setPage} />}
          {page === "bank" && <BankPage t={t} savedVocab={savedVocab} setSavedVocab={setSavedVocab} savedGrammar={savedGrammar} setSavedGrammar={setSavedGrammar} />}
          {page === "profile" && <ProfilePage t={t} essayHistory={essayHistory} avgScore={avgScore} streak={streak} savedVocab={savedVocab} savedGrammar={savedGrammar} setModalFeedback={setModalFeedback} />}
        </main>
      </div>
    </>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePage({ t, diagDone, weakArea, setDiagDone, setWeakArea, setPage, essayHistory }) {
  const [diagStep, setDiagStep] = useState(diagDone ? -1 : 0);
  const [answers, setAnswers] = useState([]);

  function handleOpt(opt, idx) {
    const next = [...answers, opt];
    setAnswers(next);
    if (next.length === t.diag.q.length) {
      setWeakArea(next[0]);
      setDiagDone(true);
      setDiagStep(-1);
    } else {
      setDiagStep(idx + 1);
    }
  }

  if (!diagDone && diagStep >= 0) {
    const q = t.diag.q[diagStep];
    return (
      <div>
        <div className="hero" style={{ paddingBottom: 16 }}>
          <div className="section-title">{t.diag.title}</div>
          <div className="section-sub">{t.diag.subtitle}</div>
        </div>
        <div className="card">
          <div className="diag-progress">
            {t.diag.q.map((_, i) => <div key={i} className={`diag-dot${i <= diagStep ? " done" : ""}`} />)}
          </div>
          <div className="diag-q">{q.q}</div>
          <div className="diag-opts">
            {q.opts.map((o, i) => (
              <button key={i} className="diag-opt" onClick={() => handleOpt(o, diagStep)}>{o}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">
          <span className="accent">Error</span>Memory
        </h1>
        <p className="hero-tagline">{t.tagline}</p>
        <button className="hero-cta" onClick={() => setPage("practice")}>
          {t.task.title} →
        </button>
      </div>
      {diagDone && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ color: "#6B7A99", fontSize: "0.8rem", marginBottom: 8 }}>{t.diag.result}</div>
          <div>{t.diag.weak} <span className="weak-badge">{weakArea}</span></div>
          <button className="btn-secondary" style={{ marginTop: 14, fontSize: "0.8rem" }} onClick={() => { setDiagDone(false); setAnswers([]); setDiagStep(0); }}>
            Retake diagnostic
          </button>
        </div>
      )}
      {essayHistory.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-title" style={{ fontSize: "1rem", marginBottom: 12 }}>Recent Essays</div>
          {essayHistory.slice(0, 3).map((e, i) => (
            <div key={i} className="history-item">
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--offwhite)" }}>{e.topic}</div>
                <div className="history-meta">{e.task} • {e.date}</div>
              </div>
              <div className="history-score">{e.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE ────────────────────────────────────────────────────────────────
function PracticePage({ t, lang, savedVocab, setSavedVocab, savedGrammar, setSavedGrammar, addEssay, setPage }) {
  const [step, setStep] = useState("task"); // task → topic → resources → write → feedback
  const [task, setTask] = useState(null);
  const [topic, setTopic] = useState(null);
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resTab, setResTab] = useState("chunks");
  const [timerOn, setTimerOn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerOn) { timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  function saveItem(text, type) {
    if (type === "chunk") {
      if (!savedVocab.includes(text)) setSavedVocab([...savedVocab, text]);
    } else {
      if (!savedGrammar.includes(text)) setSavedGrammar([...savedGrammar, text]);
    }
  }

  async function submitEssay() {
    if (wordCount(essay) < 50) return;
    setLoading(true);
    setStep("feedback");
    setTimerOn(false);

    const systemPrompt = `You are an expert IELTS Writing examiner. Evaluate the essay and respond in EXACTLY this format (no markdown, no extra text):

SCORE: [number like 6.5]
TASK_ACHIEVEMENT: [2-3 sentences]
COHERENCE: [2-3 sentences]
LEXICAL: [2-3 sentences]
GRAMMAR: [2-3 sentences]
IMPROVEMENTS: [3 specific bullet points starting with •]`;

    const userPrompt = `IELTS ${task} essay on topic "${topic}":

${essay}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: userPrompt }],
          system: systemPrompt,
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      const scoreMatch = raw.match(/SCORE:\s*([\d.]+)/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 6.0;

      const fbText = raw
        .replace(/SCORE:.*\n?/, "")
        .replace(/TASK_ACHIEVEMENT:/g, "📌 Task Achievement\n")
        .replace(/COHERENCE:/g, "\n📐 Coherence & Cohesion\n")
        .replace(/LEXICAL:/g, "\n📚 Lexical Resource\n")
        .replace(/GRAMMAR:/g, "\n✏️ Grammatical Range\n")
        .replace(/IMPROVEMENTS:/g, "\n💡 Improvements\n")
        .trim();

      const entry = {
        task, topic, score, date: new Date().toLocaleDateString(lang === "ru" ? "ru" : "en"),
        words: wordCount(essay), feedbackText: fbText,
      };
      setFeedback({ score, text: fbText });
      addEssay(entry);
    } catch {
      setFeedback({ score: "?", text: "Could not reach the AI service. Please try again." });
    }
    setLoading(false);
  }

  // ── STEP: task
  if (step === "task") return (
    <div>
      <div className="section-title">{t.task.title}</div>
      <div className="section-sub">Select the IELTS task type</div>
      <div className="task-cards">
        {[["Task 1", t.task.t1, t.task.t1d], ["Task 2", t.task.t2, t.task.t2d]].map(([val, label, desc]) => (
          <div key={val} className="task-card" onClick={() => { setTask(val); setStep("topic"); }}>
            <div className="task-num">{label}</div>
            <div className="task-label">{val}</div>
            <div className="task-desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── STEP: topic
  if (step === "topic") {
    const topics = task === "Task 1" ? t.topics.t1 : t.topics.t2;
    return (
      <div>
        <button className="btn-secondary" style={{ marginBottom: 20 }} onClick={() => setStep("task")}>{t.misc.back}</button>
        <div className="section-title">{t.topics.label}</div>
        <div className="section-sub">{task}</div>
        <div className="topic-grid">
          {topics.map((tp, i) => (
            <button key={i} className={`topic-btn${topic === tp ? " selected" : ""}`} onClick={() => setTopic(tp)}>{tp}</button>
          ))}
        </div>
        {topic && (
          <div style={{ marginTop: 24 }}>
            <button className="btn-primary" onClick={() => setStep("resources")}>
              {t.resources.title} →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── STEP: resources
  if (step === "resources") {
    const chunks = task === "Task 1" ? CHUNKS.t1 : CHUNKS.t2;
    return (
      <div>
        <button className="btn-secondary" style={{ marginBottom: 20 }} onClick={() => setStep("topic")}>{t.misc.back}</button>
        <div className="card">
          <div className="section-title" style={{ fontSize: "1.15rem" }}>{t.resources.title}</div>
          <div style={{ color: "var(--slate)", fontSize: "0.875rem", marginBottom: 18 }}>{topic}</div>
          <div className="res-tabs">
            <button className={`res-tab${resTab === "chunks" ? " active" : ""}`} onClick={() => setResTab("chunks")}>{t.resources.chunks}</button>
            <button className={`res-tab${resTab === "grammar" ? " active" : ""}`} onClick={() => setResTab("grammar")}>{t.resources.grammar}</button>
          </div>
          <div className="res-list">
            {(resTab === "chunks" ? chunks : GRAMMAR).map((item, i) => {
              const isSaved = resTab === "chunks" ? savedVocab.includes(item) : savedGrammar.includes(item);
              return (
                <div key={i} className="res-item">
                  <span className="res-text">{item}</span>
                  <button
                    className={`save-btn${isSaved ? " saved" : ""}`}
                    onClick={() => saveItem(item, resTab === "chunks" ? "chunk" : "grammar")}
                  >
                    {isSaved ? t.resources.saved : t.resources.save}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button className="btn-primary" onClick={() => { setStep("write"); setSeconds(0); }}>
            {t.write.title} →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: write
  if (step === "write") {
    const wc = wordCount(essay);
    const target = task === "Task 1" ? 150 : 250;
    return (
      <div>
        <button className="btn-secondary" style={{ marginBottom: 20 }} onClick={() => setStep("resources")}>{t.misc.back}</button>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="section-title" style={{ fontSize: "1.1rem" }}>{t.write.title}</div>
              <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>{topic}</div>
            </div>
            <button
              className="btn-secondary"
              style={{ fontSize: "0.8rem", padding: "7px 14px" }}
              onClick={() => setTimerOn(!timerOn)}
            >
              {timerOn ? "⏸" : "▶"} {t.write.timer}: <span className="timer-display">{formatTime(seconds)}</span>
            </button>
          </div>
          <textarea
            className="essay-area"
            placeholder={t.write.placeholder}
            value={essay}
            onChange={e => setEssay(e.target.value)}
          />
          <div className="write-meta">
            <span className="word-count" style={{ color: wc >= target ? "var(--teal)" : "var(--slate)" }}>
              {wc} {t.write.words} {wc < target ? `(target: ${target}+)` : "✓"}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button className="btn-primary" disabled={wc < 50} onClick={submitEssay}>{t.write.submit}</button>
        </div>
      </div>
    );
  }

  // ── STEP: feedback
  if (step === "feedback") {
    return (
      <div className="card">
        <div className="section-title" style={{ textAlign: "center", marginBottom: 24 }}>{t.feedback.title}</div>
        {loading ? (
          <>
            <div className="loading-ring" />
            <div style={{ textAlign: "center", color: "var(--slate)" }}>{t.feedback.loading}</div>
          </>
        ) : feedback ? (
          <>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--slate)", marginBottom: 8 }}>{t.feedback.score}</div>
              <div className="score-badge">{feedback.score}</div>
            </div>
            <div className="feedback-text" style={{ whiteSpace: "pre-wrap" }}>{feedback.text}</div>
            <div className="feedback-actions">
              <button className="btn-primary" onClick={() => {
                setStep("task"); setTask(null); setTopic(null); setEssay(""); setFeedback(null); setSeconds(0);
              }}>{t.feedback.retry}</button>
              <button className="btn-secondary" onClick={() => setPage("home")}>{t.feedback.back}</button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return null;
}

// ─── WORD BANK ────────────────────────────────────────────────────────────────
function BankPage({ t, savedVocab, setSavedVocab, savedGrammar, setSavedGrammar }) {
  const [tab, setTab] = useState("vocab");
  const items = tab === "vocab" ? savedVocab : savedGrammar;
  const setItems = tab === "vocab" ? setSavedVocab : setSavedGrammar;

  return (
    <div>
      <div className="section-title">{t.bank.title}</div>
      <div style={{ marginBottom: 20 }}>
        <div className="bank-tabs">
          <button className={`res-tab${tab === "vocab" ? " active" : ""}`} onClick={() => setTab("vocab")}>
            {t.bank.vocab} <span className="badge">{savedVocab.length}</span>
          </button>
          <button className={`res-tab${tab === "grammar" ? " active" : ""}`} onClick={() => setTab("grammar")}>
            {t.bank.grammar} <span className="badge">{savedGrammar.length}</span>
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">{t.bank.empty}</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="bank-item">
              <span className="bank-text">{item}</span>
              <button className="remove-btn" onClick={() => setItems(items.filter((_, j) => j !== i))}>{t.bank.remove}</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ t, essayHistory, avgScore, streak, savedVocab, savedGrammar, setModalFeedback }) {
  return (
    <div>
      <div className="section-title">{t.profile.title}</div>
      <div className="stats-grid" style={{ marginTop: 20 }}>
        {[
          [essayHistory.length, t.profile.essays],
          [avgScore, t.profile.avgScore],
          [streak, t.profile.streak],
          [savedVocab.length + savedGrammar.length, t.profile.words],
        ].map(([num, label], i) => (
          <div key={i} className="stat-card">
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="section-title" style={{ fontSize: "1rem", marginBottom: 12 }}>{t.profile.history}</div>
      {essayHistory.length === 0 ? (
        <div className="empty-state">{t.profile.noHistory}</div>
      ) : (
        essayHistory.map((e, i) => (
          <div key={i} className="history-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--offwhite)", marginBottom: 4 }}>{e.topic}</div>
              <div className="history-meta">{e.task} • {e.date} • {e.words} words</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="history-score">{e.score}</div>
              {e.feedbackText && (
                <button className="btn-secondary" style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                  onClick={() => setModalFeedback({ score: e.score, text: e.feedbackText })}>
                  {t.profile.viewFeedback}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
