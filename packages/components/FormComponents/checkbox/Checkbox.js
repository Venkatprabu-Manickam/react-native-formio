import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import ValueComponent from '../sharedComponents/Value';
import {CheckBox} from 'react-native-elements';

export default class CheckBoxComponent extends ValueComponent {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.getElements = this.getElements.bind(this);
    this.getValueDisplay = this.getValueDisplay.bind(this);
  }

  onChange(checked) {
    this.setValue(checked);
  }

  getElements() {
    const {component, colors} = this.props;
    const readOnly = component.readOnly ? component.readOnly : false;
    const {value} = this.state;

    const containerStyle = {
      backgroundColor: colors.mainBackground,
      borderWidth: 0,
      paddingHorizontal: 0,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    };

    const textStyle= {
      fontSize: 18,
      color: colors.primary1Color
    };

    return (
      <CheckBox
        disabled={readOnly}
        onPress={() => this.onChange(!value.item)}
        checkedColor={this.props.colors.primary1Color}
        title={!(component.hideLabel && component.datagridLabel === false) ? component.label : ''}
        checked={value.item}
        containerStyle={containerStyle}
        textStyle={textStyle}
        style={{
          marginHorizontal: 0
        }}
      />
    );
  }

  getValueDisplay(component, data) {
    return data ? 'Yes' : 'No';
  }
}

