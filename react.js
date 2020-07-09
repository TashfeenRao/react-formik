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

const checker = (store) => (next) => (action) => {
    if (action.type === ADD_TODO &&
        action.todo.name.toLowerCase().includes('bilal')) {
        return alert('he is a good man');
    }
    if (action.type === ADD_GOALS &&
        action.goal.name.toLowerCase().includes('bilal')) {
        return alert('he is a good man');
    }

    return next(action);
}

const logger = (store) => (next) => (action) => {
    console.group(action.type)
    console.log("this is action:", action);
    const result = next(action)
    console.log("the new state is:", store.getState())
    console.groupEnd()
    return result;
}
const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals,
  }), Redux.applyMiddleware(checker, logger))


const List = (props) => {
    return(
        <ul>
            {props.items.map(item => (
                <li key={item.id}>
                    <span onClick={() => props.toggle && props.toggle(item)}
                    style={{textDecoration: item.complete ? 'line-through' : 'none'}}
                    >{item.name}</span>
                <button onClick={() => props.removeItem(item)} >X</button>
                </li>
            ))}
        </ul>
    )
}

class Todos extends React.Component {

    addItem = (e) => {
        e.preventDefault()
        const name = this.input.value;
        this.input.value = '';
        this.props.store.dispatch(
            addTodoCreater({
                id: generateId(),
                name,
                complete: false
            })
        )
    }
    removeItem = (todo) => {
        this.props.store.dispatch(removeTodoCreater(todo.id));
    }
    toggleItem = (todo) => {
        this.props.store.dispatch(toggleTodoCreater(todo.id))
    }
    render() {
        return(
            <div>
                <h1>TODOS</h1>
                <input type="text" placeholder="ADD Todo" ref={(input) => this.input = input} />
                <button onClick={this.addItem}>Add Todo</button>
                <List 
                items={this.props.todos} 
                removeItem={this.removeItem} 
                toggle={this.toggleItem} />
            </div>
        )
    }
}

class Goals extends React.Component {
    addGoal = (e) => {
        e.preventDefault();
        const name = this.input.value;
        this.input.value = '';
        this.props.store.dispatch(addGoalCreater({
            id: generateId(),
            name, 
        }))

    }
    removeItem =(goal) => {
        this.props.store.dispatch(removeGoalCreater(goal.id))
    }
    render() {
        return(
            <div>
                <h1>Goals</h1>
                <input type="text" placeholder="ADD Goal" ref={(input) => this.input = input} />
                <button onClick={this.addGoal}>ADD Goal</button>
                <List items={this.props.goals} removeItem={this.removeItem}/>
            </div>
        )
    }
}




class App extends React.Component {
    componentDidMount = () =>{
        const { store } = this.props;
        store.subscribe(() => this.forceUpdate());
    }
    render() {
        const { store } = this.props;
        const { todos, goals } = store.getState();
        return(
            <div>
                <Todos todos={todos} store={this.props.store}/>
                <Goals goals={goals} store={this.props.store}/>
            </div>
        )
    }
}

ReactDOM.render(<App store={store}/>, document.getElementById('app'))