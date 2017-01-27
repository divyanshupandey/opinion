import React from 'react';
import {Container, Col, Row, Visible} from 'react-grid-system';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {lightBlue300} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';

const styles={
cardRound: {
	borderRadius: '2%',
	marginBottom: '50px',
	maxWidth: 260,
  textAlign: 'center',
  display: 'inline-block'
}
}
const roundImg = {
	borderRadius: '50%',
	minWidth: '0%',
	width: '99px',
	marginTop: '34px',
	height: '90px'
};
export default class DashboardEventShow extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {canSubmit: false,
		// 	open: false,
		// 	openDialog: false,
		// 	openDialogDocs: false ,
		// 	value: 'select',
		// 	docs: [],
		// 	concept: ''};
		}
		onLike()
		{
    let obj={
         party: this.props.party.name,
				 eventName: this.props.eventName
			 }
			this.props.onLike(obj);
		}
		render()
		{
			return(

				<Card style={styles.cardRound}>
			 <CardMedia style={{backgroundColor: this.props.party.color,minWidth: '205px',
				 height: '150px',borderRadius: '2%'}}>
			 <img src={this.props.party.partyImgURL} style={roundImg}/>
			 </CardMedia>
			 <CardTitle title={this.props.party.name} subtitle={this.props.eventName}/>
			 <CardText style={{paddingTop: 0,paddingBottom: 0}}>
			 <Row style={{paddingTop: 0,marginTop: 0}}>
			 <Col lg={6} md={6} sm={6} xs={6} >
			 <IconButton iconStyle={{color : this.props.party.likedColor}} onClick={this.onLike.bind(this)}>
			 <ActionThumbUp/>
			 </IconButton >
			 </Col>
				<Col lg={6} md={6} sm={6} xs={6}>
				<h3 style={{color: 'grey'}}>{this.props.party.likes}</h3>
				</Col>
				</Row>
			 </CardText>
			</Card>
			)
		}
	}
