import alt from '../alt';
import {assign} from 'underscore';

class TxtwarFormActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'validateTwilioNumber',
      'validateTwilioNumberFail'
    );
  }

  validateTwilioNumber(payload){
    $.ajax({
      url: '/api/twiliovalidation',
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
}

export default alt.createActions(TxtwarFormActions);
