import React from 'react';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton  from 'material-ui/RaisedButton';
import {Container, Row, Col} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import Request from 'superagent';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

const defaultImgURL='./../../assets/images/bulb.png';

const tfont={
  fontSize:'15px'
}
const titleDialog={
  color: '#858586',
  fontSize: 30,
  backgroundColor: '#c7c7c7'

}
const Label={paddingLeft:'15px',paddingTop:'20px',fontWeight:'bold',color:'grey'};

const errorMessages= {
  limitError: 'Party length can\'t be more than 15',
  DuplicationError: 'party name should be unique'
} ;

export default class AddParty extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.partySet = this.partySet.bind(this);
    this.state={partyList:['bjp','congress'],
      errMsg:'',
      canSubmit:false,
      open: false,
      name:'',
      color:'',
      imageUrl:defaultImgURL
    }
  }

  partySet()
  {
  this.setState({partyList:  this.props.partyList});
  }

  componentDidMount()
  {
    this.partySet();
  }

  handleSubmit() {
    console.log('on calling handle sumbit while adding party');
    console.log(this.state.imageUrl)
    let sub=this.state.name;
    sub=sub.replace(/\b[a-z]/g,function(f){return f.toUpperCase();});

    let party = {
      name:sub,
      color:this.state.color,
      partyImgURL:this.state.imageUrl
      //partyImgURL:'./../../assets/images/soon.png',
    };
    if(party.partyImgURL===''|| party.partyImgURL.length<=5)
    {
      party.partyImgURL=defaultImgURL;
    }
    this.refs.form.reset();
    this.setState({party:party})
    this.setState(
      {imageUrl:defaultImgURL})
    console.log(party);
     this.props.addParty(party);
  }
  onChangeName(e)
  {
    this.setState({name:e.target.value})
    console.log(this.state.name);
  }
  onChangeColor(e)
  {
    this.setState({color:e.target.value})
    console.log(this.state.color);
  }
  onChangeImageUrl(e)
  {
    this.setState({imageUrl:e.target.value})
    if(this.state.imageUrl==='')
    {
      this.setState(
        {imageUrl:'http://corevitality.com/'+
        'wp-content/uploads/2015/08/27114989-Coming-soon-blue-grunge-retro-style-'+
        'isolated-seal-Stock-Photo.jpg'})
    }
    console.log(this.state.imageUrl);
  }

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  enableButton() {
    this.setState(()=>({
      canSubmit: true
    }));
  }
  disableButton() {
    this.setState(()=>({
      canSubmit: false
    }));
  }
  render() {
    const actions = [
    <FlatButton
    label='Cancel'
    secondary={true}
    onTouchTap={this.handleClose} />,
    <FlatButton
    label={'Add'} primary={true} type='submit' disabled={!this.state.canSubmit}
    onTouchTap={this.handleClose} onClick={this.handleSubmit}/>
    ];
    let {wordsError, DuplicationError} = errorMessages;
    let partyAr=this.state.partyList;
    let partyArr=[];
    partyAr.forEach(function(party){
      partyArr.push(party);
    })

    console.log('The party arr'+partyArr);
    Formsy.addValidationRule('isIn', function (values, value) {
      return partyArr.indexOf(value) < 0;
    });
    return (
      <div>
      <RaisedButton label="Add Party" primary={true} onTouchTap={this.handleOpen} />
      <Dialog
      title='Add Party'
      titleStyle={titleDialog}
      actions={actions}
      modal={true}
      autoScrollBodyContent={true}
      open={this.state.open}
      >
      <Container>
      <Formsy.Form
      ref='form'
      style={{'padding': '50px 24px'}}
      onValid={this.enableButton}
      onInvalid={this.disableButton}
      //onValidSubmit={this.handleSubmit}
      >
      <Row>
      <Col lg={3} style={Label}>NAME</Col>
      <Col lg={9}>
      <FormsyText
      type='text'
      name='party'
      validations='isIn'
      validationError={DuplicationError}
      fullWidth={true}
      updateImmediately
      required
      hintText='Name of the Party'
      style={tfont} onChange={this.onChangeName.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>COLOR</Col>
      <Col lg={9}><FormsyText
      type='text'
      name='color'
      validationError={wordsError}
      updateImmediately
      required
      hintText='default color for the party'
      style={tfont}
      fullWidth={true} onChange={this.onChangeColor.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>IMAGE URL</Col>
      <Col lg={9}><FormsyText
      type='textarea'
      name='imageUrl'
      validationError={wordsError}
      updateImmediately
      hintText='Image url to be displayed'
      style={tfont}
      fullWidth={true} onChange={this.onChangeImageUrl.bind(this)}/></Col>
      </Row>

      </Formsy.Form>
      </Container>
      </Dialog>
      </div>
      );
  }
}
AddParty.propTypes = {
  addParty: React.PropTypes.func
}
