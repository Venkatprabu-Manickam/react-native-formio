import React from 'react';
import ValueComponent from '../sharedComponents/Value';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';
import {
  Platform,
  StyleSheet,
  ProgressBarAndroid,
  ProgressViewIOS,
} from 'react-native';
import {Button as ButtonElement} from 'react-native-elements';
import url from '../../../formio/providers/storage/url';
import {View, Image, Text, TouchableHighlight} from 'react-native';
import Formio from '../../../formio';
import RNFetchBlob from 'rn-fetch-blob';
import {requestStoragePermission} from '../../../util/RuntimePermissions';

const android = RNFetchBlob.android;
const ios = RNFetchBlob.ios;
export default class FileUploadComponent extends ValueComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.getElements = this.getElements.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  async pickFile() {
    return new Promise((resolve, reject) => {
      FilePickerManager.showFilePicker(null, res => {
        if (res) {
          resolve(res);
        } else {
          reject('Error in picker');
        }
      });
    });
  }

  async onClick(event) {
    try {
      const permission = await requestStoragePermission();
      let res;
      let path;
      let fileName;
      // if (permission) {
      if (Platform.OS === 'android' && permission) {
        res = await this.pickFile();
        path = {
          size: res.size,
          type: res.type,
          path: res.path,
          filename: res.fileName,
        };
        fileName = res.fileName;
      } else {
        res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        path = await RNFetchBlob.fs.stat(
          res.uri.replace('file:///private', ''),
        );
        fileName = res.name;
      }
      const data = {
        uri: res.uri,
        type: res.type, // mime type
        name: fileName,
        size: res.size,
        path: path,
      };
      this.setProgressState(true);
      this.fileService
        .uploadFile(
          'url',
          data,
          data.name,
          '',
          () => console.warn('Progressing'),
          this.props.component.url,
        )
        .then(res => {
          let updatedValue;
          if (res.data) {
            this.addImage(data);
            this.setProgressState(false);
            if (this.state.value.item && Array.isArray(this.state.value.item)) {
              var varArr = this.state.value.item.reduce(function(
                acc,
                value,
              ) {
                if (typeof value === 'object') {
                  acc.push(value.id);
                } else {
                  acc.push(value);
                }
                return acc;
              },
              []);
              varArr.push(res.id);
              updatedValue = varArr.join(',');
            } else {
              updatedValue = res.id;
            }
            this.setValue(updatedValue);
          }
        })
        .catch(err => {
          this.setProgressState(false);
          console.warn(`err in upload -> ${JSON.stringify(err)}`);
        });
      // }
    } catch (err) {
      this.setProgressState(false);
      console.warn('err from picker', err);
    }
  }

  checkCanUpload(isReadOnly = false, images = [], isMultiple = false) {
    if (isReadOnly) {
      return false;
    }
    if (isMultiple) {
      return true;
    }
    if (images.length === 0) {
      return true;
    }
  }

  getElements() {
    const {component, colors} = this.props;
    const readOnly = component.readOnly ? component.readOnly : false;
    const {value, images, showProgress, showDownloadProgress} = this.state;
    // console.log("Images => " + JSON.stringify(images));
    const canUpload = this.checkCanUpload(
      this.props.component.readOnly,
      images,
      this.props.component.multiple,
    );
    const styles = StyleSheet.flatten({
      button: {
        width: '100%',
        alignSelf: 'center',
        marginHorizontal: 10,
        paddingHorizontal: component.block ? 20 : 0,
        marginTop: 20,
        marginBottom: 10,
        color: colors.primary1Color,
        backgroundColor: 'transparent',
      },
    });

    return (
      <View style={{
        justifyContent: 'center',
        flex: 1,
        padding: 10,
      }}>
        <Text style={{color: '#636c7a', fontSize: 16, fontWeight:'bold'}}>
          {this.props.component.label}
        </Text>

        {images.length > 0 ? (
          <View
            >
            {images.map(i => {
              return (
                <View
                  style={{
                    borderColor: colors.primary1Color,
                    marginVertical: 10,
                  }}>
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => {
                      this.setDownloadProgress(true);
                      console.warn(JSON.stringify(i));
                      if (i.hasOwnProperty('uri')) {
                        this.setDownloadProgress(false);
                        if (Platform.OS === 'ios') {
                          ios.openDocument(i.uri);
                        } else {
                          android.actionViewIntent(`${i.path.path}`, i.type);
                        }
                      } else {
                        url(Formio)
                          .downloadFile(i)
                          .then(() => {
                            this.setDownloadProgress(false);
                            console.log('Download Complete');
                          })
                          .catch(() => {
                            console.log('Download Failed');
                          });
                      }
                    }}>
                    {i.hasOwnProperty('uri') ? (
                      i.type.match('image') ? (
                        <Image
                          style={{height: 150, width: 150}}
                          source={{uri: i.uri}}
                        />
                      ) : (
                        <Text
                          style={{
                            color: colors.primary1Color,
                            fontSize: 14,
                          }}>
                          {i.name}
                        </Text>
                      )
                    ) : i.mimeType.match('image') ? (
                      <Image
                        style={{height: 150, width: 150}}
                        source={{uri: i.url}}
                      />
                    ) : (
                      <Text style={{color: colors.primary1Color, fontSize: 14}}>
                        {i.name}
                      </Text>
                    )}
                  </TouchableHighlight>
                </View>
              );
            })}
          </View>
        ) : null}

        {showDownloadProgress ? (
          <View style={{marginTop: 4}}>
            <Text style={{fontSize: 14}}>Downloading...</Text>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid styleAttr="Horizontal" indeterminate={true} />
            ) : (
              <ProgressViewIOS />
            )}
          </View>
        ) : null}

        {showProgress ? (
          <View style={{marginTop: 4}}>
            <Text style={{fontSize: 14}}>Uploading...</Text>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid styleAttr="Horizontal" indeterminate={true} />
            ) : (
              <ProgressViewIOS />
            )}
          </View>
        ) : null}
        
        {canUpload ? (
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              padding: 10,
            }}>
            <ButtonElement
              containerViewStyle={styles.button}
              backgroundColor="transparent"
              title={'Upload File'}
              titleStyle={{color: colors.primary1Color}}
              onPress={this.onClick}
              buttonStyle={{
                borderWidth: 1,
                marginTop: 4,
                borderStyle: 'dotted',
                borderColor: '#bdbdbd',
                backgroundColor: 'transparent',
                color: colors.primary1Color,
              }}
            />
          </View>
        ) : null}        
      </View>
    );
  }
}
