var model = undefined;
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.width = request.width;
    img.height = request.height;
    img.onload = () => {
        model.detect(img, 20, 0.3).then((predictions) => {
            sendResponse(predictions);
        });
    }
    img.src = request.url;
    return true;
});

cocoSsd.load().then((res) => {
    model = res;
    console.log("Model loaded");
});
