import Permissions from "react-native-permissions";

export const requestStoragePermission = async () => {
  const writeResponse = await Permissions.request(
    Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
  );

  const readResponse = await Permissions.request(
    Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  );
  console.warn(writeResponse);
  if (
    writeResponse == Permissions.RESULTS.GRANTED &&
    readResponse == Permissions.RESULTS.GRANTED
  ) {
    return true;
  }
  return false;
};
