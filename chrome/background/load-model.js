var model = undefined;
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    let data = Object.values(request.data);
    let width = request.width;
    let height = request.height;
    let img = new ImageData(Uint8ClampedArray.from(data), width, height);
    model.detect(img, 20, 0.3).then((predictions) => sendResponse(predictions));
});

cocoSsd.load().then((res) => {
    model = res;
    console.log("Model loaded");
});
