function mouseDown(e) {
	var i, len = circles.length;
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
	
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,cw,ch);
	drawCircles();
	drawPolygon();
}

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
	
	
	var idx1 = dragIndex == 0? circles.length - 1 : dragIndex - 1;
	var idx2 = dragIndex == 0? 0 : idx1+1;
	var idx3 = idx2 == circles.length - 1 ? 0 : idx2+1;
	var idx4 = idx3 == circles.length - 1 ? 0 : idx3+1;
	var prevDistance = false;
	var nextDistance = false;
	
	if (edgeStatus[idx2] >= minimumDistance) { // następna krawędź ma określony dystans
		var dist = Math.sqrt((posX-circles[idx3].x) * (posX-circles[idx3].x) + (posY-circles[idx3].y) * (posY-circles[idx3].y));
		var r = edgeStatus[idx2];
		if (Math.abs(dist-r) < 2 ) {
			var point = pointOnCircle(circles[idx3].x, circles[idx3].y, posX, posY, r);
			posX = parseInt(point.x);
			posY = parseInt(point.y);
		} else {
			var point1 = moveEdge(circles[idx2].x, circles[idx2].y, circles[idx3].x, circles[idx3].y, posX, posY);		
			circles[idx3].x = point1.px;
			circles[idx3].y = point1.py;
		}		
	}
	
	if (edgeStatus[idx1] >= minimumDistance) { // poprzednia krawędź ma określony dystans
		var dist = Math.sqrt((posX-circles[idx1].x) * (posX-circles[idx1].x) + (posY-circles[idx1].y) * (posY-circles[idx1].y));
		var r = edgeStatus[idx1];
		if (Math.abs(dist-r) < 2 ) {
			var point = pointOnCircle(circles[idx1].x, circles[idx1].y, posX, posY, r);
			posX = parseInt(point.x);
			posY = parseInt(point.y);
		} else {
			var point1 = moveEdge(circles[idx2].x, circles[idx2].y, circles[idx1].x, circles[idx1].y, posX, posY);		
			circles[idx1].x = point1.px;
			circles[idx1].y = point1.py;
		}		
	}
	/*if (edgeStatus[idx1] >= minimumDistance && edgeStatus[idx2] >= minimumDistance) { // punkt pomiedy dwiema ograniczonymi krawedziami
		
		var point = crossCirclesPoints(circles[idx1].x, circles[idx1].y, circles[idx3].x, circles[idx3].y, edgeStatus[idx1], edgeStatus[idx2]);
		var d1= crossProduct(circles[idx3].x - circles[idx1].x, circles[idx3].y - circles[idx1].y, point.p1x - circles[idx1].x, point.p1y - circles[idx1].y); // położenie punktu p1 względem odcinka p3p4
		var d2= crossProduct(circles[idx3].x - circles[idx1].x, circles[idx3].y - circles[idx1].y, posX - circles[idx1].x, posY - circles[idx1].y); // położenie punktu p2 względem odcinka p3p4 
		if (d1 * d2 > 0) {
			posX = parseInt(point.p1x);
			posY = parseInt(point.p1y);
		} else {
			posX = parseInt(point.p2x);
			posY = parseInt(point.p2y);
		}
	} else if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] >= minimumDistance) { // poprzednia krawędź ma określony dystans
		var idx1 = dragIndex == 0? circles.length - 1 : dragIndex - 1;
		var idx2 = dragIndex == 0? 0 : idx1+1;
		var point = pointOnCircle(circles[idx1].x, circles[idx1].y, posX, posY, edgeStatus[idx1]);
		posX = parseInt(point.x);
		posY = parseInt(point.y);
		prevDistance = true;
	} else if (edgeStatus[dragIndex] >= minimumDistance) {// czy następna krawędź ma określony dystans
		var idx2 = dragIndex == circles.length - 1? 0 : dragIndex+1;
		var point = pointOnCircle(circles[idx2].x, circles[idx2].y, posX, posY, edgeStatus[dragIndex]);
		posX = parseInt(point.x);
		posY = parseInt(point.y);
		nextDistance = true;
	}*/
	
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
		if(prevDistance && edgeStatus[idx3] >= minimumDistance) { // distance horizontal distance
			var p = pointsOnCircleWithSpecifiedY(circles[idx4].x, circles[idx4].y, circles[idx3].y, edgeStatus[idx3]);
			if(!isNaN(p.p1x)) circles[idx3].x = Math.abs(circles[idx2].x - p.p1x) > Math.abs(circles[idx2].x - p.p2x) ? p.p2x : p.p1x;
			if(Math.abs(p.p1x - p.p2x) < 30 || isNaN(p.p1x)) {
				posX = circles[idx2].x;
				posY = circles[idx2].y;
				circles[idx3].y = circles[idx2].y;
			}
		}
	}
	
	if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] == vertical) {
		circles[dragIndex == 0? circles.length - 1 : dragIndex - 1].x = posX;
	}

	if (edgeStatus[dragIndex] == vertical) {
		circles[dragIndex == circles.length-1 ? 0 : dragIndex + 1].x = posX;
	}
	circles[dragIndex].x = posX;
	circles[dragIndex].y = posY;
	
	repairPolygon((dragIndex+1)%n);
	repairPolygonReverse( modulo(dragIndex-1, n));
	
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
	//var px = x1, py = y1;
	var h = Math.sqrt(r2*r2 - x*x);
	var dy = h * Math.sin(alpha);
	var dx = h * Math.cos(alpha);
	var p1x = phx - dx,p2x = phx + dx,p1y,p2y;
	if (a2 > 0) {
		p1y = phy - dy;
		p2y = phy + dy;
	} else {
		p1y = phy + dy;
		p2y = phy - dy;
	}
	p1x = parseInt(p1x);
	p1y = parseInt(p1y);
	p2x = parseInt(p2x);
	p2y = parseInt(p2y);
	
	return {p1x:p1x, p1y:p1y, p2x:p2x, p2y:p2y};
}

