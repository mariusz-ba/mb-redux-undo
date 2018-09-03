const { undoable, actions } = require('..');
const { createStore, applyMiddleware } = require('redux');

// Simple logging middleware that shows whats happenning in the store
const logger = store => next => action => {
  console.log('dispatching: ', action.type);
  let result = next(action);
  console.log('next state: ', store.getState());
  return result;
}

// Create simple reducer that manages one value
const reducer = (state = 0, action) => {
  if(action.type === 'INC')
    return state + 1;
  else if(action.type === 'DEC')
    return state - 1;
  return state;
}

// Create store with undoable reducer
const store = createStore(
  undoable(reducer),
  applyMiddleware(logger)
);

// Dispatch reducers base actions
store.dispatch({ type: 'INC' });
store.dispatch({ type: 'INC' });
store.dispatch({ type: 'INC' });

// dispatch undo or redo action to change states history
store.dispatch({ type: actions.undo });
store.dispatch({ type: actions.redo });