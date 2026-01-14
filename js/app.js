// ============================================
// SECTION 1: CONFIGURATION
// ============================================
const CONFIG = {
    BIN_ID: '6966f7d3d0ea881f406a513b',
    API_KEY: '$2a$10$HgzE6St8tyhSYtjBxq7Qk.l2bqTrcaN/RncxKvvpZyZsJYgW04kR6',
    API_BASE: 'https://api.jsonbin.io/v3/b',
    APP_PASSWORD: 'seo-tasks'
};

// ============================================
// SECTION 2: APPLICATION STATE
// ============================================
let appState = {
    currentMonth: '',
    clients: [],
    tasks: [],
    completions: {},
    minimizedClients: [],
    isLoading: true,
    error: null
};

// ============================================
// SECTION 3: UTILITY FUNCTIONS
// ============================================
function getCurrentMonthString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function formatMonthDisplay(monthStr) {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SECTION 3.5: PASSWORD GATE
// ============================================
function isAuthenticated() {
    return localStorage.getItem('seo-tracker-auth') === 'true';
}

function authenticate(password) {
    if (password === CONFIG.APP_PASSWORD) {
        localStorage.setItem('seo-tracker-auth', 'true');
        return true;
    }
    return false;
}

function renderPasswordPrompt(errorMsg = '') {
    return `
        <div class="password-gate">
            <h1>SEO Monthly Tracker</h1>
            <p>Enter password to continue</p>
            <form data-form="password">
                <input type="password" name="password" placeholder="Password" required autofocus>
                <button type="submit" class="btn btn-primary">Enter</button>
            </form>
            ${errorMsg ? `<p class="error-msg">${escapeHtml(errorMsg)}</p>` : ''}
        </div>
    `;
}

function handlePasswordSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const passwordInput = form.querySelector('input[name="password"]');
    const password = passwordInput.value;

    if (authenticate(password)) {
        initApp();
    } else {
        const app = document.getElementById('app');
        app.innerHTML = renderPasswordPrompt('Incorrect password');
    }
}

async function initApp() {
    const app = document.getElementById('app');

    // Set up event delegation
    app.addEventListener('click', handleClick);
    app.addEventListener('change', handleChange);
    app.addEventListener('submit', handleSubmit);

    // Load data from JSONbin
    await fetchData();
}

