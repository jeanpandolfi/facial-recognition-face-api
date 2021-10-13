const cam = document.getElementById('cam')
const startVideo = () => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            if (Array.isArray(devices)) {
                devices.forEach(device => {
                    if (device.kind === 'videoinput') {
                        if (device.label.includes('')) {
                            navigator.getUserMedia({
                                    video: {
                                        deviceId: device.deviceId
                                    }
                                },
                                stream => cam.srcObject = stream,
                                error => console.error(error)
                            )
                        }
                    }
                })
            }
        })
}

const loadLabels = () => {
    const labels = ['Douglas Braga', 'Jean Pandolfi']
    return Promise.all(labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 5; i++) {
            const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/${i}.jpg`)
            const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor()
            descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }))
}

//api de redes neurais
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'), //square
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'), //traços
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'), //reconhecimento
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'), //expressoes faciais
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'), //idade
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'), //usada internamente pra desenhar
]).then(() => {
    // startVideo();
    loadLabels().then((result => {
        const labels = result.map(label => {
            return {name: label.label, descriptors: label.descriptors}
        })
        save(labels)
        .then(result => console.log(result))

    }))
})

// Promise.all([
//     loadLabels()
// ]).then((result) => console.log(result))

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    const labels = await loadLabels()
    
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(
                cam,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors()

        const resizedDetections = faceapi.resizeResults(detections, canvasSize)
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.6)

        const results = resizedDetections.map(d =>
            faceMatcher.findBestMatch(d.descriptor)
        )

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        resizedDetections.forEach(detection => {
            const { age, gender, genderProbability } = detection
            new faceapi.draw.DrawTextField([
                `${parseInt(age, 10)} years`,
                `${gender} (${parseInt(genderProbability * 100, 10)})`
            ], detection.detection.box.topRight).draw(canvas)
        })

        results.forEach((result, index) => {
            const box = resizedDetections[index].detection.box
            const { label, distance } = result
            new faceapi.draw.DrawTextField([
                `${label} (${parseInt(distance * 100, 10)})`
            ], box.bottomRight).draw(canvas)
        })
    }, 100)
})

async function saveAllFaces(personFaces) {
    console.log('Body Enviado: ', personFaces)
    const response = await fetch(`http://localhost:3000/face-all`, {
        method: 'POST',
          body: JSON.stringify(personFaces),
          mode: 'no-cors'
    })
    return response;
}

async function getAllFaces() {
    const response = await fetch('http://localhost:3000/face-all')
    return response.json();
}

async function save(faces) {
    
    return await fetch('http://localhost:8080/face', {
        method: 'POST',
        body: { nome: "Jean Pandolfi", idade: 22},
        headers: {
          'Content-type': 'application/json',
        },
        mode: 'no-cors'
      })
    
}
