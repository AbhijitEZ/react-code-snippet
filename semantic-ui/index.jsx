import React from 'react';
import {
  Container,
  Button,
  Form,
  Header,
  Checkbox,
  Icon,
  Message,
  Radio,
  Modal
} from 'semantic-ui-react';
import _ from 'lodash';
import { axiosPost } from '../../../services';
import PageHeader from '../../common/header/header';
import { Link } from 'react-router-dom';
import styles from './formStyle.css';
import * as yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';
import { MonthInput, YearInput, DateInput } from 'semantic-ui-calendar-react';

const phoneRegExp = /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|)\d{3,4})?$/;

class RemittanceForm extends React.Component {
  state = {
    formData: {},
    errors: {},
    message: {},
    ModalForm: {
      value: 'payFull',
      subValue: 'payNow'
    },
    payNow: false,
    statusPayHalfModal: false,
    statusModal: true,
    paymentStatus: true,
    loading: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { message } = this.state;
    if (message !== prevState.message && !_.isEmpty(message)) {
      setTimeout(() => {
        this.setState({ message: {} });
      }, 5000);
    }
    if (this.state.statusModal !== prevState.statusModal) {
    }
  }

  handleSubmit = async (formData = {}) => {
    let message = {};
    try {
      let { paymentStatus } = this.state;
      this.setState({ loading: true });

      if (paymentStatus) {
        formData.tithes = Number(formData.tithes).toFixed(2);
        formData.isPayed = true;
      } else {
        formData.balance = Number(formData.balance).toFixed(2);
        formData.isPayed = false;
      }
      const result = await axiosPost(formData, '/remittance/createRemittance');

      message.header = 'Remittance has been added';
      message.content = 'Redirecting to remittance page...';
      message.positive = true;

      this.props.history.push('/user/remittance/confirmation');
    } catch (error) {
      console.log(error);
      message.header = 'Oops! Something went wrong.';
      message.content = error.message;
      message.negative = true;
      this.setState({ message, loading: false });
    }
  };

  cardSection = (
    styles,
    values,
    touched,
    errors,
    setFieldValue,
    handleChange
  ) => (
    <React.Fragment>
      <Form.Group widths="equal">
        <div className={styles.section}>
          <Form.Input
            fluid
            icon={<Icon name="cc visa" size="large" color="blue" />}
            size="large"
            name="card_number"
            type="number"
            value={values.card_number || ''}
            error={errors.card_number && touched.card_number}
            onChange={e => {
              let { value } = e.target;
              if (value.length < 17) {
                setFieldValue('card_number', value);
              }
            }}
            label="Card Information"
            placeholder="Enter Card Number"
            className={styles.formcontrol}
          />
          {errors.card_number && touched.card_number && (
            <span className={styles.hasError}>{errors.card_number}</span>
          )}
        </div>
        <div className={styles.section}>
          <Form.Input
            fluid
            label="Card Name"
            size="large"
            name="card_name"
            value={values.card_name || ''}
            error={errors.card_name && touched.card_name}
            onChange={handleChange}
            placeholder="e.g John Doe"
            className={styles.formcontrol}
          />
          {errors.card_name && touched.card_name && (
            <span className={styles.hasError}>{errors.card_name}</span>
          )}
        </div>
      </Form.Group>
      <Form.Group widths="equal">
        <div className={`${styles.section} ${styles.section2}`}>
          <MonthInput
            label="Card Expiry Month"
            size="large"
            name="card_month"
            placeholder="Select Month"
            value={values.card_month || ''}
            icon={false}
            closable
            error={errors.card_month && touched.card_month}
            hideMobileKeyboard
            onChange={(event, { name, value }) => {
              let monthNumber = moment()
                .month(value)
                .format('M');
              setFieldValue('card_month', monthNumber);
            }}
            className={`${styles.formcontrol} ${styles.formcontrol1}`}
          />
          {errors.card_month && touched.card_month && (
            <span className={`${styles.hasError} ${styles.hasError1}`}>
              {errors.card_month}
            </span>
          )}
          <YearInput
            label="Card Expiry Year"
            size="large"
            hideMobileKeyboard
            name="card_year"
            placeholder="Select Year"
            value={values.card_year || ''}
            icon={false}
            error={errors.card_year && touched.card_year}
            closable
            onChange={(event, { name, value }) => {
              setFieldValue('card_year', value);
            }}
            className={`${styles.formcontrol} ${styles.formcontrol2}`}
          />
          {errors.card_year && touched.card_year && (
            <span className={`${styles.hasError} ${styles.hasError2}`}>
              {errors.card_year}
            </span>
          )}
        </div>

        <div className={styles.section}>
          <Form.Input
            fluid
            size="large"
            label="CVV Number"
            name="card_cvv"
            type="number"
            min={0}
            value={values.card_cvv || ''}
            error={errors.card_cvv && touched.card_cvv}
            onChange={e => {
              let { value } = e.target;
              if (value.length < 4) {
                setFieldValue('card_cvv', value);
              }
            }}
            placeholder="e.g 535"
            className={styles.formcontrol}
          />
          {errors.card_cvv && touched.card_cvv && (
            <span className={styles.hasError}>{errors.card_cvv}</span>
          )}
        </div>
      </Form.Group>
    </React.Fragment>
  );

