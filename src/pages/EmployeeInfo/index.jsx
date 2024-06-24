import React from "react";

import * as publicUtils from "../../utils/publicUtils.js";

import store from "../../redux/store.js";
import request from '../../service/request.js';

import $ from "jquery";

// CSS & Images
import default_avatar from '../../assets/images/default_avatar.jpg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";

import "./index.css";
import "../../assets/css/style.css";
import "../../assets/css/newCssInsert.css";

import Autocomplete from "@material-ui/lab/Autocomplete";

import { 
  message as AntMessage,
  DatePicker as AntdDatePicker, 
} from "antd";

import { 
  Form, 
  Button, 
  Col, 
  Row, 
  InputGroup, 
  FormControl, 
  Image 
} from "react-bootstrap";

// Moment
import moment from "moment";
moment.locale("ja");

class EmployeeInfo extends React.Component {

  constructor(props) {
    super(props);

    const employee = this.props.location.state ? this.props.location.state.employee : {};

    this.state = { // 初期化
      employee: employee,

      // dropDown
      nationalityCodes: store.getState().dropDown[0] || [],
      stations: store.getState().dropDown[1] || [],
      employeeFormCodes: store.getState().dropDown[2] || [],
      departmentCodes: store.getState().dropDown[3] || [],
      homesAgentCodes: store.getState().dropDown[4] || [],
      authoritys: store.getState().dropDown[5] || [],
      employmentInsuranceStatus: [
        { code: "0", name: "未加入" },
        { code: "1", name: "加入済み" }
      ],
      // Temporary
      temporary_age: "",
      temporary_graduationYearAndMonth: "",
      temporary_comeToJapanYearAndMonth: "",
      temporary_intoCompanyYearAndMonth: "",
      temporary_yearsOfExperience: "",

      // 社員情報
      // Top
      employeeNo: employee.employeeNo || "",
      employeeFormCode: employee.employeeFormCode || "",

      // Top Left
      employeeFirstName: employee.employeeFirstName || "",
      employeeLastName: employee.employeeLastName || "",
      furigana1: employee.furigana || "",
      furigana2: employee.furigana || "",
      alphabetName1: employee.alphabetName || "",
      alphabetName2: employee.alphabetName || "",
      alphabetName3: employee.alphabetName || "",
      genderStatus: employee.genderStatus || "",
      birthday: employee.birthday ? moment(employee.birthday) : null,
      nationalityCode: employee.nationalityCode || "",
      birthplace: employee.birthplace || "",

      // Top Middle
      companyMail: employee.companyMail || "",
      phoneNo1: employee.phoneNo ? employee.phoneNo.substring(0, 3) : "",
      phoneNo2: employee.phoneNo ? employee.phoneNo.substring(3, 7) : "",
      phoneNo3: employee.phoneNo ? employee.phoneNo.substring(7, 11) : "",
      postalCode: employee.postalCode || "",
      firstHalfAddress: employee.firstHalfAddress || "",
      lastHalfAddress: employee.lastHalfAddress || "",
      stationCode : employee.stationCode || "",

      // Top Right
      image: default_avatar,

      // Bottom Left
      authorityCode: employee.authorityCode || "",
      graduationUniversity: employee.graduationUniversity || "",
      // major: employee.major || "",
      graduationYearAndMonth: employee.graduationYearAndMonth ? moment(employee.graduationYearAndMonth) : null,
      comeToJapanYearAndMonth: employee.comeToJapanYearAndMonth ? moment(employee.comeToJapanYearAndMonth) : null,
      intoCompanyYearAndMonth: employee.intoCompanyYearAndMonth ? moment(employee.intoCompanyYearAndMonth) : null,
      yearsOfExperience: employee.yearsOfExperience || null,

      // Bottom Middle
      homesAgentCode: employee.homesAgentCode || "",
      departmentCode: employee.departmentCode || "",
      residenceCode: employee.residenceCode || "",
      employmentInsurance: employee.employmentInsurance || "",
      socialInsuranceDate: employee.socialInsuranceDate ? moment(employee.socialInsuranceDate) : null,
      retirementYearAndMonth: employee.retirementYearAndMonth ? moment(employee.retirementYearAndMonth) : null,

      // Bottom Right
      employmentInsuranceNo: employee.employmentInsuranceNo ||"",
      socialInsuranceNo: employee.socialInsuranceNo || "",
      retirementResonClassificationCode: employee.retirementResonClassification || "",
    }
  }
  

