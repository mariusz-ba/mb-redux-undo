const actions = {
  undo: 'mb-redux-undo/undo',
  redo: 'mb-redux-undo/redo'
}

const undoable = (reducer) => {
  const initialState = {
    past: [],
    future: [],
    present: reducer(undefined, {})
  }

  return (state = initialState, action) => {
    const { past, present, future } = state;

    if(action.type === actions.undo) {
      if(past.length === 0)
        return {
          past: [],
          present,
          future
        }

      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [present, ...future]
      }
    }

    if(action.type === actions.redo) {
      if(future.length === 0)
        return {
          past,
          present,
          future: []
        }

      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1)
      }
    }

    return {
      past: [...past, present],
      present: reducer(present, action),
      future: []
    }
  }
}

module.exports = {
  actions,
  undoable
}