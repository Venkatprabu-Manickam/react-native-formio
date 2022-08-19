import React from 'react';
import ValueComponent from '../sharedComponents/Value';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';


export default class PRLinkComponent extends ValueComponent {
  constructor(props) {
    super(props);
    this.getElements = this.getElements.bind(this);
    this.onClickLinkedPR = this.onClickLinkedPR.bind(this);
  }

  onClickLinkedPR() {
    var processInstanceId = this.props.component.defaultValue.processInstanceId;
    var processKey = this.props.component.defaultValue.processDefinitionKey;
    this.props.component.prLinkCallBack(processInstanceId, processKey);
  }

  getElements() {
    const {component, colors} = this.props;
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#fff',
      }
    });
    return(
      <View style={{
        justifyContent: 'center',
        flex: 1,
        padding: 10,
      }}>
        <Text style={{color: '#636c7a', fontSize: 16, fontWeight:'bold'}}>
          {component.label}
        </Text>
        {
          component.defaultValue.prNumber ? (
              <View style={{marginTop : 6}}>
              <Text style={{fontSize:10, fontStyle:'italic'}}>Click here to view the linked PR</Text>
                <TouchableHighlight underlayColor="transparent"
                onPress={this.onClickLinkedPR}>
                <Text style={{color: colors.primary1Color, fontSize: 14}}>
                  {component.defaultValue.prNumber}
                </Text>
                </TouchableHighlight>
              </View>
          ) : (<Text>-</Text>)}
      </View>
    );
  }
}
