// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingTasksList = document.getElementById('pendingTasksList');
const completedTasksList = document.getElementById('completedTasksList');

// Task array to store all tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to format date
const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

// Function to create task element
const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskTitle = document.createElement('div');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.title;

    const taskDate = document.createElement('div');
    taskDate.className = 'task-date';
    taskDate.textContent = `Created: ${formatDate(task.createdAt)}`;
    if (task.completedAt) {
        taskDate.textContent += ` | Completed: ${formatDate(task.completedAt)}`;
    }

    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskDate);

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    if (!task.completed) {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.onclick = () => completeTask(task.id);
        taskActions.appendChild(completeBtn);
    }

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = () => editTask(task.id);
    taskActions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = () => deleteTask(task.id);
    taskActions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(taskActions);

    return li;
};

// Function to render tasks
const renderTasks = () => {
    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.completed) {
            completedTasksList.appendChild(taskElement);
        } else {
            pendingTasksList.appendChild(taskElement);
        }
    });
};

// Function to add new task
const addTask = () => {
    const title = taskInput.value.trim();
    if (title) {
        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
};

// Function to complete task
const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
    }
};

// Function to edit task
const editTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newTitle = prompt('Edit task:', task.title);
        if (newTitle && newTitle.trim()) {
            task.title = newTitle.trim();
            saveTasks();
            renderTasks();
        }
    }
};

// Function to delete task
const deleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
};

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks(); 