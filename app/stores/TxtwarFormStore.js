import alt from '../alt';
import TxtwarFormActions from '../actions/TxtwarFormActions';

class TxtwarFormStore {
  constructor() {
    this.bindActions(TxtwarFormActions);
    this.searchQuery = '';
    this.validated = false;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    var searchQuery = event.target.value.replace(/[^\d]/g,"");
    console.log(searchQuery);
    if(isNaN(searchQuery)){
      toastr.error("Please enter numbers only");
    } else {
      this.searchQuery = searchQuery;
    }
  }

  onAddPhoneNumberSuccess(){
    // change this to a success notification
    toastr.error("Successfully Added");
    
  }

  onAddPhoneNumberFail(){
    toastr.error("Please enter a valid phone number");
  }

}

export default alt.createStore(TxtwarFormStore);
