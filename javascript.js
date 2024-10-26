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
    const nextSlide = document.getElementById('nextSlide');
    const closePopupButton = document.getElementById('closePopup');

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

        row.querySelector('.edit-btn').addEventListener('click', () => {
            editIndex = index;
            fillForm(task);
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            renderTasks();
        });
    }

    function fillForm(task) {
        document.getElementById('title').value = task.title;
        descriptionInput.value = task.description;
        deadlineInput.value = task.deadline;
        document.getElementById('team').value = task.team;
        document.getElementById('priority').value = task.priority;
        document.getElementById('assignee').value = task.assignee;
        wordCountDisplay.textContent = `${task.description.length}/30 words`;
    }

    function clearForm() {
        taskForm.reset();
        wordCountDisplay.textContent = '0/30 words';
        editIndex = null;
    }

    function renderTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => addTaskRow(task, index));
        if (tasks.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = descriptionInput.value.trim();
        const deadline = deadlineInput.value;
        const team = document.getElementById('team').value;
        const priority = document.getElementById('priority').value;
        const assignee = document.getElementById('assignee').value;

        if (title === '' || description === '' || deadline === '') {
            alert('Please fill out all required fields.');
            return;
        }

        const task = { title, description, deadline, team, priority, assignee };

        if (editIndex !== null) {
            tasks[editIndex] = task;
        } else {
            tasks.push(task);
        }

        renderTasks();
        clearForm();
    });

    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText)
        );

        if (filteredTasks.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => addTaskRow(task, index));
    });

    filterSelect.addEventListener('change', function() {
        const filterValue = filterSelect.value;
        const filteredTasks = tasks.filter(task => 
            filterValue === '' || task.priority === filterValue
        );

        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => addTaskRow(task, index));
    });

    resetButton.addEventListener('click', clearForm);

    helpButton.addEventListener('click', () => {
        helpPopup.style.display = 'flex';
    });

    nextSlide.addEventListener('click', () => {
        document.getElementById('slide1').style.display = 'none';
        document.getElementById('slide2').style.display = 'block';
    });

    closePopupButton.addEventListener('click', () => {
        helpPopup.style.display = 'none';
        document.getElementById('slide1').style.display = 'block';
        document.getElementById('slide2').style.display = 'none';
    });

    descriptionInput.addEventListener('input', function() {
        const wordCount = descriptionInput.value.length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });
});
