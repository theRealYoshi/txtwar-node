import alt from '../alt';
import TxtwarFormActions from '../actions/TxtwarFormActions';

class TxtwarFormStore {
  constructor() {
    this.bindActions(TxtwarFormActions);
    this.searchQuery = '';
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    var searchQuery = event.target.value.replace(/[^\d]/g,"");
    console.log(searchQuery);
    if(isNaN(searchQuery)){
      toastr.error("please enter numbers only");
    } else {
      this.searchQuery = searchQuery;
    }
  }

}

export default alt.createStore(TxtwarFormStore);