// ============================================
// SECTION 4: API FUNCTIONS
// ============================================
async function fetchData() {
    appState.isLoading = true;
    appState.error = null;
    render();

    try {
        const response = await fetch(`${CONFIG.API_BASE}/${CONFIG.BIN_ID}/latest`, {
            headers: {
                'X-Access-Key': CONFIG.API_KEY
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your JSONbin API key.');
            } else if (response.status === 404) {
                throw new Error('Bin not found. Please check your JSONbin Bin ID.');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        const data = json.record;

        // Update state with fetched data
        appState.currentMonth = data.currentMonth || getCurrentMonthString();
        appState.clients = data.clients || [];
        appState.tasks = data.tasks || [];
        appState.completions = data.completions || {};
        appState.minimizedClients = data.minimizedClients || [];

        // Clean up any orphaned completion data
        cleanupCompletions();

    } catch (err) {
        appState.error = err.message;
    } finally {
        appState.isLoading = false;
        render();
    }
}

async function saveData() {
    try {
        const dataToSave = {
            currentMonth: appState.currentMonth,
            clients: appState.clients,
            tasks: appState.tasks,
            completions: appState.completions,
            minimizedClients: appState.minimizedClients
        };

        const response = await fetch(`${CONFIG.API_BASE}/${CONFIG.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Access-Key': CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSave)
        });

        if (!response.ok) {
            throw new Error(`Save failed: HTTP ${response.status}`);
        }
    } catch (err) {
        console.error('Save error:', err);
        appState.error = `Save failed: ${err.message}`;
        render();
    }
}

const debouncedSave = debounce(saveData, 500);

function cleanupCompletions() {
    // Remove completions for clients that don't exist
    Object.keys(appState.completions).forEach(client => {
        if (!appState.clients.includes(client)) {
            delete appState.completions[client];
        }
    });

    // Remove task completions that don't exist
    appState.clients.forEach(client => {
        if (appState.completions[client]) {
            Object.keys(appState.completions[client]).forEach(task => {
                if (!appState.tasks.includes(task)) {
                    delete appState.completions[client][task];
                }
            });
        }
    });
}

// ============================================
// SECTION 5: RENDER FUNCTIONS
// ============================================
function render() {
    const app = document.getElementById('app');

    if (appState.isLoading) {
        app.innerHTML = renderLoading();
        return;
    }

    if (appState.error) {
        app.innerHTML = renderError(appState.error);
        return;
    }

    app.innerHTML = `
        ${renderHeader()}
        ${renderClientGrid()}
        ${renderControls()}
    `;
}

function renderLoading() {
    return `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading your tracker...</p>
        </div>
    `;
}

function renderError(message) {
    return `
        <div class="error">
            <p>${escapeHtml(message)}</p>
            <button class="btn btn-primary" data-action="retry">Try Again</button>
        </div>
    `;
}

function renderHeader() {
    return `
        <div class="header">
            <h1>SEO Monthly Tracker</h1>
            <div class="header-right">
                <span class="month-display">${formatMonthDisplay(appState.currentMonth)}</span>
                <button class="btn btn-secondary" data-action="reset-month">New Month</button>
            </div>
        </div>
    `;
}

function renderClientGrid() {
    if (appState.clients.length === 0 && appState.tasks.length === 0) {
        return `
            <div class="empty-state">
                <p>Add your first client and task to get started.</p>
            </div>
        `;
    }

    if (appState.clients.length === 0) {
        return `
            <div class="empty-state">
                <p>Add a client to start tracking tasks.</p>
            </div>
        `;
    }

    if (appState.tasks.length === 0) {
        return `
            <div class="empty-state">
                <p>Add a task to start tracking progress.</p>
            </div>
        `;
    }

    const clientCards = appState.clients.map(client => {
        const isMinimized = appState.minimizedClients.includes(client);
        const completedCount = appState.tasks.filter(task =>
            appState.completions[client]?.[task]
        ).length;
        const totalTasks = appState.tasks.length;

        const taskList = appState.tasks.map(task => {
            const isChecked = appState.completions[client]?.[task] || false;
            return `
                <label class="task-item">
                    <input type="checkbox"
                           data-client="${escapeHtml(client)}"
                           data-task="${escapeHtml(task)}"
                           ${isChecked ? 'checked' : ''}>
                    <span>${escapeHtml(task)}</span>
                </label>
            `;
        }).join('');

        return `
            <div class="client-card ${isMinimized ? 'minimized' : ''}">
                <div class="client-card-header">
                    <div class="client-card-title">
                        <button class="btn-toggle" data-action="toggle-minimize" data-client="${escapeHtml(client)}" title="${isMinimized ? 'Expand' : 'Minimize'}">
                            ${isMinimized ? '+' : '−'}
                        </button>
                        <span class="client-name">${escapeHtml(client)}</span>
                        <span class="progress-badge">${completedCount}/${totalTasks}</span>
                    </div>
                    <button class="btn btn-danger delete-btn" data-action="delete-client" data-client="${escapeHtml(client)}" title="Delete client">&times;</button>
                </div>
                ${!isMinimized ? `
                    <div class="client-card-body">
                        <div class="task-list">
                            ${taskList}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="client-grid">
            ${clientCards}
        </div>
    `;
}

function renderControls() {
    return `
        <div class="controls">
            <form class="control-group" data-form="add-client">
                <input type="text" name="clientName" placeholder="New client name" required>
                <button type="submit" class="btn btn-primary">Add Client</button>
            </form>
            <form class="control-group" data-form="add-task">
                <input type="text" name="taskName" placeholder="New task name" required>
                <button type="submit" class="btn btn-primary">Add Task</button>
            </form>
        </div>
    `;
}

// ============================================
// SECTION 6: CRUD OPERATIONS
// ============================================
function addClient(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (appState.clients.includes(trimmed)) {
        alert('A client with this name already exists.');
        return;
    }

    appState.clients.push(trimmed);
    appState.completions[trimmed] = {};

    // Initialize all tasks as false for new client
    appState.tasks.forEach(task => {
        appState.completions[trimmed][task] = false;
    });

    render();
    debouncedSave();
}

function removeClient(name) {
    if (!confirm(`Remove client "${name}"? This will delete all their task data.`)) {
        return;
    }

    appState.clients = appState.clients.filter(c => c !== name);
    delete appState.completions[name];

    render();
    debouncedSave();
}

function addTask(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (appState.tasks.includes(trimmed)) {
        alert('A task with this name already exists.');
        return;
    }

    appState.tasks.push(trimmed);

    // Add this task to all existing clients
    appState.clients.forEach(client => {
        if (!appState.completions[client]) {
            appState.completions[client] = {};
        }
        appState.completions[client][trimmed] = false;
    });

    render();
    debouncedSave();
}

function removeTask(name) {
    if (!confirm(`Remove task "${name}"? This will delete this task from all clients.`)) {
        return;
    }

    appState.tasks = appState.tasks.filter(t => t !== name);

    // Remove from all client completions
    Object.keys(appState.completions).forEach(client => {
        delete appState.completions[client][name];
    });

    render();
    debouncedSave();
}

function toggleCompletion(client, task) {
    if (!appState.completions[client]) {
        appState.completions[client] = {};
    }
    appState.completions[client][task] = !appState.completions[client][task];
    debouncedSave();
}

function toggleMinimize(client) {
    const index = appState.minimizedClients.indexOf(client);
    if (index === -1) {
        appState.minimizedClients.push(client);
    } else {
        appState.minimizedClients.splice(index, 1);
    }
    render();
    debouncedSave();
}

function resetMonth() {
    if (!confirm('Start a new month? This will clear all checkboxes but keep your clients and tasks.')) {
        return;
    }

    // Clear all completions to false
    appState.clients.forEach(client => {
        appState.completions[client] = {};
        appState.tasks.forEach(task => {
            appState.completions[client][task] = false;
        });
    });

    // Expand all minimized clients
    appState.minimizedClients = [];

    // Update to current month
    appState.currentMonth = getCurrentMonthString();

    render();
    saveData(); // Immediate save, not debounced
}

// ============================================
// SECTION 7: EVENT HANDLERS
// ============================================
function handleClick(event) {
    const target = event.target;
    const action = target.dataset.action;

    if (!action) return;

    switch (action) {
        case 'retry':
            fetchData();
            break;
        case 'reset-month':
            resetMonth();
            break;
        case 'delete-client':
            removeClient(target.dataset.client);
            break;
        case 'delete-task':
            removeTask(target.dataset.task);
            break;
        case 'toggle-minimize':
            toggleMinimize(target.dataset.client);
            break;
    }
}

function handleChange(event) {
    const target = event.target;

    if (target.type === 'checkbox' && target.dataset.client && target.dataset.task) {
        toggleCompletion(target.dataset.client, target.dataset.task);
    }
}

function handleSubmit(event) {
    const form = event.target;
    const formType = form.dataset.form;

    if (!formType) return;

    event.preventDefault();

    switch (formType) {
        case 'add-client':
            const clientInput = form.querySelector('input[name="clientName"]');
            addClient(clientInput.value);
            clientInput.value = '';
            break;
        case 'add-task':
            const taskInput = form.querySelector('input[name="taskName"]');
            addTask(taskInput.value);
            taskInput.value = '';
            break;
    }
}

// ============================================
// SECTION 8: INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    if (isAuthenticated()) {
        // Already logged in, load the app
        await initApp();
    } else {
        // Show password prompt
        app.innerHTML = renderPasswordPrompt();
        app.addEventListener('submit', (e) => {
            if (e.target.dataset.form === 'password') {
                handlePasswordSubmit(e);
            }
        });
    }
});
