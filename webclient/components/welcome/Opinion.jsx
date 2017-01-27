
import React from 'react';
import {Link} from 'react-router';
import {ScreenClassRender} from 'react-grid-system';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ContentCreate from 'material-ui/svg-icons/content/create';
import Formsy from 'formsy-react';
import FlatButton from 'material-ui/FlatButton';
import {Container, Row, Col} from 'react-grid-system';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import Request from 'superagent';
import Dialog from 'material-ui/Dialog';
import Dashboard from './../dashboard';
const styles = {
  msgStyle: {
    marginTop : 7,
    marginLeft : '20%',
    color : 'grey'
  },
  headline: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};
const imgStyle = (screenClass) => {
  if (screenClass === 'xl') {return { width: '350px', height:'300px' };}
  if (screenClass === 'lg') {return { width: '320px', height:'280px' };}
  if (screenClass === 'md') {return { width: '350px', height:'auto' };}
  if (screenClass === 'sm') {return { width: '320px', height:'auto'};}
  return { width: '280px', height: '280'};
};
const divStyle = (screenClass) => {
  if (screenClass === 'xl') {return { width: '350px',margin:"2% auto auto" };}
  if (screenClass === 'lg') {return { width: '320px',margin:"2% auto auto"};}
  if (screenClass === 'md') {return { width: '350px',margin:"2% auto auto" };}
  if (screenClass === 'sm') {return { width: '320px',margin:"2% auto auto" };}
  return { width: '280px',margin:"2% auto auto"};

};

const tfont={
  fontSize:'15px'
}

const customContentStyle = {
  width: '50%',
  height: '30%',
  maxWidth: 'none'
};

const Label={paddingLeft:'15px',paddingTop:'20px',fontWeight:'bold',color:'grey'};


const errorMessages= {
  passwordError: 'Invalid password',
  emailError: 'email id not found'
} ;

export default class Opinion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    slideIndex : 0,
    canSubmit : false,
    canSignUP : false,
    errMsg : '',
    emails : [],
    otp : '# this is opinion otp by pandey #',
    email : '',
    password : '',
    name : '',
    errMsgSignUP : '',
    open : false,
    otpSubmit : false,
    token : ''
};
this.handleSubmit = this.handleSubmit.bind(this);
this.handleOTPSubmit = this.handleOTPSubmit.bind(this);
this.handleSubmitSignUP = this.handleSubmitSignUP.bind(this);
this.enableButton = this.enableButton.bind(this);
this.disableButton = this.disableButton.bind(this);
this.enableOTPButton = this.enableOTPButton.bind(this);
this.disableOTPButton = this.disableOTPButton.bind(this);
this.enableSignUPButton = this.enableSignUPButton.bind(this);
this.disableSignUPButton = this.disableSignUPButton.bind(this);
  }

  handleSubmit()
  {
    let url =`/opinion/login`;
    Request
    .post(url)
    .send({email : this.state.email, password: this.state.password})
    .end((err, res) => {
      if(err) {
    this.setState({errMsg: 'Could not login !'});
  }

  else {
    let response=JSON.parse(res.text);
    if(response.msg==='success')
    {
    localStorage.setItem('token' , response.token);
    this.setState({errMsg: 'varified',token :response.token});
   }
   else {
   this.setState({errMsg: 'Invalid password !'});
   }
  }
});
  }

  handleSubmitSignUP()
  {
    let d = new Date();
    let t = d.getTime();
    let s=t.toString()
    t = Number(s.substring(7,13));
    let url =`/opinion/otp`;

    Request
    .post(url)
    .send({otp : t,email : this.state.email})
    .end((err, res) => {
      if(err) {
    //res.send(err);
    this.setState({errMsgSignUP: res.body});
  }

  else {
    console.log('Response on show in child: ', JSON.parse(res.text));
    //let domainList1=this.state.domainList;
    let response=JSON.parse(res.text);
    if(response.err)
    {
    this.setState({errMsgSignUP: 'Wrong Email Address'});
    }
    else {
    this.setState({otp : t,open : true });
    }
  }
});

  }

  handleOTPSubmit()
  {
    let url =`/opinion/signup`;
    Request
    .post(url)
    .send({email : this.state.email, name: this.state.name,
      password: this.state.password})
    .end((err, res) => {
      if(err) {
    this.setState({errMsgSignUP: 'Could not sign up !'});
  }

  else {
    let response=JSON.parse(res.text);
    localStorage.setItem('token' , response.token);
    this.setState({errMsgSignUP: 'OTP varified',token :response.token});

  }
});
  }

  emailFetch()
  {
    let url =`/opinion/`;
    Request
    .get(url)
    .end((err, res) => {
      if(err) {
    this.setState({errMsg: res.body});
  }

  else {
    console.log('Response on show in emailFetch: ', JSON.parse(res.text));
    let response=JSON.parse(res.text);
    if(response.length===0)
    {
      this.setState({emails : []});
    }
    else {
      let emails = [];
      	response.map((item,i) =>{
          emails.push(item.email);
        })
      this.setState({emails : emails});
    }
  }
  });
  }

  componentDidMount()
  {
    this.emailFetch();
  }

  handleChange = (value) => {
  this.setState({
    slideIndex: value,
  });
};

