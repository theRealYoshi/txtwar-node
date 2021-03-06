import React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import TxtwarForm from './TxtwarForm';
import Footer from './Footer';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar history={this.props.history}/>
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App;
