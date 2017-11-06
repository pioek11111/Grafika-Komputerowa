function canvasOnClick(e) {
	var i, len = circles[polygonIndex].length;
	var notOnLine = true;
	var x = e.pageX - leftCanvas,
		y = e.pageY - topCanvas;
	var inE = false;
	var color = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
	
	if (len > 1 && inCircle(circles[polygonIndex][0], x, y)) {
		//endDrowing = true;
		polygonIndex++;
		drawCanvas();
		return;
	}
	
	if (endDrowing) {
		secondCircles[polygonIndex].push({
			x: x,
			y: y,
			r: pointRadius,
			color: color
		});
	} else {
		circles[polygonIndex].push({
			x: x,
			y: y,
			r: pointRadius,
			color: color
		});
	}
		
	drawCanvas();
}