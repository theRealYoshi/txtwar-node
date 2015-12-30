import alt from '../alt';
import TxtwarFormActions from '../actions/TxtwarFormActions';

class TxtwarFormStore {
  constructor() {
    this.bindActions(TxtwarFormActions);
    this.searchQuery = '';
    this.validated = false;
    this.unverified = false;
    this.keypad = [1,2,3,4,5,6,7,8,9,null,0,"<<"];
    this.heldKeys = [];
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    var searchQuery = event.target.value.replace(/[^\d]/g,"");
    if(isNaN(searchQuery)){
      toastr.error("Please enter numbers only");
    } else {
      this.searchQuery = searchQuery;
    }
  }

  onUpdateSearchQueryClick(value) {
    if (this.searchQuery.length === 10 && value !== "<<"){
        return null;
    }
    if(value === "<<"){
      this.searchQuery = this.searchQuery.slice(0, this.searchQuery.length - 1);
    } else {
      this.searchQuery = this.searchQuery + value;
    }
  }

  onAddPhoneNumberSuccess(data){
    toastr.error(data);
  }

  onAddPhoneNumberFail(data){
    toastr.error(data.responseText);
    if (data.responseText === "Unverified number"){
      this.unverified = true;
    }
  }
}

export default alt.createStore(TxtwarFormStore);
