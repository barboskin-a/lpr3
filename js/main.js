
Vue.component('tasks-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    methods: {
        removeTask(index) {
            this.$emit('delete-task', index);
        },
        updateTask({ index, updatedTask }) {
            this.$emit('update-task', { index, updatedTask });
        }
    },
    template: `
    <ul class="tasks-list">
        <li v-for="(task, index) in tasks" :key="index">
            <task-item 
                :task="task" 
                :index="index"
                @delete-task="removeTask"
                @update-task="updateTask" />
        </li>
    </ul>
    `
});

Vue.component('tasks-creator', {
    data() {
        return {
            taskTitle: '',
            taskDescription: '',
            taskDeadline: ''
        };
    },
    computed: {
        isTaskValid() {
            return this.taskTitle && this.taskDescription && this.taskDeadline;
        }
    },
    methods: {
        createTask() {
            if (this.isTaskValid) {
                const newTask = {
                    title: this.taskTitle,
                    description: this.taskDescription,
                    deadline: this.taskDeadline,
                    status: 'pending',
                    lastModified: new Date().toISOString()
                };

                this.$emit('add-task', newTask);
                this.clearForm();
            } else {
                alert('Заполнены не все поля!');
            }
        },
        clearForm() {
            this.taskTitle = '';
            this.taskDescription = '';
            this.taskDeadline = '';
        }
    },
    template: `
        <div class="tasks-creator">
            <form @submit.prevent="createTask">
                <div>
                    <label for="tasksTitle">Заголовок:</label>
                    <input type="text" id="tasksTitle" v-model="tasksTitle" required />
                </div>

                <div>
                    <label for="tasksDescription">Описание:</label>
                    <textarea id="tasksDescription" v-model="tasksDescription" required></textarea>
                </div>

                <div>
                    <label for="tasksDeadline">Дедлайн:</label>
                    <input type="date" id="tasksDeadline" v-model="tasksDeadline" required />
                </div>

                <button type="submit" :disabled="!isTaskValid">Создать задачу</button>
            </form>
        </div>
    `
});


Vue.component('tasks-board', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    methods: {
        removeTask(index) {
            this.$emit('delete-tasks', index);
        },
        updateTask({ index, updatedTask }) {
            this.$emit('update-tasks', { index, updatedTask });
        }
    },
    template: `
    <div class="tasks-board">
        <h2>Запланированные задачи</h2>
        <task-list :tasks="tasks.filter(task => task.status === 'pending')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Задачи в работе</h2>
        <task-list :tasks="tasks.filter(task => task.status === 'inProgress')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Тестирование</h2>
        <task-list :tasks="tasks.filter(task => task.status === 'testing')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Готовые задачи</h2>
        <task-list :tasks="tasks.filter(task => task.status === 'completed')" @delete-task="removeTask" @update-task="updateTask"/>
    </div>
    `
});

Vue.component('tasks-item', {
    props: {
        task: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isEditing: false,
            editedTitle: this.task.title,
            editedDescription: this.task.description,
            editedDeadline: this.task.deadline,
            returnReason: ''
        };
    },
    methods: {
        removeTask() {
            if (this.task.status === 'pending') {
                this.$emit('delete-task', this.index);
            } else {
                alert('Удаление доступно только для задач в статусе "Запланированная"');
            }
        },
        editTask() {
            this.isEditing = true;
        },
        saveTask() {
            const updatedTask = {
                ...this.task,
                title: this.editedTitle,
                description: this.editedDescription,
                deadline: this.editedDeadline,
                lastModified: new Date().toISOString()
            };
            this.$emit('update-task', { index: this.index, updatedTask });
            this.isEditing = false;
        },
        moveToInProgress() {
            const updatedTask = { ...this.task, status: 'inProgress' };
            this.$emit('update-task', { index: this.index, updatedTask });
        },
    },
    template: `
    
    `
});


new Vue({
    el: '#task-manager',
    data() {
        return {
            tasks: []
        };
    },
    methods: {
        addNewTask(newTask) {
            this.tasks.push(newTask); //добавление задачи
        },
        updateTask({ index, updatedTask }) {
            this.tasks.splice(index, 1, updatedTask); //обнвление задачи
        },
        removeTask(index) {
            this.tasks.splice(index, 1); //удаление задачи
        }
    }
});
