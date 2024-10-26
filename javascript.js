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
    const helpPopup = document.getElementById('helpPopup');
    const slides = document.querySelectorAll('.slide');
    const nextSlideButtons = document.querySelectorAll('.next-slide');
    const closePopupButton = document.getElementById('closePopup');

    let tasks = [];
    let editIndex = null;
    let currentSlideIndex = 0;

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

    function showMessage(message) {
        alert(message);
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const team = document.getElementById('team').value;
        const priority = document.getElementById('priority').value;
        const assignee = document.getElementById('assignee').value;

        if (editIndex !== null) {
            tasks[editIndex] = { title, description, deadline, team, priority, assignee };
            editIndex = null;
            showMessage('Task updated successfully!');
        } else {
            tasks.push({ title, description, deadline, team, priority, assignee });
            showMessage('Task added successfully!');
        }

        displayTasks();
        taskForm.reset();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
        noResultsMessage.style.display = filteredTasks.length === 0 ? 'block' : 'none';
        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    });

    filterSelect.addEventListener('change', function() {
        const selectedPriority = filterSelect.value;
        const filteredTasks = tasks.filter(task => task.priority === selectedPriority || selectedPriority === '');
        noResultsMessage.style.display = filteredTasks.length === 0 ? 'block' : 'none';
        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    });

    descriptionInput.addEventListener('input', function() {
        const wordCount = descriptionInput.value.trim().split(/\s+/).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    resetButton.addEventListener('click', function() {
        taskForm.reset();
        wordCountDisplay.textContent = '0/30 words';
    });

    helpButton.addEventListener('click', function() {
        helpPopup.style.display = 'block';
        slides[currentSlideIndex].classList.add('active-slide');
    });

    nextSlideButtons.forEach(button => {
        button.addEventListener('click', function() {
            slides[currentSlideIndex].classList.remove('active-slide');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active-slide');
        });
    });

    closePopupButton.addEventListener('click', function() {
        helpPopup.style.display = 'none';
        slides.forEach(slide => slide.classList.remove('active-slide'));
        currentSlideIndex = 0;
    });
});
