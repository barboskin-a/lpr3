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