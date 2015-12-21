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
    TxtwarFormStore.unlisten(this.onChange);
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

  _handleClick(event) {
    event.preventDefault();
    TxtwarFormActions.updateSearchQueryClick(event.target.value);
  }

  _checkValidation(){
    // route to twilio api once all numbers are fulfilled
  }

  _onKeypressEvent(){

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
    var keypad = [1,2,3,4,5,6,7,8,9,null,0,"<<"];
    var phoneNumber;
    if (this.state.searchQuery){
      phoneNumber = this._formattedNumber();
    } else {
      phoneNumber = "";
    }

    return (
      <div>
        <form ref='searchForm' className="navbar-form navbar-left animated" onSubmit={this._handleSubmit.bind(this)}>
          <div className='input-group'>
            <input type='text' className='form-control' placeholder="(000)-000-0000"
              value={phoneNumber} onChange={TxtwarFormActions.updateSearchQuery}
              maxLength="14"/>
            <span className='input-group-btn'>
              <button className='btn btn-default' onClick={this._handleSubmit.bind(this)}><span className='glyphicon glyphicon-phone'></span></button>
            </span>
          </div>
        </form>
        <div className="keypad-container">
          {
            keypad.map(function(key){
              return <button className="key" onClick={this._handleClick.bind(this)} value={key}>{key}</button>
            }.bind(this))
          }
        </div>
      </div>
    );
  }
}

export default TxtwarForm;
