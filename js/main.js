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
