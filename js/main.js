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
                    <label for="taskTitle">Заголовок:</label>
                    <input type="text" id="taskTitle" v-model="taskTitle" required />
                </div>

                <div>
                    <label for="taskDescription">Описание:</label>
                    <textarea id="taskDescription" v-model="taskDescription" required></textarea>
                </div>

                <div>
                    <label for="taskDeadline">Дедлайн:</label>
                    <input type="date" id="taskDeadline" v-model="taskDeadline" required />
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
            this.$emit('delete-task', index);
        },
        updateTask({ index, updatedTask }) {
            this.$emit('update-task', { index, updatedTask });
        }
    },
    template: `
    <div class="tasks-board">
        <h2>Запланированные задачи</h2>
        <tasks-list :tasks="tasks.filter(task => task.status === 'pending')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Задачи в работе</h2>
        <tasks-list :tasks="tasks.filter(task => task.status === 'inProgress')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Тестирование</h2>
        <tasks-list :tasks="tasks.filter(task => task.status === 'testing')" @delete-task="removeTask" @update-task="updateTask"/>

        <h2>Готовые задачи</h2>
        <tasks-list :tasks="tasks.filter(task => task.status === 'completed')" @delete-task="removeTask" @update-task="updateTask"/>
    </div>
    `
});

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
            <tasks-item 
                :task="task" 
                :index="index"
                @delete-task="removeTask"
                @update-task="updateTask" />
        </li>
    </ul>
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
        moveToTesting() {
            const updatedTask = { ...this.task, status: 'testing' };
            this.$emit('update-task', { index: this.index, updatedTask });
        },
        returnToInProgress() {
            if (this.returnReason) {
                const updatedTask = {
                    ...this.task,
                    status: 'inProgress',
                    returnReason: this.returnReason
                };
                this.$emit('update-task', { index: this.index, updatedTask });
                this.returnReason = '';
            } else {
                alert('Укажите причину возврата');
            }
        },
        markAsCompleted() {
            const updatedTask = {
                ...this.task,
                status: 'completed',
                isOverdue: new Date(this.task.deadline) < new Date()
            };
            this.$emit('update-task', { index: this.index, updatedTask });
        }
    },
    template: `
    <div class="tasks-item">
        <div v-if="isEditing && task.status !== 'completed'">
            <div>
                <label for="editedTitle">Заголовок задачи:</label>
                <input type="text" id="editedTitle" v-model="editedTitle" required />
            </div>
            <div>
                <label for="editedDescription">Описание задачи:</label>
                <textarea id="editedDescription" v-model="editedDescription" required></textarea>
            </div>
            <div>
                <label for="editedDeadline">Дедлайн задачи:</label>
                <input type="date" id="editedDeadline" v-model="editedDeadline" required />
            </div>
            <button @click="saveTask">Сохранить</button>
        </div>
        <div v-else>
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
            <p><em>Дедлайн: {{ task.deadline }}</em></p>
            <p>Status: {{ task.status }}</p>
            <div v-if="task.status === 'testing' && task.returnReason">
                <p><strong>Причина возврата задачи:</strong> {{ task.returnReason }}</p>
            </div>
            
            <button v-if="task.status !== 'completed'" @click="editTask">Редактировать</button>
            <button v-if="task.status === 'pending'" @click="removeTask">Удалить</button>
            <button v-if="task.status === 'pending'" @click="moveToInProgress">Далее</button>
            <button v-if="task.status === 'inProgress'" @click="moveToTesting">Тестирование</button>
            <div v-if="task.status === 'testing'">
                <label for="returnReason">Причина возврата:</label>
                <textarea id="returnReason" v-model="returnReason" required></textarea>
                <button @click="returnToInProgress">Вернуть в работу</button>
                <button @click="markAsCompleted">Завершить</button>
            </div>
            <p v-if="task.status === 'completed'">
                <strong v-if="task.isOverdue">Задача просрочена!</strong>
                <strong v-else>Задача выполнена в срок.</strong>
            </p>
        </div>
    </div>
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
