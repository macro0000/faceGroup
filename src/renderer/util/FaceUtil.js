import * as faceapi from 'face-api.js';
import { createCanvas } from 'face-api.js';


const _promise = (data, call) => {
    return new Promise(function (resolve, reject) {
        call(resolve, reject)
    })
}

(function(){
    // faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
})();

const FaceUtil = {
    getCNN: (path) => {
        var canvas = createCanvas(300, 300);
        canvas.toDataURL("file://C://Users//macrocc//Desktop//faceGrouop//蓝底照片.jpg")

        const minConfidence = 0.8
        const fullFaceDescriptions = faceapi.allFaces(canvas, minConfidence)
        fullFaceDescriptions.then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    },

};



function loadLabeledImages(url) {
    
}



export default FaceUtil;