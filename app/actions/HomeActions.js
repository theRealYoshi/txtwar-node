import alt from '../alt';
import {assign} from 'underscore';

class HomeActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'updateAjaxAnimation',
      'getGiphySuccess',
      'getGiphyFail',
      'reRenderPage',
      'clearGifs',
      'removeShake',
      'keepInput'
    );
  }
}

export default alt.createActions(HomeActions);
