// --- 1. CLOCK, DATE & GREETING (Custom Name Challenge) ---
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date-display');
const greetingDisplay = document.getElementById('greeting');

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    
    // Tampilan Jam & Tanggal
    timeDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
    dateDisplay.innerText = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Penentuan Greeting waktu
    let greetText = "Good Night";
    if (hours >= 5 && hours < 12) greetText = "Good Morning";
    else if (hours >= 12 && hours < 17) greetText = "Good Afternoon";
    else if (hours >= 17 && hours < 21) greetText = "Good Evening";

    const savedName = localStorage.getItem('customName') || "Creator";
    greetingDisplay.innerHTML = `${greetText}, <span id="user-name" contenteditable="true" style="border-bottom: 1px dashed #5b82d7; outline: none;">${savedName}</span>`;
}
setInterval(updateClock, 1000);

// Simpan nama otomatis ke LocalStorage saat user mengedit teks namanya langsung di layar
document.body.addEventListener('blur', function(e) {
    if (e.target && e.target.id === 'user-name') {
        const newName = e.target.innerText.trim() || "Creator";
        localStorage.setItem('customName', newName);
    }
}, true);


// --- 2. FOCUS TIMER (25 MENIT POMODORO) ---
let timer;
let timeLeft = 25 * 60; 
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

document.getElementById('btn-start').addEventListener('click', () => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            alert("Focus session complete! Time to rest.");
        }
    }, 1000);
});

document.getElementById('btn-stop').addEventListener('click', () => clearInterval(timer));
document.getElementById('btn-reset').addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 25 * 60;
    updateTimerDisplay();
});


// --- 3. TO-DO LIST (Prevent Duplicate & Sort Challenges) ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-left" onclick="toggleTask(${index})">
                <input type="checkbox" ${task.done ? 'checked' : ''} style="cursor:pointer;">
                <span class="${task.done ? 'checked' : ''}">${task.text}</span>
            </div>
            <button class="btn-danger" onclick="deleteTask(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

document.getElementById('btn-add').addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    if (taskText === '') return;

    // --- TANTANGAN: Prevent Duplicate ---
    const isDuplicate = tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());
    if (isDuplicate) {
        alert("This task already exists in your list!");
        return;
    }

    tasks.push({ text: taskText, done: false });
    todoInput.value = '';
    renderTasks();
});

window.toggleTask = function(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// --- TANTANGAN: Sort Tasks ---
document.getElementById('btn-sort').addEventListener('click', () => {
    tasks.sort((a, b) => {
        if (a.done === true && b.done === false) return 1;
        if (a.done === false && b.done === true) return -1;
        return 0;
    });
    renderTasks();
});


// --- 4. QUICK LINKS (Dinamis dengan Local Storage) ---
let quickLinks = JSON.parse(localStorage.getItem('myLinks')) || [
    { name: "Google", url: "https://google.com" },
    { name: "GitHub", url: "https://github.com" }
];
const linksContainer = document.getElementById('links-container');
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput = document.getElementById('link-url-input');

function renderLinks() {
    linksContainer.innerHTML = '';
    quickLinks.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-btn-wrapper';
        
        // Memastikan URL valid diawali http/https
        let formattedUrl = link.url;
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        div.innerHTML = `
            <a href="${formattedUrl}" target="_blank">${link.name}</a>
            <button class="btn-del-link" onclick="deleteLink(${index})">×</button>
        `;
        linksContainer.appendChild(div);
    });
    localStorage.setItem('myLinks', JSON.stringify(quickLinks));
}

document.getElementById('btn-add-link').addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    if (name === '' || url === '') {
        alert("Please fill in both Link Name and URL!");
        return;
    }

    quickLinks.push({ name: name, url: url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderLinks();
});

window.deleteLink = function(index) {
    quickLinks.splice(index, 1);
    renderLinks();
}


// Jalankan inisialisasi awal saat web dimuat
updateClock();
renderTasks();
renderLinks();