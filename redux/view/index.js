import React from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import { getmarketRationale,getmarketTokenspread,getmarketidearanking,getmarketSentimentreport,getmarketengagementreport, exportCsv} from '../../structural/actions/markets';
import LoadImage from '../../components/LoadImage'
import {images} from "../../components/Helper"
import {BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts'
import asyncComponent from '../../components/AsyncComponent'
import Modal from 'react-responsive-modal'
import _ from 'lodash'

const Collapse  = asyncComponent(() =>  import("../../components/Collapse"))

class Reports extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
			viewMode:1, //1. ranking, 2.rationale, 3.token, 4.sentiments, 5.engagement
			rankings:{
				ideas:[],
				summary:{}
			},
			rationale:{
				ideas:[]
			},
			token:{
				ideas:[]
			},
			sentiments:{
				ideas:[],
				summary:{},
			},
			engagement:{
				participants:[],
				summary:{},
			},
			market_id:null,
			team_id:null,
			market:{},
			alertMessage:null,
			marketStatus:null,
			showFilter:false,
			profileRecords:[],
			canFilter:false,
			filter:_.cloneDeep([]),
		}
		this.formatedFilter = []
		this.filledFilter = []
    this._renderMarketIdeaRanking = this._renderMarketIdeaRanking.bind(this)
    this._valueFilter = this._valueFilter.bind(this)
    this._getReportType = this._getReportType.bind(this)
    this._getReportsByType = this._getReportsByType.bind(this)
    this._renderMarketRationale = this._renderMarketRationale.bind(this)
    this._renderTokenSpread = this._renderTokenSpread.bind(this)
    this._negativeFilter = this._negativeFilter.bind(this)
    this._renderMarketSentiments = this._renderMarketSentiments.bind(this)
    this._renderEngagements = this._renderEngagements.bind(this)
    this._fixValueFilter = this._fixValueFilter.bind(this)
    this._adValueFilter = this._adValueFilter.bind(this)
    this._onDownloadParticipantsClick = this._onDownloadParticipantsClick.bind(this)
		this._stringTruncate = this._stringTruncate.bind(this)
		this.submitFilter = this.submitFilter.bind(this)
		this.fillArray = this.fillArray.bind(this)

    this.modelConfig={
      showCloseIcon:false,
      closeOnEsc:false,
      closeOnOverlayClick:false,
      classNames:{
        modal:'participant-profile-modal'
      }
    }
  }
	fillArray(profileRecordsLength){
		let fillIndexArray = []
			for (let length = 0 ; length <= profileRecordsLength; length++) {
				fillIndexArray[length] =  []
			}
			return fillIndexArray
	}
  componentDidMount() {
  		if(this.props.location.state && this.props.location.state.market){
  			let profileRecords = []
  			let canFilter = false
			let team_id = localStorage.getItem('current_team')
			let market_id = this.props.location.state.market.id
			let market = this.props.location.state.market
			if (market.participant_profile && !_.isEmpty(market.participant_profile)) {
				profileRecords = market.participant_profile.questions
				canFilter = true
			}
			let marketStatus = null;
	    	if(market.finished) {
				marketStatus  = 'ENDED';
			} else if (!market.started) {
				marketStatus  = 'BUILDING';
			} else if (market.started && !market.finished) {						
				marketStatus  = 'LIVE';
			}
			this.setState({
				market_id,
				team_id,
				market,
				marketStatus,
				profileRecords,
				canFilter,
				filter: _.cloneDeep(this.fillArray(profileRecords.length))
			})
			this.formatedFilter = []
			this.filledFilter = _.cloneDeep(this.fillArray(profileRecords.length))
			this.props.actions.getIdearanking({market_id, filter:[], images: images})

		}else{
			this.props.history.goBack()
		}
  	}
  componentDidUpdate(prevprops){
  	if (this.props.reports !== prevprops.reports) {
  		const {viewMode} = this.state
  	    	if (viewMode === 1) {
  	    		this.setState({
  	    			rankings: this.props.reports
  	    		});
  	    	}
  	    	if (viewMode === 2) {
  	    		this.setState({
  	    			rationale: this.props.reports
  	    		});
  	    	}
  	    	if (viewMode === 3) {
  	    		this.setState({
  	    			token: this.props.reports
  	    		});
  	    	}
  	    	if (viewMode === 4) {
  	    		this.setState({
  	    			sentiments: this.props.reports
  	    		});
  	    	}
  	    	if (viewMode === 5) {
  	    		this.setState({
  	    			engagement: this.props.reports
  	    		});
  	    	}
  	    }
  }

  closeFilter = () =>{
  	this.setState({
			showFilter:false,
			filter: _.cloneDeep(this.filledFilter)
  	})
  }

  openFilter = () =>{
  	this.setState({showFilter:true})
  }


  onResetSelect = () =>{
		const {profileRecords} = this.state
  	this.setState({
			filter:_.clone(this.fillArray(profileRecords.length)),
		})
	}

	

  submitFilter = () =>{
		const {viewMode, filter, profileRecords} = this.state	
		this.setState((prevState) => ({
			showFilter: false,
		}))


		this.filledFilter = _.cloneDeep(filter)
		let formatFilter = filter.map((value,index) => {
			return {
				index: index,
				values: value,
				type: profileRecords.filter((type, ind) => {
					if(index === ind) return type
				}).map(data => data.question_type)[0]
			}
		}) 	
	

		let filtered = formatFilter.filter(data => data.values.length > 0)
		this.formatedFilter = filtered
		this._getReportsByType(viewMode)

  }

  _stringTruncate = (str, length = str.length / 2)=>{
	  let dots = str.length > length ? '...' : '';
	  return str.substring(0, length)+dots;
	};

  _getReportType = (type)=>{
		this.setState({
			viewMode:type 
		});
	this._getReportsByType(type);
  }
  _getReportsByType = (type)=>{
		const {market_id} = this.state
		let filter = this.formatedFilter
		

		if (type === 1) {
			// if (!this.state.rankings.ideas.length > 0) {
				this.props.actions.getIdearanking({market_id, filter, images: images})
			// }
		}
		if (type === 2){
			// if (!this.state.rationale.ideas.length >0) {
				this.props.actions.getRationale({market_id, filter})
			// }
		}
		if (type === 3){
			// if (!this.state.token.ideas.length > 0) {
				this.props.actions.getToken({market_id, filter})
			// }
		}
		if (type === 4){
			// if (!this.state.sentiments.ideas.length > 0) {
				this.props.actions.getSentiments({market_id, filter})
			// }
		}
		if (type === 5){
			// if (!this.state.engagement.participants.length >0) {
				this.props.actions.getEngagements({market_id, filter})
			// }
		}
	}
	 _valueFilter = (value)=>{
		if (value && value!== null && value!== '') {
			if (!Number.isInteger(value)) {
				return parseFloat(Number(value).toFixed(2));
			}
			return value;
		}else{
			return '-';
		}
	}

	_negativeFilter = (value)=>{
		if (value && value!== null && value!== '') {
			return -Math.abs(value);
		}else{
			return 0;
		}
	}
	_fixValueFilter = (value)=>{
		if (value && value!== null && value!== '') {
			if (!Number.isInteger(value)) {

				return parseFloat(Number(value).toFixed(0));
			}
			return value;
		}else{
			return '0';
		}
	}

	_adValueFilter = (value)=>{
		if (value && value!== null && value!== '') {
			if (!Number.isInteger(value)) {

				return parseFloat(Number(value).toFixed(0));
			}
			return value;
		}else{
			return '-';
		}
	}

	_onDownloadParticipantsClick = (e) => {
		this.props.actions.exportRecord(this.state.market_id)
	}

	optionSelected = (value,name,checked)=>{

		let {filter} = this.state
		// if (!Array.isArray(filter[name])) {
		// 	filter[name] =  new Array();
		// }
		if (checked) {
			filter[name].push(value)
		}else{
			let index = filter[name].findIndex(obj => obj === value)
			filter[name].splice(index,1)
		}																																					
				this.setState({
					filter,
				})
				
	}

  render() {
		const {market,marketStatus, showFilter, profileRecords, canFilter, filter} = this.state
		let checkFilterFlag = filter.filter(data => data.length > 0)
    return(
      <div className="main-r-content-div reports">
		  <div className="container">
		    <div className="markets-div">
		      <div>
		        <h2 className="page-title d-inline-block">Reports : <span>{market.name} ({marketStatus})</span></h2>
		        <div className="text-right">
		          {canFilter && <button type="button" className={`${checkFilterFlag.length > 0 ? 'btn red' : 'btn blue' }`} onClick={this.openFilter}><i className={`${checkFilterFlag.length > 0 ? ' fa fa-check-circle-o' : 'fa fa-filter' }`} /> Filter </button>}      
		          <button type="button" className="btn blue ml-5" onClick={this._onDownloadParticipantsClick}><i className="fa fa-download" /> Export Report </button>
		        </div>
		      </div>
		      <div className="tabbable-line market-list">
		        <ul className="nav nav-tabs">
		          <li onClick={(e) => { this._getReportType(1) }} className={this.state.viewMode === 1 ? 'active' : ''}>
		            <a href="javascript:;">  Idea Ranking</a>
		          </li>
		          <li onClick={(e) => { this._getReportType(2) }} className={this.state.viewMode === 2 ? 'active' : ''}>
		            <a href="javascript:;">  Rationale</a>
		          </li>
		          <li onClick={(e) => { this._getReportType(3) }} className={this.state.viewMode === 3 ? 'active' : ''}>
		            <a href="javascript:;">  Token Spread </a>
		          </li>
		          <li onClick={(e) => { this._getReportType(4) }} className={this.state.viewMode === 4 ? 'active' : ''}>
		            <a href="javascript:;">  Market Sentiment</a>
		          </li>
		          <li onClick={(e) => { this._getReportType(5) }} className={this.state.viewMode === 5 ? 'active' : ''}>
		            <a href="javascript:;">  Engagement</a>
		          </li>
				  <li onClick={(e) => { this._getReportType(6) }} className={this.state.viewMode === 6 ? 'active' : ''}>
		            <a href="javascript:;">  Turf Analysis</a>
		          </li>
		        </ul>
		        <div className="tab-content">		          
		           {
								this.state.viewMode === 1 && this._renderMarketIdeaRanking()						
				   }
				   {
								this.state.viewMode === 2 && this._renderMarketRationale()						
				   }
				   {
								this.state.viewMode === 3 && this._renderTokenSpread()						
				   }
				   {
								this.state.viewMode === 4 && this._renderMarketSentiments()						
				   }
				   {
								this.state.viewMode === 5 && this._renderEngagements()
				   }
				   {
								this.state.viewMode === 6 && this._renderTurfAnalysis()
				   }
		        </div>
		      </div>
		    </div>
		     <Modal open={showFilter} onClose={this.closeFilter} center {...this.modelConfig}>
		        <div className="participant-profile-header model-header">
		          <b>  Filter </b>
		          <span className="pull-right"><a href="javascript:;" onClick={this.closeFilter}> <i className="fa fa-times-circle"/> </a></span>
		        </div>
		        <div className="modal-body">
		        <div className="panel-group accordion" id="accordion3">
		        	{
								profileRecords.map((each,qkey)=>

		        				<Collapse title={`${each.prompt}`} reportFilteredTitle={checkFilterFlag.length > 0 && filter[qkey].length > 0 ? 'text-blue' : null} key={qkey}>
			  					<ul className="list-unstyled">
								        {each.answers.map((single, skey)=>											
												<div className="form-group mNone custom-checkbox" key={skey}>
									                <label className="c-checkbox01">
									                  <input
									                      id={skey}
									                      type='checkbox'
									                      onChange={({target:{value,name,checked}})=>{this.optionSelected(value,name,checked)}}
									                      name={qkey}
									                      checked={(filter[qkey] || []).indexOf(single) !== -1}
									                      value={single}
									                    />
									                    {single}
									                  <span className="checkmark" />
									                </label>
								              	</div>
										)}
								</ul>
		  					</Collapse>
		        		)
		        	}
  					</div>
		        </div>
		        <div className="text-left modal-footer">
		          	<button className="btn blue" onClick={this.submitFilter}> <i className="fa fa-check-circle-o"/> Submit</button>
		            <button className="btn blue" onClick={this.onResetSelect}> <i className="fa fa-refresh"/> Reset</button>
		        </div>
		      </Modal>
		  </div>
		</div>


      )
  }

  _renderMarketIdeaRanking = ()=>{
  	const {loading} = this.props
  	return(
	  		<div className="tab-pane active" id="idea-ranking">
			  <div className="idea-ranking-list">
			    <ul className="outer-list list-unstyled">
			    {
			    	this.state.rankings.ideas.length > 0 ?
			    	this.state.rankings.ideas.map((ranking, key)=>{
			    		const data =[
						    {value:ranking.bucket_neg3? ranking.bucket_neg3 :0, fill: '#ff6a33'},
						    {value:ranking.bucket_neg2 ? ranking.bucket_neg2 :0, fill: '#ff6a33'},
						    {fill:'#ff6a33', value:ranking.bucket_neg1 ? ranking.bucket_neg1 :0},						
							{value:ranking.bucket_pos1 ? ranking.bucket_pos1 :0, fill:'#2b78e4'},
							{value:ranking.bucket_pos2 ? ranking.bucket_pos2 :0, fill:'#2b78e4'},
							{value:ranking.bucket_pos3 ? ranking.bucket_pos3 :0, fill:'#2b78e4'}
						]

			    		return (<li key={key}>
			    						        <ul className="inner-list list-unstyled">
			    						          <li className="index">{ranking.ranking}</li>
			    						          <li className="img-section">
			    						            <LoadImage className="img" type='idea' classType='' id={ranking.id} imageUrl = {ranking.thumbnails ? ranking.thumbnails[0] : 'default'} thumbnail={ranking.thumbnail} isdiv={true}></LoadImage>
			    						            <div className="text">{ranking.name}</div>
			    						          </li>
			    						          <li className="score-details">
			    						            <div className="score">Token Distribution</div>
			    						            <div className="cart">
			    						            <BarChart width={300} height={150} data={data} style={{margin:'auto'}} barGap={0} className="bar-chart-tokens">
												         <Bar dataKey='value' fill='color' minPointSize={1}/>
												    </BarChart>
			    						            </div>
			    						            <div className="counters">
			    						              <span className="margin-r10 parent-span">
			    						                <span className="left label label-info d-inline-block">{this._valueFilter(ranking.neg_participants)}</span><span className="center label label-default d-inline-block"><i className="fa fa-user" /></span><span className="right label label-info d-inline-block">{this._valueFilter(ranking.pos_participants)}</span>
			    						              </span>
			    						              <span className="parent-span">
			    						                <span className="left label label-info d-inline-block">{this._valueFilter(ranking.neg_tokens)}</span><span className="center label label-default d-inline-block"><i className="fa fa-circle" /></span><span className="right label label-info d-inline-block">{this._valueFilter(ranking.pos_tokens)}</span>
			    						              </span>
			    						            </div>
			    						          </li>
			    						          <li className="counters-section">
			    						            <div className={'img count ' + (ranking.score < 0 ? 'octangle-red' : ranking.score > 0 ? 'octangle-blue' : 'octangle-grey')}>
			    						              <span>{this._valueFilter(ranking.score)}</span>
			    						            </div>
													 {(ranking.passion_score || ranking.passion_score === 0)  && 
													 <div className={'passion-score '+(ranking.score < 0 ? 'passion-text-red' : ranking.score > 0 ? 'text-blue' : 'text-grey')}>
														 <div className={'passion-score-img '+(ranking.score < 0 ? 'passion-img-red' : ranking.score > 0 ? 'passion-img-blue' : 'text-grey')}></div>
			    						              <span>{ranking.passion_score === 0 ? '0%' : ' '+this._valueFilter(ranking.passion_score)+"%"}</span>
													</div>
													} 
			    						          </li>
			    						        </ul>
			    						      </li>)
	  				}) :  		
					<li className="text-center">
					<b>{loading ? 'Loading Idea Ranking...' : 'No Idea Ranking Available'}</b>
					</li>

			    }

			    </ul>
			  </div>
			</div>
		)
  }

  _renderMarketRationale = () =>{
  	const {loading} = this.props
  	return(
  		<div className="tab-pane active" id="rationale">
  		<div className="panel-group accordion" id="accordion3">
  		{
  			this.state.rationale.ideas.length > 0 ?
  			this.state.rationale.ideas.map((rational, key)=>{
  				return(
  						
  					<Collapse title={rational.name} key={key}>
  					<ul className="outer-list list-unstyled">
					        {rational.positions.map((position,ky)=>{
					        	return(
					        		<li key={ky}>
									  <ul className="inner-list list-unstyled">
									    <li className="email">
									      {position.tracking_id}
									    </li>
									    <li className="desc">
									      {position.rationale ? position.rationale : '-'}
									    </li>
									    <li className="display-count">
									      <div className={'img count '+ (position.net_tokens < 0 ? 'octangle-red' : position.net_tokens > 0 ? 'octangle-blue' : 'octangle-grey')}>
									        <span>{this._valueFilter(position.net_tokens)}</span>
									      </div>
									    </li>
									  </ul>
									</li>)
					        })}
					      </ul>
  					</Collapse>
  					
  			)
  			})
  			:
			
				<div className="text-center">
				<b>{loading ? 'Loading Rationale...' :'No Rationale Available'}</b>
				</div>
				
		
  		}
  		</div>
  		</div>
  		)

	}
	_renderTokenSpread = () =>{
		const {loading} = this.props
		if (this.state.token.ideas.length > 0) {
			let data = [];
			let graph_height = null;
			let idea = this.state.token.ideas;
			idea.map((idea, i)=>{
				let returns = {};
				let ideaName = idea.name
				ideaName =this._stringTruncate(ideaName, 27)
				returns.name = ideaName;
				returns.pos_tokens = idea.pos_tokens ? idea.pos_tokens :0;
				returns.neg_tokens = idea.neg_tokens ? this._negativeFilter(idea.neg_tokens) : 0;
				data.push(returns); 
			})
			if(data.length > 40){
				graph_height = 1800
			}
			else if(data.length > 32){
				graph_height = 1500
			}
			else if(data.length > 22){
				graph_height = 1300
			}
			else if(data.length > 9){
				graph_height = 900
			}
			else{
				graph_height = 400
			}
			return( <div className="form-group">							
							<BarChart 
							  width={1000} 
							  height={graph_height} 
							  data={data} 
							  layout="vertical"
							  stackOffset="sign"
							  className="bar-chart-tokens"
							  margin={{top: 5, right: 20, left: 30, bottom: 5}}
							>
							  <XAxis type="number" width={200}/>
							  <YAxis type="category" dataKey="name" tick={{fontSize: 18}} width={150}/>
							   <CartesianGrid y={1} horizontal={false} vertical={true}/>
							  <Bar dataKey="neg_tokens" fill="#ff4500" stackId="stack"/>
							  <Bar dataKey="pos_tokens" fill="#2b78e4" stackId="stack"/>
							</BarChart>
					</div>)
		}else{
			return(
				<div className="text-center">
				<b>{loading ? 'Loading Token Spread...' : 'No Token Spread Available'}</b>
				</div>
				)
		}
	}

	_renderMarketSentiments = () =>{
		const {loading} = this.props
		return (<div className="tab-pane active" id="market-sentiment">
				  <div className="table-scrollable table-scrollable-borderless">
				    <table className="table table-hover table-light">
				      <thead>
				        <tr>
				          <th width="30%" />
				          <th width="10%"> Idea Score </th>
				          <th width="10%"> % passion </th>
				          <th width="10%"> Controversiality </th>
				          <th width="10%"> #pos tok </th>
				          <th width="12%"> #neg tok </th>
				          <th width="10%"> #pos part </th>
				          <th width="10%"> #neg part </th>
				          <th width="10%"> pos avg </th>
				          <th width="10%"> neg avg </th>
				        </tr>
				      </thead>
				      <tbody>
				        <tr className="total">
				          	<td>{'<total>'}</td>
							<td></td>
							<td></td>
							<td></td>
							<td>{this._valueFilter(this.state.sentiments.summary.pos_tokens)}</td>
							<td>{this._valueFilter(this.state.sentiments.summary.neg_tokens)}</td>
							<td>{this._valueFilter(this.state.sentiments.summary.pos_participants)}</td>
							<td>{this._valueFilter(this.state.sentiments.summary.neg_participants)}</td>
							<td>{this._valueFilter(this.state.sentiments.summary.pos_token_avg)}</td>
							<td>{this._valueFilter(this.state.sentiments.summary.neg_token_avg)}</td>
				        </tr>
				        {
				        	this.state.sentiments.ideas.length > 0 ?
				        	this.state.sentiments.ideas.map((sentiment, key)=>{
				        		return(
										<tr key={key}>
											<td>{sentiment.name}</td>
											<td>{this._valueFilter(sentiment.score)}</td>
											<td>{sentiment.passion_score === 0 ? '0%':this._valueFilter(sentiment.passion_score)+`${sentiment.passion_score === null ? '':'%'}`}</td>
											<td className={(sentiment.controversiality === 0 || sentiment.controversiality) && 'controversiality-text' }>{sentiment.controversiality === 0 ? '0' : this._valueFilter(sentiment.controversiality)}</td>
											<td>{this._valueFilter(sentiment.pos_tokens)}</td>
											<td>{this._valueFilter(sentiment.neg_tokens)}</td>
											<td>{this._valueFilter(sentiment.pos_participants)}</td>
											<td>{this._valueFilter(sentiment.neg_participants)}</td>
											<td>{this._valueFilter(sentiment.pos_token_avg)}</td>
											<td>{this._valueFilter(sentiment.neg_token_avg)}</td>
										</tr>
									)
				        	})	: 
							<tr>
							<td colSpan={8} className="text-center"> <b>{loading ? 'Loading Market Sentiment...' : 'No Market Sentiment Avalilable'}</b> </td>
							</tr>														
				        }
				      </tbody>
				    </table>
				  </div>
				</div>
				)
	}

	_renderEngagements = () =>{
		const {loading} = this.props
		return(
			<div className="tab-pane active" id="engagement">
			  <div className="engagement-section">
			    <div className="engagement-display">
			      <div className="eng-mainbox">
			        <div className=" eng-box">
			          <div className="inner-box">
			            <span>{this._fixValueFilter(this.state.engagement.participants.length)}</span>
			            <div><i className="fa fa-users" /> Participants</div>
			          </div>
			        </div>
			        <div className=" eng-box">
			          <div className="inner-box">
			            <span>{this._fixValueFilter(this.state.engagement.summary.percent_engaged * 100)}%</span>
			            <div><i className="fa fa-play-circle" /> Engaged</div>
			          </div>
			        </div>
			        <div className=" eng-box">
			          <div className="inner-box">
			            <span>{this._fixValueFilter(this.state.engagement.summary.percent_completed * 100)}%</span>
			            <div><i className="fa fa-check-square-o" /> Completed</div>
			          </div>
			        </div>
			      </div>
			    </div>
			    <div className="engagement-list">
			      <ul className="outer-list list-unstyled">
			        {
			        	this.state.engagement.participants.length > 0 ?
			        		this.state.engagement.participants.map((participant, key)=>{
			        			return(
			        				<li key={key}>
			        			      <ul className="inner-list list-unstyled">
			        			        <li className="img-section">
			        			          <LoadImage className="img" type='imageUrl' classType='add-thumbnail' imageUrl={participant.picture} isdiv={true}></LoadImage>
			        			        </li>
			        			        <li className="score-details">
			        			          
			        			          <div> {participant.tracking_id}</div>
			        			        </li>
			        			        <li className="invested-details">
			        			          <div className="invested-box">
			        			            <span className="num">{participant.num_ideas_invested ? this._valueFilter(participant.num_ideas_invested) : 0}</span>
			        			            <div>Ideas Invested</div>
			        			          </div>
			        			        </li>
			        			        <li className="counters-section">
			        			          <div className={'img count ' + (participant.percent_tokens_invested < 1 ? (!participant.percent_tokens_invested ? 'octangle-grey' : 'octangle-red'):(!participant.percent_tokens_invested ? 'octangle-grey' : 'octangle-blue'))}>
			        			            <span>{participant.percent_tokens_invested ? this._adValueFilter(participant.percent_tokens_invested * 100) +'%' : '-'}</span>
			        			          </div>
			        			        </li>
			        			      </ul>
			        			    </li>)
			        	}):<li className="text-center"><b>{loading ? 'Loading Participants...' : 'No Participants Avalialbe'}</b></li>				
			        }
			      </ul>
			    </div>
			  </div>
			</div>
)
	}



	_renderTurfAnalysis = () => {

		return(
			<div className="tab-pane active" id="turf-analysis">
				<div className="turf-wrapper">
					<h2>TURF ANALYSIS report can be provided upon request.</h2>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
     reports: state.market.reports,
	 message: state.market.message,
	 loading: state.market.loading
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: {
		getIdearanking: (payload) => dispatch(getmarketidearanking(payload)),
		getRationale: (payload) => dispatch(getmarketRationale(payload)),			
		getToken: (payload) => dispatch(getmarketTokenspread(payload)),			
		getSentiments: (payload) => dispatch(getmarketSentimentreport(payload)),			
		getEngagements: (payload) => dispatch(getmarketengagementreport(payload)),		
		exportRecord: (payload) => dispatch(exportCsv(payload)),		
    }
  }
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports))