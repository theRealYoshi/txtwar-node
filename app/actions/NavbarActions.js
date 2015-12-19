import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
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
  //find images based off Giphy or Redis
  findGif(payload){
    $.ajax({
      url: '/api/gifs/search',
      data: { email: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.getGiphySuccess(payload);
        this.actions.keepInput(email);
      })
      .fail((data) => {
        assign(payload, data);
        this.actions.getGiphyFail(payload);
        this.actions.removeShake();
      });
  }

}

export default alt.createActions(NavbarActions);
