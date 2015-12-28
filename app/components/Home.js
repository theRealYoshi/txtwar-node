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

  handleClick(event) {
    event.preventDefault();
    var action = event.currentTarget.value;
      HomeActions.testAMQP(action);
  }

  render() {
    var header = <h1 className='text-center'>Enter your phone number</h1>;

    return (
      <div className='container'>
        <div className='row'>
          <TxtwarForm />
        </div>
        <button onClick={this.handleClick} value="publish">Publish AMQP</button>
        <button onClick={this.handleClick} value="consume">Consume AMQP</button>
      </div>
    );
  }
}

export default Home;
