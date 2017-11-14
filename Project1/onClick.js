function canvasOnClick(e) {
	var i, len = circles[polygonIndex].length;
	var notOnLine = true;
	var x = e.pageX - leftCanvas,
		y = e.pageY - topCanvas;
	var inE = false;
	var color = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
	
	if (len > 1 && inCircle(circles[polygonIndex][0], x, y)) {
		endDrowing[polygonIndex] = true;		
		polygonIndex++;
		endDrowing[polygonIndex] = false;
		circles[polygonIndex] = [];
		drawCanvas();
		FillPolygon(circles[0]);
		return;
	}
		
	circles[polygonIndex].push({
		x: x,
		y: y,
		r: pointRadius,
		color: color
	});
			
	drawCanvas();
}