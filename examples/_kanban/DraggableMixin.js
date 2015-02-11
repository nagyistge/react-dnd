var React = require('react/addons');
var { DragDropMixin } = require('react-dnd');

module.exports = {
  mixins: [DragDropMixin],

  render() {
    var { isDragging } = this.getDragState(this.getSourceType());
    return (
      <section
        style={{
          minHeight: 60,
        }}
        {...this.dragSourceFor(this.getSourceType())}
        {...this.dropTargetFor.apply(this, this.getTargetType())}
      >
        <div style={_.extend(this.getStyle(), {opacity: isDragging ? 0 : 1})}>
          {this.props.children}
        </div>
      </section>
    );
  }
};
