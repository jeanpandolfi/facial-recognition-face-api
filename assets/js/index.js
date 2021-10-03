const cam = document.getElementById('cam')
const startVideo = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        if (Array.isArray(devices)) {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    if (device.label.includes('')) {
                        navigator.getUserMedia(
                            { video: {
                                deviceId: device.deviceId
                            }},
                            stream => cam.srcObject = stream,
                            error => console.error(error)
                        )
                    }
                }
            })
        }
    })
}

//api de redes neurais
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),//square
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),//traços
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),//reconhecimento
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),//expressoes faciais
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),//idade
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'),//usada internamente pra desenhar
]).then(startVideo)

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(
                cam,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, canvasSize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
    }, 100)
})