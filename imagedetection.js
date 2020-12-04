window.onload = ()=>{
 document.body.style.border = "5px solid red";
 console.log("Running extension!!");
 var canvasid = 0;
 console.log("toto");
 
 console.log("sending message");
 let images = $("img");
 let re = /.*.jpg/;

 for(var i = 0; i<images.length; i++){
         let img = images[i];
        console.log(img.src, re.test(img.src));
        if(img.height < 100 || img.width < 100 || !re.test(img.src)){
            console.log("image too small",i, img.height, img.width);
            continue;
        }
        detectObjects(img);
     if(i > 20)
         break;
    }

 var drawBoxes = (ctx, predictions) => {
    for(var i = 0; i < predictions.length; ++i){
      console.log("Drawing boxes:", predictions[i]);
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

 function detectObjects(img, model) {
    console.log("Detecting objects on",img.id, img.src);

    canvas_html = `<canvas id="canvas${canvasid}" width=${img.width} height=${img.height}> </canvas>`;
    $(canvas_html).insertAfter($(img));

    console.log("starting detection");

    const canvas = document.getElementById(`canvas${canvasid}`);
    const ctx = canvas.getContext("2d");

    let img_data = new Image();
    img_data.crossOrigin = "Anonymous";

    img_data.onload = () => {
        console.log("Loading image", img_data);
        ctx.drawImage(img_data, 0, 0, img.width, img.height);
        $(img).hide();
        let imgd = ctx.getImageData(0, 0, img.width, img.height);
        console.log("Detecting on image", imgd);
        
        try{
        browser.runtime.sendMessage({img:imgd}).then((predictions) => {
            console.log(`Predictions for canvas ${canvas.id}: `, predictions);
            drawBoxes(ctx, predictions);
                }, (e) => {console.log("something went wrong",e)}
         );
        }catch(e){
            console.log("Error", e);
        }
     
    }
    img_data.src = img.src;
    canvasid += 1;
    console.log("done detection");
 }
};
