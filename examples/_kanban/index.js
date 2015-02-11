var React = require('react/addons');
var _ = require('lodash');
var Perf = React.addons.Perf;


var Data = require('./Data');
var Header = require('./Header');
var Card = require('./Card');
var Column = require('./Column');
var DropTypes = require('./DropTypes');

var setPosition = require('./setPosition');

var App = React.createClass({
  mixins:[React.addons.PureRenderMixn],

  getInitialState() {
    return Data;
  },

  moveColumn(id, afterId) {
    var index = _.findIndex(this.state.columns, {id: id});
    var afterIndex = _.findIndex(this.state.columns, {id: afterId});

    this.setState(
      setPosition(this.state, 'columns', index, afterIndex)
    );
  },

  moveCardToColumn(id, columnId) {
    var card = this.state.cards.filter(c => c.id === id)[0];
    card.columnId = columnId;
    this.setState(this.state);
  },

  moveCard(id, afterId, columnId) {
    var index = _.findIndex(this.state.cards, {id: id});
    var afterIndex = _.findIndex(this.state.cards, {id: afterId});

    this.state.cards[index].columnId = columnId;

    // HACK: not sure why setState fails to work on the result of setPosition
    // so assign it to this.state and force an update :/
    this.state = setPosition(this.state, 'cards', index, afterIndex);

    this.setState(this.state);
  },

  renderCards(column) {
    return _.chain(this.state.cards)
      .where({columnId: column.id})
      .value()
      .map(card =>
        <Card
          key={card.id}
          id={card.id}
          columnId={column.id}
          moveCard={this.moveCard}
        >
          {card.text}
        </Card>
      );
  },

  renderColumns() {
    return this.state.columns.map(column =>
      <Column
        key={column.id}
        id={column.id}
        move={this.moveColumn}
        moveCard={this.moveCardToColumn}
      >
        <div style={{
          background: '#333',
          color: '#fff',
          borderBottom: '3px solid #fff',
          minHeight: 20,
          margin: 2,
        }}>{column.text}</div>
        {this.renderCards(column)}
      </Column>
    );
  },

  render() {
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

    return (
      <div style={{WebkitUserSelect: 'none'}}>
        <Header/>
        <main style={mainStyle}>
          {this.renderColumns()}
        </main>
      </div>
    );
  }
});

module.exports = App;
