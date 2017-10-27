function canvasOnClick(e) {
	var i, len = circles.length;
	var notOnLine = true;
	var x = e.pageX - leftCanvas,
		y = e.pageY - topCanvas;
	var inE = false;

	if (len > 1 && inCircle(circles[0], x, y)) {
		endDrowing = true;
		//$("#endDrawing").trigger("click");
		drawCanvas();
		return;
	}
	var color = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
	
	if (endDrowing) {
		secondCircles.push({
			x: x,
			y: y,
			r: pointRadius,
			color: color
		});
	} else {
		circles.push({
			x: x,
			y: y,
			r: pointRadius,
			color: color
		});
	}
		
	drawCanvas();
}