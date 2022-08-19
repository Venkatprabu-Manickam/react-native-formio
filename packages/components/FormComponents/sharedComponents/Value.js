import { deepEqual } from "../../../util";
import clone from "lodash/clone";
import BaseComponent from "./Base";
import PropTypes from "prop-types";
import { validate } from "../componentUtils/validators";
import { safeSingleToMultiple } from "../componentUtils/safeSingleToMultiple";
import { getDefaultValue } from "../componentUtils/getDefaultValue";
import Formio from "../../../formio";

export default class ValueComponent extends BaseComponent {
  constructor(props) {
    super(props);
    const value = getDefaultValue(
      this.props.value,
      this.props.component,
      this.getInitialValue,
      this.onChangeCustom
    );
    // console.log('Value props--> ' +JSON.stringify(value));
    const valid = this.validate(value);
    this.state = {
      selectItems: [],
      searchTerm: "",
      hasNextPage: false,
      showDownloadProgress: false,
      showProgress: false,
      open: false,
      showSignaturePad: false,
      value: value,
      isValid: valid.isValid,
      errorType: valid.errorType,
      errorMessage: valid.errorMessage,
      isPristine: true,
      images: this.props.component.type == 'file' && this.getFileValue(value),
      tableHead:
        (this.props.component.type == 'grid' || this.props.component.type == 'costing-grid')
          ? this.props.component.colHeaders
          : [],
      tableData:
        (this.props.component.type == 'grid' || this.props.component.type == 'costing-grid')
          ? this.getGridValue(value, this.props.component.colKeys)
          : [],
    };
    if (typeof this.customState === "function") {
      this.state = this.customState(this.state);
    }
    this.data = {};
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setValue = this.setValue.bind(this);
    this.getDisplay = this.getDisplay.bind(this);
    this.getElements = this.getElements.bind(this);
    // this.setDefaultImages = this.setDefaultImages.bind(this);
    this.addImage = this.addImage.bind(this);
    this.setProgressState = this.setProgressState.bind(this);
  
  }

  getFileValue(value) {
    if (value) {
      if (Array.isArray(value)) {
        return value.map(v => ({
          url: v.url,
          mimeType: v.mimeType,
          name: v.name,
        }));
      } else {
        return [
          {
            url: value.url,
            mimeType: value.mimeType,
            name: value.name,
          },
        ];
      }
    }
    return [];
  }

  getGridValue(value, columnKey) {
    var rows = [];
    if(value) {
      var val = JSON.parse(value);
      if(val.data) {
        val.data.forEach(row =>{
          var rowArray = [];
          columnKey.forEach(col => {
            if(row[col]) {
              rowArray.push(row[col]);
            } else {
              rowArray.push('');
            }
          })
          rows.push(rowArray);
        })
      }
    }
    return rows;
  }

