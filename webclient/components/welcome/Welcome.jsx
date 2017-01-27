
import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {Link} from 'react-router';
import ActionHome from 'material-ui/svg-icons/action/home';
const styles = {
 largeIcon: {
  width: 30,
  height: 30
}
};
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: true, open: false};
    this.updateState = this.updateState.bind(this);
  }
  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  updateState() {
    this.setState({data: false});
  }
  render() {
    return (
      <div>
      <Drawer
      docked={false}
      width={250}
      open={this.state.open}
      onRequestChange={(open) => this.setState({open})}>
      <Link to='/job'>
      <MenuItem onTouchTap={this.handleToggle}>
      <IconButton><ActionSearch /></IconButton>
      <FlatButton label='Job' hoverColor= '#e8f1fb' labelStyle={{textAlign: 'left'}}
      style = {{fontSize: '50px', marginTop: '4px'}}/>
      </MenuItem>
      </Link>
      <Link to='/dashboard'>
      <MenuItem onTouchTap={this.handleToggle}>
      <IconButton><ActionDashboard/></IconButton>
      <FlatButton label='dashboard' hoverColor='#e8f1fb' labelStyle={{textAlign: 'left'}}
      style={{fontSize: '50px', marginTop: '4px'}}/></MenuItem>
      </Link>
      </Drawer>
      <AppBar
      onLeftIconButtonTouchTap={this.handleToggle}
      title='Oxygen'
      style={{position: 'fixed', top: 0}}
      iconElementRight={<span>
        <Link to='/dashboard'><IconButton iconStyle={styles.largeIcon}>
        <ActionHome color={'white'} />
        </IconButton></Link></span>
      }/>
      <main style={{marginTop: 50}}>
      {this.props.children}
      </main>
      </div>
      );
  }
}
Welcome.propTypes = {
  children: React.PropTypes.node.isRequired
};
export default Welcome;
