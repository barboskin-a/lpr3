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
        // добавить отчистку
    },
    template: `
        
    `
});
