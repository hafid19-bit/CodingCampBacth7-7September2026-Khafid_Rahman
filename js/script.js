/* ---------- GREETING  ---------- */

const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('dateText');
const greetingEl = document.getElementById('greetingText');
const editNameBtn = document.getElementById('editNameBtn');

function getUserName() {
  return localStorage.getItem('dashboard_userName') || '';
}

function setUserName(name) {
  localStorage.setItem('dashboard_userName', name);
}

function getGreetingWord(hour) {
  if (hour >= 4 && hour < 11) return 'Good Morning';
  if (hour >= 11 && hour < 15) return 'Good Afternoon';
  if (hour >= 15 && hour < 18) return 'Good Evening';
  return 'Good Night';
}

function updateClock() {
  const now = new Date();

  // Jam HH:MM:SS
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  // Tanggal lengkap, misal: Saturday, September 12 2026
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('en-US', options);

  // Sapaan + nama (challenge: custom name)
  const name = getUserName();
  const greetingWord = getGreetingWord(now.getHours());
  greetingEl.textContent = name ? `${greetingWord}, ${name}!` : greetingWord;
}

editNameBtn.addEventListener('click', () => {
  const current = getUserName();
  const newName = prompt('Masukkan nama kamu:', current);
  if (newName !== null) {
    setUserName(newName.trim());
    updateClock();
  }
});

updateClock();
setInterval(updateClock, 1000);


/* ---------- FOCUS TIMER ---------- */

const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const TIMER_DEFAULT_SECONDS = 25 * 60; // 25 menit
let timerSeconds = TIMER_DEFAULT_SECONDS;
let timerInterval = null;

function renderTimer() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerInterval) return; // sudah jalan, jangan dobel
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      renderTimer();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert('Waktu fokus selesai! Saatnya istirahat sebentar.');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = TIMER_DEFAULT_SECONDS;
  renderTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

renderTimer();


/* ---------- TO-DO LIST ---------- */

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskWarning = document.getElementById('taskWarning');

function getTasks() {
  return JSON.parse(localStorage.getItem('dashboard_tasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

function showWarning(msg) {
  taskWarning.textContent = msg;
  setTimeout(() => { taskWarning.textContent = ''; }, 2500);
}

function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    // Checkbox untuk tandai selesai
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      const current = getTasks();
      current[index].done = checkbox.checked;
      saveTasks(current);
      renderTasks();
    });

    // Teks task
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // Tombol edit
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit tugas:', task.text);
      if (newText !== null && newText.trim() !== '') {
        const current = getTasks();
        const duplicate = current.some((t, i) =>
          i !== index && t.text.toLowerCase() === newText.trim().toLowerCase()
        );
        if (duplicate) {
          showWarning('Tugas dengan nama sama sudah ada!');
          return;
        }
        current[index].text = newText.trim();
        saveTasks(current);
        renderTasks();
      }
    });

    // Tombol delete
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      const current = getTasks();
      current.splice(index, 1);
      saveTasks(current);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const tasks = getTasks();

  // Challenge: Prevent duplicate tasks (tidak case-sensitive)
  const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    showWarning('Tugas ini sudah ada di daftar!');
    return;
  }

  tasks.push({ text, done: false });
  saveTasks(tasks);
  taskInput.value = '';
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

renderTasks();


/* ---------- QUICK LINKS ---------- */

const linkNameInput = document.getElementById('linkName');
const linkUrlInput = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const linkButtonsContainer = document.getElementById('linkButtons');

function getLinks() {
  return JSON.parse(localStorage.getItem('dashboard_links') || '[]');
}

function saveLinks(links) {
  localStorage.setItem('dashboard_links', JSON.stringify(links));
}

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}

function renderLinks() {
  const links = getLinks();
  linkButtonsContainer.innerHTML = '';

  links.forEach((link, index) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const a = document.createElement('a');
    a.href = normalizeUrl(link.url);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.name;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.title = 'Hapus link';
    removeBtn.addEventListener('click', () => {
      const current = getLinks();
      current.splice(index, 1);
      saveLinks(current);
      renderLinks();
    });

    chip.appendChild(a);
    chip.appendChild(removeBtn);
    linkButtonsContainer.appendChild(chip);
  });
}

addLinkBtn.addEventListener('click', () => {
  const name = linkNameInput.value.trim();
  const url = linkUrlInput.value.trim();
  if (name === '' || url === '') return;

  const links = getLinks();
  links.push({ name, url });
  saveLinks(links);

  linkNameInput.value = '';
  linkUrlInput.value = '';
  renderLinks();
});

renderLinks();


/* ---------- CHALLENGE: LIGHT / DARK MODE ---------- */

const themeToggleBtn = document.getElementById('themeToggleBtn');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('dashboard_theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('dashboard_theme') || 'light';
  applyTheme(saved);
}

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();
