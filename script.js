let model;

async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log('Model loaded');
}

async function predictFromImage(image) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .toFloat()
        .div(tf.scalar(255.0))
        .reshape([1, 28, 28, 1]);
    
    const prediction = model.predict(tensor);
    const result = Array.from(prediction.dataSync());
    const maxIndex = result.indexOf(Math.max(...result));
    return maxIndex.toString();
}

document.getElementById('uploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const image = new Image();
        image.onload = async () => {
            const result = await predictFromImage(image);
            displayResult(result);
        };
        image.src = URL.createObjectURL(file);
    }
});

async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;
    await new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
    return new Promise((resolve) => {
        video.onloadeddata = () => {
            resolve(video);
        };
    });
}

document.getElementById('captureBtn').addEventListener('click', async () => {
    const video = await setupCamera();
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const image = tf.browser.fromPixels(imageData);
    const result = await predictFromImage(image);
    displayResult(result);
    video.srcObject.getVideoTracks().forEach(track => track.stop());
});

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Predicted Digit:</h3><p>${result}</p>`;
}

loadModel();