  /**
   * 处理员工信息提交
   */
  handleEmployeeSubmit = (url, successMessage, errorMessage) => {

    let obj = document.getElementById("imageId");
    let imgSrc = obj.getAttribute("src");
    const emp = {
      // TODO: password
      password: publicUtils.nullToEmpty(this.state.passwordSetInfo),                // pw設定

      employeeNo: this.state.employeeNo,                                            // 社員番号
      employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode),       // 社員形式

      employeeFirstName: publicUtils.trim(this.state.employeeFirstName),            // 社員氏
      employeeLastName: publicUtils.trim(this.state.employeeLastName),              // 社員名
      furigana:                                                                     // カタカナ 
        publicUtils.nullToEmpty(this.state.furigana1) + " " + 
        publicUtils.nullToEmpty(this.state.furigana2),
      alphabetName:                                                                 // ローマ字
        publicUtils.nullToEmpty(this.state.alphabetName1) + " " +
        publicUtils.nullToEmpty(this.state.alphabetName2) + " " +
        publicUtils.nullToEmpty(this.state.alphabetName3),
      genderStatus: publicUtils.nullToEmpty(this.state.genderStatus),               // 性別
      birthday: publicUtils.formateDate(this.state.birthday, true),                 // 年齢
      nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode),         // 出身地
      birthplace: publicUtils.nullToEmpty(this.state.birthplace),                   // 出身地

