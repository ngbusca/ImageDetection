$(window).on("load", ()=>{
 console.log("Running Image Detection!");

 function drawBoxes(ctx, predictions) {
    for(var i = 0; i < predictions.length; ++i){
      let clas = predictions[i].class;
      let score = predictions[i].score;
      let bbox = predictions[i].bbox;

      ctx.font = "9px Arial";
      ctx.fillStyle = "red";
      let text = `${clas}: ${score.toFixed(3)}`;
      ctx.fillText(text,bbox[0], bbox[1]-10);
      ctx.moveTo(bbox[0], bbox[1]);
      ctx.lineTo(bbox[0] + bbox[2], bbox[1]);
      ctx.lineTo(bbox[0] + bbox[2], bbox[1] + bbox[3]);
      ctx.lineTo(bbox[0], bbox[1] + bbox[3]);
      ctx.lineTo(bbox[0], bbox[1]);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "red";
      ctx.stroke();
    }
 };

 function detectObjects(imgTag) {
    let imgWidth = imgTag.width;
    let imgHeight = imgTag.height;
    canvas_html = `<canvas id="canvas${canvasid}" width=${imgWidth} height=${imgHeight}> </canvas>`;
    let img = $(imgTag);
    img.hide();
    $(canvas_html).insertAfter(imgTag);
    const canvas = $(`#canvas${canvasid}`);
    canvas.css('width', window.getComputedStyle(img).width);
    canvas.css('height', window.getComputedStyle(img).height);
    canvas.css('outline-style','solid');
    canvas.css('outline-color','lightgreen');
    canvas.css('outline-width','2px');
    canvas.css('outline-offset','-2px');
    const ctx = canvas[0].getContext("2d");
    ctx.drawImage(imgTag, 0, 0, imgWidth, imgHeight);

    chrome.runtime.sendMessage({url:imgTag.src, width:imgWidth, height:imgHeight}, (predictions) => {
        console.log(predictions);
        drawBoxes(ctx, predictions);
    });
    canvasid += 1;
 }

 var canvasid = 0;

 var selectTimeout;
 $("img").hover((e) => {
     selectTimeout = setTimeout(() => {
        detectObjects(e.target);
     }, 5000);
 },
     (e) => {
         clearTimeout(selectTimeout);
     }
 );
});
