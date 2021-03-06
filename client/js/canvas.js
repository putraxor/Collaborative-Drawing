var Canvas = function(container_selector, init){
  //initializing the canvas
  this.canvas = document.createElement('canvas');
  this.canvas.id = "canvas_id"
  this.canvas.height = 500;
  this.canvas.width = parseInt($('#draw-box').css('width')); //600

  //initializing the drawing brush
  this.ctx = this.canvas.getContext('2d');
  this.ctx.fillStyle = "solid";
  this.ctx.strokeStyle = init.initColor;
  this.ctx.lineWidth = init.initSize;
  this.ctx.lineCap = "round";
  setDrawing(this);
  
  //adding the drawing area to the page
  $(container_selector).append(this.canvas);

  //draws lines on the canvas
  this.draw = function(x,y,type){
    if(type == "dragstart"){
      this.pushHistory();
      this.ctx.beginPath();
      return this.ctx.moveTo(x,y);
    }else if(type == "drag"){
      this.ctx.lineTo(x,y);
      return this.ctx.stroke();
    }else{ //dragend
      return this.ctx.closePath();
    }
  }

  //saves drawing settings
  this.save = function(){
    $.post(
      '/drawings', 
      {initColor: this.ctx.strokeStyle, initSize: this.ctx.lineWidth, initCanvas: this.canvas.toDataURL()},
      function(data){},
      'json');
  }

  //loads previous drawings into the canvas
  function setDrawing(app){
    var img = new Image;
    img.onload = function(){
      app.ctx.drawImage(img,0,0);
    };
    img.src = init.initCanvas;
  }

  // saves drawing moves for undo/redo
  var history = [];
  var step = -1;
  var ctx = this.ctx;
  this.pushHistory = function(){
    step++;
    if(step<history.length){ 
      history.length = step; 
    }
    history.push(document.getElementById("canvas_id").toDataURL());
  };
  this.undoStep = function(){
    if(step === history.length-1){
      this.pushHistory();
    }
    if(step>=0){
      step--;
      var canvasImg = new Image();
      canvasImg.src = history[step];
      canvasImg.onload = function(){ 
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(canvasImg, 0, 0);
      }
    }
  };
  this.redoStep = function(){
    if(step<history.length-1){
      step++;
      var canvasImg = new Image();
      canvasImg.src = history[step];
      canvasImg.onload = function(){ 
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(canvasImg, 0, 0); 
      }
    }
  };
}