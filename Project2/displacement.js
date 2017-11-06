function mouseDown(e) {
	var i, len = circles.length;
	var n2 = secondCircles.length;
	var bRect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - bRect.left);
	mouseY = (e.clientY - bRect.top);
	console.log(len)
	for (i=0; i < len; i++) {
		if(inCircle(circles[i], mouseX, mouseY)) {
			console.log(i);
			drag = true;
			dragHoldX = mouseX - circles[i].x;
			dragHoldY = mouseY - circles[i].y;
			dragIndex = i;
		}
	}	
	
	if (drag) {
		window.addEventListener("mousemove", mouseMove, false);
	} else if (endDrowing) {
		
		window.addEventListener("mousemove", mouseMove2, false);
	}
	canvas.removeEventListener("mousedown", mouseDown, false);
	window.addEventListener("mouseup", mouseUp, false);
	return false;		
}

function mouseMove2(e) {
	var bRect = canvas.getBoundingClientRect();
	var mouseXNew = (e.clientX - bRect.left);
	var mouseYNew = (e.clientY - bRect.top);
	var deltaX = mouseXNew - mouseX;
	var deltaY = mouseYNew - mouseY;	
	var i, len = circles.length;
	
	for (i=0; i < len; i++) {
		circles[i].x += deltaX;
		circles[i].y += deltaY;
	}
	mouseX = mouseXNew;
	mouseY = mouseYNew;
	
	drawCanvas();
}

var relationsToAdd = [];
var eps = 15;

function mouseMove(e) {
	var posX, posY;
	var radius = circles[dragIndex].r;
	var minX = radius;
	var maxX = canvas.width - radius;
	var minY = radius;
	var maxY = canvas.height - radius;
	var n = circles.length;
	var bRect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - bRect.left);
	mouseY = (e.clientY - bRect.top);
	
	posX = mouseX - dragHoldX;
	posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
	posY = mouseY - dragHoldY;
	posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
	posY = parseInt(posY);
	posX = parseInt(posX);
	
	circles[dragIndex].x = posX;
	circles[dragIndex].y = posY;
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,cw,ch);	
	drawPolygon();
	drawCircles();
}

function mouseUp()
{
	canvas.addEventListener("mousedown", mouseDown, false);
	window.removeEventListener("mouseup", mouseUp, false);
	if (drag) 
	{
		drag = false;
		window.removeEventListener("mousemove", mouseMove, false);
	}
	
	drawCanvas();
	window.removeEventListener("mousemove", mouseMove2, false);
}	

function pointOnCircle(x1, y1, x2, y2, r) {
	var a = (y1 - y2) / (x1 - x2);
	var b = y1 - a * x1;
	var alpha = Math.abs(Math.atan(a));
	var x = x1, y = y1;
	var dy = r * Math.sin(alpha);
	var dx = r * Math.cos(alpha);
	if(x2>=x1 && y2>y1) {
		x+=dx;
		y+=dy;
	} else if(x2<x1 && y2>=y1) {
		x-=dx;
		y+=dy;
	} else if(x2<=x1 && y2<y1) {
		x-=dx;
		y-=dy;
	} else {
		x+=dx;
		y-=dy;
	}

	return {x:x, y:y};
}

function modulo(a, n) {
    return ((a%n)+n)%n;
}