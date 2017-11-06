function mouseDown(e) {
	var i, len = circles.length;
	var n2 = secondCircles.length;
	var bRect = canvas.getBoundingClientRect();
	mouseX = (e.clientX - bRect.left);
	mouseY = (e.clientY - bRect.top);
	console.log(len)
	for(var j = 0; j <= polygonIndex; j++) {
		for (i=0; i < circles[j].length; i++) {
			if(inCircle(circles[j][i], mouseX, mouseY)) {
				console.log(i);
				drag = true;
				dragHoldX = mouseX - circles[j][i].x;
				dragHoldY = mouseY - circles[j][i].y;
				dragIndex = i;
				dragIndexj = j;
			}
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
	var radius = circles[dragIndexj][dragIndex].r;
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
	
	var idx1 = dragIndex == 0? circles.length - 1 : dragIndex - 1;
	var idx2 = dragIndex == 0? 0 : idx1+1;
	var idx3 = idx2 == circles.length - 1 ? 0 : idx2+1;
	var idx4 = idx3 == circles.length - 1 ? 0 : idx3+1;
	var prevDistance = false;
	var nextDistance = false;
	
	
	if (newRelation) {
		if ( Math.abs(circles[modulo(dragIndex-1, n)].x - posX) <= eps ) {
			posX = circles[modulo(dragIndex-1, n)].x;
			relationsToAdd.push({
				index: modulo(dragIndex-1, n),
				type: vertical
			})
		}
		if (Math.abs(circles[modulo(dragIndex + 1, n)].x - posX) <= eps) {
			posX = circles[modulo(dragIndex+1, n)].x;
			relationsToAdd.push({
				index: dragIndex,
				type: vertical
			})
		}
		if ( Math.abs(circles[modulo(dragIndex-1, n)].y - posY) <= eps ) {
			posY = circles[modulo(dragIndex-1, n)].y;
			relationsToAdd.push({
				index: modulo(dragIndex-1, n),
				type: horizontal
			})
		}
		if (Math.abs(circles[modulo(dragIndex + 1, n)].y - posY) <= eps) {
			posY = circles[modulo(dragIndex+1, n)].y;
			relationsToAdd.push({
				index: dragIndex,
				type: horizontal
			})
		}		
	}
	
	posY = parseInt(posY);
	posX = parseInt(posX);
	
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
	
	if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] == horizontal) {
		circles[dragIndex == 0? circles.length - 1 : dragIndex - 1].y = posY;		
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
	
	circles[dragIndexj][dragIndex].x = posX;
	circles[dragIndexj][dragIndex].y = posY;
	
	repairPolygon((dragIndex+1)%n);
	repairPolygonReverse( modulo(dragIndex-1, n));
	
	drawCanvas();
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
	var i = modulo(startIndex+1,n);

	for(var j = 0; j < n - 2; j++) {
		if (edgeStatus[modulo(i-1, n)] == horizontal) {
			circles[modulo(i-1, n)].y = circles[i].y;
		} else if (edgeStatus[modulo(i-1, n)] == vertical) {
			circles[modulo(i-1, n)].x = circles[i].x;
		} else if (edgeStatus[modulo(i-1, n)] >= minimumDistance) {
			var sub = setDistance(circles[i].x, circles[i].y, circles[modulo(i-1, n)].x, circles[modulo(i-1, n)].y, edgeStatus[modulo(i-1, n)]);
			circles[modulo(i-1, n)].x -= parseInt(sub.dx);
			circles[modulo(i-1, n)].y -= parseInt(sub.dy);
		} else {
			break;
		}
		i = modulo(i-1, n);			
	}
}

function modulo(a, n) {
    return ((a%n)+n)%n;
}