const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tasksFilePath = path.join(__dirname, 'tasks.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readTasks() {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
  }
  const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
  return JSON.parse(tasksData);
}

function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

function addTask() {
  rl.question('Enter the task description: ', (description) => {
    const tasks = readTasks();
    const newTask = { id: Date.now(), description, completed: false };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log('Task added.');
    showMenu();
  });
}

function viewTasks() {
  const tasks = readTasks();
  tasks.forEach(task => {
    console.log(`${task.id}: ${task.description} [${task.completed ? 'Completed' : 'Incomplete'}]`);
  });
  showMenu();
}

function markTaskAsComplete() {
  rl.question('Enter the task ID to mark as complete: ', (id) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
      task.completed = true;
      writeTasks(tasks);
      console.log('Task marked as complete.');
    } else {
      console.log('Task not found.');
    }
    showMenu();
  });
}

function removeTask() {
  rl.question('Enter the task ID to remove: ', (id) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id !== parseInt(id));
    writeTasks(tasks);
    console.log('Task removed.');
    showMenu();
  });
}

function showMenu() {
  console.log('\nTask Manager');
  console.log('1. Add a new task');
  console.log('2. View a list of tasks');
  console.log('3. Mark a task as complete');
  console.log('4. Remove a task');
  console.log('5. Exit');

  rl.question('Choose an option: ', (option) => {
    switch (option) {
      case '1':
        addTask();
        break;
      case '2':
        viewTasks();
        break;
      case '3':
        markTaskAsComplete();
        break;
      case '4':
        removeTask();
        break;
      case '5':
        rl.close();
        break;
      default:
        console.log('Invalid option.');
        showMenu();
    }
  });
}

showMenu();
