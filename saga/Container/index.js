import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import actions from 'customApp/redux/immofonds/property/actions';
import LayoutContentWrapper from 'components/utility/layoutWrapper';
import PageHeader from 'components/utility/pageHeader';
import IntlMessages from 'components/utility/intlMessages';
import { Breadcrumb, Icon, Spin } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Box from 'components/utility/box';
import {
  ImmoFondTool,
  LastUpdated,
  LastUpdatedWrapper,
} from 'customApp/containers/immofonds/_Tool/customStyle';
import ContentHolder from 'components/utility/contentHolder';
import BankInsertModal from 'customApp/components/ImmoFonds/PropertyModals/BankInsertModal';
import ComponentInsertModal from 'customApp/components/ImmoFonds/PropertyModals/ComponentInsertModal';
import ViewCard from 'customApp/components/ImmoFonds/PropertyModals/ViewCards';
import EditCard from 'customApp/components/ImmoFonds/PropertyModals/EditCards';
import DownloadPdfModal from 'customApp/components/ImmoFonds/PropertyModals/DownloadPdfModal';
import {
  PropertyScreen,
  HomeScreen,
  PaginationSize,
  Actions,
} from 'customApp/containers/global/App/AppConstants';
import { GraphWrapper, ButtonWrapper } from './property.style';
import Graph from 'customApp/components/ImmoFonds/Graph';
import {
  ActionBtn,
  TitleWrapper,
  ComponentTitle,
  TableWrapper,
  PageTitle,
  PageSubTitle,
  TableTitle,
  Container,
  WhiteIcon,
  CommonTable,
  Spacer,
  StatusHandler,
} from 'customApp/containers/global/App/customGlobalStyle';
import Tags from 'components/uielements/tag';
import {
  appendDatabaseKeyToData,
  formatToReadableNumber,
  getLastUpdate,
  validationsCheck,
  successIndicator,
} from 'customApp/helpers/functionHelper';
import FirebaseHelper from 'helpers/firebase';
const { onFileUpload } = FirebaseHelper;
class Property extends Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {},
      components: [],
      addProperty: {},
      addComponent: {},
      addBankAccount: {},
      bankModal: false,
      componentModal: false,
      errors: {},
      editingProperty: false,
      isLoading: false,
      downloadPdfModal: false,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    const paramsValue = this.props.match.params.value;
    this.props.loadPropertyDetails(paramsValue);
  };
  componentDidUpdate(prevProps) {
    if (this.props.property !== prevProps.property) {
      this.setState({
        property: this.props.property,
        editingProperty: false,
      });
    }
    if (this.props.cacheUpdated !== prevProps.cacheUpdated) {
      this.setState({
        property: this.props.property,
      });
    }
    if (this.props.isLoading !== prevProps.isLoading) {
      this.setState({
        isLoading: this.props.isLoading,
      });
    }
    if (
      this.props.successMessage &&
      this.props.successMessageString !== prevProps.successMessageString
    ) {
      successIndicator(
        this.context.intl.formatMessage({
          id: this.props.successMessageString,
        })
      );
    }
  }
  handleAddBankAccount = () => {
    let addBankAccount = {};
    let errors = {};
    this.setState(
      { addBankAccount, errors, bankModal: true, componentModal: false },
      () => {
        this.toggleModal();
      }
    );
  };
  handleAddComponent = () => {
    let addComponent = {};
    let errors = {};
    this.setState(
      { addComponent, errors, componentModal: true, bankModal: false },
      () => {
        this.toggleModal();
      }
    );
  };
  toggleModal = () => {
    this.props.toggleModal();
  };
  updateProperty = () => {
    let { property } = this.state;
    let requires = [
      HomeScreen.city,
      HomeScreen.construction_date,
      HomeScreen.insurance_value,
      HomeScreen.number,
      HomeScreen.property_type,
      HomeScreen.street,
      HomeScreen.zip_code,
      HomeScreen.ground_area,
      PropertyScreen.cubature_insureance_value,
      PropertyScreen.current_deposit,
      PropertyScreen.manual_deposit,
      PropertyScreen.minimum_threshold,
      PropertyScreen.gvz_percentage,
      PropertyScreen.yearly_correction_threshold,
    ];
    let errors = validationsCheck(property, requires);
    errors.account = {};
    let accountRequires = [
      PropertyScreen.account.account_number,
      PropertyScreen.account.balance,
      PropertyScreen.account.name_account,
      PropertyScreen.account.name_bank,
      PropertyScreen.account.rate_inflation,
      PropertyScreen.account.rate_interest,
    ];
    property.cloud_cache.accounts_data.forEach((account, key) => {
      let accountErrors = validationsCheck(account.data, accountRequires);
      if (!_.isEmpty(accountErrors)) {
        errors.account[key] = accountErrors;
      }
    });
    this.setState({ errors }, () => {
      if (_.isEmpty(errors.account)) delete errors.account;
      if (_.isEmpty(errors)) {
        property.key = this.props.match.params.value;
        if (
          property.image &&
          property.image.length > 0 &&
          property.image[0].uid
        ) {
          this.setState({ uploading: true, isLoading: true });
          var records;
          successIndicator(
            this.context.intl.formatMessage({
              id: 'upload.inprogress',
            }),
            1500
          );
          records = onFileUpload(
            PropertyScreen.propertyImage,
            property.image,
            this,
            {}
          );
        } else {
          property.image = property.image ? property.image : [];
        }
        if (
          property.image &&
          property.image.length > 0 &&
          property.image[0].uid
        ) {
          records.then(fileObject => {
            property.image = fileObject[0];
            this.props.updateProperty(property);
          });
        } else {
          this.props.updateProperty(property);
        }
      }
    });
    //
  };
  propertyAction = action => {
    switch (action) {
      case Actions.doEdit:
        this.setState({ editingProperty: true, errors: { account: {} } });
        break;
      case Actions.cancel:
        this.setState({
          editingProperty: false,
        });
        this.getData();
        break;
      case Actions.update:
        this.updateProperty();
        break;
      case Actions.downloadPdf:
        this.setState({ downloadPdfModal: true });
        break;
      default:
        this.setState({ editingProperty: !this.state.editingProperty });
    }
  };
  setData = property => {
    this.setState({ property });
  };
  closePdfModal = () => {
    this.setState({ downloadPdfModal: false });
  };
  render() {
    let {
      property,
      addBankAccount,
      errors,
      bankModal,
      componentModal,
      addComponent,
      editingProperty,
      isLoading,
      downloadPdfModal,
    } = this.state;
    let componentsData = [];
    let calculationData = [];
    let graphData = {};
    if (property.cloud_cache !== undefined && property.cloud_cache !== '') {
      componentsData = appendDatabaseKeyToData(
        property.cloud_cache.components_data,
        true
      );
      calculationData = property.cloud_cache.calculations;
      graphData = property.cloud_cache.graph_data;
      graphData.interest = calculationData.weighted_average_interest.toFixed(2);
      graphData.inflation = calculationData.weighted_average_inflation.toFixed(
        2
      );
    }
    const columns = [
      {
        title: <IntlMessages id="property.component" />,
        key: PropertyScreen.component,
        render: (text, row) => {
          return <span>{row.name}</span>;
        },
        sorter: (a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        },
      },
      {
        title: <IntlMessages id="property.replaceCost" />,
        key: PropertyScreen.replaceCost,
        render: (text, row) => {
          return (
            <span className="numberFontFamily">
              {formatToReadableNumber(row.calculated_data.erneuerungskosten)}
            </span>
          );
        },
        sorter: (a, b) => {
          if (
            a.calculated_data.erneuerungskosten <
            b.calculated_data.erneuerungskosten
          )
            return -1;
          if (
            a.calculated_data.erneuerungskosten >
            b.calculated_data.erneuerungskosten
          )
            return 1;
          return 0;
        },
      },
      {
        title: <IntlMessages id="property.remainServiceTime" />,
        key: PropertyScreen.remainServiceTime,
        render: (text, row) => {
          return (
            <span className="numberFontFamily">
              {formatToReadableNumber(row.calculated_data.restnutzungsdauer)}{' '}
              {row.calculated_data.restnutzungsdauer <= 1 ? (
                <IntlMessages id="property.year" />
              ) : (
                <IntlMessages id="property.years" />
              )}
            </span>
          );
        },
        sorter: (a, b) => {
          if (
            a.calculated_data.restnutzungsdauer <
            b.calculated_data.restnutzungsdauer
          )
            return -1;
          if (
            a.calculated_data.restnutzungsdauer >
            b.calculated_data.restnutzungsdauer
          )
            return 1;
          return 0;
        },
      },
      {
        title: <IntlMessages id="property.depositPerYear" />,
        key: PropertyScreen.depositPerYear,
        render: (text, row) => {
          return (
            <span className="numberFontFamily">
              {formatToReadableNumber(
                row.calculated_data.einlage_ideal.toFixed(2)
              )}
            </span>
          );
        },
        sorter: (a, b) => {
          if (a.calculated_data.einlage_ideal < b.calculated_data.einlage_ideal)
            return -1;
          if (a.calculated_data.einlage_ideal > b.calculated_data.einlage_ideal)
            return 1;
          return 0;
        },
      },
      {
        title: <IntlMessages id="property.state" />,
        key: PropertyScreen.state,
        render: (text, row) => {
          return (
            <StatusHandler>
              <Tags className={`component_${row.status}`}>
                {
                  PropertyScreen.componentStatus.displayNames[row.status - 1]
                    .name
                }
              </Tags>
            </StatusHandler>
          );
        },
        sorter: (a, b) => {
          if (a.status < b.status) return -1;
          if (a.status > b.status) return 1;
          return 0;
        },
      },
      {
        title: <IntlMessages id="global.active" />,
        key: PropertyScreen.active,
        render: (text, row) => {
          row.active = row.active === undefined ? false : row.active;
          return (
            <span>
              <b>{row.active && <i className="ion-checkmark" />}</b>
            </span>
          );
        },
        sorter: (a, b) => {
          if (a.active < b.active) return -1;
          if (a.active > b.active) return 1;
          return 0;
        },
      },
    ];
    let separatorIcon = <Icon type="right" />;
    return (
      <ImmoFondTool>
        <Container>
          <LayoutContentWrapper>
            <PageTitle>
              <TitleWrapper className="propertyTitleWraper">
                <PageHeader>
                  {!_.isEmpty(property) ? property.street : '...'}{' '}
                  {property.number}
                </PageHeader>

                <PageSubTitle>
                  <Breadcrumb separator={separatorIcon}>
                    <Breadcrumb.Item>
                      <Link
                        to={{
                          pathname: `${process.env.REACT_APP_URL_STAFF_CONSTANT}${process.env.REACT_APP_IMMOFONDS_CONSTANT}/home`,
                        }}
                      >
                        <IntlMessages id="property.home" />
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      {!_.isEmpty(property) ? property.street : '...'}{' '}
                      {property.number}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </PageSubTitle>
              </TitleWrapper>
              <LastUpdatedWrapper>
                <div className="LastUpdatedButtonWrapper">
                  <div>
                    {editingProperty
                      ? [
                          <ActionBtn type="danger" key="delete">
                            <IntlMessages id="global.delete" />
                          </ActionBtn>,
                          <ActionBtn className="copyButton" key="copy">
                            <IntlMessages id="global.copy" />
                          </ActionBtn>,
                          <ActionBtn
                            type="primary"
                            key="editProperty"
                            loading={isLoading}
                            onClick={this.propertyAction.bind(
                              this,
                              Actions.update
                            )}
                          >
                            <IntlMessages id="global.save" />
                          </ActionBtn>,
                          <ActionBtn
                            key="cancel"
                            onClick={this.propertyAction.bind(
                              this,
                              Actions.cancel
                            )}
                          >
                            <IntlMessages id="global.cancel" />
                          </ActionBtn>,
                        ]
                      : [
                          <ActionBtn
                            type="primary"
                            key="downloadPdf"
                            loading={this.props.pdfDownloading}
                            onClick={this.propertyAction.bind(
                              this,
                              Actions.downloadPdf
                            )}
                          >
                            <IntlMessages id="global.report" />
                          </ActionBtn>,
                          <ActionBtn
                            type="primary"
                            key="editProperty"
                            onClick={this.propertyAction.bind(
                              this,
                              Actions.doEdit
                            )}
                          >
                            <IntlMessages id="global.edit" />
                          </ActionBtn>,
                        ]}
                  </div>
                </div>
                <LastUpdated className="lastUpdatedLabel">
                  <IntlMessages id="property.lastUpdated" />
                  <span>
                    {!_.isEmpty(property)
                      ? getLastUpdate(property.updated_at, property.created_at)
                      : '...'}
                  </span>
                </LastUpdated>
              </LastUpdatedWrapper>
            </PageTitle>
            {editingProperty ? (
              <EditCard
                propertyData={property}
                handleAddBankAccount={this.handleAddBankAccount}
                setData={this.setData}
                errors={errors}
              />
            ) : (
              <ViewCard
                propertyData={property}
                handleAddBankAccount={this.handleAddBankAccount}
              />
            )}
            <Spacer space={'40px'} />
            <GraphWrapper>
              <TitleWrapper>
                <ComponentTitle>
                  <IntlMessages id="property.forecastRenewalFund" />
                </ComponentTitle>
              </TitleWrapper>
              <Spin spinning={_.isEmpty(property)}>
                {!_.isEmpty(property) && !_.isEmpty(property.cloud_cache) && (
                  <Graph
                    graphData={!_.isEmpty(property) && graphData}
                    componentsData={componentsData}
                  />
                )}
              </Spin>
            </GraphWrapper>
            <Spacer space={'40px'} />
            <Box>
              <CommonTable>
                <ContentHolder style={{ marginTop: 0 }}>
                  <TableTitle>
                    <TitleWrapper>
                      <ComponentTitle>
                        <IntlMessages id="property.communityComponents" />
                      </ComponentTitle>
                      <ButtonWrapper>
                        <ActionBtn
                          type="primary"
                          onClick={this.handleAddComponent}
                          className="button"
                        >
                          <IntlMessages id="global.add" />
                          <WhiteIcon>
                            <Icon type="plus" />
                          </WhiteIcon>
                        </ActionBtn>
                      </ButtonWrapper>
                    </TitleWrapper>
                  </TableTitle>
                  <TableWrapper
                    rowKey="key"
                    onRow={record => ({
                      onClick: () => {
                        this.props.history.push({
                          pathname: '../component/' + record.key,
                        });
                      },
                    })}
                    columns={columns}
                    loading={_.isEmpty(property)}
                    dataSource={componentsData}
                    className="isoSimpleTable"
                    pagination={{
                      hideOnSinglePage: true,
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: PaginationSize,
                      total: componentsData.length,
                      showTotal: (total, range) => {
                        return `${range[0]} - ${
                          range[1]
                        } ${this.context.intl.formatMessage({
                          id: 'pagination.of',
                        })} ${
                          componentsData.length
                        } ${this.context.intl.formatMessage({
                          id: 'pagination.results',
                        })}`;
                      },
                    }}
                  />
                </ContentHolder>
              </CommonTable>
            </Box>
            {componentModal && (
              <ComponentInsertModal
                errors={errors}
                component={addComponent}
                propertyId={this.props.match.params.value}
              />
            )}
            {bankModal && (
              <BankInsertModal
                errors={errors}
                addAccount={addBankAccount}
                propertyId={this.props.match.params.value}
              />
            )}
            <DownloadPdfModal
              showModal={downloadPdfModal}
              propertyData={property}
              closePdfModal={this.closePdfModal}
              property_ref={this.props.match.params.value}
            />
          </LayoutContentWrapper>
        </Container>
      </ImmoFondTool>
    );
  }
}
Property.contextTypes = {
  //To add dynamic placeholder in german language
  intl: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    ...state.Property,
  }),
  actions
)(Property);
