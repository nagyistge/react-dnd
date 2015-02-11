var React = require('react/addons');

var DraggableMixin = require('./DraggableMixin');
var DropTypes = require('./DropTypes');

var Card =  React.createClass({
  mixins: [DraggableMixin],

  propTypes: {
    id: React.PropTypes.any.isRequired,
    children: React.PropTypes.string.isRequired,
    moveCard: React.PropTypes.func.isRequired
  },

  statics: {
    configureDragDrop(registerType) {
      registerType(DropTypes.CARD, {
        dragSource: {
          getKey(component) {
            return DropTypes.CARD + component.props.id;
          },

          beginDrag(component, e) {
            e.stopPropagation();

            return {
              item: {
                id: component.props.id,
                columnId: component.props.columnId,
              }
            };
          }
        },

        dropTarget: {
          over(component, item, e) {
            component.props.moveCard(item.id, component.props.id, component.props.columnId);
          }
        }
      });
    },
  },

  getSourceType() {
    return DropTypes.CARD;
  },

  getTargetType() {
    return [DropTypes.CARD];
  },

  getStyle() {
    return {
      overflow: 'hidden',
      borderRadius: 3,
      background: '#fff',
      borderBottom: '1px solid #bbb',
      minHeight: 50,
      margin: 5,
    };
  },
});

module.exports = Card;
