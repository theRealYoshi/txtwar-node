import React from 'react';
import {Link} from 'react-router';
import TxtwarFormStore from '../stores/TxtwarFormStore';
import TxtwarFormActions from '../actions/TxtwarFormActions';

class TxtwarForm extends React.Component  {

  constructor(props) {
    super(props);
    this.state = TxtwarFormStore.getState();
    this._onChange = this._onChange.bind(this);

  }

  componentDidMount() {
    TxtwarFormStore.listen(this._onChange);
  }

  componentWillUnmount() {
    TxtwarFormStore.unlisten(this._onChange);
  }

  _onChange(state){
    this.setState(state);
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (this.state.searchQuery.length === 10){
      TxtwarFormActions.addPhoneNumber({
        phonenumber: this.state.searchQuery
      });
    } else {
      TxtwarFormActions.validateTwilioNumberFail();
    }
  }

  _handleClick(key) {
    if (key !== null){
      TxtwarFormActions.updateSearchQueryClick(key);
    }
  }

  _formattedNumber() {
    var numStr = this.state.searchQuery.toString();
    //regex for different formats and then add 000's until end
    if (numStr.length <= 3){
      return "(" + numStr;
    } else if (numStr.length > 3 && numStr.length < 7){
      return "(" + numStr.slice(0,3) + ")-" + numStr.slice(3);
    } else {

      return "(" + numStr.slice(0,3) + ")-" + numStr.slice(3,6) + "-" + numStr.slice(6);
    }
  }

  //add debounce

  render() {
    var keypad = this.state.keypad;
    var phoneNumber, warning;
    if (this.state.searchQuery){
      phoneNumber = this._formattedNumber();
    } else {
      phoneNumber = "";
    }

    return (
      <div>
        <div className="numberForm">
          <form className="navbar-form navbar-left animated" onSubmit={this._handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder="(000)-000-0000"
                value={phoneNumber} onChange={TxtwarFormActions.updateSearchQuery}
                maxLength="14"/>
              <span className='input-group-btn'>
                <button className='btn btn-default btn-lg' onClick={this._handleSubmit.bind(this)}><span className='glyphicon glyphicon-phone'></span></button>
              </span>
            </div>
          </form>
        </div>
        <div className="keys">
          <div className="keys-container">
            {
              keypad.map(function(key){
                return (
                  // pass in props
                  <div className="note-key" onClick={this._handleClick.bind(this, key)} >
                    <span>{key}</span>
                  </div>
                )
              }.bind(this))
            }
          </div>
        </div>
        <div className="warning-container">
          <h4>If your number is unverified with Twilio, please verify your number
            <a href='https://www.twilio.com/user/account/phone-numbers/verified'> here</a>
          </h4>
        </div>
      </div>
    );
  }
}

export default TxtwarForm;
