export const UploadImageAPI = (formData, setProgress) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/api/uploadImage', true);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setProgress((e.loaded / e.total) * 100);
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.filePath); // 파일 경로를 resolve 합니다.
      } else if(xhr.readyState === XMLHttpRequest.DONE) {
        reject(xhr.status); // 오류 발생시 상태 코드를 reject 합니다.
      }
    };
    xhr.send(formData);
  });
};