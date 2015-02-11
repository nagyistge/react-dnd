var React = require('react/addons');
var update = React.addons.update;

module.exports = (container, type, position, nextPosition, columnId) => {
  var item = container[type][position];
  var kv = {};
  kv[type] = {
    $splice: [
      [position, 1],
      [nextPosition, 0, item]
    ]
  };

  return update(container, kv);
};
