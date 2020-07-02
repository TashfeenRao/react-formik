const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOALS = 'ADD_GOALS';
const REMOVE_GOALS = 'REMOVE_GOALS';

const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  }
const addTodoCreater = (todo) => {
    return {
        type: ADD_TODO,
        todo,
    }
}
const toggleTodoCreater = (id) => {
    return {
        type: TOGGLE_TODO,
        id,
    }
}
const removeTodoCreater = (id) => {
    return {
        type: REMOVE_TODO,
        id,
    }
}
const addGoalCreater = (goal) => {
    return {
        type: ADD_GOALS,
        goal,
    }
}
const removeGoalCreater = (id) => {
    return {
        type: REMOVE_GOALS,
        id,
    }
}



const todos = (state = [], action) => {

    switch(action.type) {
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
            Object.assign({}, todo, {complete: !todo.complete}))
        default:
            return state;
    }
}

const goals = (state = [], action) => {
    switch(action.type) {
        case ADD_GOALS:
            return state.concat([action.goal])
        case REMOVE_GOALS:
            return state.filter((goal) => goal.id !== action.id )
        default:
            return state;
    }
}

const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals,
  }))

store.subscribe(() => {
    const { goals, todos } = store.getState();

    document.getElementById('todos').innerHTML = '';
    document.getElementById('goals').innerHTML = '';

    goals.forEach(addGoalToDOM);
    todos.forEach(addTodoToDOM);
})

const addTodo = () => {
    const input = document.getElementById('todo');
    const name = input.value;
    input.value = '';

    store.dispatch(addTodoCreater({
        id: generateId(),
        name,
        complete: false
    }))
}
const addGoal = () => {
    const input = document.getElementById('goal');
    const name = input.value;
    input.value = '';

    store.dispatch(addGoalCreater({
        id: generateId(),
        name,
    }))
}
const createRemoveBtn = (onClick) => {
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click',onClick);
    return removeBtn;
}
document.getElementById('todoBtn').addEventListener('click',addTodo);
document.getElementById('goalBtn').addEventListener('click',addGoal);

const addTodoToDOM = (todo) => {
    const node = document.createElement('li');
    const text = document.createTextNode(todo.name);
    const removeBtn = createRemoveBtn(() => {
        store.dispatch(removeTodoCreater(todo.id))
    })
    node.appendChild(text);
    node.appendChild(removeBtn);
    document.getElementById('todos').appendChild(node);
    node.style.textDecoration = todo.complete ? 'line-through' : 'none';
    node.addEventListener('click',() => {
        store.dispatch(toggleTodoCreater(todo.id))
    });
}
const addGoalToDOM = (goal) => {
    const node = document.createElement('li');
    const text = document.createTextNode(goal.name);
    const removeBtn = createRemoveBtn(() => {
        store.dispatch(removeGoalCreater(goal.id))
    })
    node.appendChild(text);
    node.appendChild(removeBtn);

    document.getElementById('goals').appendChild(node);
}
