import React from 'react';
import {Link} from 'react-router';
import TxtwarFormStore from '../stores/TxtwarFormStore';
import TxtwarFormActions from '../actions/TxtwarFormActions';

class TxtwarForm extends React.Component  {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <p>
            TXTWAR
          </p>
      </div>
    );
  }
}

export default TxtwarForm;
