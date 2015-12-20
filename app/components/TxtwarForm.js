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

    $(document).ajaxStart(() => {
      TxtwarFormStore.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        TxtwarFormStore.updateAjaxAnimation('fadeOut');
      }, 2000);
    });
  }

  _onChange(state){
    this.setState(state);
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (this.state.searchQuery.length === 10){
      TxtwarFormActions.validateTwilioNumber({
        phonenumber: this.state.searchQuery
      });
    } else {
      TxtwarFormActions.validateTwilioNumberFail();
    }
    // if validated
    // save to database
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
          //keypad here
      </div>
    );
  }
}

export default TxtwarForm;