onChangeName(e)
{
  this.setState({name:e.target.value})
  console.log(this.state.name);
}

onChangeEmail(e)
{
  this.setState({email:e.target.value})
  console.log(this.state.email);
}

onChangePassword(e)
{
  this.setState({password:e.target.value})
  console.log(this.state.password);
}

enableButton() {
  this.setState({ canSubmit : true});
}
disableButton() {
  this.setState({ canSubmit : false});
}

enableOTPButton() {
  this.setState({ otpSubmit : true});
}
disableOTPButton() {
  this.setState({ otpSubmit : false});
}

enableSignUPButton() {
  this.setState({ canSignUP : true});
}
disableSignUPButton() {
  this.setState({ canSignUP : false});
}

handleClose = () => {
  this.setState({open: false});
};

logout()
  {
this.setState({errMsgSignUP : '',errMsg: ''});
  }

  render()
  {
    const otpActions = [
      <FlatButton
      label={'Cancel'} secondary={true} type='submit'
      onTouchTap={this.handleClose} style={{marginLeft : -5 , paddingTop : 5}}/>,
    <FlatButton
    label={'Submit'} primary={true} type='submit' disabled={!this.state.otpSubmit}
    onClick={this.handleOTPSubmit} onTouchTap={this.handleClose}
   style={{marginLeft : -5 , paddingTop : 5}}/>
    ];
    const actions = [
    <FlatButton
    label={'LOGIN'} primary={true} type='submit' disabled={!this.state.canSubmit}
    onClick={this.handleSubmit} style={{marginLeft : -5 , paddingTop : 5}}/>
    ];
    const signUP = [
    <FlatButton
    label={'SIGNUP'} primary={true} type='submit' disabled={!this.state.canSignUP}
     style={{marginLeft : -5 , paddingTop : 5}}/>
    ];
    let {passwordError, emailError} = errorMessages;
    let otpValidation = 'equals:'+this.state.otp
    let emailAr=this.state.emails;
    let emailArr=[];
    emailAr.forEach(function(email){
      emailArr.push(email);
    })

    console.log('The email arr'+emailArr);
    Formsy.addValidationRule('isIn', function (values, value) {
      return emailArr.indexOf(value) >= 0;
    });

    Formsy.addValidationRule('isNotIn', function (values, value) {
      return emailArr.indexOf(value) < 0;
    });
    if(this.state.errMsgSignUP==='OTP varified' || this.state.errMsg==='varified' )
    {
      return(<Dashboard logout={this.logout.bind(this)}/>);
    }

    return(
     <ScreenClassRender style={divStyle}>
     <div>
     <ScreenClassRender style={imgStyle}>
     <img src='./../assets/images/opinion.png' />
     </ScreenClassRender>
     <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >

          <Tab
          icon={<ActionLock />}
          label="LOGIN"
           value={0}
          />
          <Tab
           icon={<ContentCreate />}
           label="SIGNUP"
            value={1}
            />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
          <Formsy.Form
          ref='form'
          style={{'padding': '15px 15px'}}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          >
          <Row>
          <Col lg={3} style={Label}>Email</Col>
          <Col lg={9}>
          <FormsyText
          type='text'
          name='email'
          validations='isIn'
          validationError={emailError}
          fullWidth={true}
          updateImmediately
          required
          hintText='Enter Email'
          style={tfont} onChange={this.onChangeEmail.bind(this)}/></Col>
          </Row>

          <Row>
          <Col lg={3} style={Label}>Password</Col>
          <Col lg={9}><FormsyText
          type='password'
          name='description'
        //  validationError={passwordError}
          updateImmediately
          required
          hintText='Enter Password ..'
          style={tfont}
          fullWidth={true} onChange={this.onChangePassword.bind(this)}/></Col>
          </Row>
          <Row>
          {actions}
          </Row>
          <Row>
          <h3 style={styles.msgStyle}>{this.state.errMsg}</h3>
          </Row>
          </Formsy.Form>
          </div>
          <div style={styles.slide}>
          <Formsy.Form
          ref='form'
          style={{'padding': '0px 15px'}}
          onValid={this.enableSignUPButton}
          onInvalid={this.disableSignUPButton}
          onValidSubmit={this.handleSubmitSignUP}
          >
          <Row>
          <Col lg={3} style={Label}>Name</Col>
          <Col lg={9}>
          <FormsyText
          type='text'
          name='name'
          validations="minLength:2"
          validationError="Min length can be two"
          fullWidth={true}
          updateImmediately
          required
          hintText='Enter Name'
          style={tfont} onChange={this.onChangeName.bind(this)}/></Col>
          </Row>

          <Row>
          <Col lg={3} style={Label}>Email</Col>
          <Col lg={9}>
          <FormsyText
          type='text'
          name='email'
          validations={{
            isEmail: true,
            isNotIn: true
          }}
          validationErrors={{
            isEmail: 'You have to type valid email',
            isNotIn: 'email already in use'
          }}
          fullWidth={true}
          updateImmediately
          required
          hintText='Enter Email'
          style={tfont} onChange={this.onChangeEmail.bind(this)}/></Col>
          </Row>

          <Row>
          <Col lg={3} style={Label}>Password</Col>
          <Col lg={9}><FormsyText
          type='password'
          name='password'
        //  validationError={passwordError}
          updateImmediately
          required
          validations="minLength:6"
          validationError='password length should be more than 5'
          hintText='Enter Password ..'
          style={tfont}
          fullWidth={true} onChange={this.onChangePassword.bind(this)}/></Col>
          </Row>
          <Row>
          <Col lg={3} style={Label}>Confirm</Col>
          <Col lg={9}>
          <FormsyText
          type='password'
          name='Confirm'
          validations="equalsField:password"
          validationError='does not match password'
          fullWidth={true}
          updateImmediately
          required
          hintText='Confirm Password'
          style={tfont} /></Col>
          </Row>
          <Row>
          {signUP}
          </Row>
          <Row>
          <h3 style={styles.msgStyle}>{this.state.errMsgSignUP}</h3>
          </Row>
          </Formsy.Form>
          <Dialog
          title="Enter OTP"
          actions={otpActions}
          modal={true}
          contentStyle={customContentStyle}
          autoScrollBodyContent={true}
          open={this.state.open}
          >
          <Formsy.Form
          ref="form"
          style={{"padding": "50px 24px"}}
          onValid={this.enableOTPButton}
          onInvalid={this.disableOTPButton}
          onValidSubmit={this.handleOTPSubmit.bind(this)}
          >
          <Row>
          <Col lg={3} style={Label}>OTP</Col>
          <Col lg={9}>
          <FormsyText
          type="text"
          name="otp"
          validations={otpValidation}
          validationError='Invalid OTP'
          updateImmediately
          required
          hintText="Enter OTP"
          style={tfont} /></Col>
          </Row>
          </Formsy.Form>
          </Dialog>
          </div>
        </SwipeableViews>
       </div>
     </ScreenClassRender >
     );
  }
}
