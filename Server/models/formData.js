let formData = {
  caption: "posted from social genie's Server!",
};

let newPhotoUploaded = false;

function setFormData(obj) {
  formData = obj;
}

function getFormData() {
  return formData;
}

function setNewPhoto(val) {
  newPhotoUploaded = val;
}

function getNewPhotoUploaded() {
  return newPhotoUploaded;
}

exports.setFormData = setFormData;
exports.getFormData = getFormData;
exports.setNewPhoto = setNewPhoto;
exports.getNewPhotoUploaded = getNewPhotoUploaded;
