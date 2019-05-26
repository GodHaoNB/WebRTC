'use script'
let audioList = document.getElementById("audioList");
let videoList = document.getElementById("videoList");
let videoElement = document.querySelector("video#player");
let recpplayer = document.querySelector("video#recpplayer");
let audioElement = document.getElementById("audioplayer");
let filter = document.querySelector("select#filter");
let constranints = document.querySelector("div#constranints");
let record = document.querySelector("button#record");
let recplay = document.querySelector("button#recplay");
let download = document.querySelector("button#download");
let canvas = document.querySelector("canvas#canvas");
let mediaRecorder ;
let buffer;
canvas.width = 240;
caches.height = 640;
function init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("浏览器不支持 mediaDevices")
    } else {
        updateDeviceList();
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("浏览器不支持 getUserMedia")
    } else {
        const constrants = {
            video: {
                /**
                 * 视频宽,高
                 */
                width: 640,
                height: 480,
                /**。
                 * 设置帧率
                 */
                frameRate: 30,
                /**
                 * enviroment:后置摄像头
                 * user:前置摄像头
                 */
                facingMode: 'enviroment'
            },
            // audio: {
            //     noiseSupperssion:true,
            //     echoCancellation:true
            // }
            audio: false
        }
        getMediasStream(constrants)
    }
}

/**
 * 获取音视频设备权限
 */
function updateDeviceList() {
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            console.log(devices)
            audioList.innerHTML = "";
            videoList.innerHTML = "";
            devices.forEach(function (device) {
                let elem = document.createElement("li");
                let [kind, type, direction] = device.kind.match(/(\w+)(input|output)/i);
                elem.innerHTML = "<strong>" + device.label + "</strong> (" + direction + ")";
                if (type === "audio") {
                    audioList.appendChild(elem);
                } else if (type === "video") {
                    videoList.appendChild(elem);
                }
            });
        }).catch(info => {
            console.log(info)
        });
}
/**
 * 音视频数据采集
 * @param {*} constrants 
 */
function getMediasStream(constrants) {

    navigator.mediaDevices.getUserMedia(constrants).then((stream) => {
        window.stream = stream;
        videoElement.srcObject = stream;
        // audioElement.srcObject = stream;
    }).catch((err) => {
        console.log(err.name + "---" + err.massage);
    })
}
init();
videoElement.onchange = init();
filter.onchange = () => {
    videoElement.className = filter.value;
}
btnSanpShop.onclick = () => {
    canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
}
/**
 * 录制文件保存值二进制数组
 * @param {录制事件} e 
 */
function handleAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data)
    }
}
/**
 * 开启视频录制
 */
function startRecord() {
    let options = {
        mimeType: 'video/webm;codecs=vp8'
    }
    buffer=[];
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`)
        return;
    }
    try {
         mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (error) {
        console.error('Failed to create MediaRecorder', error)
    }
    mediaRecorder.ondataavailable = handleAvailable;
    mediaRecorder.start(10);
}
/**
 * 结束视频录制
 */
function stopRecord() {
    mediaRecorder.stop();
}
record.onclick = () => {
    if (record.textContent === 'start record') {
        startRecord();
        record.textContent = "stop record";
        recplay.disabled = true;
        download.disabled = true;
    } else {
        stopRecord();
        record.textContent = "start record";
        recplay.disabled = false;
        download.disabled = false;
    }
}
recplay.onclick=()=>{
    var blob = new Blob(buffer,{type:'video/webm'});
    recpplayer.src=window.URL.createObjectURL(blob);
    recpplayer.srcObject=null;
    recpplayer.contains=true;
    recpplayer.play();
}
download.onclick=()=>{
    var blob = new Blob(buffer, { type: 'video/webm' });
    let url = window.URL.createObjectURL(blob);
    let a =document.createElement("a");
    a.href=url;
    a.display='none';
    a.download='GodHao.webm';
    a.click();
}