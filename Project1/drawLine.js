function setPixel(x, y, red) {
	if(red) {
		ctx.fillStyle = '#ff0000';
	} else {
		ctx.fillStyle = 'black';
	}
	var id = ctx.createImageData(1, 1); // only do this once per page
	var d  = id.data;                        // only do this once per page
	d[0]   = 125;
	d[1]   = 125;
	d[2]   = 125;
	d[3]   = 125;
	ctx.putImageData(id, x, y);
	ctx.fillRect(x, y, 1, 1);
}

function MidpointLine(x1, y1, x2, y2, red) {
	// zmienne pomocnicze
	var d, dx, dy, ai, bi, xi, yi;
	var x = x1;
	var y = y1;
	
	// ustalenie kierunku rysowania
	if (x1 < x2) {
		xi = 1;
		dx = x2 - x1;
	} else {
		xi = -1;
		dx = x1 - x2;
	}
	// ustalenie kierunku rysowania
	if (y1 < y2) {
		yi = 1;
		dy = y2 - y1;
	} else {
		yi = -1;
		dy = y1 - y2;
	}
	// pierwszy piksel
	setPixel(x, y, red);
	// oś wiodąca OX
	if (dx > dy) {
		ai = (dy - dx) * 2;
		bi = dy * 2;
		d = bi - dx;
		// pętla po kolejnych x
		while (x != x2) {
			// test współczynnika
			if (d >= 0) {
				x += xi;
				y += yi;
				d += ai;
			} else {
				d += bi;
				x += xi;
			}
			setPixel(x, y, red);
		}
	} else { // oś wiodąca Y
		ai = (dx - dy) * 2;
		bi = dx * 2;
		d = bi - dy;
		// pętla po kolejnych y
		while (y != y2) {
			// test współczynnika
			if (d >= 0) {
				x += xi;
				y += yi;
				d += ai;
			} else {
				d += bi;
				y += yi;
			}
			setPixel(x, y, red);
		}
	}
}

function drawLine(x1, y1, x2, y2, red = false) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	if(red) {
		ctx.strokeStyle = '#ff0000';
	} else {
		ctx.strokeStyle = 'black';
	}
	ctx.stroke();
}