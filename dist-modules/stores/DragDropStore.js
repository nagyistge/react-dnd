'use strict';

var DragDropDispatcher = require('../dispatcher/DragDropDispatcher'),
    DragDropActionTypes = require('../constants/DragDropActionTypes'),
    createStore = require('../utils/createStore');

var _draggedItemKey = null,
    _draggedItem = null,
    _draggedItemType = null,
    _effectsAllowed = null,
    _dropEffect = null;

var DragDropStore = createStore({
  isDragging:function() {
    return !!_draggedItem;
  },

  getEffectsAllowed:function() {
    return _effectsAllowed;
  },

  getDropEffect:function() {
    return _dropEffect;
  },

  getDraggedItem:function() {
    return _draggedItem;
  },

  getDraggedItemKey:function() {
    return _draggedItemKey;
  },

  getDraggedItemType:function() {
    return _draggedItemType;
  }
});

DragDropDispatcher.register(function (payload) {
  var $__0=    payload,action=$__0.action;

  switch (action.type) {
  case DragDropActionTypes.DRAG_START:
    _dropEffect = null;
    _draggedItem = action.item;
    _draggedItemKey = action.itemKey;
    _draggedItemType = action.itemType;
    _effectsAllowed = action.effectsAllowed;
    DragDropStore.emitChange();
    break;

  case DragDropActionTypes.DROP:
    _dropEffect = action.dropEffect;
    DragDropStore.emitChange();
    break;

  case DragDropActionTypes.DRAG_END:
    _draggedItemKey = null;
    _draggedItem = null;
    _draggedItemType = null;
    _effectsAllowed = null;
    _dropEffect = null;
    DragDropStore.emitChange();
    break;
  }
});

module.exports = DragDropStore;
