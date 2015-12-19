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
    if(isNaN(event.target.value)){
      toastr.error("please enter numbers only");
    } else {
      this.searchQuery = event.target.value;
    }
    console.log(this.searchQuery);
  }

}

export default alt.createStore(TxtwarFormStore);
