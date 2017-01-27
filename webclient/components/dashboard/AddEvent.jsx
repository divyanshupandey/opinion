import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton  from 'material-ui/RaisedButton';
import {Container, Row, Col} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import Request from 'superagent';
import ActionAddBox from 'material-ui/svg-icons/content/add-box';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

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
  limitError: 'eventName length can\'t be more than 15',
  DuplicationError: 'eventName name should be unique'
} ;

export default class AddEvent extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.eventSet = this.eventSet.bind(this);
    this.state={eventNames: [],
      partyList : [],
      errMsg:'',
      canSubmit:false,
      open: false,
      eventName: '',
      eventType: '',
      year : 2017,
      noOfParties: 1,
      parties : []
    }
  }
    eventSet()
   {
  this.setState({eventList: this.props.eventList, partyList:  this.props.partyList});
   }

  handleSubmit() {
     console.log('on calling handle sumbit while adding eventName');

    let eventObj = {
      eventName: this.state.eventName,
      eventType: this.state.eventType,
      year: this.state.year,
      parties: this.state.parties
    };
     this.refs.form.reset();
    console.log(eventObj);
    this.props.addEvent(eventObj);
  }
  onChangeEvent(e)
  {
    this.setState({eventName:e.target.value})
    console.log(this.state.eventName);
  }
  onChangeType(e)
  {
    this.setState({eventType:e.target.value})
    console.log(this.state.eventType);
  }
  onChangePartyNumber(e)
  {
    let no = this.state.noOfParties;
    no++;
    this.setState({noOfParties: no})
    console.log(this.state.noOfParties);
  }
  onChangeYear(e)
  {
    this.setState({year:e.target.value})
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

  changePartyList(e,index,value) {
    //console.log(this.refs.query.getName())
  let id= ReactDOM.findDOMNode(this.refs.query).getAttribute('data-id');
    //console.log( ReactDOM.findDOMNode(this.refs.query).querySelector('div[name]'))
    //console.log(e);
    //console.log(value);
    //let j = e.target.getAttribute('data-id');
    //console.log('j '+j)
    let parties=this.state.parties;

    parties[id]=index;

    this.setState({parties : parties});
    console.log('parties added ',this.state.parties);
  }

  componentDidMount()
  {
    this.eventSet();
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
    let eventNameAr=this.state.eventNames;
    let eventNameArr=[];
    eventNameAr.forEach(function(eventName){
      eventNameArr.push(eventName);
    })

    console.log('The eventName arr'+eventNameArr);
    Formsy.addValidationRule('isIn', function (values, value) {
      return eventNameArr.indexOf(value) < 0;
    });
    const items = [];

    for (let i = 0; i < this.state.partyList.length; i+=1) {
      items.push(<MenuItem
        value={this.state.partyList[i]} data-id={i}
        key={i} primaryText={this.state.partyList[i]} />);
    }
    const allParties = [];

    for (let i = 0; i < this.state.noOfParties; i+=1) {
    allParties.push(
    <Row key={i} data-id={i}>
    <FormsySelect
    key={i}
    data-id={i}
    name="party"
    required
    floatingLabelText="Selected party"
    value= {i}
    ref='query'
    onChange={this.changePartyList.bind(this)}>
     {items}
    </FormsySelect></Row>);
    }

    return (
      <div>
      <RaisedButton label="Add Event" primary={true} onTouchTap={this.handleOpen} />
      <Dialog
      title='Add Event'
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
      <Col lg={3} style={Label}>EVENT</Col>
      <Col lg={9}>
      <FormsyText
      type='text'
      name='eventName'
      validations='isIn'
      validationError={DuplicationError}
      fullWidth={true}
      updateImmediately
      required
      hintText='Name of the event'
      style={tfont} onChange={this.onChangeEvent.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>TYPE</Col>
      <Col lg={9}><FormsyText
      type='textarea'
      name='eventType'
      validationError={wordsError}
      updateImmediately
      required
      hintText='Some words about the event'
      style={tfont}
      fullWidth={true} onChange={this.onChangeType.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={3} style={Label}>YEAR</Col>
      <Col lg={9}><FormsyText
      type='number'
      name='year'
      validationError={wordsError}
      updateImmediately
      hintText='year of the event'
      style={tfont}
      fullWidth={true} onChange={this.onChangeYear.bind(this)}/></Col>
      </Row>

      <Row>
      <Col lg={12} style={Label}>ADD PARTIES</Col>
      </Row>

      <Row>
      <Col lg={12} style={Label}>
      </Col>
      </Row>

      <Row>
      {allParties}
      </Row>
      <Row>
      <IconButton onClick={this.onChangePartyNumber.bind(this)}><ActionAddBox/></IconButton>
      </Row>
      </Formsy.Form>
      </Container>
      </Dialog>
      </div>
      );
  }
}
AddEvent.propTypes = {
  addEvent: React.PropTypes.func
}
