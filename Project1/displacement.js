function mouseDown(e)
{
	var i, len = circles.length;
	var bRect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - bRect.left);
	mouseY = (e.clientY - bRect.top);
	console.log(len)
	for (i=0; i < len; i++) {
		if(inCircle(circles[i], mouseX, mouseY)) 
		{
			console.log(i);
			drag = true;
			dragHoldX = mouseX - circles[i].x;
			dragHoldY = mouseY - circles[i].y;
			dragIndex = i;
		}
	}
	if (drag) 
	{
		window.addEventListener("mousemove", mouseMove, false);
	}
	canvas.removeEventListener("mousedown", mouseDown, false);
	window.addEventListener("mouseup", mouseUp, false);
	return false;		
}

function mouseMove(e)
{
	var posX, posY;
	var radius = circles[dragIndex].r;
	var minX = radius;
	var maxX = canvas.width - radius;
	var minY = radius;
	var maxY = canvas.height - radius;

	var bRect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - bRect.left);
	mouseY = (e.clientY - bRect.top);

	posX = mouseX - dragHoldX;
	posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
	posY = mouseY - dragHoldY;
	posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

	if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] == horizontal) {
		circles[dragIndex == 0? circles.length - 1 : dragIndex - 1].y = posY;
		var i = (dragIndex == 0? circles.length - 1 : dragIndex - 1);
		var x1 = (circles[dragIndex].x + circles[i].x) / 2;
		var y1 = (circles[dragIndex].y + circles[i].y) / 2;
		x1 = parseInt(x1);
		y1 = parseInt(y1);

		//drawStatusImages(x1, y1 - 14, horizontal)
	}

	if (edgeStatus[dragIndex] == horizontal) {
		circles[dragIndex == circles.length-1 ? 0 : dragIndex + 1].y = posY;
	}

	if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] == vertical) {
		circles[dragIndex == 0? circles.length - 1 : dragIndex - 1].x = posX;
	}

	if (edgeStatus[dragIndex] == vertical) {
		circles[dragIndex == circles.length-1 ? 0 : dragIndex + 1].x = posX;
	}				
	var idx1 = dragIndex == 0? circles.length - 1 : dragIndex - 1;
	var idx2 = dragIndex == 0? 0 : idx1+1;

	if (edgeStatus[idx1] >= minimumDistance && edgeStatus[idx2] >= minimumDistance) {
		var idx3 = idx2 == circles.length - 1 ? 0 : idx2+1;
		var point = crossCirclesPoints(circles[idx1].x, circles[idx1].y, circles[idx3].x, circles[idx3].y, edgeStatus[idx1], edgeStatus[idx2]);
		var d1= crossProduct(circles[idx3].x - circles[idx1].x, circles[idx3].y - circles[idx1].y, point.p1x - circles[idx1].x, point.p1y - circles[idx1].y); // położenie punktu p1 względem odcinka p3p4
		var d2= crossProduct(circles[idx3].x - circles[idx1].x, circles[idx3].y - circles[idx1].y, posX - circles[idx1].x, posY - circles[idx1].y); // położenie punktu p2 względem odcinka p3p4 
		console.log("pomiedy dwiema ograniczonymi krawedziami");
		if (d1 * d2 > 0) {
			posX = parseInt(point.p1x);
			posY = parseInt(point.p1y);
		} else {
			posX = parseInt(point.p2x);
			posY = parseInt(point.p2y);
		}
	} else if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] >= minimumDistance) { // czy poprzednia krawędź ma określony dystans
		var idx1 = dragIndex == 0? circles.length - 1 : dragIndex - 1;
		var idx2 = dragIndex == 0? 0 : idx1+1;
		var point = pointOnCircle(circles[idx1].x, circles[idx1].y, posX, posY, edgeStatus[idx1]);
		posX = parseInt(point.x);
		posY = parseInt(point.y);
	} else if (edgeStatus[dragIndex] >= minimumDistance) {// czy następna krawędź ma określony dystans
		var idx2 = dragIndex == circles.length - 1? 0 : dragIndex+1;
		var point = pointOnCircle(circles[idx2].x, circles[idx2].y, posX, posY, edgeStatus[dragIndex]);
		posX = parseInt(point.x);
		posY = parseInt(point.y);
	}

	circles[dragIndex].x = posX;
	circles[dragIndex].y = posY;

	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,cw,ch);
	drawCircles();
	drawPolygon();
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

function crossCirclesPoints(x1, y1, x2, y2, r1, r2) {
	var a = (y1 - y2) / (x1 - x2);
	var b = y1 - a * x1;
	var dist = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
	var x = (r2*r2+dist*dist-r1*r1)/(2*dist);
	var sub = setDistance(x1, y1, x2, y2, dist-x);
	var phx = x2 - sub.dx;
	var phy = y2 - sub.dy;
	var a2 = -(1/a);
	var alpha = Math.abs(Math.atan(a2));
	var x = x1, y = y1;
	var dy = r1 * Math.sin(alpha);
	var dx = r1 * Math.cos(alpha);
	var p1x = phx - dx,p2x = phx + dx,p1y,p2y;
	if (a2 > 0) {
		p1y = phy - dy;
		p2y = phy + dy;
	} else {
		p1y = phy + dy;
		p2y = phy - dy;
	}
	debugger
	p1x = parseInt(p1x);
	p1y = parseInt(p1y);
	p2x = parseInt(p2x);
	p2y = parseInt(p2y);
	
	return {p1x:p1x, p1y:p1y, p2x:p2x, p2y:p2y};
}		

function crossProduct(x1, y1, x2, y2) {
	return  x1*y2 - x2*y1;
}