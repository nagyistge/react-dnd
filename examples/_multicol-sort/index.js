// totally not trello
var React = require('react');
var _ = require('lodash-node');
var update = React.addons.update;
var { PropTypes } = React;
var { MouseDragDropMixin, DropEffects, DragFeedbackMixin } = require('react-dnd');
var keyMirror = require('react/lib/keyMirror');

var DragLayer = require('./DragLayer');

var DropTypes =  keyMirror({
  COLUMN: null,
  CARD: null,
});

var headerStyle = {
  flexDirection: 'column',
  position: 'absolute',
  right: 0,
  top: 0,
  left: 0,
  display: 'flex',
  background: '#268',
  color: '#fff',
  alignItems: 'center',
  font: '12px/40px sans-serif',
};

var mainStyle = {
  overflow: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  bottom: 5,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 40,
};

var columnStyle = {
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

var cardStyle = {
  overflow: 'hidden',
  borderRadius: 3,
  background: '#fff',
  borderBottom: '1px solid #bbb',
  minHeight: 50,
  margin: 8,
};

var Column = React.createClass({
  mixins: [MouseDragDropMixin],

  statics: {
    configureDragDrop(registerType) {
      registerType(DropTypes.COLUMN, {
        dragSource: {
          key(c){return 'c' + c.props.id},
          beginDrag(component) {
            return {
              key: 'c'+ component.props.id, // TODO: use this
              item: {
                id: component.props.id,
                children: React.addons.cloneWithProps(<Column {...component.props}/>, {id: 'e'})
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

      registerType(DropTypes.CARD, { // FIXME: not working
        dropTarget: {
          over(component, item) {
            component.props.moveCard(item.id, component.props.id);
          }
        }
      });
    },
  },

  render() {
    var { isDragging } = this.getDragState(DropTypes.COLUMN);
    return <section
      style={_.extend(columnStyle, {opacity: isDragging ? 0 : 1})}
      {...this.dragSourceFor(DropTypes.COLUMN)}
      {...this.dropTargetFor(DropTypes.COLUMN)}
    >{this.props.children}
    </section>;
  }
});

var Card =  React.createClass({
  mixins: [MouseDragDropMixin],

  propTypes: {
    id: PropTypes.any.isRequired,
    children: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired
  },

  statics: {
    configureDragDrop(registerType) {
      registerType(DropTypes.CARD, {
        dragSource: {
          key(c){return c.props.id},
          beginDrag(component, e) {
            e.stopPropagation();

            return {
              key: component.props.id,
              item: {
                id: component.props.id,
                columnId: component.props.columnId,
                children: React.addons.cloneWithProps(<Card style={{cursor: 'inherit'}} {...component.props}/>, {id: 'f'})
              }
            };
          }
        },

        dropTarget: {
          over(component, item) {
            component.props.moveCard(item.id, component.props.id, component.props.columnId);
          }
        }
      });
    },
  },

  render() {
    var { isDragging } = this.getDragState(DropTypes.CARD);

    return (
      <section
        style={_.extend(cardStyle, { cursor: isDragging ? 'inherit' : 'pointer', opacity: isDragging ? 0 : 1})}
        {...this.dragSourceFor(DropTypes.CARD)}
        {...this.dropTargetFor(DropTypes.CARD)}
      >
          {this.props.children}
      </section>
    );
  }
});

var App = React.createClass({
  mixins: [DragFeedbackMixin],
  getInitialState() {
    return {
      columns: [{
        id: 1,
        text: 'no swearing'
      }, {
        id: 2,
        text: 'lark'
      }],
      cards: [{ // stolen from sortable example
        id: 1,
        text: 'npm init',
        columnId: 2
      }, {
        id: 2,
        text: 'Make it generic enough',
        columnId: 1
      }, {
        id: 3,
        text: 'Write README',
        columnId: 1
      }, {
        id: 4,
        text: 'Create some examples',
        columnId: 1
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it',
        columnId: 1
      }, {
        id: 6,
        text: '???',
        columnId: 1
      }, {
        id: 7,
        text: 'PROFIT',
        columnId: 1
      }]
    };
  },

  moveColumn(id, afterId) {
    var column = this.state.columns.filter(c => c.id === id)[0];
    var afterColumn = this.state.columns.filter(c => c.id === afterId)[0];
    var columnIndex = this.state.columns.indexOf(column);
    var afterIndex = this.state.columns.indexOf(afterColumn);

    var stateUpdate = {
      columns: {
        $splice: [
          [columnIndex, 1],
          [afterIndex, 0, column]
        ]
      }
    };

    this.setState(update(this.state, stateUpdate));
  },

  moveCardToColumn(id, columnId) {
    // TODO: this doesnt work, perhaps the column should always be the target
    // TODO: some sortable components to abstract this away would be nice
    var card = this.state.cards.filter(c => c.id === id)[0];
    card.columnId = columnId;
    this.setState(this.state);
  },

  moveCard(id, afterId, columnId) {
    // FIXME: the placeholder is not invisible because for some reason
    // moving to another column breaks the isDragging detection?
    var card = this.state.cards.filter(c => c.id === id)[0];
    var afterCard = this.state.cards.filter(c => c.id === afterId)[0];
    var cardIndex = this.state.cards.indexOf(card);
    var afterIndex = this.state.cards.indexOf(afterCard);

    card.columnId = columnId;

    var stateUpdate = {
      cards: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    };

    this.setState(update(this.state, stateUpdate));
  },

  render() {
    return (
      <div style={{
        cursor: this.state.isDragging && '-webkit-grabbing',
        WebkitUserSelect: 'none',
      }}>
        <header style={headerStyle}>
          uStack
        </header>
        <main style={mainStyle}>
          {
            this.state.columns.map(column => {
              return (
                <Column
                  key={column.id}
                  id={column.id}
                  move={this.moveColumn}
                  moveCard={this.moveCardToColumn}
                >
                  {
                    _.chain(this.state.cards).where({columnId: column.id}).map(card => {
                      return (
                        <Card key={card.id}
                          id={card.id}
                          columnId={column.id}
                          moveCard={this.moveCard}>
                            {card.text}
                        </Card>
                      );
                    })
                  }
                </Column>
              );
            })
          }
        </main>
        <DragLayer />
      </div>
    );
  }
});

module.exports = App;
