import alt from '../alt';
import {assign} from 'underscore';

class TxtwarFormActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'addPhoneNumberSuccess',
      'addPhoneNumberFail',
      'validateTwilioNumberFail'
    );
  }

  addPhoneNumber(payload){
    $.ajax({
      type: 'POST',
      url: '/api/phonenumbers/',
      data: { phonenumber: payload.phonenumber }
    })
    .done((data) => {
      //set state to true
      console.log("api call success");
    })
    .fail((data) => {
      console.log("api call fail");
    });
  }

  validatePhoneNumber(payload){
    $.ajax({
      type: 'GET',
      url: '/api/phonenumbers/validate/',
      data: { phonenumber: payload.phonenumber }
    })
    .done((data) => {
      //set state to true
      console.log("api call success");
    })
    .fail((data) => {
      console.log(data);
    });
  }
}

export default alt.createActions(TxtwarFormActions);
