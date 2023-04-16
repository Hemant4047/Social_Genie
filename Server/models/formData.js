let formData = {
  caption: "post scheduled from social genie's Server!",
  publishDate: null,
};

let newPhotoUploaded = false;

function setFormCaption(str) {
  formData.caption = str;
}

function setFormDate(date) {
  formData.publishDate = date;
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

exports.setFormCaption = setFormCaption;
exports.setFormDate = setFormDate;
exports.getFormData = getFormData;
exports.setNewPhoto = setNewPhoto;
exports.getNewPhotoUploaded = getNewPhotoUploaded;
