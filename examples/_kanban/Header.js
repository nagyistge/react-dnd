var React = require('react/addons');

var Header = React.createClass({
  render() {
    var headerStyle = {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      right: 0,
      top: 0,
      left: 0,
      background: '#268',
      color: '#fff',
      alignItems: 'center',
      font: '12px/40px sans-serif',
    };

    return (
      <header style={headerStyle}>
        Kanban Example
      </header>
    );
  }
});

module.exports = Header;
