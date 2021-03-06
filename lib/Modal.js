var React = require('react');
var ReactDOM = require('react-dom');
var FocusTrap = require('focus-trap-react');
var displace = require('react-displace');
var noScroll = require('no-scroll');

var PropTypes = React.PropTypes;
var focusTrapFactory = React.createFactory(FocusTrap);

var Modal = React.createClass({
  propTypes: {
    onExit: PropTypes.func.isRequired,
    alert: PropTypes.bool,
    dialogClass: PropTypes.string,
    dialogId: PropTypes.string,
    focusDialog: PropTypes.bool,
    initialFocus: PropTypes.string,
    onEnter: PropTypes.func,
    titleId: PropTypes.string,
    titleText: PropTypes.string,
    underlayClass: PropTypes.string,
    underlayColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    underlayClickExits: PropTypes.bool,
    verticallyCenter: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      dialogId: 'react-aria-modal-dialog',
      underlayClickExits: true,
      underlayColor: 'rgba(0,0,0,0.5)',
    };
  },

  componentWillMount: function() {
    if (!this.props.titleText && !this.props.titleId) {
      throw new Error('react-aria-modal instances should have a `titleText` or `titleId`');
    }
    noScroll.on();
  },

  componentDidMount: function() {
    if (this.props.onEnter) {
      this.props.onEnter();
    }
  },

  componentWillUnmount: function() {
    noScroll.off();
  },

  checkClick: function(e) {
    if (ReactDOM.findDOMNode(this.refs.dialog).contains(e.target)) return;
    this.deactivate();
  },

  deactivate: function() {
    this.props.onExit();
  },

  render: function() {
    var props = this.props;
    var underlayProps = {
      className: props.underlayClass,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        textAlign: 'center',
      },
    };
    if (props.underlayColor) {
      underlayProps.style.background = props.underlayColor;
    }
    if (props.underlayClickExits) {
      underlayProps.style.cursor = 'pointer';
      underlayProps.onClick = this.checkClick;
    }

    var verticalCenterHelperProps = {
      key: 'a',
      style: {
        display: 'inline-block',
        height: '100%',
        verticalAlign: 'middle',
      },
    };

    var dialogStyle = {
      display: 'inline-block',
      textAlign: 'left',
      top: (props.verticallyCenter) ? '50%' : '0',
      maxWidth: '100%',
      cursor: 'default',
    };
    if (props.verticallyCenter) {
      dialogStyle.verticalAlign = 'middle';
    }

    var dialogProps = {
      key: 'b',
      ref: 'dialog',
      role: (props.alert) ? 'alertdialog' : 'dialog',
      id: props.dialogId,
      className: props.dialogClass,
      style: dialogStyle,
    };
    if (props.titleId) {
      dialogProps['aria-labelledby'] = props.titleId;
    } else if (props.titleText) {
      dialogProps['aria-label'] = props.titleText;
    }
    if (props.focusDialog) {
      dialogProps.tabIndex = '-1';
      dialogProps.style.outline = 0;
    }

    var childrenArray = [
      React.DOM.div(dialogProps, props.children),
    ];
    if (props.verticallyCenter) {
      childrenArray.unshift(React.DOM.div(verticalCenterHelperProps));
    }

    return focusTrapFactory(
      {
        initialFocus: (props.focusDialog)
          ? '#react-aria-modal-dialog'
          : props.initialFocus,
        onDeactivate: this.deactivate,
      },
      React.DOM.div(underlayProps, childrenArray)
    );
  },
});

module.exports = displace(Modal);
