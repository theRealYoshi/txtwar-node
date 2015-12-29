import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import TxtwarForm from './TxtwarForm';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    var header = <h1 className='text-center'>Enter your phone number</h1>;

    return (
      <div className='container'>
        <h1>How long to wait before texting back?</h1>
        <h3>Everybody hates the waiting game.</h3>
        <div className='row'>
          <TxtwarForm />
        </div>
      </div>
    );
  }
}

export default Home;
