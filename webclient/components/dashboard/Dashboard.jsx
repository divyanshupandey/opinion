import React from 'react';
import rd3 from 'react-d3';
import DashboardEventShow from './DashboardEventShow';
import Request from 'superagent';
import AddEvent from './AddEvent.jsx';
import AddParty from './AddParty.jsx';
import Notification from './Notification.jsx';
import {Container, Col, Row, Visible} from 'react-grid-system';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {blue300, lime800, lightGreen500,lightBlue300} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import {ScreenClassRender} from 'react-grid-system';
import jwt_decode from 'jwt-decode';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const errStyle = (screenClass) => {
	if (screenClass === 'xl') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	if (screenClass === 'lg') {return { width:700,margin: "20% auto 5%",textAlign:"left"};}
	if (screenClass === 'md') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	if (screenClass === 'sm') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	return { width:300,margin: "20% auto 5%",textAlign:"left" };
};

const paperStyle = {
  height: 296,
  width: 260,
  margin: 20,
	marginTop: 0,
  textAlign: 'center',
  display: 'inline-block'
};

const iconStyle={
	iconSize: {
		width: 30,
		height: 30,
		backgroundColor: '#a9a9a9',
		padding: 10,
		borderRadius: 60
	},
	large: {
		width: 120,
		height: 120,
		padding: 30
	},
	leftIcon:{
		position:"fixed",
		top:"45%",
		left:30,
		float:'left'
	},
	rightIcon:{
		position:"fixed",
		top:"45%",
		right:30,
		float:'right'
	},
	leftIconAvg:{
		position:"relative",
		margin:"20 0 0 30 ",
		padding:0,
		zDepth:10,
		float:'left'
	},
	rightIconAvg:{
		position:"relative",
		margin:"20 30 0 0",
		padding:0,
		zDepth:10,
		float:'right'
	}
}
const fonts={

	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2"

}
const style = {
	refresh: {
		marginTop: '200px',
		display: 'inline-block',
		position: 'relative'
	}
};


