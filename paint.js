							
	var bgColor,canvas,canvasImage,circleCount, circles, color, context,draggingDraw, draggingMove, dragX, dragY, dragIndexDelete, dragIndexMove, dragStartLocation, mouseX, mouseY, radius,tempX, tempY, dx, dy;


window.addEventListener('load', init, false);


window.onload = window.onresize = function() 
	{
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.8;
		drawCircles();
	}	


function init() 
	{
		canvas = document.getElementById("canvas");
		context = canvas.getContext('2d');
		context.lineWidth = 4;
		context.lineCap = 'round';
	
		circleCount=0;	
		draggingDraw = false;
		bgColor = "#ffffff";
		circles = [];
		
	
		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
		
		canvas.addEventListener('dblclick', deleteCircle,false);
		canvas.addEventListener('click', hitMissMessage,false);
	}	


	
function dragStart(event) {
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
	color = "rgb(" + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) +")";
    getImage();
}

function drag(event) {
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawCircle(position);
		context.fillStyle = color;
		context.fill();
    }
}
function dragStop(event) {
    draggingDraw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawCircle(position);		
	context.fillStyle = color;
	context.fill();	
	circleCount=circleCount+1;
	tempCircle = {x:tempX, y:tempY, rad:radius, color:color};
	
	circles.push(tempCircle);
	
	
}
	
function getCanvasCoordinates(event) {

    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

  function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}


function drawCircle(position) {
	
		tempX=dragStartLocation.x;
		tempY=dragStartLocation.y;
		
		radius = Math.sqrt(Math.pow((tempX - position.x), 2) + Math.pow((tempY - position.y), 2));
		context.beginPath();
		context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
		context.closePath();
}


function drawScreen() {
		circleCount=0;
		circles = [];
		context.fillStyle = bgColor;
		context.fillRect(0,0,canvas.width,canvas.height);
	}	


	function drawCircles() {
		var i,x,y,rad,color;
		
		
		context.fillStyle = bgColor;
		context.fillRect(0,0,canvas.width,canvas.height);		
		
		for (i=0; i < circleCount; i++) {
			rad = circles[i].rad;
			x = circles[i].x;
			y = circles[i].y;
			color=circles[i].color;
			context.beginPath();
			context.arc(x, y, rad, 0, 2*Math.PI, false);
			context.closePath();
			context.fillStyle = color;
			context.fill();
		}		
	}	
	
	function isCircleClicked(shape,mx,my) {		
		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;
		return (dx*dx + dy*dy < shape.rad*shape.rad);
	}


function deleteCircle(event) 
{
		var i;
		var bRect = canvas.getBoundingClientRect();
		dragIndexDelete=-1;
		
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		for (i=0; i < circleCount; i++) 
			if	(isCircleClicked(circles[i], mouseX, mouseY)) 
				dragIndexDelete = i;		
		
		if ( dragIndexDelete> -1 ){
			circles.splice(dragIndexDelete,1)[0];
			circleCount=circleCount-1;
		}
		
		if (event.preventDefault) 
			event.preventDefault();
		else if (event.returnValue) 
			event.returnValue = false;

		drawCircles();				
		return false;
}
	
function mouseDown(event) 
{
		var i;
		var highestIndex = -1;		
		var bRect = canvas.getBoundingClientRect();
	
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		
		for (i=0; i < circleCount; i++) {
			if	(isCircleClicked(circles[i], mouseX, mouseY)) {
				draggingMove = true;
				if (i > highestIndex) {
					dragX = mouseX - circles[i].x;
					dragY = mouseY - circles[i].y;
					highestIndex = i;
					dragIndexMove = i;
				}				
			}
		}
		if (draggingMove) {
			window.addEventListener("mousemove", mouseMove, false);
			
			circles.push(circles.splice(dragIndexMove,1)[0]);
			
		}
		canvas.removeEventListener("mousedown", mouseDown, false);
		window.addEventListener("mouseup", mouseUp, false);
		
		if (event.preventDefault) 
				event.preventDefault();
		else if (event.returnValue) 
				event.returnValue = false;
		return false;
}
	
	function mouseUp(event) {

		canvas.addEventListener("mousedown", mouseDown, false);
		window.removeEventListener("mouseup", mouseUp, false);
		if (draggingMove) {
			draggingMove = false;
			window.removeEventListener("mousemove", mouseMove, false);
		}
	}

	function mouseMove(event) {
		
		var posX, posY;
		var shapeRad = circles[circleCount-1].rad;
		var minX = shapeRad;
		var maxX = canvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = canvas.height - shapeRad;
		
		var bRect = canvas.getBoundingClientRect();
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		posX = mouseX - dragX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		circles[circleCount-1].x = posX;
		circles[circleCount-1].y = posY;
		
		drawCircles();
	}
	
function hitMissMessage(event){
	var i;
		var bRect = canvas.getBoundingClientRect();
		dragIndexDelete=-1;
		
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		for (i=0; i < circleCount; i++) 
			if	(isCircleClicked(circles[i], mouseX, mouseY)) 
			{
				alert("Hit");
				break;
			}
			if(i==circleCount)
			alert("Miss");
}
