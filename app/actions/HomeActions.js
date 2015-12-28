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
  //find images based off Giphy or Redis
  testAMQP(data){
    $.ajax({
      type: 'GET',
      url: '/api/amqp/',
      data: {action: data}
    })
    .done(() => {
      console.log("tested");
    })
    .fail(() => {
      console.log("failed");
    });
  }

}

export default alt.createActions(HomeActions);