export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			domainList: [], canSubmit: false, errmsg: '', loading: 'loading', pageNum: 1,
		 user: 'admin',eventList: [],partyList: []};

     this.percentCalc = this.percentCalc.bind(this);
		this.updateEventList = this.updateEventList.bind(this);

		}
		addEvent(eventObj)
		{
			let url = `/opinion/event` ;
			let myToken = localStorage.getItem('token');
			this.setState({user : jwt_decode(myToken).user})
	    let token='Bearer '+myToken;
	    Request
	    .post(url)
			.send(eventObj)
	    .set('Authorization',token)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				let responseArr = [];
				responseArr.push(response);
				responseArr = this.percentCalc(responseArr);
				let eventList = this.state.eventList;
				eventList.push(responseArr[0]);
				this.setState({eventList : eventList})
				console.log('after adding the event'+this.state.eventList);
			});
		}
		show()
		{
			let myToken = localStorage.getItem('token');
			let userEmail = jwt_decode(myToken).email
			let url = `/opinion/`+userEmail;
			this.setState({user : jwt_decode(myToken).user})
	    let token='Bearer '+myToken;
	    Request
	    .get(url)
	    .set('Authorization',token)
			.end((err, res) => {
				if(err) {
				// res.send(err);
				this.setState({errmsg: res.body, loading: 'hide'});
			}

			else {
				// console.log('Response on show: ', JSON.parse(res.text));
				// let domainList1=this.state.domainList;
				let response = JSON.parse(res.text);
				if(response.length === 0)
				{
					this.setState({domainList: [], loading: 'hide'});
				}
				else {
					this.setState({partyList: response.partyList});

					let eList=this.percentCalc(response.eventList);

					this.setState({eventList: eList, loading: 'hide'});
										console.log(this.state.eventList);
										console.log(this.state.partyList);
				}
			}
		});
		}

		percentCalc(eventList)
		{
			console.log('percentCalc '+eventList)
			   eventList.map((item,i) =>{
					 let pieData = [];
					 let total = 0;
					item.parties.map((party,j) =>{
						console.log('party likes',party.likes)
						total = total + party.likes;
					});
				item.parties.map((party,k) =>{
					let value = 0;
					if(total === 0)
					{
          value=Math.floor( 100/(item.parties.length) );
					}
					else {
					 value = Math.floor((party.likes/total) * 100);
					}
					if(value !==0)
					{
					pieData.push({label: party.name, value: value})
				  }
					this.state.partyList.map((party1,l) =>{

					 if(party.name===party1.name)
						{
							party.color=party1.color;
							party.partyImgURL=party1.partyImgURL;
						}
					if(item.liked === party.name)
					{
				   	party.likedColor= lightBlue300;
					}
					else {
			   		console.log(party.name);
						console.log(party.likes);
						console.log(party.likedColor);
						party.likedColor = 'grey';
					}
					});

				});
				item.pieData = pieData;
			});
			return eventList;
		}

		colourChange(concepts,intents,docs)
		{
			let conceptColor=blue300;
    	let intentColor=blue300;
			let docsColor=blue300;
			if(concepts < 11)
			{
				conceptColor= blue300;
			}
			else if(concepts < 50)
			{
				conceptColor= lime800;
			}
			else {
				conceptColor= lightGreen500;
			}

			if(intents <2)
			{
				intentColor= blue300;
			}
			else if(intents < 11)
			{
				intentColor= lime800;
			}
			else {
				intentColor= lightGreen500;
			}


			if(docs <10)
			{
				docsColor= blue300;
			}
			else if(docs < 20)
			{
        docsColor= lime800;
			}
			else {
				docsColor= lightGreen500;
			}
			return ([conceptColor,intentColor,docsColor]);
		}

		componentDidMount()
		{
			this.show();
		}

		onLike(obj)
		{
			let response1=this.state.eventList;
			response1.map((item,i) =>{
				if(item.eventName===obj.eventName){
				item.parties.map((party,i) =>{

					if(obj.party===party.name)
					{
						if(party.likedColor !== lightBlue300)
						{
							item.liked=obj.party;
							party['likedColor']= lightBlue300;
							party.likes = party.likes + 1;
						}
					}
					else {
						if(party.likedColor === lightBlue300)
						{
						party['likedColor'] = 'grey';
						party.likes = party.likes -1 ;
					}
					}
				});
			}
			});
			this.setState({eventList: response1});
			let url = `/opinion/like` ;
			let myToken = localStorage.getItem('token');
		  let userEmail = jwt_decode(myToken).email;
			obj.email = userEmail;
			this.setState({user : jwt_decode(myToken).user})
			let token='Bearer '+myToken;
			Request
			.post(url)
			.send(obj)
			.set('Authorization',token)
			.end((err, res) => {
				let response = this.state.eventList;
				let response1 = JSON.parse(res.text);
        response = this.updateEventList(response,response1);
				response = this.percentCalc(response);
				this.setState({eventList : response});
				console.log('after adding the event'+this.state.eventList);
			});
		}

		updateEventList(response,response1)
		{
			response.map((item,i) =>{
				response1.map((item1,i) =>{
					if(item.eventName === item1.eventName)
					{
						 response.liked = response1.liked
						 item.parties.map((party,i) =>{
							 item1.parties.map((party1,i) =>{
								 if(party.name === party1.name)
								 {
										party.likes = party1.likes;
								 }
							 })
						 })
					}
				})
			})
			return response;
		}

		onPageClick(e)
		{
			let page = this.state.pageNum;
			if(e.currentTarget.dataset.id === 'prev')
			{
				page -= 1;
				this.setState({pageNum: page});
			}
			else
			{
				page += 1;
				this.setState({pageNum: page});
			}
		}


		freshlyIndex(domain)
		{
			// console.log('inside Index refresh '+domain);
			let url = `/domain/` + domain + `/index`;
			Request
			.post(url)
			.send(domain)
			.end((err, res) => {
				if(err) {
					this.setState({errmsg: res.body});
				}
			});
		}

		updateData(obj)
		{
			console.log('in update data',obj);
			let response = this.state.eventList;
			let response1 = JSON.parse(JSON.stringify(obj.data.eventList));
			console.log(response1);
			response = this.updateEventList(response,response1);
			response = this.percentCalc(response);
			this.setState({eventList : response});
			console.log('after adding the event'+this.state.eventList);
		}

		addDocument(doc)
		{
			let url = `/domain/`+doc.domainName+`/crawl` ;
			Request
			.post(url)
			.send(doc.docs)
			.end((err, res) => {
				if(err) {
					this.setState({errmsg: res.body});
				}
				console.log(res);
			});
		}

		addParty(partyObj)
		{
			let url = `/opinion/party` ;
			let myToken = localStorage.getItem('token');
			this.setState({user : jwt_decode(myToken).user})
	    let token='Bearer '+myToken;
	    Request
	    .post(url)
			.send(partyObj)
	    .set('Authorization',token)
			.end((err, res) => {
				let response = JSON.parse(res.text);
				let partyList = this.state.partyList;
			  console.log('before adding the party '+this.state.partyList);
				partyList.push(response);
				this.setState({partyList : partyList})
				console.log('after adding the party '+this.state.partyList);
			});
		}

		logout()
      {
			localStorage.removeItem('token');
			this.props.logout();
			}
		render() {
			let prevFlag=false;
			let nextFlag=false;
			const smallNav=()=>{
				return(<Row md={12} sm={12} xs={12} style={{marginBotton:20}}>

					<Col md={4} sm={4} xs={4} style={{float:"left"}}>
					<IconButton style={iconStyle.leftIconAvg} label="prev" disabled={prevFlag} data-id="prev"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowBack style={iconStyle.large} color={'white'} />
					</IconButton>
					</Col>
					<Col md={4} sm={4} xs={4} style={{float:"right"}}>
					<IconButton style={iconStyle.rightIconAvg} label="next" disabled={nextFlag} data-id="next"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowForward style={iconStyle.large} color={'white'} />
					</IconButton>
					</Col>

					</Row>)
			}

			let list=[];
			let dList=this.state.domainList;
			if(dList.length>0)
			{
				let pages = Math.ceil(dList.length/6);
				let pageNow = this.state.pageNum;
				if(pages === pageNow)
				{
					nextFlag = true;
				}
				if(this.state.pageNum === 1)
				{
					prevFlag = true;
				}
				if(pages === 1 || pages === pageNow)
				{
					list=[];
					for(let i=6*(pageNow-1);i < this.state.domainList.length; i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
				else
				{
					list=[];
					let foo=6*(pageNow-1);
					for(let i=foo;i<(foo+6);i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
			}
			const show = [], eList = [], pList = [];
			{this.state.eventList.map((item,i) =>{
				eList.push(item.eventName);
			})}

			{this.state.partyList.map((item,i) =>{
				pList.push(item.name);
			})}

			if(this.state.user==='admin')
			{
				show.push(<Row style={{marginBottom : 15 , marginLeft : 0, marginRight : 0}}>
									<Col lg={6} md={6} sm={6}>
									<AddParty
									addParty={this.addParty.bind(this)}
                  partyList={pList}
									style={{color: "#1976d2"}}/>
									</Col>
									<Col lg={6} md={6} sm={6}>
									<AddEvent partyList={pList} eventList={eList}
									addEvent={this.addEvent.bind(this)} style={{color: "#1976d2"}}/>
									</Col>
									</Row>);
			}
			else {
				show.push(<Row style={{marginBottom : 15 , marginLeft : 0, marginRight : 0}}>
					<h1>Thanks for your opinion</h1></Row>);
			}
			const allEvents=[];

			{this.state.eventList.map((item,i) =>{
				allEvents.push(
					<Row style={{marginLeft : 0, marginRight : 0}}>
					<Col lg={3} md={3} sm={12} xs={12} key={i}>
          <Paper style={paperStyle}>
					<h3>{item.eventName}</h3>
			    <h3>{item.eventType} - {item.year}</h3>
					<rd3.PieChart
		  data={item.pieData}
		  width={250}
		  height={200}
		  radius={50}
		  innerRadius={20}
		/>
          </Paper>
					</Col>
					{item.parties.map((item1,i) =>{
						return (
							<Col lg={2} md={2} sm={12} xs={12} key={i}>
							<DashboardEventShow party={item1} eventName={item.eventName}
							onLike={this.onLike.bind(this)}/>

							</Col>)})}
			</Row>)})
		}
			return (
				<div style={fonts}>
				{
					this.state.loading==="loading"?<RefreshIndicator
					size={70}
					left={10}
					top={0}
					status={this.state.loading}
					style={style.refresh}
					/>:<div>
					{
						this.state.eventList.length!==0?<div>
						<br/>
						<Row  style={{marginLeft : 0, marginRight : 0}}>
						<Col lg={11} md={11} sm={12} xs={12}><h1>OUR POLITICAL EVENTS</h1></Col>
						<Col lg={1} md={1} sm={12} xs={12} >
					  <Link to='/'>
					  <FlatButton label="Logout" secondary={true} style={{float : 'right', marginTop : 10}}
						onClick={this .logout.bind(this)}
						/>
						</Link>
						</Col>
						</Row>
						{allEvents}
						{show}
						</div>:
						<ScreenClassRender style={errStyle}>
						<div style={errStyle} >
						<h1 >It seems there are no events</h1>
												{show}
						</div>
						</ScreenClassRender>
					}

					</div>
				}
				<Notification updateData={this.updateData.bind(this)} />
				</div>

				);
		}
	}
