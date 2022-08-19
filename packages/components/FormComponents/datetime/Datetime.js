import React from "react";
import DateTimePicker from "react-native-modal-datetime-picker";
import MultiComponent from "../sharedComponents/Multi";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Button, Input } from "react-native-elements";
import styles from "./styles";
import moment from "moment";

export default class Datetime extends MultiComponent {
  constructor(props) {
    super(props);
    this.getInitialValue = this.getInitialValue.bind(this);
    this.getMode = this.getMode.bind(this);
    this.getDisplayFormat = this.getDisplayFormat.bind(this);
    this.getResultFormat = this.getResultFormat.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.getSingleElement = this.getSingleElement.bind(this);
  }

  getInitialValue(value) {
    if (!this.props) {
      return moment().toDate();
    }

    const dateFormat = this.props.component.dateFirst
      ? "DD/MM/YYYY"
      : "MM/DD/YYYY";
    if (
      value &&
      value.item &&
      moment(
        value.item,
        this.props.component.format.toUpperCase(),
        true
      ).isValid()
    ) {
      return moment(
        value.item,
        this.props.component.format.toUpperCase()
      ).toDate();
    } else if (this.props.component.defaultValue) {
      if (
        moment(this.props.component.defaultValue, "D-M-YYYY", true).isValid()
      ) {
        return moment(this.props.component.defaultValue, "D-M-YYYY").toDate();
      } else if (
        moment(this.props.component.defaultValue, "YYYY-M-D", true).isValid()
      ) {
        return moment(this.props.component.defaultValue, "YYYY-M-D").toDate();
      }
      return moment(this.props.component.defaultValue, dateFormat).toDate();
    } else {
      return moment().toDate();
    }
  }

  getMode() {
    switch (this.props.component.type) {
      case "datetime":
        return "datetime";
      case "day":
        return "date";
      case "time":
        return "time";
      default:
        return "date";
    }
  }

  getDisplayFormat() {
    switch (this.props.component.type) {
      case "datetime":
        return "MMMM DD, YYYY hh:mm A";
      case "day":
        return "DD-MM-YYYY";
      case "time":
        return "hh:mm A";
      default:
        return "MMMM DD, YYYY";
    }
  }

  getResultFormat() {
    const dateFirst = this.props.component.dateFirst;
    switch (this.props.component.type) {
      case "datetime":
        return dateFirst ? "DD/MM/YYYY : hh:mm A" : "MM/DD/YYYY : hh:mm A";
      case "day":
        return dateFirst ? "DD/MM/YYYY" : "MM/DD/YYYY";
      case "time":
        return "hh:mm A";
      default:
        return dateFirst ? "DD/MM/YYYY" : "MM/DD/YYYY";
    }
  }

  onConfirm(value, index) {
    const selected = moment(value);
    const dateFormat = this.getResultFormat();
    if (selected.isValid()) {
      const date = selected
        .format(this.props.component.format.toUpperCase())
        .toString();
      console.warn(`Selected data -> ${date}`);
      this.setValue(date, index);
    } else {
      // this fixes date module returning invalid date
      //if confirm button was pressed without touching date picker.
      value = moment()
        .format(dateFormat)
        .toString();
      this.setValue(value.toISOString(), index);
    }
    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      open: !this.state.open
    });
  }

  // getSingleElement(value, index) {
  //   const {component, name, readOnly, colors, theme} = this.props;
  //   const dateFormat = this.props.component.dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
  //   return (
  //     <View style={styles.date}>
  //       {this.state.value && this.state.value.item ?
  //         <Text style={[styles.dateText,theme.DateTimeText]}>{
  //           moment(this.state.value.item, dateFormat).format(this.getDisplayFormat())}
  //       </Text> : null }
  //       <Button
  //         disabled={readOnly}
  //         onPress={this.togglePicker}
  //         //containerViewStyle={styles.button}
  //         buttonStyle={{
  //           backgroundColor: colors.primary1Color,
  //           marginHorizontal: 10,
  //           marginVertical: 10,
  //         }}
  //         //color={this.props.colors.primary1Color}
  //         // title={component.type === 'time' ? 'Select time' : 'Select date'}
  //         title={component.type === 'time' ? 'Select time' : component.label ? component.label : 'Select date'}
  //         //leftIcon={{name: component.type === 'time' ? 'clock-o' : 'calendar', type: 'font-awesome'}}
  //       />
  //       <DateTimePicker
  //         isVisible={this.state.open}
  //         key="component"
  //         data-index={index}
  //         name={name}
  //         placeholder = {component.placeholder}
  //         pickerRefCb={(ref) => this.datepicker = ref}
  //         minuteInterval={this.props.component.timePicker ? this.props.component.timePicker.minuteStep : 5}
  //         mode={this.getMode()}
  //         date={this.getInitialValue(value)}
  //         onCancel={this.togglePicker}
  //         onConfirm={this.onConfirm}
  //       />
  //     </View>
  //   );
  // }

  getSingleElement(value, index) {
    const { component, name, colors, theme } = this.props;
    const readOnly = component.readOnly ? component.readOnly : false;
    const themeStyle = theme.Input;
    const dateFormat = this.props.component.dateFirst
      ? "DD/MM/YYYY"
      : "MM/DD/YYYY";
    const style = StyleSheet.create({
      container: {
        borderColor: themeStyle.borderColor
      },
      input: {
        color: themeStyle.color,
        fontSize: themeStyle.fontSize,
        lineHeight: themeStyle.lineHeight,
        flex: 1,
        maxWidth: 210
      }
    });
    return (
      <View style={styles.date}>
        <TouchableHighlight
          style={{ backgroundColor: "transparent" }}
          underlayColor={"transparent"}
          disabled={readOnly}
          onPress={this.togglePicker}
        >
          <Input
            editable={false}
            inputStyle={style.input}
            containerStyle={style.container}
            label={component.label}
            value={
              this.state.value && this.state.value.item
                ? moment(this.state.value.item, "D-M-YYYY", true).isValid()
                  ? moment(this.state.value.item, "D-M-YYYY").format(
                      this.getDisplayFormat()
                    )
                  : moment(this.state.value.item, "YYYY-M-D", true).isValid()
                  ? moment(this.state.value.item, "YYYY-M-D").format(
                      this.getDisplayFormat()
                    )
                  : ""
                : ""
            }
          />
        </TouchableHighlight>
        <DateTimePicker
          isVisible={this.state.open}
          key="component"
          data-index={index}
          name={name}
          placeholder={component.placeholder}
          pickerRefCb={ref => (this.datepicker = ref)}
          minuteInterval={
            this.props.component.timePicker
              ? this.props.component.timePicker.minuteStep
              : 5
          }
          mode={this.getMode()}
          date={this.getInitialValue(value)}
          onCancel={this.togglePicker}
          onConfirm={this.onConfirm}
        />
      </View>
    );
  }
}