  componentDidMount() {
    this.unmounting = false;
    if (
      !this.props.options ||
      !this.props.options.skipInit ||
      !this.props.options.isInit
    ) {
      this.setValue(this.state.value, null, true);
    }
    if (typeof this.props.attachToForm === "function") {
      this.props.attachToForm(this);
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
    if (typeof this.props.detachFromForm === "function") {
      this.props.detachFromForm(this);
    }
  }

  componentDidUpdate(prevProps) {
    const { component } = prevProps;
    let value;
    if (
      component.hasOwnProperty("calculateValue") &&
      component.calculateValue
    ) {
      if (!deepEqual(this.data, this.props.data)) {
        this.data = clone(this.props.data);
        try {
          const result = eval(
            "(function(data, row) { const value = [];" +
              component.calculateValue.toString() +
              "; return value; })(this.data, this.props.row)"
          );
          if (this.state.value !== result) {
            this.setValue(result);
          }
        } catch (e) {
          /* eslint-disable no-console */
          console.warn(
            "An error occurred calculating a value for " + component.key,
            e
          );
          /* eslint-enable no-console */
        }
      }
    }

    if (
      this.props.value &&
      (!prevProps.value || prevProps.value !== this.props.value)
    ) {
      value = safeSingleToMultiple(this.props.value, this.props.component);
    }

    // This occurs when a datagrid row is deleted.
    let defaultValue = getDefaultValue(
      value,
      this.props.component,
      this.getInitialValue,
      this.onChangeCustom
    );
    if (value === null && this.state.value !== defaultValue) {
      value = defaultValue;
      this.setState({
        isPristine: true
      });
    }
    if (typeof value !== "undefined" && value !== null) {
      const valid = this.validate(value);
      this.setState({
        value: valid,
        isValid: valid.isValid,
        errorType: valid.errorType,
        errorMessage: valid.errorMessage
      });
    }
    if (typeof this.willReceiveProps === "function") {
      this.willReceiveProps(this.props);
    }
  }

  validate(value) {
    return validate(
      value,
      this.props.component,
      this.props.data,
      this.validateCustom
    );
  }

  onChange(event) {
    let value = event.nativeEvent.text;
    // Allow components to respond to onChange event.
    if (typeof this.props.onChangeCustom === "function") {
      value = this.props.onChangeCustom(value);
    }
    const index = this.props.component.multiple
      ? event.nativeEvent.target
      : null;
    this.setValue(value, index);
  }

  setValue(value, index, pristine) {
    if (index === undefined) {
      index = null;
    }
    let newValue;
    if (index !== null && Array.isArray(this.state.value)) {
      // Clone so we keep state immutable.
      newValue = clone(this.state.value);
      newValue[index] = value;
    } else {
      newValue = value;
    }
    const validatedValue = this.validate(newValue);
    this.setState(
      {
        isPristine: !!pristine,
        value: validatedValue
      },
      () => {
        if (typeof this.props.onChange === "function") {
          if (
            !this.state.isPristine ||
            (this.props.value &&
              this.props.value.item !== this.state.value.item)
          ) {
            this.props.onChange(this);
          }
        }
      }
    );
  }

  // setDefaultImages() {
  //   this.setState({
  //     images: this.state.value.item.map(i => {
  //       if (i.hasOwnProperty("id")) {
  //         return {
  //           url: `https://approval.emircom.com/api/v1/public/content/${i.id}/raw`
  //         };
  //       }
  //       return i;
  //     })
  //   });
  // }

  addImage(data) {
    this.setState({ images: [...this.state.images, data] });
  }

  setProgressState(state) {
    this.setState({ showProgress: state });
    this.forceUpdate();
  }

  setDownloadProgress(state) {
    this.setState({ showDownloadProgress: state });
    this.forceUpdate();
  }

  getDisplay(component, value) {
    if (typeof this.getValueDisplay === "function") {
      if (
        Array.isArray(value) &&
        component.multiple &&
        component.type !== "file"
      ) {
        return value.map(this.getValueDisplay.bind(null, component)).join(", ");
      } else {
        return this.getValueDisplay(component, value);
      }
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    // If this is still an object, something went wrong and we don't know what to do with it.
    if (typeof value === "object") {
      return "[object Object]";
    }
    return value;
  }

  render() {
    let element;
    if (typeof this.props.onElementRender === "function") {
      element = this.props.onElementRender(this, element);
    }
    element = this.getElements();
    return element;
  }

  get fileService() {
    if (this.props.options.fileService) {
      return this.props.options.fileService;
    }
    if (this.props.options.formio) {
      return this.props.options.formio;
    }
    const formio = new Formio();
    return formio;
  }
}

ValueComponent.propTypes = {
  data: PropTypes.any,
  options: PropTypes.object,
  component: PropTypes.any,
  value: PropTypes.any,
  images: PropTypes.array,
  row: PropTypes.any,
  onChange: PropTypes.func,
  onElementRender: PropTypes.func,
  attachToForm: PropTypes.func,
  detachFromForm: PropTypes.func
};
