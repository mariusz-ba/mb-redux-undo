# mb-redux-undo
mb-redux-undo is a library that provides undo and redo functionality to redux state containers.
## Installation
To install the stable version
```
npm install --save mb-redux-undo
```
## Usage
To make Your reducer undoable you just have to wrap it in high order reducer that is provided by mb-redux-undo:
```javascript
const { createStore } = require('redux');
const { undoable, actions } = require('mb-redux-undo');

const createStore(
  undoable(reducer)
)
```
At this point an additional functionality will be added to your reducer. The state shape will change to:
```
{
  past: [],
  present: ... your base reducers state,
  future: []
}
```
Every time a new action is dispatched the current state will be added to the end of past array so it could be restored later on by dispatchin undo action:
```javascript
const { actions } = require('mb-redux-undo');

store.dispatch({ type: actions.undo });
```
The future array is storing all undone elements from past array and they can be restored by dispatchin redo action:
```javascript
const { actions } = require('mb-redux-undo');

store.dispatch({ type: actions.redo });
```
Notice that after dispatching any other action that isn't a undo or redo action the future array will be cleared.