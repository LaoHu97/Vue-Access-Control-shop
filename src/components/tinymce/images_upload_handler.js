import { uploadImage } from '../../api/shop';

const images_upload_handler = function (blobInfo, success, failure) {
  var xhr, formData;
  xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', uploadImage);
  xhr.onload = function () {
    var json;

    if (xhr.status != 200) {
      failure('HTTP Error: ' + xhr.status);
      return;
    }
    json = JSON.parse(xhr.responseText);

    console.log(json);

    if (!json || typeof json.data.locationPath != 'string') {
      failure('Invalid JSON: ' + xhr.responseText);
      return;
    }
    success(json.data.locationPath);
  };
  formData = new FormData();
  formData.append('file', blobInfo.blob());
  xhr.send(formData);
}

export default images_upload_handler