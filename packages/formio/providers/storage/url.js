import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';

const android = RNFetchBlob.android;
const ios = RNFetchBlob.ios;

const url = formio => ({
  title: 'Url',
  name: 'url',
  uploadFile(file, fileName, dir, progressCallback, url) {
    return new Promise((resolve, reject) => {
      const data = {
        dir,
        file,
        name: fileName,
      };

      // Send the file with data.
      const xhr = new XMLHttpRequest();

      if (typeof progressCallback === 'function') {
        xhr.upload.onprogress = progressCallback;
      }

      const fd = new FormData();
      for (const key in data) {
        fd.append(key, data[key]);
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Need to test if xhr.response is decoded or not.
          let respData = {};
          try {
            respData =
              typeof xhr.response === 'string' ? JSON.parse(xhr.response) : {};
            respData = respData && respData.data ? respData.data : respData;
          } catch (err) {
            respData = {};
          }

          const url = respData.hasOwnProperty('url')
            ? respData.url
            : `${xhr.responseURL}/${fileName}`;
          resolve({
            storage: 'url',
            name: fileName,
            url,
            size: file.size,
            type: file.type,
            data: respData,
            id: JSON.parse(xhr.response).id,
          });
        } else {
          reject(xhr.response || 'Unable to upload file');
        }
      };

      // Fire on network error.
      xhr.onerror = () => reject(xhr);

      xhr.onabort = () => reject(xhr);

      xhr.open('POST', url);
      const token = formio.getToken();
      if (token) {
        xhr.setRequestHeader('x-jwt-token', token);
      }
      xhr.send(fd);
    });
  },
  downloadFile(file) {
    if (Platform.OS === 'ios') {
      let dirs = RNFetchBlob.fs.dirs.DocumentDir;
      console.log(dirs, 'document path');
      return RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        path: dirs + `/${file.name}`,
      })
        .fetch('GET', file.url)
        .progress((received, total) => {
          console.warn('progress', received / total);
        })
        .then(resp => {
          // the path of downloaded file
          console.warn(`Downloader response ->${JSON.stringify(resp)}`);
          ios.openDocument(resp.data);
        })
        .catch(err => {
          console.warn(`Downloader err -> ${err}`);
        });
    } else {
      console.warn(JSON.stringify(file));
      return RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
      })
        .fetch('GET', file.url)
        .progress((received, total) => {
          console.warn('progress', received / total);
        })
        .then(resp => {
          // the path of downloaded file
          console.warn(`Downloader response ->${JSON.stringify(resp)}`);
          android.actionViewIntent(resp.path(), file.mimeType);
        })
        .catch(err => {
          console.warn(`Downloader err -> ${err}`);
        });
    }
  },
});

url.title = 'Url';
export default url;
