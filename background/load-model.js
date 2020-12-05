var model = undefined;
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    sendResponse(model.detect(request.img, 20, 0.3));
});

cocoSsd.load().then((res) => {
    model = res;
    console.log("Model loaded");
});

/*
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        sendResponse({model:cocoSsd});
});
*/
