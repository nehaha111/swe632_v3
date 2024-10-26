document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const noResultsMessage = document.getElementById('noResults');
    const resetButton = document.getElementById('resetButton');

    let tasks = [];
    let editIndex = null;

    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.team}</td>
            <td>${task.description}</td>
            <td>${task.priority}</td>
            <td>${task.deadline}</td>
            <td>${task.assignee}</td>
            <td>
                <select>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </td>
            <td>
                <button class="edit-btn">Update</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1);
                displayTasks();
                showMessage('Task deleted successfully!');
            }
        });

        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        const priorityCell = row.cells[3];
        if (task.priority === 'High') {
            priorityCell.style.color = 'red';
        } else if (task.priority === 'Medium') {
            priorityCell.style.color = 'orange';
        } else if (task.priority === 'Low') {
            priorityCell.style.color = 'green';
        }
    }

    function displayTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
        noResultsMessage.style.display = tasks.length === 0 ? 'block' : 'none';
    }

    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('team').value = task.team;
        document.getElementById('priority').value = task.priority;
        document.getElementById('assignee').value = task.assignee;
        editIndex = index;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const newTask = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            deadline: document.getElementById('deadline').value,
            team: document.getElementById('team').value,
            priority: document.getElementById('priority').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex !== null) {
            tasks[editIndex] = newTask;
            editIndex = null;
            showMessage('Task updated successfully!', 'success');
        } else {
            tasks.push(newTask);
            showMessage('Task added successfully!', 'success');
        }

        displayTasks();
        taskForm.reset();
    }

    taskForm.addEventListener('submit', handleFormSubmit);

    resetButton.addEventListener('click', () => {
        taskForm.reset();
        editIndex = null;
    });

    descriptionInput.addEventListener('input', () => {
        const wordCount = descriptionInput.value.split(/\s+/).filter(word => word).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.priority.toLowerCase().includes(searchTerm)
        );

        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });

        noResultsMessage.style.display = filteredTasks.length === 0 ? 'block' : 'none';
    });

    // Filtering by priority
    filterSelect.addEventListener('change', () => {
        const selectedPriority = filterSelect.value;
        const filteredTasks = selectedPriority 
            ? tasks.filter(task => task.priority === selectedPriority)
            : tasks;

        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    });

    // Help & Documentation Popup Logic
    const helpButton = document.getElementById('helpButton');
    const helpPopup = document.getElementById('helpPopup');
    const closePopupButton = document.getElementById('closePopup');

    helpButton.addEventListener('click', () => {
        helpPopup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', () => {
        helpPopup.style.display = 'none';
    });

    // Function to show messages to the user
    function showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 3000);
    }
});

