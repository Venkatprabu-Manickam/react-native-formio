import React from "react";
import InputComponent from "../sharedComponents/Input";
import { StyleSheet, Text, View } from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import styles from "./styles";

export default class Radio extends InputComponent {
  constructor(props) {
    super(props);

    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.getRadioButton = this.getRadioButton.bind(this);
    this.getSingleElement = this.getSingleElement.bind(this);
    this.getValueDisplay = this.getValueDisplay.bind(this);
  }

  onChangeRadio(value, index) {
    this.setValue(value);
  }

  getRadioButton(v, id, key, index, horizontal) {
    const { component } = this.props;
    const readOnly = component.readOnly ? true : false;
    return (
      <RadioButton
        labelHorizontal={horizontal}
        key={id}
        style={styles.radioButton}
      >
        <RadioButtonInput
          obj={v}
          index={index}
          isSelected={v.value === this.state.value.item}
          onPress={this.onChangeRadio}
          disabled={readOnly}
          borderWidth={2}
          buttonColor={this.props.colors.primary1Color}
          buttonSize={10}
          buttonStyle={{}}
          buttonWrapStyle={styles.radioButtonWrap}
        />
        <RadioButtonLabel
          obj={v}
          index={index}
          disabled={readOnly}
          onPress={this.onChangeRadio}
          labelStyle={styles.label}
          labelWrapStyle={{}}
        />
      </RadioButton>
    );
  }

  getSingleElement(value, index, error) {
    index = index || 0;
    let key = this.props.component.key;
    if (this.props.hasOwnProperty('rowIndex')) {
      key += '-' + this.props.rowIndex;
    }

    const radioFormStyle = {
      ...StyleSheet.flatten(styles.radioForm),
      marginLeft: this.props.component.inline ? 20 : 0,
    };
    return (
      <View style={{flex: 1}}>
        <Text
          style={{
            color: '#636c7a',
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 10,
          }}>
          {this.props.component.label}
        </Text>
        <RadioForm
          formHorizontal={this.props.component.inline}
          animation={true}
          style={radioFormStyle}>
          {this.props.component.values.map((v, id) => {
            return this.getRadioButton(
              v,
              id,
              key,
              index,
              this.props.component.inline,
            );
          })}
          <View style={{padding:8}}>
            <Text style={{color:'red', fontSize:12}}>
              {error && this.state.value.errorMessage
                ? this.state.value.errorMessage
                : ''}
            </Text>
          </View>
        </RadioForm>
      </View>
    );
  }

  getValueDisplay(component, data) {
    for (let i in component.values) {
      if (component.values[i].value === data) {
        return component.values[i].label;
      }
    }
    return data;
  }
}
