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
    const helpButton = document.getElementById('helpButton');
    const closePopupButton = document.getElementById('closePopup');
    const helpPopup = document.getElementById('helpPopup');
    const helpMessage = document.getElementById('helpMessage');

    let tasks = [];
    let editIndex = null;

    // Function to add a row to the task table
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

        // Delete functionality with confirmation prompt and message
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1);
                displayTasks();
                showMessage('Task deleted successfully!');
            }
        });

        // Edit functionality
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        // Set priority color
        const priorityCell = row.cells[3];
        priorityCell.style.color = task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green';
    }

    // Display all tasks
    function displayTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    // Popup message function
    function showMessage(message) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <p>${message}</p>
            <button class="close-btn">Close</button>
        `;
        document.body.appendChild(popup);

        // Close button functionality
        popup.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 3000);
    }

    // Add or update a task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            title: document.getElementById('title').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex === null) {
            // Confirmation for adding a task
            if (confirm('Are you sure you want to add this task?')) {
                tasks.push(newTask);
                showMessage('Task added successfully!');
                taskForm.reset();
                displayTasks(); // Refresh table
            }
        } else {
            // Confirmation before updating a task
            if (confirm('Are you sure you want to update this task?')) {
                tasks[editIndex] = newTask;
                showMessage('Task updated successfully!');
                editIndex = null;
                taskForm.reset();
                displayTasks();
            }
        }

        document.querySelector('button[type="submit"]').textContent = 'Add Task';
    });

    // Fill form for editing
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        editIndex = index;
        document.querySelector('button[type="submit"]').textContent = 'Update Task';
    }

    // Word count logic
    descriptionInput.addEventListener('input', function() {
        const wordCount = descriptionInput.value.split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
        wordCountDisplay.style.color = wordCount > 30 ? 'red' : '#888';
    });

    // Date input restrictions
    deadlineInput.setAttribute('min', new Date().toISOString().split('T')[0]);

    // Task filter logic
    function filterTasks() {
        const searchQuery = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredTasks = tasks.filter(task => 
            (task.title.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery) ||
            task.team.toLowerCase().includes(searchQuery) ||
            task.priority.toLowerCase().includes(searchQuery) ||
            task.deadline.toLowerCase().includes(searchQuery) ||
            task.assignee.toLowerCase().includes(searchQuery)) &&
            (filterValue === '' || task.priority === filterValue)
        );

        taskTable.innerHTML = '';

        if (filteredTasks.length > 0) {
            filteredTasks.forEach((task, index) => {
                addTaskRow(task, tasks.indexOf(task));
            });
            noResultsMessage.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', filterTasks);
    filterSelect.addEventListener('change', filterTasks);

    // Help Popup Logic
    helpButton.addEventListener('click', function() {
        helpPopup.style.display = 'block';
        helpMessage.textContent = "This is the Help section!"; // Adjust help text here
    });

    closePopupButton.addEventListener('click', function() {
        helpPopup.style.display = 'none';
    });

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        taskForm.reset();
        document.querySelector('button[type="submit"]').textContent = 'Add Task';
        editIndex = null;
        noResultsMessage.style.display = 'none';
    });
});
