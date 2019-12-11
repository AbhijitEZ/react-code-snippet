import * as actions from './constants'
import { getMarkets,
 	getMarket,
  	getMarketResults,
    getMarketsRecord,
	getMarketData,
	addMarketData,
	getMarketRationaleReport,
	getMarketTokenSpread,
	getMarketIdeaRanking,
	getMarketSentimentReport,
	getMarketEngagementReport,
	exportMarketPositions,
	sendMarketInviteEmail,
	removeMarketData,
	openMarket,
	shadowValidate,
	closeMarket,
	shadowParticipant, } from '../../../api/aws/markets'

import {
  showLoadingView
} from '../../system/loadingview/actions'
import {download} from '../../../api/aws/helpers'
import history from '../../../history'
/**
 *
 * reducer to get all markets list of current user
 *
 */
export function getMarketsData() {
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.MARKET,
		})		
		getMarkets().then((r) => {
			dispatch(showLoadingView(false))
			let markets = JSON.parse(r.Payload).response			
			if (markets && markets.length > 0) {
				dispatch({
					type: actions.MARKET_SUCCESS,
					payload: markets
				})

			} else {
				dispatch({
					type: actions.MARKET_NO_DATA,
					payload: markets
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_ERROR,
				payload: 'No Markets'
			})
		})
	}

}


/**
 *
 * reducer to get single market data
 *
 */
export function getSingleMarket({market_id, images}){
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.SINGLE_MARKET,
		})		
		getMarket(market_id, images).then((r) => {
			dispatch(showLoadingView(false))
			let market = JSON.parse(r.Payload).response		
			if (market) {
				dispatch({
					type: actions.SINGLE_MARKET_SUCCESS,
					payload: market
				})

			} else {
				dispatch({
					type: actions.SINGLE_MARKET_NO_DATA,
					payload: market
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.SINGLE_MARKET_ERROR,
				payload: 'No Market'
			})
		})
	}

}

/**
 *
 * To start market
 *
 */
export function marketStart(market_id){
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.MARKET_START,
		})		
		openMarket(market_id).then((r) => {
			dispatch(showLoadingView(false))
			let market = JSON.parse(r.Payload)		
			if (market.statusCode === 200) {
				dispatch({
					type: actions.MARKET_START_SUCCESS,
					payload: 'market_started'
				})

			} else {
				dispatch({
					type: actions.MARKET_START_ERROR,
					payload: market.message
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_START_ERROR,
				payload: 'Unauthorized.'
			})
		})
	}
}

/**
 *
 * To start market
 *
 */
export function MarketEnd(market_id){
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.MARKET_END,
		})		
		closeMarket(market_id).then((r) => {
			dispatch(showLoadingView(false))
			let market = JSON.parse(r.Payload)		
			if (market.statusCode === 200) {
				dispatch({
					type: actions.MARKET_END_SUCCESS,
					payload: 'market_closed'
				})

			} else {
				dispatch({
					type: actions.MARKET_END_ERROR,
					payload: market.message
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_END_ERROR,
				payload: 'Unauthorized.'
			})
		})
	}
}

/**
 *
 * reducer to get market results
 *
 */


export function getMarketResult(market_id){
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.MARKET_RESULT,
		})		
		getMarketResults(market_id).then((r) => {
			dispatch(showLoadingView(false))
			let results = JSON.parse(r.Payload).response			
			if (results) {
				dispatch({
					type: actions.MARKET_RESULT_SUCCESS,
					payload: results
				})

			} else {
				dispatch({
					type: actions.MARKET_RESULT_NO_DATA,
					payload: results
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_RESULT_ERROR,
				payload: 'No Market'
			})
		})
	}

}

/*
 calls from backend
*/
export function getMarketList({teamId,images}) {
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.MARKET,
		})		
		getMarketsRecord(teamId,images).then((r) => {
			dispatch(showLoadingView(false))
			let markets = JSON.parse(r.Payload).response			
			if (markets && markets.length > 0) {
				dispatch({
					type: actions.MARKET_SUCCESS,
					payload: markets
				})

			} else {
				dispatch({
					type: actions.MARKET_NO_DATA,
					payload: markets
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_ERROR,
				payload: 'No Markets'
			})
		})
	}

}

export function getEditorMarket(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.SINGLE_MARKET,
		})		
		getMarketData(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let market = JSON.parse(r.Payload).response			
			if (market) {
				dispatch({
					type: actions.SINGLE_MARKET_SUCCESS,
					payload: market
				})

			} else {
				dispatch({
					type: actions.SINGLE_MARKET_NO_DATA,
					payload: market
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.SINGLE_MARKET_ERROR,
				payload: 'No Markets'
			})
		})
	}
}


export function exportCsv(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.CSV,
		})		
		exportMarketPositions(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let market = JSON.parse(r.Payload)			
			if (market) {
				if(market.statusCode === 200) {
					download(market.response.url);
				} 
				dispatch({
					type: actions.CSV_SUCCESS,
					payload: market
				})

			} else {
				dispatch({
					type: actions.CSV_NO_DATA,
					payload: market
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.CSV_ERROR,
				payload: 'Error while downloading'
			})
		})
	}
}
/**
 *
 * to get market rationale reports
 *
 */
export function getmarketRationale(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.REPORT,
		})		
		getMarketRationaleReport(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let report = JSON.parse(r.Payload).response			
			if (report.length > 0) {
				dispatch({
					type: actions.REPORT_SUCCESS,
					payload: report
				})

			} else {
				dispatch({
					type: actions.REPORT_NO_DATA,
					payload: report
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.REPORT_ERROR,
				payload: 'No Markets'
			})
		})
	}

}
/**
 *
 * to get market token spread
 *
 */
