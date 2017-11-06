function FillPolygon(polygon) {
	var yStart = polygon[0].y;
	var xMin = polygon[0].x; 
	var n = polygon.length;
	for(var i = 1; i < n; i++) {
		if (yStart > polygon[i].y) {
			yStart = polygon[i].y;
		}
		if (xMin > polygon[i].x) {
			xMin = polygon[i].x;
		}
	}
	
	var yMin = yStart;
	var AET = [];
	var ET = [];
	var ETCount = n;
	
	var canvas2 = document.createElement('canvas');
	var context = canvas2.getContext('2d');
	var img = document.getElementById('wall');
	canvas2.width = img.width;
	canvas2.height = img.height;
	context.drawImage(img, 0, 0 );
	var myData = context.getImageData(0, 0, img.width, img.height);
	console.log(myData);
	
	for(var i = 0; i < n; i++) {
		if(ET[Math.min(polygon[i].y, polygon[(i+1)%n].y)] == undefined) {
			ET[Math.min(polygon[i].y, polygon[(i+1)%n].y)] = [];
		}
			
		ET[Math.min(polygon[i].y, polygon[(i+1)%n].y)].push({
			yMax: Math.max(polygon[i].y, polygon[(i+1)%n].y),
			xMin: polygon[i].y > polygon[(i+1)%n].y ? polygon[(i+1)%n].x : polygon[i].x,
			a: A(polygon[i].x, polygon[(i+1)%n].x, polygon[i].y, polygon[(i+1)%n].y)
		});		
	}
	
	var y = yStart;
	while (AET.length != 0 || ETCount != 0) {
		// przenieś listy z kubełka ET[y] do AET (ymin = y)
		if (ET[y] != undefined) {
			for(var i = 0; i < ET[y].length; i++) {
				AET.push(ET[y][i]);
				ETCount--;
			}
		}
		// posortuj listę AET wg x
		AET.sort(function(a, b){return a.xMin-b.xMin});
		//wypełnij piksele pomiędzy parami przecięć
		for(var i = 0; i < AET.length; i+=2) {
			if (AET[i].xMin != AET[i+1].xMin) {
				drawHorizontalLine2(AET[i].xMin, AET[i+1].xMin, y, myData, AET[i].xMin % img.width, y % img.height, img.width, img.height);
				/*for(var j = AET[i].xMin; j <= AET[i+1].xMin; j++) {
					setPixel(j, y, true);
				}*/
			}
		}
		// usuń z AET te elementy, dla których y=ymax
		var i;
		for(var i = 0; i < AET.length; i++) {
			if (AET[i].yMax == y+1) {
				AET.splice(i, 1);
				i--;
			}
		}
		// zwiększ y o 1 (przejście do następnej scan-linii)
		y++;
		// dla każdej krawędzi w AET
		// uaktualnij x dla n owej scanlinii y (x+=1/m)
		for(var i = 0; i < AET.length; i++) {
			AET[i].xMin += 1/AET[i].a;
		}
	}
}

function A(x1, x2, y1, y2) {
	return (y1 - y2) / (x1 - x2);
}

function drawHorizontalLine(x1, x2, y) {
	ctx.fillStyle = '#ff0000';
	var id = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	var d  = id.data;                     // only do this once per page
	d[0]   = 125;
	d[1]   = 125;
	d[2]   = 125;
	d[3]   = 125;
	ctx.putImageData(id, x1, y);
	ctx.fillRect(x1, y, x2-x1+1, 1);
}

function drawHorizontalLine2(x1, x2, y, imageData, xBitmap, yBitmap, w, h) {
	//ctx.fillStyle = '#ff0000';
	var imgData = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	var position = parseInt(( xBitmap + w * yBitmap ) * 4);
	debugger
	for (var i=0;i<imgData.data.length;i+=4)
	{
		position += 4;
		var a = imageData.data[position];
		imgData.data[i+0]=imageData.data[position];
		imgData.data[i+1]=imageData.data[position+1];
		imgData.data[i+2]=imageData.data[position+2];
		imgData.data[i+3]=imageData.data[position+3];
	}
	
	ctx.putImageData(imgData, x1, y);
	//ctx.fillRect(x1, y, x2-x1+1, 1);
}

function setPixel(x, y, red) {
	/*if(red) {
		ctx.fillStyle = '#ff0000';
	} else {
		ctx.fillStyle = 'black';
	}*/
	var id = ctx.createImageData(1, 1); // only do this once per page
	var d  = id.data;                        // only do this once per page
	d[0]   = 0;
	d[1]   = 0;
	d[2]   = 230;
	d[3]   = 125;
	ctx.putImageData(id, x, y);
	ctx.fillRect(x, y, 1, 1);
}

function getPixel( imagedata, x, y ) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}