function pointsOnCircleWithSpecifiedY(x1, y1, y, r) {
	var sqrt = Math.sqrt(r * r - (y - y1) * (y - y1));
	var p1x = sqrt + x1;
	var p2x = -sqrt + x1;
	return {p1x:p1x, p2x:p2x};
}

function moveEdge(x1, y1, x2, y2, x3, y3) { //
	var px = -x1+x3+x2;
	var py = -y1+y3+y2;
	return {px:px, py:py};
}

function crossProduct(x1, y1, x2, y2) {
	return  x1*y2 - x2*y1;
}

function repairPolygon(startIndex) { 
	var n = circles.length;
	var i = startIndex;
	
	for(var j = 0; j < n - 2; j++) {
		if (edgeStatus[i] == horizontal) {
			circles[(i + 1) % n].y = circles[i].y;
			if(circles[(i + 1) % n].y < 0) {
				debugger;
			}
		} else if (edgeStatus[i] == vertical) {
			circles[(i + 1) % n].x = circles[i].x;
		} else if (edgeStatus[i] >= minimumDistance) { 		
			var sub = setDistance(circles[i].x, circles[i].y, circles[(i + 1) % n].x, circles[(i + 1) % n].y, edgeStatus[i]);
			circles[(i + 1) % n].x -= parseInt(sub.dx);
			circles[(i + 1) % n].y -= parseInt(sub.dy);
		} else {
			break;
		}
		i = (i+1)%n;		
	}
}

function repairPolygonReverse(startIndex) {
	var n = circles.length;
	var i = startIndex;
	for(var j = 0; j < n - 2; j++) {
		if (edgeStatus[i] == horizontal) {
			circles[i].y = circles[(i + 1) % n].y;
		} else if (edgeStatus[i] == vertical) {
			circles[i].x = circles[(i + 1) % n].x;
		} else if (edgeStatus[i] >= minimumDistance) {
			var sub = setDistance(circles[(i + 1) % n].x, circles[(i + 1) % n].y, circles[i].x, circles[i].y, edgeStatus[i]);
			circles[i].x -= parseInt(sub.dx);
			circles[i].y -= parseInt(sub.dy);
		} else {
			break;
		}
		i = modulo(i-1, n);			
	}
}

function modulo(a, n) {
    return ((a%n)+n)%n;
};