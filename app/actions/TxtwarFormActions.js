import alt from '../alt';
import {assign} from 'underscore';

class TxtwarFormActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'addPhoneNumberSuccess',
      'addPhoneNumberFail',
      'validatePhoneNumberSuccess',
      'validatePhoneNumberFail'
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
      this.actions.addPhoneNumberSuccess();

    })
    .fail((data) => {
      console.log("api call failure");
      this.actions.addPhoneNumberFail();
    });
  }

  validatePhoneNumber(payload){
    $.ajax({
      type: 'GET',
      url: '/api/phonenumbers/validate/',
      data: { phonenumber: payload.phonenumber }
    })
    .done(() => {
      //set state to true
      console.log("api call success");
      this.actions.validatePhoneNumberSuccess();
    })
    .fail(() => {
      this.actions.validatePhoneNumberFail();
    });
  }
}

export default alt.createActions(TxtwarFormActions);
