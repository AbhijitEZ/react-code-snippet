import { all, takeEvery, put, call } from 'redux-saga/effects';
import actions from './actions';
import axios from 'axios';
import FirebaseHelper from 'helpers/firebase';
import * as Reporting from 'customApp/helpers/reporting';
import { handleTimeStamps } from 'customApp/helpers/functionHelper';
import omit from 'lodash/omit';
import _ from 'lodash';
import {
  Actions,
  PdfSelection,
} from 'customApp/containers/global/App/AppConstants';
const {
  database,
  getAuthToken,
  rsfFirestore,
  processFireStoreCollection,
  refFireFunction,
} = FirebaseHelper;

const updateRecords = async (data, documentId) => {
  try {
    await database
      .collection(`${FirebaseHelper.DB_COLLECTION_IMMOFONDS_PROPERTIES}`)
      .doc(documentId)
      .set(data);
    return 1;
  } catch (error) {
    return error;
  }
};

function* loadPropertyDetails({ payload }) {
  try {
    const collections = database.collection(
      FirebaseHelper.DB_COLLECTION_IMMOFONDS_PROPERTIES
    );
    let docRef = yield collections.doc(payload.data);
    const snapshot = yield call(rsfFirestore.getDocument, docRef);
    let data = yield snapshot.data();
    if (data.cloud_cache && !_.isEmpty(data.cloud_cache))
      yield put(actions.loadPropertyDetailsSuccess(data, false));
    let propertyCalculation = yield refFireFunction.httpsCallable(
      FirebaseHelper.CLOUD_FUNCTION_IMMOFONDS_PROPERTY_CALCULATION
    );

    let calculatedData = yield propertyCalculation({
      property_ref: payload.data,
    });

    data.cloud_cache = calculatedData.data;
    yield updateRecords(data, payload.data);
    yield put(actions.loadPropertyDetailsSuccess(data, true));
  } catch (error) {
    console.log(error, 'catch');
    Reporting.Error(error);
    yield put(actions.loadPropertyError(error));
  }
}

function* addNewBankAccount({ payload }) {
  try {
    let { data } = payload;
    yield call(
      rsfFirestore.addDocument,
      FirebaseHelper.DB_COLLECTION_IMMOFONDS_BANK_ACCOUNTS,
      data
    );
    yield put({ type: actions.ADD_BANK_ACCOUNT_SUCCESS });
    yield put(actions.loadPropertyDetails(data.property_ref));
  } catch (error) {
    Reporting.Error(error);
    yield put(actions.addBankAccountError(error.code));
  }
}

function* componentAction({ payload }) {
  try {
    const { data } = payload;
    let { action, key, ...records } = JSON.parse(JSON.stringify(data));
    if (records.images && records.images.length > 0) {
      records.images.map((file, index) => {
        file.created_at = handleTimeStamps(
          file.created_at ? file.created_at : null
        );
        return file;
      });
    }
    switch (action) {
      case Actions.update:
        records.created_at = handleTimeStamps(records.created_at);
        records.updated_at = handleTimeStamps();
        yield call(
          rsfFirestore.setDocument,
          `${FirebaseHelper.DB_COLLECTION_IMMOFONDS_COMPONENTS}/${key}`,
          {
            ...omit(records, ['key', 'actions']),
          }
        );
        yield put({ type: actions.COMPONENT_UPDATED });
        break;
      default:
        records.created_at = handleTimeStamps();
        records.updated_at = handleTimeStamps();
        yield call(
          rsfFirestore.addDocument,
          FirebaseHelper.DB_COLLECTION_IMMOFONDS_COMPONENTS,
          records
        );
        yield put({ type: actions.COMPONENT_ACTION_SUCCESS });
        yield put(actions.loadPropertyDetails(records.property_ref));
        break;
    }
  } catch (error) {
    Reporting.Error(error);
    yield put(actions.componentActionError(error.code));
  }
}

function* updateProperty({ payload }) {
  try {
    const { data } = payload;
    let { action, key, ...records } = JSON.parse(JSON.stringify(data));
    if (records.account_year)
      records.account_year = handleTimeStamps(records.account_year);
    records.created_at = handleTimeStamps(records.created_at);
    records.updated_at = handleTimeStamps();
    yield records.cloud_cache.accounts_data.map(async account => {
      account.data.created_at = new Date(
        account.data.created_at._seconds * 1000
      );
      await database
        .collection(FirebaseHelper.DB_COLLECTION_IMMOFONDS_BANK_ACCOUNTS)
        .doc(account.id)
        .set(account.data);
    });
    if (records.removeBankAccount && records.removeBankAccount.length > 0) {
      yield records.removeBankAccount.map(async account => {
        await database
          .collection(FirebaseHelper.DB_COLLECTION_IMMOFONDS_BANK_ACCOUNTS)
          .doc(account)
          .delete();
      });
    }
    yield call(
      rsfFirestore.setDocument,
      `${FirebaseHelper.DB_COLLECTION_IMMOFONDS_PROPERTIES}/${key}`,
      {
        ...omit(records, ['key', 'removeBankAccount', 'imageUrl']),
      }
    );
    yield put({ type: actions.UPDATE_PROPERTY_SUCCESS });
    yield put(actions.loadPropertyDetails(key));
  } catch (error) {
    Reporting.Error(error);
    yield put(actions.updatePropertyError(error.code));
  }
}
function* getCalculationsBase() {
  try {
    const calculationBaseComponent = yield database.collection(
      FirebaseHelper.DB_COLLECTION_IMMOFONDS_CALCULATIONS_BASE
    );
    const snapshotCalculationBase = yield call(
      rsfFirestore.getCollection,
      calculationBaseComponent
    );
    let calculationBasedata = yield processFireStoreCollection(
      snapshotCalculationBase
    );
    yield put(actions.getCalculationsBaseSuccess(calculationBasedata));
  } catch (error) {
    console.log(error, 'catch');
    Reporting.Error(error);
    yield put(actions.getCalculationsBaseError(error));
  }
}

function* downloadPdf({ payload }) {
  try {
    yield put(actions.updateProgress(20));
    let start = new Date().getTime();
    const idToken = yield getAuthToken();
    yield put(actions.updateProgress(30));
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (idToken ? idToken : 'missing-token'),
      },
      responseType: 'blob',
      timeout: 60000,
    };
    const response = yield axios.post(
      `${process.env.REACT_APP_CLOUD_FUNCTION_URL}if_pdf_export/doc`,
      payload.data,
      options
    );
    // Here 100% progress
    yield put(actions.updateProgress(100));
    console.log(response);

    // TODO REPLACE THIS WITH COMPONENT FUNCTIONALITY
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    var url = window.URL.createObjectURL(response.data);
    a.href = url;
    a.download = response['headers']['pdf-title'];
    a.click();
    window.URL.revokeObjectURL(url);
    // END TODO REPLACE THIS

    console.log('PDF creation time', new Date().getTime() - start);
    yield put(actions.downloadPdfSuccess(response.data, true));
  } catch (error) {
    console.log(error, 'catch');
    Reporting.Error(error);
    yield put(actions.downloadPdfError(error));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_PROPERTY_DETAILS, loadPropertyDetails),
    takeEvery(actions.ADD_BANK_ACCOUNT, addNewBankAccount),
    takeEvery(actions.COMPONENT_ACTION, componentAction),
    takeEvery(actions.UPDATE_PROPERTY, updateProperty),
    takeEvery(actions.GET_CALCULATION_BASES, getCalculationsBase),
    takeEvery(actions.DOWNLOAD_PDF, downloadPdf),
  ]);
}
