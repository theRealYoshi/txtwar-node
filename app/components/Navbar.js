import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 2000);
    });
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();
    if (searchQuery) {
      NavbarActions.clearGifs();
      NavbarActions.findGif({
        searchQuery: searchQuery,
        history: this.props.history
      });
      NavbarActions.keepInput(searchQuery);
    } else {
      NavbarActions.reRenderPage();
    }
  }

  handleReRender(){
    NavbarActions.reRenderPage();
  }

  render() {

    var inputForm = 'navbar-form navbar-left animated';
    if (this.state.shake){
      inputForm += ' shake';
    }

    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand' onClick={this.handleReRender}>
            TXTWAR
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <button className='btn btn-default clear' onClick={this.handleReRender}>Clear Search</button>
        </div>
      </nav>
    );
  }
}

export default Navbar;
