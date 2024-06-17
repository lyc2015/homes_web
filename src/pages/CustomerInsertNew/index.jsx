import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/newCssInsert.css"
import * as publicUtils from "../../utils/publicUtils.js";

import $ from "jquery";
import store from "../../redux/store.js";

import Autocomplete from "@material-ui/lab/Autocomplete";

import default_avatar from '../../assets/images/default_avatar.jpg';
import "./index.css";
import request from '../../service/request.js';

import { DatePicker, message, Select as AntSelect } from "antd";

import FromCol from "../../components/CustomerInsertNewInfo/FromCol/index.jsx";

import { 
  Form, 
  Button, 
  Col, 
  Row, 
  InputGroup, 
  FormControl, 
  Image 
} from "react-bootstrap";

import moment from "moment";
moment.locale("ja");

class CustomerInsertNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.insertCustomer = this.insertCustomer.bind(this); // 登録
  }

  initialState = {
    employeeFormCode: "",
    employeeNo: "",
    employeeFristName: "",
    employeeLastName: "",
    furigana1: "",
    furigana2: "",
    alphabetName1: "",
    alphabetName2: "",
    alphabetName3: "",
    birthday: "",
    genderStatus: "",
    nationalityCode: "",
    birthplace: "",
    image: default_avatar,
    temporary_age: "",
    companyMail: "",
    socialInsuranceNo: "",
    socialInsuranceDate: null,

    employmentInsurance: "",
    employmentInsuranceNo: "",
    socialInsurance: "",      
    employmentInsuranceStatus: [
      { code: "0", name: "未加入" },
      { code: "1", name: "加入済み" }
    ],
    socialInsuranceStatus: [
      { code: "0", name: "未加入" },
      { code: "1", name: "加入済み" }
    ],
    graduationYearAndMonth: null,
    comeToJapanYearAndMonth: null,
    intoCompanyYearAndMonth: null,
    yearsOfExperience: null,
    temporary_graduationYearAndMonth: "",
    temporary_comeToJapanYearAndMonth: "",
    temporary_intoCompanyYearAndMonth: "",
    temporary_yearsOfExperience: "",
    employeeStatus: "0",
    postalCode: '',
    firstHalfAddress: '',
    // dropDown
    // nationalityCodes: store.getState().dropDown[0],
    nationalityCodes: [],
    station: [],
    employeeFormCodes: [],
    departmentCodes: [],
    homesAgentCodes: [],
  };

  /**
   * 登録
   */
  insertCustomer = (event) => {
    this.setState({ loading: false });
    event.preventDefault();
    let obj = document.getElementById("imageId");
    let imgSrc = obj.getAttribute("src");
    const emp = {
      employeeStatus: this.state.employeeStatus,                                    // 社員区分
      employeeNo: this.state.employeeNo,                                            // 社員番号
      employeeFirstName: publicUtils.trim(this.state.employeeFristName),            // 社員氏
      employeeLastName: publicUtils.trim(this.state.employeeLastName),              // 社員名
      furigana1: publicUtils.nullToEmpty(this.state.furigana1),                     // カタカナ
      furigana2: publicUtils.nullToEmpty(this.state.furigana2),                     // カタカナ
      alphabetName1: publicUtils.nullToEmpty(this.state.alphabetName1),
      alphabetName2: publicUtils.nullToEmpty(this.state.alphabetName2),
      alphabetName3: publicUtils.nullToEmpty(this.state.alphabetName3),
      birthday: publicUtils.formateDate(this.state.birthday, true),                 // 年齢
      genderStatus: publicUtils.nullToEmpty(this.state.genderStatus),               // 性別
      password: publicUtils.nullToEmpty(this.state.passwordSetInfo),                // pw設定
      authorityCode: this.state.authorityCode,                                      // 権限
      nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode),         // 出身地
      intoCompanyYearAndMonth:                                                      // 入社年月
        this.state.employeeStatus === "1" || this.state.employeeStatus === "4"
          ? " "
          : publicUtils.formateDate(this.state.intoCompanyYearAndMonth, true),
      employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode),       // 社員形式
      retirementResonClassification: publicUtils.nullToEmpty(                       // 退職区分
        this.state.retirementResonClassificationCode
      ), 
      retirementYearAndMonth: publicUtils.formateDate(                              // 退職年月
        this.state.retirementYearAndMonth,
        true
      ), 
      comeToJapanYearAndMonth: publicUtils.formateDate(                             // 来日年月
        this.state.comeToJapanYearAndMonth,
        false
      ),
      graduationUniversity: publicUtils.nullToEmpty(                                // 卒業学校
        this.state.graduationUniversity
      ),
      graduationYearAndMonth: publicUtils.formateDate(                              // 卒業年月
        this.state.graduationYearAndMonth,
        false
      ),
      residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),             // 在留資格
      companyMail:                                                                  // 社内メール
        publicUtils.nullToEmpty(this.state.companyMail) === ""
          ? ""
          : this.state.companyMail + "@lyc.co.jp",
      phoneNo:                                                                      // 携帯電話
        publicUtils.nullToEmpty(this.state.phoneNo1) +
        publicUtils.nullToEmpty(this.state.phoneNo2) +
        publicUtils.nullToEmpty(this.state.phoneNo3), 
      employmentInsuranceStatus: publicUtils.nullToEmpty(                           // 雇用保険加入
        this.state.employmentInsurance
      ),
      socialInsuranceStatus: publicUtils.nullToEmpty(                               // 社会保険加入
        this.state.socialInsurance
      ),
      yearsOfExperience: publicUtils.formateDate(                                   // 経験年数
        this.state.yearsOfExperience,
        false
      ), 
      departmentCode: publicUtils.nullToEmpty(this.state.departmentCode),           // 部署
      homesAgentCode: publicUtils.nullToEmpty(this.state.homesAgentCode),           // 仲介区分
      picInfo: imgSrc,                                                              // 画像
    };
    
    request
      .post("employee/insertCustomer", emp, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((result) => {
        if (result.data.errorsMessage != null) {
          this.setState({ loading: true });
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
          setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        } else {
          this.setState({
            myToastShow: true,
            method: "post",
            errorsMessageShow: false,
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          this.setState({
            employeeFristName: publicUtils.trim(this.state.employeeFristName), // 社員氏
            employeeLastName: publicUtils.trim(this.state.employeeLastName), // 社員名
            disabledFalg: false,
          });
          //window.location.reload();
          store.dispatch({ type: "UPDATE_STATE", dropName: "getCustomerName" });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getCustomerNameNoBP",
          });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getCustomerNameByOccupationName",
          });
          //this.getNO(this.state.empNoHead);// 採番番号
          setTimeout(() => this.changePage(), 3000);
        }
      })
      .catch((error) => {
        this.setState({ loading: true });
        console.error("Error - " + error);
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "ファイルアップデートエラー発生",
        });
        setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
      });
  };
  

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  dateChange = (name, date) => {
    this.setState({
      [name]: date,
    });
  };

  inactiveBirthday = (date) => {
    this.setState({
      birthday: date,
      temporary_age: this.calculateAge(date)
    });
  };

  calculateAge = (birthday) => {
    const today = moment();
    const birthDate = moment(birthday);
    let age = today.year() - birthDate.year();
    const monthDiff = today.month() - birthDate.month();
    if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
      age--;
    }
    return age;
  };



  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  valueChangeCustomerInsuranceStatus = (event) => {
    this.setState({
      employmentInsurance: event.target.value
    });
  };

  valueChangesocialInsuranceStatus = (event) => {
    this.setState({
      socialInsurance: event.target.value
    });
  };

  socialInsuranceDateChange = (date) => {
    this.setState({
      socialInsuranceDate: date
    });
  };

  // 卒業

  formatDuration = (years, months) => {
    if (years === 0) {
      return `${months}ヶ月`;
    }
    return `${years}年${months}ヶ月`;
  };

  inactiveGraduationYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      graduationYearAndMonth: date,
      temporary_graduationYearAndMonth: formattedDuration
    }, () => {
      if (!this.state.yearsOfExperience) {
        this.setState({
          yearsOfExperience: date,
          temporary_yearsOfExperience: formattedDuration
        });
      }
    });
  };

  inactiveComeToJapanYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      comeToJapanYearAndMonth: date,
      temporary_comeToJapanYearAndMonth: formattedDuration
    });
  };

  inactiveintoCompanyYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      intoCompanyYearAndMonth: date,
      temporary_intoCompanyYearAndMonth: formattedDuration
    });
  };

  inactiveyearsOfExperience = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      yearsOfExperience: date,
      temporary_yearsOfExperience: formattedDuration
    });
  };

  /**
   * 郵便番号API
   */
  postApi = (event) => {
    let value = event.target.value;
    const promise = Promise.resolve(publicUtils.postcodeApi(value));
    promise.then((data) => {
      if (data !== undefined && data !== null && data !== "") {
        this.setState({ firstHalfAddress: data });
      }
    });
  };

  /**
   * 漢字をカタカナに変更する
   */
  katakanaApiChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let promise = Promise.resolve(publicUtils.katakanaApi(value));
    promise.then((date) => {
      switch (name) {
        case "employeeFristName":
          this.setState({
            furigana1: date,
            employeeFristName: value,
          });
          break;
        case "employeeLastName":
          this.setState({
            furigana2: date,
            employeeLastName: value,
          });
          break;
        default:
      }
    });
  };

  /**
   * ファイルを処理
   *
   * @param {*}
   *            event
   * @param {*}
   *            name
   */
  addFile = (event, name) => {
    console.log('click file')
    $("#" + name).click();
  };

  changeFile = (event, name) => {
    if (name === "image") {
      if (publicUtils.nullToEmpty($("#image").get(0).files[0]) === "") {
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(
        publicUtils.nullToEmpty($("#image").get(0).files[0])
      );
      reader.onload = function () {
        document.getElementById("imageId").src = reader.result;
      };
    }
  };




  render() {
    // 第一行搜索项
    const formCols = [
      [
        {
            label: 'お客様名',
            name: 'customerName',
            required: true,
            //maxLength: 6
        },
        {
          label: 'カタカナ',
          name: 'furigana',
        },
        {
          label: 'ローマ字',
          name: 'alphabetName',
        },
        {
          label: '性別',
          name: 'genderStatus',
        },
        // {
        //   label: '担当者',
        //   name: 'employeeNo',
        //   required: true,
        //   children:
        //       <AntSelect
        //           className="form-control form-control-sm"
        //           bordered={false}
        //           showArrow={false}
        //           filterOption={(input, option) =>
        //               (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        //           }
        //           // options={employeeOption}
        //           // onChange={(e) => selChange("employeeNo", e)}
        //           // value={values.employeeNo}
        //       />
  
        // }
      ],
      [
        {
          label: '年齢',
          name: 'age',
          //maxLength: 6
        },
        {
          label: '国籍',
          name: 'nationalityCode',
        },
        {
          label: 'メール',
          name: 'mail',
        },
        {
          label: '電話番号',
          name: 'phoneNo',
        },
      ],
      [
        {
          label: '顧客出所',
          name: 'customerBase',
          required: true
          //maxLength: 6
        },
        {
          label: 'ビザ',
          name: 'residenceCode',
        },
        {
          label: '最寄駅',
          name: 'stationCode',
        },
        {
          label: '備考',
          name: 'remark',
        },
      ]
    ]
    
    const {
      nationalityCode,
      employeeFormCode,
      companyMail,
      phoneNo1,
      phoneNo2,
      phoneNo3,
      employmentInsurance, 
      socialInsuranceDate, 
      employeeStatus,
      graduationYearAndMonth,
      comeToJapanYearAndMonth,
      intoCompanyYearAndMonth,
      yearsOfExperience,
      temporary_graduationYearAndMonth,
      temporary_comeToJapanYearAndMonth,
      temporary_intoCompanyYearAndMonth,
      temporary_yearsOfExperience,
      retirementYearAndMonth,
      employmentInsuranceNo,
      socialInsuranceNo,
      temporary_retirementYearAndMonth,
      authorityCode,
      stationCodeValue,
      departmentCode,
      homesAgentCode,
    } = this.state;

    // 
    return (  
      <div className="container CustomerInsertNew">
        <Row className="text-center mb-3">
          <Col>
            <h2>お客様情報登録</h2>
          </Col>
        </Row>

        <Form>
          <Row className="mb-3">
                <Col sm={12}>
                  <Form.Label style={{ color: "#000000" }}>基本情報</Form.Label>
                </Col>
              </Row>
          <Row>
            
              {formCols.map((items, idx) => (
               
               <Col md={4} key={idx} >
                {items.map((item, idx) => (
                  <FromCol
                    key={idx}
                    {...item}
                    // value={values[item.name]}
                    // valueChange={valueChange}
                    required={item.required}
                  />
                ))}
                </Col>
              ))}
          </Row>
          
          <Row>
            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
                住所
              </Form.Label>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>郵便番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="郵便番号"
                  value={authorityCode}
                  onChange={this.valueChange}
                  name="postcode"
                  size="sm"
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
              &nbsp; 
              </Form.Label>
              <InputGroup size="sm" >
                <FormControl
                  placeholder="住所"
                  value={authorityCode}
                  onChange={this.valueChange}
                  name="Address"
                  size="sm"
                />
              </InputGroup>
              
            </Col>
          </Row>
          <Row >
            &nbsp;
          </Row>
          <div style={{ textAlign: "center" }}  >
              <Button
                size="sm"
                variant="info"
                onClick={this.insertCustomer}
                type="button"
              >
                <FontAwesomeIcon icon={faSave} /> 登録
              </Button>
            </div>
            <Row >&nbsp;</Row>
        </Form>
      </div>
    );
  }
}

export default CustomerInsertNew;
