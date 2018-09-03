const undoable = require('./src/undoable');

module.exports =  {
  actions: undoable.actions,
  undoable: undoable.undoable
}