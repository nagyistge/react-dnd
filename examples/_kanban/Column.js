var React = require('react/addons');

var DraggableMixin = require('./DraggableMixin');
var DropTypes = require('./DropTypes');

var Column = React.createClass({
  mixins: [DraggableMixin],

  statics: {
    configureDragDrop(registerType) {
      registerType(DropTypes.COLUMN, {
        dragSource: {
          getKey(component) {
            return component.props.id;
          },

          beginDrag(component) {
            return {
              item: {
                id: component.props.id,
              }
            };
          }
        },

        dropTarget: {
          over(component, item) {
            component.props.move(item.id, component.props.id);
          }
        }
      });

      registerType(DropTypes.CARD, {
        dropTarget: {
          over(component, item, e) {
            component.props.moveCard(item.id, component.props.id);
          }
        }
      });
    },
  },

  getSourceType() {
    return DropTypes.COLUMN;
  },

  getTargetType() {
    return [DropTypes.COLUMN, DropTypes.CARD];
  },

  getStyle() {
    return {
      overflow: 'scroll',
      flexDirection: 'column',
      background: '#ddd',
      maxHeight: '100%',
      display: 'flex',
      margin: '0 4px',
      minHeight: 50,
      minWidth: 250,
      maxWidth: 250,
      borderRadius: 3,
    };
  },
});

module.exports = Column;
