const undoable = require('..');

const initial_state = {
  value: 0
}

const reducer = (state = initial_state, action) => {
  const { value } = state;
  if(action.type === 'inc') return { ...state, value: value + 1 }
  if(action.type === 'dec') return { ...state, value: value - 1 }
  return state;
}

describe('reducer', () => {
  it('has a reducer', () => {
    expect(reducer).toBeDefined();
  });

  it('should return initial state', () => {
    const expected = initial_state;
    expect(reducer(undefined, {})).toEqual(expected);
  });

  it('should handle inc action', () => {
    const action = { type: 'inc' };
    const expected = { value: 1 };
    const result = reducer(undefined, action);
    expect(result).toEqual(expected);
  })

  it('should handle dec action', () => {
    const action = { type: 'dec' };
    const expected = { value: -1 };
    const result = reducer(undefined, action);
    expect(result).toEqual(expected);
  })
})

describe('undoable', () => {
  it('has a undoable module', () => {
    expect(undoable).toBeDefined();
    expect(undoable.undoable).toBeDefined();
    expect(undoable.actions).toBeDefined();
  });

  it('attaches past property to state container', () => {
    const undoable_reducer = undoable.undoable(reducer);
    const result = undoable_reducer(undefined, {});
    expect(result.past).toBeDefined();
    expect(result.past).toEqual([initial_state]);
  })

  it('attaches future property to state container', () => {
    const undoable_reducer = undoable.undoable(reducer);
    const result = undoable_reducer(undefined, {});
    expect(result.future).toBeDefined();
    expect(result.future).toEqual([]);
  })

  it('attaches present property to state container', () => {
    const undoable_reducer = undoable.undoable(reducer);
    const result = undoable_reducer(undefined, {});
    expect(result.present).toBeDefined();
    expect(result.present).toEqual(initial_state);
  })

  it('can dispatch reducers base actions', () => {
    const undoable_reducer = undoable.undoable(reducer);
    const action = { type: 'inc' };
    const expected = { value: 1 };
    const result = undoable_reducer(undefined, action);
    expect(result.present).toBeDefined();
    expect(result.present).toEqual(expected);
  })

  describe('undo and redo', () => {
    const undoable_reducer = undoable.undoable(reducer);
    const action = { type: 'inc' };
    const expected = { value: 1 };

    // Can undo
    it('can undo action', () => {
      let state = undefined;
      state = undoable_reducer(state, action);
      expect(state.present).toEqual(expected);
  
      // Undo
      state = undoable_reducer(state, { type: undoable.actions.undo });
      expect(state.present).toEqual({ value: 0 });
    })
  
    // Can redo
    it('can redo action', () => {
      let state = undefined;
      state = undoable_reducer(state, action);
      expect(state.present).toEqual(expected);
  
      // Undo
      state = undoable_reducer(state, { type: undoable.actions.undo });
      expect(state.present).toEqual({ value: 0 });
  
      // Redo
      state = undoable_reducer(state, { type: undoable.actions.redo });
      expect(state.present).toEqual({ value: 1 });
    })
  
    // Clear future after dispatching other action
    it('clears future array after dispatching non @undoable action', () => {
      let state = undefined;
      state = undoable_reducer(state, action);
      expect(state.present).toEqual(expected);
  
      // Undo
      state = undoable_reducer(state, { type: undoable.actions.undo });
      expect(state.present).toEqual({ value: 0 });
      expect(state.future).toEqual([{ value: 1 }]);
  
      // Dispatch non undoable action
      state = undoable_reducer(state, action);
      expect(state.future).toEqual([]);
    })
  })

  // Could not undo when past is empty
  describe('can not undo when past array is empty', () => {
    const undoable_reducer = undoable.undoable(reducer);
    let state = undoable_reducer(undefined, {});

    // Can undo
    it('can undo', () => {
      state = undoable_reducer(state, { type: undoable.actions.undo });
      expect(state.past).toEqual([]);
      expect(state.present).toEqual(initial_state);
      expect(state.future).toEqual([initial_state]);
    })

    // Cannot undo
    it('can undo but does not change state', () => {
      state = undoable_reducer(state, { type: undoable.actions.undo });
      expect(state.past).toEqual([]);
      expect(state.present).toEqual(initial_state);
      expect(state.future).toEqual([initial_state]);
    })
  })

  // Could not redo when future is empty
  describe('can not redo when future array is empty', () => {
    const undoable_reducer = undoable.undoable(reducer);
    let state = undoable_reducer(undefined, {});

    // Cannot undo
    it('can redo but does not change state', () => {
      state = undoable_reducer(state, { type: undoable.actions.redo });
      expect(state.past).toEqual([initial_state]);
      expect(state.present).toEqual(initial_state);
      expect(state.future).toEqual([]);
    })
  })
})