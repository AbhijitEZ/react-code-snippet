// @flow

import Immutable from 'seamless-immutable'
import * as actions from './constants'

const initialState = Immutable({
	message: null,
	markets: [],
	market:{},
	results:[],
	code:null,
	market_id:null,
	details:{},
	collaborators:[],
	loading:false,
})

function marketReducer(state: Object = initialState, action: {
	type: string,
	payload: any
}) {
	switch (action.type) {
		/*
		 markets
		 */
		case actions.MARKET:
			return{
				...state,
				message:null,
				loading:true,
				markets:[]
			}
		case actions.MARKET_SUCCESS:
			return{
				...state,
				message:null,
				loading:false,
				markets:action.payload
			}
		case actions.MARKET_NO_DATA:
			return{
				...state,
				message:null,
				loading:false,
				markets:[]
			}
		case actions.MARKET_ERROR:
			return{
				...state,
				message:null,
				loading:false,
				markets:[]
			}
		/*
		 Add market
		*/
		case actions.ADD_MARKET:
			return{
				...state,
				message:action.payload
			}
		case actions.ADD_MARKET_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.ADD_MARKET_ERROR:
			return{
				...state,
				message:action.payload
			}
		/* 
		single market
		*/
		case actions.SINGLE_MARKET:
			return{
				...state,
				message:null
			}
		case actions.SINGLE_MARKET_SUCCESS:
			return{
				...state,
				market:action.payload
			}
		case actions.SINGLE_MARKET_NO_DATA:
			return{
				...state,
				market:action.payload
			}
		case actions.SINGLE_MARKET_ERROR:
			return{
				...state,
				message:action.payload
			}
		/*
		 Participants
		*/
		case actions.PARTICIPANTS:
			return{
				...state,
				message:null
			}
		case actions.PARTICIPANTS_SUCCESS:
			return{
				...state,
				participants:action.payload
			}
		case actions.PARTICIPANTS_NO_DATA:
			return{
				...state,
				participants:action.payload
			}
		case actions.PARTICIPANTS_ERROR:
			return{
				...state,
				message:action.payload
			}
		/*
		 Reports
		*/
		case actions.REPORT:
			return{
				...state,
				message:null,
				loading:true
			}
		case actions.REPORT_SUCCESS:
			return{
				...state,
				reports:action.payload,
				loading:false
			}
		case actions.REPORT_NO_DATA:
			return{
				...state,
				reports:action.payload,
				loading:false
			}
		case actions.REPORT_ERROR:
			return{
				...state,
				message:action.payload,
				loading:false
			}
		/* 
		market results 
		*/
		case actions.MARKET_RESULT:
			return{
				...state,
				message:null
			}
		case actions.MARKET_RESULT_SUCCESS:
			return{
				...state,
				results:action.payload
			}
		case actions.MARKET_RESULT_NO_DATA:
			return{
				...state,
				results:action.payload
			}
		case actions.MARKET_RESULT_ERROR:
			return{
				...state,
				message:action.payload
			}
		/* 
		calls to action
		 */
		case actions.ACTION:
			return{
				...state,
				message:null
			}
		case actions.ACTION_SUCCESS:
			return{
				...state,
				results:action.payload
			}
		case actions.ACTION_NO_DATA:
			return{
				...state,
				results:action.payload
			}
		case actions.ACTION_ERROR:
			return{
				...state,
				message:action.payload
			}
		
		/*
		 Csv	
		*/
		case actions.CSV:
			return{
				...state,
				message:null
			}
		case actions.CSV_SUCCESS:
			return{
				...state,
				csv:action.payload
			}
		case actions.CSV_NO_DATA:
			return{
				...state,
				csv:action.payload
			}
		case actions.CSV_ERROR:
			return{
				...state,
				message:action.payload
			}
		/*
		 Send mail
		*/	
		case actions.MAIL:
			return{
				...state,
				message:null
			}
		case actions.MAIL_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.MAIL_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.MAIL_ERROR:
			return{
				...state,
				message:action.payload
			}
		
		/*
		 start market
		*/	
		case actions.MARKET_START:
			return{
				...state,
				message:null
			}
		case actions.MARKET_START_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_START_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_START_ERROR:
			return{
				...state,
				message:action.payload
			}
		
		/*
		 end market
		*/	
		case actions.MARKET_END:
			return{
				...state,
				message:null
			}
		case actions.MARKET_END_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_END_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_END_ERROR:
			return{
				...state,
				message:action.payload
			}
		
		/*
		 delete market
		*/	
		case actions.MARKET_DELETE:
			return{
				...state,
				message:null
			}
		case actions.MARKET_DELETE_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_DELETE_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_DELETE_ERROR:
			return{
				...state,
				message:action.payload
			}
		
		/*
		 validating url
		*/	
		case actions.VALIDATE:
			return{
				...state,
				message:null
			}
		case actions.VALIDATE_SUCCESS:
			return{
				...state,
				market:action.payload
			}
		case actions.VALIDATE_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.VALIDATE_ERROR:
			return{
				...state,
				message:action.payload
			}
		/*
		 market participant
		*/	
		case actions.MARKET_PARTICIPANT:
			return{
				...state,
				message:null
			}
		case actions.MARKET_PARTICIPANT_SUCCESS:
			return{
				...state,
				market:action.payload
			}
		case actions.MARKET_PARTICIPANT_NO_DATA:
			return{
				...state,
				message:action.payload
			}
		case actions.MARKET_PARTICIPANT_ERROR:
			return{
				...state,
				message:action.payload
			}
		/*
		 Collaborators
		 */
		case actions.MARKET_COLLABORATORS:
			return{
				...state,
				collaborators:[]
			}
		case actions.MARKET_COLLABORATORS_SUCCESS:
			return{
				...state,
				collaborators:action.payload
			}
		case actions.MARKET_COLLABORATORS_ERROR:
			return{
				...state,
				message:action.payload
			}
/*
		 Collaborators Add
		 */
		case actions.ADD_COLLABORATOR:
			return{
				...state,
				message:null
			}	
		case actions.ADD_COLLABORATOR_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.ADD_COLLABORATOR_ERROR:
			return{
				...state,
				message:action.payload
			}
/*
		Collaborators Update
		 */
		case actions.UPDATE_COLLABORATOR:
			return{
				...state,
				message:null
			}
		case actions.UPDATE_COLLABORATOR_SUCCESS:
			return{
				...state,
				message:action.payload
			}
		case actions.UPDATE_COLLABORATOR_ERROR:
			return{
				...state,
				message:action.payload
			}

		default:
			return state
	}
}

export default marketReducer
