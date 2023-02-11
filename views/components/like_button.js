'use strict';

const e = React.createElement;

class NewFile extends React.Component {
  render() {
      return 'hil';
  }
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return <NewFile />;
  }
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));