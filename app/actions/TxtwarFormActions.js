import alt from '../alt';
import {assign} from 'underscore';

class TxtwarFormActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateSearchQueryClick',
      'updateAjaxAnimation',
      'addPhoneNumberSuccess',
      'addPhoneNumberFail'
    );
  }

  addPhoneNumber(payload){
    $.ajax({
      type: 'POST',
      url: '/api/phonenumbers/',
      data: { phonenumber: payload.phonenumber }
    })
    .done((data) => {
      this.actions.addPhoneNumberSuccess(data);

    })
    .fail((data) => {
      this.actions.addPhoneNumberFail(data);
    });
  }

}

export default alt.createActions(TxtwarFormActions);