      companyMail:                                                                  // 社内メール
        publicUtils.nullToEmpty(this.state.companyMail) === ""
          ? ""
          : this.state.companyMail + "@lyc.co.jp",
      phoneNo:                                                                      // 携帯電話
        publicUtils.nullToEmpty(this.state.phoneNo1) +
        publicUtils.nullToEmpty(this.state.phoneNo2) +
        publicUtils.nullToEmpty(this.state.phoneNo3), 
      postalCode: publicUtils.nullToEmpty(this.state.postalCode),                  // 郵便番号
      firstHalfAddress: publicUtils.nullToEmpty(this.state.firstHalfAddress),      // 都道府県
      lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),        // 以降住所
      stationCode: publicUtils.nullToEmpty(this.state.stationCode),                // 最寄駅
      picInfo: imgSrc,                                                             // 画像

      authorityCode: this.state.authorityCode,                                      // 権限
      graduationUniversity: publicUtils.nullToEmpty(                                // 卒業学校
        this.state.graduationUniversity),
      graduationYearAndMonth: publicUtils.formateDate(                              // 卒業年月
        this.state.graduationYearAndMonth,
        false
      ),
      comeToJapanYearAndMonth: publicUtils.formateDate(                             // 来日年月
        this.state.comeToJapanYearAndMonth, false),
      intoCompanyYearAndMonth: publicUtils.formateDate(                             // 入社年月
        this.state.intoCompanyYearAndMonth, true),
      yearsOfExperience: publicUtils.formateDate(                                   // 経験年数
        this.state.yearsOfExperience,
        false
      ),

      homesAgentCode: publicUtils.nullToEmpty(this.state.homesAgentCode),           // 仲介区分
      departmentCode: publicUtils.nullToEmpty(this.state.departmentCode),           // 部署
      residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),             // 在留資格
      employmentInsuranceStatus: publicUtils.nullToEmpty(                           // 雇用保険加入
        this.state.employmentInsurance
      ),
      socialInsuranceStatus: publicUtils.nullToEmpty(                               // 社会保険加入
        this.state.socialInsurance
      ),
      retirementYearAndMonth: publicUtils.formateDate(                              // 退職年月
        this.state.retirementYearAndMonth, true),
 
      employmentInsuranceNo: publicUtils.nullToEmpty(                               // 雇用保険番号
        this.state.employmentInsuranceNo
      ),
      socialInsuranceNo: publicUtils.nullToEmpty(                                   // 社会保険番号
        this.state.socialInsuranceNo
      ),
      retirementResonClassification: publicUtils.nullToEmpty(                       // 退職区分
        this.state.retirementResonClassificationCode
      ), 
    };
    
    request
      .post(url, emp, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((result) => {
        console.log('result', result);
        if (result) {
          AntMessage.success(successMessage);
        } else {
          AntMessage.error(errorMessage);
          this.setState({
            employeeFirstName: publicUtils.trim(this.state.employeeFirstName), // 社員氏
            employeeLastName: publicUtils.trim(this.state.employeeLastName), // 社員名
            disabledFalg: false,
          });
          // //window.location.reload();
          // store.dispatch({ type: "UPDATE_STATE", dropName: "getEmployeeName" });
          // store.dispatch({
          //   type: "UPDATE_STATE",
          //   dropName: "getEmployeeNameNoBP",
          // });
          // store.dispatch({
          //   type: "UPDATE_STATE",
          //   dropName: "getEmployeeNameByOccupationName",
          // });
          // //this.getNO(this.state.empNoHead);// 採番番号
          // setTimeout(() => this.changePage(), 3000);
        }
      })
      .catch((error) => {
        AntMessage.error("登録失敗")
      });
  };
  
  /**
   * 登録
   */
  insertEmployee = (event) => {
    event.preventDefault();
    this.handleEmployeeSubmit(
      "employee/insertEmployee",
      "登録しました",
      "登録失敗"
    );
  };

  /**
   * 更新
   */
  updateEmployee = (event) => {
    event.preventDefault();
    this.handleEmployeeSubmit(
      "employee/updateEmployee",
      "更新しました",
      "更新失敗"
    );
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

  valueChangeEmployeeInsuranceStatus = (event) => {
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

  /**
   * 卒業年月
   * 
   * @param {*} date 
   */
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
        case "employeeFirstName":
          this.setState({
            furigana1: date,
            employeeFirstName: value,
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

  /**
   * get maxID
   */

  componentDidMount() {
    this.fetchMaxEmployeeNo();
  }

  fetchMaxEmployeeNo = async () => {
    if (this.state.employeeNo !== "") {
      return;
    }
    try {
      const response = await request.get('/employee/getMaxEmployeeNo');
      const maxID = response.maxID;
      this.setState({
        employeeNo: maxID,
      });
    } catch (error) {
      AntMessage.error('Error fetching the max employee number');
    }
  };

  render() {
    const {
      employee,
      nationalityCodes,
      employeeFirstName,
      employeeFormCodes,
      companyMail,
      phoneNo1,
      phoneNo2,
      phoneNo3,
      employmentInsurance, 
      socialInsuranceDate, 
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
      stationCodeValue,
      departmentCodes,
      homesAgentCodes,
      stations,
      authoritys,
    } = this.state;

    const hasEmployeeData = Object.keys(employee).length > 0;

    // 
    return (  
      <div className="employeeInfo">
        <Row className="text-center mb-3">
          <Col>
            <h2>社員情報登録</h2>
          </Col>
        </Row>

        <Form>
          <Row className="mb-3">
                <Col sm={12}>
                  <Form.Label style={{ color: "#000000" }}>基本情報</Form.Label>
                </Col>
              </Row>
          <Row>
            <Col md={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>社員形式</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={employeeFormCodes || []}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(event, values) => {
                    console.log('values', values)
                    this.setState({
                      employeeFormCode: values.code,
                    });
                  }}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder=""
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
                
              </InputGroup>

              <InputGroup size="sm" className="required-mark">
                <InputGroup.Prepend>
                  <InputGroup.Text>社員名</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社員氏"
                  value={employeeFirstName}
                  onChange={this.valueChange}
                  onBlur={this.katakanaApiChange.bind(this)}
                  name="employeeFirstName"
                  size="sm"
                />
                <FormControl
                  placeholder="社員名"
                  value={this.state.employeeLastName}
                  onChange={this.valueChange}
                  onBlur={this.katakanaApiChange.bind(this)}
                  name="employeeLastName"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>カタカナ</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="カタカナ"
                  value={this.state.furigana1}
                  onChange={this.valueChange}
                  name="furigana1"
                  size="sm"
                />
                <FormControl
                  placeholder="カタカナ"
                  value={this.state.furigana2}
                  onChange={this.valueChange}
                  name="furigana2"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>ローマ字</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="first"
                  value={this.state.alphabetName1}
                  onChange={this.valueChange}
                  name="alphabetName1"
                  size="sm"
                />
                <FormControl
                  placeholder="last"
                  value={this.state.alphabetName2}
                  onChange={this.valueChange}
                  name="alphabetName2"
                  size="sm"
                />
                <FormControl
                  placeholder="last"
                  value={this.state.alphabetName3}
                  onChange={this.valueChange}
                  name="alphabetName3"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>性別</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  name="genderStatus"
                  value={this.state.genderStatus}
                  onChange={this.valueChange}
                  autoComplete="off"
                >
                  <option value="">選択してください</option>
                  <option value="0">男性</option>
                  <option value="1">女性</option>
                </Form.Control>
              </InputGroup>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={this.state.birthday ? moment(this.state.birthday) : ""}
                  onChange={this.inactiveBirthday}
                  format="YYYY/MM/DD"
                  locale="ja"
                  showMonthYearPicker
                  className="form-control form-control-sm"
                  autoComplete="off"
                  id="datePicker-empInsert-left"
                />
                </InputGroup.Prepend>
                <FormControl
                  id="temporary_age"
                  value={this.state.temporary_age}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="temporary_age"
                  disabled
                />
                <FormControl value="歳" size="sm" disabled />
              </InputGroup>

              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>国籍</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={nationalityCodes || []}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(event, values) => {
                    console.log('values', values)
                    this.setState({
                      nationalityCode: values.code,
                    });
                  }}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder=""
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
                <FormControl
                  placeholder="県"
                  value={this.state.birthplace}
                  onChange={this.valueChange}
                  name="birthplace"
                  size="sm"
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup size="sm" className="mb-3 required-mark">
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    社員番号
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社員番号"
                  value={this.state.employeeNo}
                  onChange={this.valueChange}
                  name="employeeNo"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    社内メール
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="email"
                  placeholder="メール"
                  value={companyMail}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="companyMail"
                />
                <FormControl value="@lyc.co.jp" size="sm" disabled />
              </InputGroup>
              <InputGroup size="sm" className="">
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    携帯電話
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo1}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo1"
                  maxLength="3"
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo2}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo2"
                  maxLength="4"
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo3}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo3"
                  maxLength="4"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    郵便番号
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="郵便番号"
                  value={this.state.postalCode}
                  onChange={this.valueChange}
                  onBlur={this.postApi.bind(this)}
                  name="postalCode"
                  size="sm"
                  id="postcode"
                  maxLength="7"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    都道府県
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="都道府県"
                  value={this.state.firstHalfAddress}
                  onChange={this.valueChange}
                  name="firstHalfAddress"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    以降住所
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="以降住所"
                  value={this.state.lastHalfAddress}
                  onChange={this.valueChange}
                  name="lastHalfAddress"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    最寄駅
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={stations || []}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(event, values) => {
                    console.log('values', values)
                    this.setState({
                      station: values.code,
                    });
                  }}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="例：秋葉原駅"
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>

            <Col md={4} className="text-center">
              <Col>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Prepend>
                    <Image 
                      src={this.state.image} 
                      id="imageId"
                      rounded
                      width="220" 
                      height="240"
                      onClick={(event) => this.addFile(event, "image")}
                    />
                  </InputGroup.Prepend>
                  <Form.File
                    id="image"
                    hidden
                    data-browse="添付"
                    custom
                    onChange={(event) => this.changeFile(event, "image")}
                    accept="image/png, image/jpeg"
                  ></Form.File>
                </InputGroup>
              </Col>
            </Col>
          </Row>
          
          <Row>
            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
                {/* 基本情報補足 */}
              </Form.Label>
              <InputGroup size="sm" className="required-mark">
                <InputGroup.Prepend>
                  <InputGroup.Text>権限</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={authoritys || []}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(event, values) => {
                    console.log('values', values)
                    this.setState({
                      authority: values.code,
                    });
                  }}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder=""
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>卒業学校</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="学校"
                  value={this.state.graduatedSchool}
                  onChange={this.valueChange}
                  name="graduatedSchool"
                  size="sm"
                />
                {/* <FormControl
                  placeholder="専門"
                  value={this.state.major}
                  onChange={this.valueChange}
                  name="major"
                  size="sm"
                /> */}
              </InputGroup>

              <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  卒業年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={graduationYearAndMonth ? moment(graduationYearAndMonth) : ""}
                  onChange={this.inactiveGraduationYearAndMonth}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_graduationYearAndMonth"
                value={temporary_graduationYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  来日年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={comeToJapanYearAndMonth ? moment(comeToJapanYearAndMonth) : ""}
                  onChange={this.inactiveComeToJapanYearAndMonth}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_comeToJapanYearAndMonth"
                value={temporary_comeToJapanYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  入社年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={intoCompanyYearAndMonth ? moment(intoCompanyYearAndMonth) : ""}
                  onChange={this.inactiveintoCompanyYearAndMonth}
                  format="YYYY/MM/DD"
                  locale="ja"
                  showMonthYearPicker
                  className="form-control form-control-sm"
                  autoComplete="off"
                  id="datePicker-empInsert-left"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_intoCompanyYearAndMonth"
                value={temporary_intoCompanyYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  経験年数
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={yearsOfExperience ? moment(yearsOfExperience) : ""}
                  onChange={this.inactiveyearsOfExperience}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  className="form-control form-control-sm"
                  autoComplete="off"
                  id="datePicker-empInsert-left"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_yearsOfExperience"
                value={temporary_yearsOfExperience}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
                
              </Form.Label>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    仲介区分
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={homesAgentCodes || []}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder=""
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
              </InputGroup>
              <InputGroup size="sm" className="">
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    部署
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="input-group-right-item"
                  options={departmentCodes || []}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="例：秋葉原駅"
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-emp-station"
                      />
                    </div>
                  )}
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    在留資格
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="在留資格"
                  value={this.state.residenceStatus}
                  onChange={this.valueChange}
                  name="residenceStatus"
                  size="sm"
                />
              </InputGroup>

              <InputGroup size="sm" className="flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="sevenKanji">
                    雇用保険加入
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={this.valueChangeEmployeeInsuranceStatus}
                  name="employmentInsurance"
                  value={employmentInsurance}
                  autoComplete="off"
                >
                  {this.state.employmentInsuranceStatus.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </InputGroup>
              
              <InputGroup size="sm" className="flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="sevenKanji">
                    社会保険加入
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={socialInsuranceDate ? moment(socialInsuranceDate) : ""}
                  onChange={this.socialInsuranceDateChange}
                  format="YYYY/MM/DD"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                />
              </InputGroup>           

              

              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text　id="sevenKanji">
                    退職年月日
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={retirementYearAndMonth ? moment(retirementYearAndMonth) : ""}
                  // onChange={this.socialInsuranceDateChange}
                  format="YYYY/MM/DD"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                  disabled
                />
              </InputGroup>
            </Col>
            <Col>
              <div className="blank-3"></div>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="雇用保険番号"
                  value={employmentInsuranceNo}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社会保険番号"
                  value={socialInsuranceNo}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>区分</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="退職区分"
                  name="temporary_retirementYearAndMonth"
                  value={temporary_retirementYearAndMonth}
                  onChange={this.valueChange}
                  size="sm"
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
            <div style={{ textAlign: "center" }}>
              <Button
                size="sm"
                variant={hasEmployeeData ? "warning" : "info"}
                onClick={hasEmployeeData ? this.updateEmployee : this.insertEmployee}
                type="button"
              >
                <FontAwesomeIcon icon={hasEmployeeData ? faEdit : faSave} /> {hasEmployeeData ? "更新" : "登録"}
              </Button>
            </div>
        </Form>
      </div>
    );
  }
}

export default EmployeeInfo;
