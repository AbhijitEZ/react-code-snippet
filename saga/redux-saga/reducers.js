import actions from './actions';

const initState = {
  isLoading: false,
  errorMessage: false,
  modalActive: false,
  successMessage: false,
  successMessageString: '',
  properties: [],
  property: {},
  propertyTypes: [],
  calculationsBase: [],
  cacheUpdated: false,
  propertyUpdated: false,
  pdfProgressReference: 0,
  pdfDownloaded: false,
  pdfDownloading: false,
};

export default function reducer(state = initState, { type, payload }) {
  switch (type) {
    case actions.LOAD_PROPERTY_DETAILS:
      return {
        ...state,
        successMessage: false,
        isLoading: true,
        property: {},
      };
    case actions.LOAD_PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        property: payload.data,
        cacheUpdated: payload.cacheUpdateStatus,
        errorMessage: false,
      };
    case actions.LOAD_PROPERTY_DETAILS_ERROR:
      return {
        ...state,
        isLoading: false,
        property: {},
        errorMessage: payload.error,
      };
    case actions.ADD_BANK_ACCOUNT:
      return {
        ...state,
        isLoading: true,
        errorMessage: false,
        successMessage: false,
        successMessageString: '',
      };
    case actions.ADD_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: false,
        modalActive: false,
        successMessage: true,
        successMessageString: 'property.bankAccountAdded',
      };
    case actions.ADD_BANK_ACCOUNT_ERROR:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload.error,
        successMessage: false,
      };
    case actions.COMPONENT_ACTION:
      return {
        ...state,
        isLoading: true,
        errorMessage: false,
        successMessage: false,
        updateComponent: false,
        successMessageString: '',
      };
    case actions.COMPONENT_UPDATED:
      return {
        ...state,
        isLoading: false,
        errorMessage: false,
        modalActive: false,
        successMessage: true,
        updateComponent: true,
        successMessageString: 'component.updated',
      };
    case actions.COMPONENT_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: false,
        modalActive: false,
        successMessage: true,
        updateComponent: false,
        successMessageString: 'property.componentAdded',
      };
    case actions.COMPONENT_ACTION_ERROR:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload.error,
        successMessage: false,
      };
    case actions.TOGGLE_MODAL:
      return {
        ...state,
        modalActive: !state.modalActive,
      };
    case actions.UPDATE_PROPERTY:
      return {
        ...state,
        isLoading: true,
        errorMessage: false,
        successMessage: false,
        propertyUpdated: false,
        successMessageString: '',
      };
    case actions.UPDATE_PROPERTY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: false,
        successMessage: true,
        propertyUpdated: true,
        successMessageString: 'property.updated',
      };
    case actions.UPDATE_PROPERTY_ERROR:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload.error,
        propertyUpdated: false,
        successMessage: false,
      };
    case actions.GET_CALCULATION_BASES:
      return {
        ...state,
        isLoading: true,
        errorMessage: false,
        calculationsBase: [],
      };
    case actions.GET_CALCULATION_BASES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: false,
        calculationsBase: payload.data,
      };
    case actions.GET_CALCULATION_BASES_ERROR:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload.error,
        calculationsBase: [],
      };
    case actions.DOWNLOAD_PDF:
      return {
        ...state,
        errorMessage: false,
        pdfDownloaded: false,
        pdfDownloading: true,
      };
    case actions.DOWNLOAD_PDF_SUCCESS:
      return {
        ...state,
        errorMessage: false,
        pdfDownloaded: true,
        pdfDownloading: false,
      };
    case actions.DOWNLOAD_PDF_ERROR:
      return {
        ...state,
        errorMessage: true,
        pdfDownloaded: false,
        pdfDownloading: false,
      };
    case actions.UPDATE_PROGRESS:
      return {
        ...state,
        pdfProgressReference: payload.data,
      };
    default:
      return state;
  }
}
