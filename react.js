const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOALS = 'ADD_GOALS';
const REMOVE_GOALS = 'REMOVE_GOALS';
const RECEIVE_DATA = 'RECEIVE_DATA';

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

const receiveDataAction = (todos,goals) => {
    return {
        type: RECEIVE_DATA,
        todos,
        goals,
    }
}

const handleAddTodo = (name,cb) => {
    return (dispatch) => {
        return API.saveTodo(name)
        .then((todo) => {
            dispatch(addTodoCreater(todo));
            cb();
        }).catch(() => {
            alert("an error has occured try again")
        })
    }
}

const handleDeleteTodo = (todo) => {
    return (dispatch) => {
        dispatch(removeTodoCreater(todo.id));

        return API.deleteTodo(todo.id).
        catch(() => {
            dispatch(addTodoCreater(todo))
            alert('an error has occured try again!')
        })
    }
}

const handleToggleItem = (todo) => {

    return (dispatch) => {
        
        dispatch(toggleTodoCreater(todo.id));

        return API.saveTodoToggle(todo.id).
        catch(() => {
    
            dispatch(toggleTodoCreater(todo.id));
            alert('an error has occured try again');
        });
    }
}

const handleAddGoal = (name,cb) => {
    return (dispatch) => {
        return API.saveGoal(name)
        .then((goal) => {
            dispatch(addGoalCreater(goal))
            cb();
        }).catch(() => {
            alert("an error has occured try again")
        })
    }
}

const handleRemoveGoal = (goal) => {
    return (dispatch) => {
        dispatch(removeGoalCreater(goal.id));

        API.deleteGoal(goal.id).
        catch(() => {
            dispatch(addGoalCreater(goal));
            alert("an error has occured try again")
        })
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
        case RECEIVE_DATA:
            return action.todos;
        default:
            return state;
    }
}

const goals = (state = [], action) => {
    switch(action.type) {
        case ADD_GOALS:
            return state.concat([action.goal]);
        case REMOVE_GOALS:
            return state.filter((goal) => goal.id !== action.id );
        case RECEIVE_DATA:
            return action.goals;
        default:
            return state;
    }
}

const loading = (state=true, action) => {
    switch(action.type) {
        case RECEIVE_DATA:
            return false
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
    loading,
  }), Redux.applyMiddleware(ReduxThunk.default,checker, logger))


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

        this.props.store.dispatch(handleAddTodo(
            this.input.value,
            () => this.input.value = ''
        ))
    }
    removeItem = (todo) => {
        this.props.store.dispatch(handleDeleteTodo(todo))
    }
    toggleItem = (todo) => {
        this.props.store.dispatch(handleToggleItem(todo));

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

        this.props.store.dispatch(handleAddGoal(
            this.input.value,
            () => this.input.value = ''
        ))
    }
    removeItem =(goal) => {

        this.props.store.dispatch(handleRemoveGoal(goal));
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
        Promise.all([
            API.fetchTodos(),
            API.fetchGoals()
        ]).then(([todos, goals,loading ]) => {
            store.dispatch(receiveDataAction(todos, goals))
        })

        store.subscribe(() => this.forceUpdate());
    }
    render() {
        const { store } = this.props;
        const { todos, goals, loading } = store.getState();

        if (loading === true) {
            return <h3>Loading..</h3>
        }
        return(
            <div>
                <Todos todos={todos} store={this.props.store}/>
                <Goals goals={goals} store={this.props.store}/>
            </div>
        )
    }
}

ReactDOM.render(<App store={store}/>, document.getElementById('app'))