  handleAction = () => {
    let { ModalForm } = this.state;
    if (ModalForm.value === 'payHalf') {
      this.setState({
        statusModal: false,
        statusPayHalfModal: true,
        paymentStatus: false
      });
    } else {
      this.setState({ statusModal: false, paymentStatus: true });
    }
  };

  handleHalfAction = () => {
    let { ModalForm } = this.state;
    if (ModalForm.subValue === 'payNow') {
      this.setState({ payNow: true });
    } else {
      this.setState({ payNow: false });
    }
    this.setState({ statusPayHalfModal: false });
  };
  render() {
    const {
      formData,
      loading,
      message,
      statusModal,
      payNow, // For half Payment
      paymentStatus, //For Full Payment
      statusPayHalfModal,
      ModalForm
    } = this.state;

    let initialFormData,
      validationFormSchema = {};

    if (paymentStatus) {
      initialFormData = {
        card_number: formData.card_number || '',
        card_name: formData.card_name || '',
        card_month: formData.card_month || '',
        card_year: formData.card_year || '',
        card_cvv: formData.card_cvv || ''
      };
      validationFormSchema = {
        card_number: yup.string().required('This field is required.'),
        card_name: yup.string().required('This field is required.'),
        card_month: yup
          .number()
          .required('This field is required.')
          .max(12),
        card_year: yup.number().required('This field is required.'),
        card_cvv: yup
          .number()
          .required('This field is required.')
          .positive()
          .integer()
      };
    } else {
      if (payNow) {
        initialFormData = {
          card_number: formData.card_number || '',
          card_name: formData.card_name || '',
          card_month: formData.card_month || '',
          card_year: formData.card_year || '',
          card_cvv: formData.card_cvv || '',
          balance: formData.balance || 0,
          reasonNotPaying: formData.reasonNotPaying || '',
          payingDate: formData.payingDate || ''
        };
        validationFormSchema = {
          card_number: yup.string().required('This field is required.'),
          card_name: yup.string().required('This field is required.'),
          card_month: yup
            .number()
            .required('This field is required.')
            .max(12),
          card_year: yup.number().required('This field is required.'),
          card_cvv: yup
            .number()
            .required('This field is required.')
            .positive()
            .integer(),
          balance: yup
            .number()
            .required('This field is required.')
            .positive(),
          reasonNotPaying: yup.string().required('This field is required'),
          payingDate: yup.string().required('This field is required')
        };
      } else {
        initialFormData = {
          balance: formData.balance || 0,
          reasonNotPaying: formData.reasonNotPaying || '',
          payingDate: formData.payingDate || ''
        };
        validationFormSchema = {
          balance: yup
            .number()
            .required('This field is required.')
            .positive(),
          reasonNotPaying: yup.string().required('This field is required'),
          payingDate: yup.string().required('This field is required')
        };
      }
    }

    return (
      <Container className={styles.container}>
        <PageHeader />
        <Formik
          enableReinitialize
          initialValues={{
            ...initialFormData,
            tithes: formData.tithes || 0.0,
            offering: formData.offering || '',
            urnNumber: formData.urnNumber || '',
            noOfSoulSaved: formData.noOfSoulSaved || '',
            newWorkers: formData.newWorkers || '',
            noOfCongregation: formData.noOfCongregation || '',
            marriages: formData.marriages || '',
            soulsBaptised: formData.soulsBaptised || '',
            deaths: formData.deaths || 0,
            births: formData.births || 0,
            newCommers: formData.newCommers || 0,
            address: formData.address || '',
            contactNumber: formData.contactNumber || ''
          }}
          validationSchema={yup.object().shape({
            ...validationFormSchema,
            tithes: yup
              .number()
              .required('This field is required.')
              .positive(),
            offering: yup
              .number()
              .required('This field is required')
              .positive()
              .integer('Offering can not have a decimal values.'),
            urnNumber: yup.string().required('This field is required.'),
            noOfSoulSaved: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            newWorkers: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            noOfCongregation: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            marriages: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            soulsBaptised: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            births: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),
            newCommers: yup
              .number()
              .required('This field is required.')
              .positive()
              .integer(),

            address: yup.string().required('This field is required.'),
            contactNumber: yup
              .string()
              .required('This field is required.')
              .matches(
                phoneRegExp,
                'Please provide a valid UK or European phone number.'
              )
          })}
          onSubmit={this.handleSubmit}
        >
          {formProps => {
            const {
              handleChange,
              errors,
              touched,
              values,
              handleSubmit,
              setFieldValue
            } = formProps;
            return (
              <Form
                className={styles.formStyle}
                onSubmit={handleSubmit}
                loading={loading}
              >
                <Header as="h1" className={styles.title}>
                  Remittance page
                </Header>
                <Header as="h4" className={styles.info} disabled>
                  Remitting tithe and offering is now simple, seamless and
                  secure. Please complete the form below to submit your updates.
                  {!_.isEmpty(message) && <Message {...message} />}
                </Header>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      label="Tithe"
                      type="number"
                      name="tithes"
                      step="0.25"
                      min="0"
                      error={errors.tithes && touched.tithes}
                      value={values.tithes || ''}
                      // onChange={handleChange}
                      onChange={e => {
                        let { value } = e.target;
                        setFieldValue('tithes', value);
                      }}
                      size="large"
                      placeholder="Tithe received for the week e.g 10,000"
                      className={styles.formcontrol}
                    />
                    {errors.tithes && touched.tithes && (
                      <span className={styles.hasError}>{errors.tithes}</span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      label="Offering"
                      size="large"
                      type="number"
                      min={0}
                      name="offering"
                      value={values.offering || ''}
                      error={errors.offering && touched.offering}
                      onChange={handleChange}
                      placeholder="Offering received for the week e.g 5000"
                      className={styles.formcontrol}
                    />
                    {errors.offering && touched.offering && (
                      <span className={styles.hasError}>{errors.offering}</span>
                    )}
                  </div>
                </Form.Group>
                {!paymentStatus ? (
                  <React.Fragment>
                    <Form.Group widths="equal">
                      <div className={styles.section}>
                        <Form.Input
                          fluid
                          label="Balance"
                          type="number"
                          name="balance"
                          step="0.25"
                          min="0"
                          error={errors.balance && touched.balance}
                          value={values.balance || ''}
                          onChange={e => {
                            let { value } = e.target;
                            setFieldValue('balance', value);
                          }}
                          size="large"
                          placeholder="Money that are you going to pay latter"
                          className={styles.formcontrol}
                        />
                        {errors.balance && touched.balance && (
                          <span className={styles.hasError}>
                            {errors.balance}
                          </span>
                        )}
                      </div>
                      <div className={styles.section}>
                        <Form.TextArea
                          fluid
                          label="Reason for not Paying"
                          size="large"
                          name="reasonNotPaying"
                          value={values.reasonNotPaying || ''}
                          error={
                            errors.reasonNotPaying && touched.reasonNotPaying
                          }
                          onChange={handleChange}
                          placeholder="Reason for not paying now"
                          className={styles.formcontrol}
                        />
                        {errors.reasonNotPaying && touched.reasonNotPaying && (
                          <span className={styles.hasError}>
                            {errors.reasonNotPaying}
                          </span>
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className={styles.section}>
                        <DateInput
                          label="Paying Date"
                          size="large"
                          name="payingDate"
                          placeholder="Select Date"
                          value={values.payingDate || ''}
                          icon={false}
                          closable
                          error={errors.payingDate && touched.payingDate}
                          hideMobileKeyboard
                          onChange={(event, { name, value }) => {
                            setFieldValue('payingDate', value);
                          }}
                          className={`${styles.formcontrol} ${styles.formcontrol1}`}
                        />
                        {errors.payingDate && touched.payingDate && (
                          <span
                            className={`${styles.hasError} ${styles.hasError1}`}
                          >
                            {errors.payingDate}
                          </span>
                        )}
                      </div>
                    </Form.Group>
                    {payNow &&
                      this.cardSection(
                        styles,
                        values,
                        touched,
                        errors,
                        setFieldValue,
                        handleChange
                      )}
                  </React.Fragment>
                ) : (
                  this.cardSection(
                    styles,
                    values,
                    touched,
                    errors,
                    setFieldValue,
                    handleChange
                  )
                )}{' '}
                <Form.Group widths="equal" className={styles.formGroup}>
                  <div className={styles.section}>
                    <Form.Input
                      label="Number of soul saved"
                      size="large"
                      name="noOfSoulSaved"
                      type="number"
                      min={0}
                      value={values.noOfSoulSaved || ''}
                      error={errors.noOfSoulSaved && touched.noOfSoulSaved}
                      onChange={handleChange}
                      placeholder="e.g 100"
                      className={styles.formcontrol}
                    />
                    {errors.noOfSoulSaved && touched.noOfSoulSaved && (
                      <span className={styles.hasError}>
                        {errors.noOfSoulSaved}
                      </span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      label="New workers"
                      name="newWorkers"
                      type="number"
                      min={0}
                      value={values.newWorkers || ''}
                      error={errors.newWorkers && touched.newWorkers}
                      onChange={handleChange}
                      placeholder="e.g 50"
                      className={styles.formcontrol}
                    />
                    {errors.newWorkers && touched.newWorkers && (
                      <span className={styles.hasError}>
                        {errors.newWorkers}
                      </span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="noOfCongregation"
                      type="number"
                      min={0}
                      value={values.noOfCongregation || ''}
                      error={
                        errors.noOfCongregation && touched.noOfCongregation
                      }
                      onChange={handleChange}
                      label="Attendance number of congregation"
                      placeholder="e.g 500"
                      className={styles.formcontrol}
                    />
                    {errors.noOfCongregation && touched.noOfCongregation && (
                      <span className={styles.hasError}>
                        {errors.noOfCongregation}
                      </span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      label="Billing address"
                      size="large"
                      name="address"
                      value={values.address || ''}
                      error={errors.address && touched.address}
                      onChange={handleChange}
                      placeholder="Your card billing address"
                      className={styles.formcontrol}
                    />
                    {errors.address && touched.address && (
                      <span className={styles.hasError}>{errors.address}</span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="contactNumber"
                      value={values.contactNumber || ''}
                      error={errors.contactNumber && touched.contactNumber}
                      onChange={handleChange}
                      label="Contact Number"
                      placeholder="e.g +44 7787384437"
                      className={styles.formcontrol}
                    />
                    {errors.contactNumber && touched.contactNumber && (
                      <span className={styles.hasError}>
                        {errors.contactNumber}
                      </span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="urnNumber"
                      value={values.urnNumber || ''}
                      error={errors.urnNumber && touched.urnNumber}
                      onChange={e => {
                        let { value } = e.target;
                        if (value.length < 11) {
                          setFieldValue('urnNumber', value);
                        }
                      }}
                      label="URN Number"
                      placeholder="Your Unique Reference Number e.g EMR3CGHBEN"
                      className={styles.formcontrol}
                    />
                    {errors.urnNumber && touched.urnNumber && (
                      <span className={styles.hasError}>
                        {errors.urnNumber}
                      </span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="marriages"
                      type="number"
                      min={0}
                      value={values.marriages || ''}
                      error={errors.marriages && touched.marriages}
                      onChange={handleChange}
                      label="Marriages"
                      placeholder="e.g 10"
                      className={styles.formcontrol}
                    />
                    {errors.marriages && touched.marriages && (
                      <span className={styles.hasError}>
                        {errors.marriages}
                      </span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="soulsBaptised"
                      type="number"
                      min={0}
                      value={values.soulsBaptised || ''}
                      error={errors.soulsBaptised && touched.soulsBaptised}
                      onChange={handleChange}
                      label="Souls Baptised"
                      placeholder="e.g 20"
                      className={styles.formcontrol}
                    />
                    {errors.soulsBaptised && touched.soulsBaptised && (
                      <span className={styles.hasError}>
                        {errors.soulsBaptised}
                      </span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="deaths"
                      type="number"
                      min={0}
                      value={values.deaths || ''}
                      error={errors.deaths && touched.deaths}
                      //   onChange={handleChange}
                      onChange={e => {
                        let { value } = e.target;
                        setFieldValue('deaths', value);
                      }}
                      label="Deaths"
                      placeholder="e.g 2"
                      className={styles.formcontrol}
                    />
                    {errors.deaths && touched.deaths && (
                      <span className={styles.hasError}>{errors.deaths}</span>
                    )}
                  </div>
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="births"
                      type="number"
                      min={0}
                      value={values.births || ''}
                      error={errors.births && touched.births}
                      onChange={handleChange}
                      label="Births"
                      placeholder="e.g 10"
                      className={styles.formcontrol}
                    />
                    {errors.births && touched.births && (
                      <span className={styles.hasError}>{errors.births}</span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group widths="equal">
                  <div className={styles.section}>
                    <Form.Input
                      fluid
                      size="large"
                      name="newCommers"
                      type="number"
                      min={0}
                      value={values.newCommers || ''}
                      error={errors.newCommers && touched.newCommers}
                      onChange={handleChange}
                      label="New Commers"
                      placeholder="e.g 5"
                      className={styles.formcontrol}
                    />
                    {errors.newCommers && touched.newCommers && (
                      <span className={styles.hasError}>
                        {errors.newCommers}
                      </span>
                    )}
                  </div>
                </Form.Group>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    className={styles.continueButton}
                    type="submit"
                    size="medium"
                  >
                    Continue
                  </Button>
                </div>
                <div className={styles.backButton}>
                  <Link to="/user/remittancePage">Back</Link>
                </div>
              </Form>
            );
          }}
        </Formik>
        <Modal
          open={statusModal}
          size="small"
          closeIcon={false}
          closeOnDimmerClick={false}
          closeOnDocumentClick={false}
        >
          <Header icon="money" content="Are you going to pay the whole amount ?" />
          <Modal.Content>
            <Form>
              <Form.Field>Are you going to pay full</Form.Field>
              <Form.Field>
                <Checkbox
                  radio
                  label="Pay Full"
                  name="checkboxRadioGroup"
                  value="payFull"
                  checked={ModalForm.value === 'payFull'}
                  onChange={(e, { value }) => {
                    ModalForm.value = value;
                    this.setState({ ModalForm });
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  radio
                  label="Pay Half"
                  name="checkboxRadioGroup"
                  value="payHalf"
                  checked={ModalForm.value === 'payHalf'}
                  onChange={(e, { value }) => {
                    ModalForm.value = value;
                    this.setState({ ModalForm });
                  }}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              inverted
              onClick={() => this.handleAction(true)}
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          open={statusPayHalfModal}
          size="small"
          closeIcon={false}
          closeOnDimmerClick={false}
          closeOnDocumentClick={false}
        >
          <Header icon="money" content="Are you going to pay half or latter ?" />
          <Modal.Content>
            <React.Fragment>
              <Form>
              <Form.Field>Are paying now or latter</Form.Field>
              <Form.Field>
                <Radio
                  label="Pay Now"
                  name="radioGroup"
                  value="payNow"
                  checked={ModalForm.subValue === 'payNow'}
                  onChange={(e, { value }) => {
                    ModalForm.subValue = value;
                    this.setState({ ModalForm });
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Pay Latter"
                  name="radioGroup"
                  value="payLatter"
                  checked={ModalForm.subValue === 'payLatter'}
                  onChange={(e, { value }) => {
                    ModalForm.subValue = value;
                    this.setState({ ModalForm });
                  }}
                />
              </Form.Field>
              </Form>
            </React.Fragment>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              inverted
              onClick={() => this.handleHalfAction()}
            >
              <Icon name="checkmark" /> Submit
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

export default RemittanceForm;
