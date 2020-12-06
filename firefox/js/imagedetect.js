$(document).ready(()=>{
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

 function detectObjects(img) {

    let imgHeight = img.height;
    let imgWidth = img.width;

    let img_data = new Image();
    img_data.crossOrigin = "Anonymous";

    img_data.onload = () => {
        $(img).hide();
        canvas_html = `<canvas id="canvas${canvasid}" width=${img.width} height=${img.height}> </canvas>`;
        $(canvas_html).insertAfter($(img));
        const canvas = $(`#canvas${canvasid}`);
        canvas.css('outline-style','solid');
        canvas.css('outline-color','lightgreen');
        canvas.css('outline-width','2px');
        canvas.css('outline-offset','-2px');
        const ctx = canvas[0].getContext("2d");
        ctx.drawImage(img_data, 0, 0, imgWidth, imgHeight);
        let imgd = ctx.getImageData(0, 0, imgWidth, imgHeight);
        
        browser.runtime.sendMessage({img:imgd}).then((predictions) => {
            drawBoxes(ctx, predictions);
                }, (e) => {console.log("something went wrong", e)}
         );
    }
    img_data.src = img.src;
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