export function getmarketTokenspread(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.REPORT,
		})		
		getMarketTokenSpread(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let token = JSON.parse(r.Payload).response			
			if (token.length > 0) {
				dispatch({
					type: actions.REPORT_SUCCESS,
					payload: token
				})

			} else {
				dispatch({
					type: actions.REPORT_NO_DATA,
					payload: token
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.REPORT_ERROR,
				payload: 'No Markets'
			})
		})
	}

}
/**
 *
 * market idea ranking
 *
 */
export function getmarketidearanking(marketId){
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.REPORT,
		})		
		getMarketIdeaRanking(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let rank = JSON.parse(r.Payload).response			
			if (rank) {
				dispatch({
					type: actions.REPORT_SUCCESS,
					payload: rank
				})

			} else {
				dispatch({
					type: actions.REPORT_NO_DATA,
					payload: rank
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.REPORT_ERROR,
				payload: {}
			})
		})
	}

}
/**
 *
 * to get market sentiment report
 *
 */
export function getmarketSentimentreport(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.REPORT,
		})		
		getMarketSentimentReport(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let sentiment = JSON.parse(r.Payload).response			
			if (sentiment.length > 0) {
				dispatch({
					type: actions.REPORT_SUCCESS,
					payload: sentiment
				})

			} else {
				dispatch({
					type: actions.REPORT_NO_DATA,
					payload: sentiment
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.REPORT_ERROR,
				payload: 'No Markets'
			})
		})
	}

}

/**
 *
 * to get market engagement report
 *
 */

 export function getmarketengagementreport(marketId){	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.REPORT,
		})		
		getMarketEngagementReport(marketId).then((r) => {
			dispatch(showLoadingView(false))
			let engagement = JSON.parse(r.Payload).response			
			if (engagement.length > 0) {
				dispatch({
					type: actions.REPORT_SUCCESS,
					payload: engagement
				})

			} else {
				dispatch({
					type: actions.REPORT_NO_DATA,
					payload: engagement
				})
			}
		}).catch((error) => {
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.REPORT_ERROR,
				payload: 'No Markets'
			})
		})
	}

}

export function addMarket(payload) {	
	return function (dispatch) {
		dispatch(showLoadingView(true))
		dispatch({
			type: actions.ADD_MARKET,
		})
		addMarketData(payload).then((r) => {
			dispatch(showLoadingView(false))			
			dispatch({
				type: actions.ADD_MARKET_SUCCESS,
				payload: JSON.parse(r.Payload).response
			})
		}).catch(error => {			
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.ADD_MARKET_ERROR,
				payload: error.message
			})
		});
	}	
}


export function sendInviteMail(payload){
	return function (dispatch){
		dispatch(showLoadingView(true))
		dispatch({
			type:actions.MAIL
		})
		sendMarketInviteEmail(payload).then((r) => {
			dispatch(showLoadingView(false))		
			dispatch({
				type: actions.MAIL_SUCCESS,
				payload: 'mail_success'
			})
		}).catch(error => {			
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MAIL_ERROR,
				payload: error.message
			})
		})
	}
}
export function deleteMarket(payload){
	return function (dispatch){
		dispatch(showLoadingView(true))
		dispatch({
			type:actions.MARKET_DELETE,
			payload:'Deleting market...'
		})
		removeMarketData(payload).then((r) => {
			dispatch(showLoadingView(false))
			if (JSON.parse(r.Payload).statusCode === 200) {			
				dispatch({
					type: actions.MARKET_DELETE_SUCCESS,
					payload: 'market_deleted'
				})
			}else{
				dispatch({
					type: actions.MARKET_DELETE_ERROR,
					payload: JSON.parse(r.Payload).message
				})
			}
		}).catch(error => {			
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_DELETE_ERROR,
				payload: error.message
			})
		})
	}
}

export function validateLink(payload){
	return function (dispatch){
		dispatch(showLoadingView(true))
		dispatch({
			type:actions.VALIDATE
		})
		shadowValidate(payload).then((r) => {
			dispatch(showLoadingView(false))
			if (JSON.parse(r.Payload).statusCode === 200) {
				dispatch({
					type: actions.VALIDATE_SUCCESS,
					payload: JSON.parse(r.Payload).response
				})
			}
			else{
				let statusMsg = JSON.parse(r.Payload).message || 'other_issue'
				dispatch({
					type: actions.VALIDATE_ERROR,
					payload: statusMsg
				})
			}			
		}).catch(error => {			
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.VALIDATE_ERROR,
				payload: error.message
			})
		})
	}
}

export function getParticipantRecord(payload){
	return function (dispatch){
		dispatch(showLoadingView(true))
		dispatch({
			type:actions.MARKET_PARTICIPANT
		})
		shadowParticipant(payload).then((r) => {
			dispatch(showLoadingView(false))
			if (JSON.parse(r.Payload).statusCode === 200) {
				dispatch({
					type: actions.MARKET_PARTICIPANT_SUCCESS,
					payload: JSON.parse(r.Payload).response
				})
			}else{
				history.push({
				  pathname: '/',
				  state: { message: 'Something Went Wrong while validating url' }
				})
			}			
			
		}).catch(error => {			
			dispatch(showLoadingView(false))
			dispatch({
				type: actions.MARKET_PARTICIPANT_ERROR,
				payload: error.message
			})
			history.push({
			  pathname: '/',
			  state: { message: 'Something Went Wrong while validating url' }
			})
		})
	}
}

