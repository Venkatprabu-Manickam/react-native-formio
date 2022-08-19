import React from 'react';
import ValueComponent from '../sharedComponents/Value';
import {Platform, StyleSheet, Modal, TextInput, ScrollView} from 'react-native';
import {View, Image, Text, TouchableHighlight} from 'react-native';
import {Button as ButtonElement} from 'react-native-elements';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';

export default class CostingGridComponent extends ValueComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.getElements = this.getElements.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.component.costingCallback();
  }

  getElements() {
    const {component, colors} = this.props;
    const {tableHead, tableData} = this.state;
    var lengthArray = [];
    if (tableHead && tableHead.length > 0) {
      tableHead.forEach(col => {
        lengthArray.push(140);
      });
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#fff',
      },
      parentModalContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      },
      modalContainer: {
        elevation: 10,
        shadowOffset: {width: 0, height: 4},
        shadowColor: 'gray',
        shadowOpacity: 0.7,
        shadowRadius: 8,
        backgroundColor: '#eeeeee',
        width: '90%',
        borderRadius: 10,
        padding: 8,
      },
      textInputStyle: {
        color: colors.BLACK,
        // width:'90%',
        marginStart: 8,
        marginEnd: 8,
        marginTop: 18,
        borderWidth: 0.5,
        borderColor: colors.GREY,
        marginBottom: 20,
        borderRadius: 4,
        backgroundColor: colors.WHITE,
      },
      head: {height: 40, backgroundColor: '#eeeeee'},
      text: {margin: 6},
      dataWrapper: {marginTop: -1},
      row: {height: 40},
      header: {height: 40, backgroundColor: '#eeeeee'},
    });
    return (
      <View style={styles.container}>
        {/* <Modal transparent={true} visible={showAddRow}>
          <View style={styles.parentModalContainer}>
            <View style={styles.modalContainer}>
              {tableHead.map((col, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 8,
                    backgroundColor: '#ffffff',
                  }}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                      <Text style={{fontSize: 16}}>{col}</Text>
                    </View>
                    <View style={{flex: 4}}>
                      <TextInput
                        onEndEditing={e => {
                          this._onChangeText(e.nativeEvent.text, col);
                        }}
                        ref={ref => {
                          this.inputRefs[col] = ref;
                        }}
                        style={styles.textInputStyle}
                      />
                    </View>
                  </View>
                </View>
              ))}
              <ButtonElement
                backgroundColor="transparent"
                title={'Submit'}
                titleStyle={{color: colors.primary1Color}}
                onPress={this.onSubmitNewRow}
                buttonStyle={{
                  marginTop: 2,
                  padding: 10,
                  borderStyle: 'dotted',
                  borderColor: '#bdbdbd',
                  backgroundColor: '#ffffff',
                  color: colors.primary1Color,
                }}
              />
            </View>
          </View>
        </Modal> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#636c7a',
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 8,
            }}>
            {this.props.component.label}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <ButtonElement
              backgroundColor="transparent"
              title={'View Costing'}
              titleStyle={{color: colors.white}}
              onPress={this.onClick}
              buttonStyle={{
                borderWidth: 1,
                marginBottom: 4,
                borderStyle: 'dotted',
                borderColor: '#bdbdbd',
                backgroundColor: '#2A2F49',
                color: colors.white,
                borderRadius:6,
              }}
            />
          </View>
        </View>
        {/* <Table borderStyle={{borderWidth: 1, borderColor: '#bdbdbd'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
        </Table> */}

        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#bdbdbd'}}>
              <Row
                data={tableHead}
                widthArr={lengthArray}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={lengthArray}
                    style={[styles.row]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
