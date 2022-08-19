# React Native Formio Renderer

A React Native Library for formio specifically developed to support with Form definition.


## Prerequisites
yarn add rn-fetch-blob yarn add react-native-device-info



## Install
### npm
npm i react-native-formio-renderer

### yarn 
yarn add react-native-formio-renderer

### iOS
cd ios pod install


## Props

### `src` : `string`

The form API source from [form.io](https://www.form.io) or your custom formio server.

See the [Creating a form](http://help.form.io/userguide/#new-form)
for where to set the API Path for your form.

You can also pass in the submission url as the `src` and the form will render with the data populated from the submission.

### `form` : `object`

An object representing the form. Use this instead of src for custom forms. 

**Note:** `src` will override this property if used.

### `submission`: `Object`

An object representing the default data for the form.

**Note:** `src` will override this if a submission url is entered.

### `onChange` : `(submission: object, key: string, value: mixed)`

A function callback that will be called when any field is changed. The full submission is passed as well as the field
that is changing's key and value.

### `onFormSubmit` : `(submission: object)`

A function callback that will be called when a submission is successful.

### `onFormError` : `(response: object)`

A function callback that will be called when a submisison is unsuccessful.

### `onFormLoad` : `(form: object)`

A function callback that will be called with a form is finished loading.

### `onSubmissionLoad` : `(submission: object)`

A function callback that will be called after a submission is loaded.

### `onElementRender` : `(element: object)`

A function callback that will be called each time a component is rendered.

### `options : object`

A settings object to pass various options into the form. skipInit will stop the form from initialling setting values
on the submission object which will result in data only changing when a user interacts with the form.

```javascript
options={
  skipInit: true
}
```

## License
Released under the ISC
