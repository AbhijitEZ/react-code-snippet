const DOCUMENT = 'HOME_';

const actions = {
  LOAD_PROPERTY_DETAILS: `${DOCUMENT}LOAD_PROPERTY_DETAILS`,
  LOAD_PROPERTY_DETAILS_SUCCESS: `${DOCUMENT}LOAD_PROPERTY_DETAILS_SUCCESS`,
  LOAD_PROPERTY_DETAILS_ERROR: `${DOCUMENT}LOAD_PROPERTY_DETAILS_ERROR`,

  ADD_BANK_ACCOUNT: `${DOCUMENT}ADD_BANK_ACCOUNT`,
  ADD_BANK_ACCOUNT_SUCCESS: `${DOCUMENT}ADD_BANK_ACCOUNT_SUCCESS`,
  ADD_BANK_ACCOUNT_ERROR: `${DOCUMENT}ADD_BANK_ACCOUNT_ERROR`,

  COMPONENT_ACTION: `${DOCUMENT}COMPONENT_ACTION`,
  COMPONENT_ACTION_SUCCESS: `${DOCUMENT}COMPONENT_ACTION_SUCCESS`,
  COMPONENT_ACTION_ERROR: `${DOCUMENT}COMPONENT_ACTION_ERROR`,

  COMPONENT_UPDATED: `${DOCUMENT}COMPONENT_UPDATED`,

  TOGGLE_MODAL: `${DOCUMENT}TOGGLE_MODAL`,

  UPDATE_PROPERTY: `${DOCUMENT}UPDATE_PROPERTY`,
  UPDATE_PROPERTY_SUCCESS: `${DOCUMENT}UPDATE_PROPERTY_SUCCESS`,
  UPDATE_PROPERTY_ERROR: `${DOCUMENT}UPDATE_PROPERTY_ERROR`,

  GET_CALCULATION_BASES: `${DOCUMENT}GET_CALCULATION_BASES`,
  GET_CALCULATION_BASES_SUCCESS: `${DOCUMENT}GET_CALCULATION_BASES_SUCCESS`,
  GET_CALCULATION_BASES_ERROR: `${DOCUMENT}GET_CALCULATION_BASES_ERROR`,

  DOWNLOAD_PDF: `${DOCUMENT}DOWNLOAD_PDF`,
  DOWNLOAD_PDF_SUCCESS: `${DOCUMENT}DOWNLOAD_PDF_SUCCESS`,
  DOWNLOAD_PDF_ERROR: `${DOCUMENT}DOWNLOAD_PDF_ERROR`,

  UPDATE_PROGRESS: `${DOCUMENT}UPDATE_PROGRESS`,

  loadPropertyDetails: data => {
    return { type: actions.LOAD_PROPERTY_DETAILS, payload: { data } };
  },

  loadPropertyDetailsSuccess: (data, cacheUpdateStatus) => {
    return {
      type: actions.LOAD_PROPERTY_DETAILS_SUCCESS,
      payload: { data, cacheUpdateStatus },
    };
  },

  loadPropertyDetailsError: error => {
    return {
      type: actions.LOAD_PROPERTY_DETAILS_ERROR,
      payload: { error: error.message },
    };
  },

  addBankAccount: data => ({
    type: actions.ADD_BANK_ACCOUNT,
    payload: { data },
  }),

  addBankAccountSuccess: data => ({
    type: actions.ADD_BANK_ACCOUNT_SUCCESS,
    payload: { data },
  }),

  addBankAccountError: data => ({
    type: actions.ADD_BANK_ACCOUNT_ERROR,
    payload: { data },
  }),
  componentAction: data => ({
    type: actions.COMPONENT_ACTION,
    payload: { data },
  }),

  componentActionSuccess: data => ({
    type: actions.COMPONENT_ACTION_SUCCESS,
    payload: { data },
  }),

  componentUpdated: data => ({
    type: actions.COMPONENT_UPDATED,
    payload: { data },
  }),

  componentActionError: data => ({
    type: actions.COMPONENT_ACTION_ERROR,
    payload: { data },
  }),

  toggleModal: (data = null) => ({
    type: actions.TOGGLE_MODAL,
    payload: { data },
  }),
  updateProperty: data => ({
    type: actions.UPDATE_PROPERTY,
    payload: { data },
  }),

  updatePropertySuccess: data => ({
    type: actions.UPDATE_PROPERTY_SUCCESS,
    payload: { data },
  }),

  updatePropertyError: data => ({
    type: actions.UPDATE_PROPERTY_ERROR,
    payload: { data },
  }),
  getCalculationsBase: data => ({
    type: actions.GET_CALCULATION_BASES,
    payload: { data },
  }),

  getCalculationsBaseSuccess: data => ({
    type: actions.GET_CALCULATION_BASES_SUCCESS,
    payload: { data },
  }),

  getCalculationsBaseError: data => ({
    type: actions.GET_CALCULATION_BASES_ERROR,
    payload: { data },
  }),
  downloadPdf: data => ({
    type: actions.DOWNLOAD_PDF,
    payload: { data },
  }),

  downloadPdfSuccess: data => ({
    type: actions.DOWNLOAD_PDF_SUCCESS,
    payload: { data },
  }),

  downloadPdfError: data => ({
    type: actions.DOWNLOAD_PDF_ERROR,
    payload: { data },
  }),
  updateProgress: data => ({
    type: actions.UPDATE_PROGRESS,
    payload: { data },
  }),
};
export default actions;
