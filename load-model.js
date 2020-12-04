var model = undefined;
console.log("Banana boat");
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    console.log("Received img", request);
    sendResponse(model.detect(request.img, 20, 0.3));
});

cocoSsd.load().then((res) => {
    console.log("model loaded"); 
    model = res;
});

/*
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        sendResponse({model:cocoSsd});
});
*/
