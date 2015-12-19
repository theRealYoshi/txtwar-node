import alt from '../alt';
import {assign} from 'underscore';

class TxtwarFormActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation'
    );
  }
}

export default alt.createActions(TxtwarFormActions);
