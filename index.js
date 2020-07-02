const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOALS = 'ADD_GOALS';
const REMOVE_GOALS = 'REMOVE_GOALS';


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

const app = (state = {}, action) => {
    return {
        todos: todos(state.todo, action),
        goals: goals(state.goal, action)
    }
}


const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter((l) => l !== listener )
        }
    }

    const dispatch = (action) => {
        state = reducer(state,action);
        listeners.forEach((listener) => listener())
    }

    return {
        getState, subscribe, dispatch
    }
}

const store = createStore(app)

store.subscribe(() => {
    console.log("This is todos state", store.getState())
})

store.dispatch({
    type: ADD_TODO,
    todo: {
        id: 0,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: ADD_GOALS,
    goal: {
        id: 0,
        name: 'learn Redux Tashfeen goals',
        complete: false
    }
})
store.dispatch({
    type: ADD_TODO,
    todo: {
        id: 1,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: ADD_TODO,
    todo: {
        id: 2,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: ADD_TODO,
    todo: {
        id: 3,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: REMOVE_TODO,
    todo: {
        id: 2,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: TOGGLE_TODO,
    todo: {
        id: 1,
        name: 'learn Redux Tashfeen',
        complete: true
    }
})
store.dispatch({
    type: ADD_GOALS,
    goal: {
        id: 1,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})
store.dispatch({
    type: ADD_GOALS,
    goal: {
        id: 2,
        name: 'learn Redux Tashfeen',
        complete: false
    }
})