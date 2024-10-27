document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterInput = document.getElementById('filter');
    const resetButton = document.getElementById('resetButton');
    const wordCountElement = document.getElementById('wordCount');
    const helpButton = document.getElementById('helpButton');
    const helpPopup = document.getElementById('helpPopup');
    const closePopup = document.getElementById('closePopup');
    const noResultsMessage = document.getElementById('noResults');
    
    let tasks = [];

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const team = document.getElementById('team').value;
        const priority = document.getElementById('priority').value;
        const assignee = document.getElementById('assignee').value;

        const task = {
            title,
            description,
            deadline,
            team,
            priority,
            assignee,
            status: 'Pending'
        };

        tasks.push(task);
        renderTasks();
        taskForm.reset();
        updateWordCount();
    });

    resetButton.addEventListener('click', function() {
        taskForm.reset();
        updateWordCount();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );

        if (filteredTasks.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        renderTasks(filteredTasks);
    });

    filterInput.addEventListener('change', function() {
        const priorityFilter = filterInput.value;
        const filteredTasks = priorityFilter ? 
            tasks.filter(task => task.priority === priorityFilter) : 
            tasks;

        renderTasks(filteredTasks);
    });

    helpButton.addEventListener('click', function() {
        helpPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function() {
        helpPopup.style.display = 'none';
    });

    function renderTasks(taskList = tasks) {
        taskTable.innerHTML = '';

        taskList.forEach((task, index) => {
            const row = taskTable.insertRow();

            row.insertCell(0).textContent = task.title;
            row.insertCell(1).textContent = task.team;
            row.insertCell(2).textContent = task.description;
            row.insertCell(3).textContent = task.priority;
            row.insertCell(4).textContent = task.deadline;
            row.insertCell(5).textContent = task.assignee;
            row.insertCell(6).textContent = task.status;

            const actionCell = row.insertCell(7);
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');

            editButton.textContent = 'Edit';
            deleteButton.textContent = 'Delete';

            editButton.className = 'edit-btn';
            deleteButton.className = 'delete-btn';

            editButton.addEventListener('click', () => editTask(index));
            deleteButton.addEventListener('click', () => deleteTask(index));

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
        });
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function editTask(index) {
        const task = tasks[index];

        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('team').value = task.team;
        document.getElementById('priority').value = task.priority;
        document.getElementById('assignee').value = task.assignee;

        tasks.splice(index, 1);
        renderTasks();
    }

    function updateWordCount() {
        const descriptionInput = document.getElementById('description');
        const wordCount = descriptionInput.value.split(/\s+/).filter(word => word.length > 0).length;
        wordCountElement.textContent = `${wordCount}/30 words`;
    }

    document.getElementById('description').addEventListener('input', updateWordCount);
    updateWordCount();
});
