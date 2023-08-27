export const ImageSelector = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
        
        return {
            'selectedImage':imageFile,
            'displayImage':URL.createObjectURL(imageFile)
        }
    }
  };