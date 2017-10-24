function canvasOnClick(e) {
	var i, len = circles.length;
	var notOnLine = true;
	var x = e.pageX - leftCanvas,
		y = e.pageY - topCanvas;
	var inE = false;

	if (len > 0 && inCircle(circles[0], x, y)) {
		endDrowing = true;
		$("button").trigger("click");
		drawPolygon();
		endDrowing = true;
		return;
	}

	for (i = 0; i < len - 1; i++) { 
		if (inEdge(circles[i].x, circles[i].y, circles[i + 1].x, circles[i + 1].y, x, y)) {					
			x = (circles[i].x + circles[i + 1].x) / 2;
			y = (circles[i].y + circles[i + 1].y) / 2;
			x = parseInt(x);
			y = parseInt(y);
			inE = true;
			break;
		}
	}

	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fill();
	var color = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
	if (inE) {
		circles.splice(i + 1, 0, {
			x: x,
			y: y,
			r: pointRadius,
			color: color
		})
	} else {
		circles.push({
			x: x,
			y: y,
			r: pointRadius,
			color: color
		});

	}

	drawPolygon();
}