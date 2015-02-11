var _ = require('lodash');
var r = n => require('random-words')(n);

var cols = _.chain(5).times(_.partial(_.uniqueId, 'col_')).map((k,v) => {
  return {
    id: k,
    text: r(_.random(1,2)).join(' ')
  };
}).value();

var cards = _.chain(50).times(_.partial(_.uniqueId, 'card_')).map((k,v) => {
  return {
    id: k,
    text: r(_.random(1, 5)).join(' '),
    columnId: cols[_.random(0, cols.length-1)].id
  };
}).value();

module.exports = {
  columns: cols,
  cards: cards,
};
