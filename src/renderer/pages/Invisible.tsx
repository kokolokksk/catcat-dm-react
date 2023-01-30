import React from 'react';
import '../styles/invisible.css';

class Invisible extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <img
          className="drag"
          alt="catcat"
          src="https://i0.hdslb.com/bfs/new_dyn/750c0c53bbee5e1d4f151b3ac7236bd21999280.png@120w_120h_1e_1c.webp"
        />
      </div>
    );
  }
}
export default Invisible;
