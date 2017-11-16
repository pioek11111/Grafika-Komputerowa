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
	canvas2.height = 1000;
	canvas2.width = 1000;
	var context = canvas2.getContext('2d');
	var i = document.getElementById('wall');
	var img = new Image();
	img.src = i.src;
	context.drawImage(img, 0, 0 );
	var myData = context.getImageData(0, 0, img.width, img.height);
	
	var canvas3 = document.createElement('canvas');
	canvas3.height = 1000;
	canvas3.width = 1000;
	var context3 = canvas3.getContext('2d');
	var normalMapImg = document.getElementById('normalMap');
	var img2 = new Image();
	img2.src = normalMapImg.src;
	context3.drawImage(img2, 0, 0 );
	var normalMapData = context3.getImageData(0, 0, img2.width, img2.height);
	
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
		
		var backgroundColor = [255, 0, 0];
		
		var lightColor = "#" + $("#lightColor").val();
		var fillColor = "#" + $("#fillColor").val();
		var lightColor = parseColor(lightColor);
		var fillColor = parseColor(fillColor);
		if($('#color').is(':checked')) { 			
			newColor = [lightColor[0] * fillColor[0] / (255), lightColor[1] * fillColor[1] / (255), lightColor[2] * fillColor[2] / (255)];
		}
		//wypełnij piksele pomiędzy parami przecięć
		for(var i = 0; i < AET.length; i+=2) {
			if (AET[i].xMin != AET[i+1].xMin) {
				if($('#color').is(':checked')) { // kolor
					if($('#normalVectorConst').is(':checked')) { // stały wektor normalny
						if($('#sphere').is(':checked')) { // światło na sferze
							drawHorizontalLineSphere(AET[i].xMin, AET[i+1].xMin, y, fillColor, lightColor, pointOnCircle);
							//drawHorizontalLine(AET[i].xMin, AET[i+1].xMin, y, lightColor, fillColor, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height, pointOnCircle, true); 
						} else { // światło stałe
							drawHorizontalLine(AET[i].xMin, AET[i+1].xMin, y, lightColor, fillColor, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height, false, true); 
						}
					} else { // mapa wektorów normalnych
						if($('#sphere').is(':checked')) { // światło na sferze
							drawHorizontalLine(AET[i].xMin, AET[i+1].xMin, y, lightColor, fillColor, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height, pointOnCircle, true); 
						} else { // światło stałe
							drawHorizontalLine(AET[i].xMin, AET[i+1].xMin, y, lightColor, fillColor, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height, false, true); 
						}
					}					
				} else { // tekstura
					if($('#normalVectorConst').is(':checked')) { // stały wektor normalny
						if($('#sphere').is(':checked')) { // światło na sferze
							drawHorizontalLine2Sphere(AET[i].xMin, AET[i+1].xMin, y, myData, AET[i].xMin % img.width, y % img.height, img.width, img.height, lightColor, pointOnCircle);
						} else { // światło stałe
							drawHorizontalLine2(AET[i].xMin, AET[i+1].xMin, y, myData, AET[i].xMin % img.width, y % img.height, img.width, img.height, lightColor, false, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height);
						}
					} else { // mapa wektorów normalnych
						if($('#sphere').is(':checked')) { // światło na sferze
							drawHorizontalLine2(AET[i].xMin, AET[i+1].xMin, y, myData, AET[i].xMin % img.width, y % img.height, img.width, img.height, lightColor, pointOnCircle, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height);
						} else { // światło stałe
							drawHorizontalLine2(AET[i].xMin, AET[i+1].xMin, y, myData, AET[i].xMin % img.width, y % img.height, img.width, img.height, lightColor, false, normalMapData, AET[i].xMin % img2.width, y % img2.height, img2.width, img2.height);
						}
					}				
				}
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

function drawHorizontalLine(x1, x2, y, lightColor, color, normalMapData, xNoMap, yNoMap, wNoMap, hNoMap, spherePoint, useNormalMap = false) {
	var imgData = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	
	var normalMPosition = parseInt(( parseInt(xNoMap) + wNoMap * yNoMap ) * 4);
	var nMapEndPosition = normalMPosition + wNoMap * 4;
	var nMapStartPosition = normalMPosition;
	
	for (var i=0;i<imgData.data.length;i+=4)
	{
		normalMPosition +=4;
		var n1 = normalMapData.data[(normalMPosition)];
		var n2 = normalMapData.data[(normalMPosition+1)];
		var n3 = normalMapData.data[(normalMPosition+2)];

		var newColor = calcColor([n1,n2,n3],color, lightColor, {x:x1+i/4, y: y}, spherePoint)
		imgData.data[i+0] = newColor[0];
		imgData.data[i+1] = newColor[1];
		imgData.data[i+2] = newColor[2];
		imgData.data[i+3] = 255;
		if (normalMPosition >= nMapEndPosition)
			normalMPosition = nMapStartPosition;
	}
	
	ctx.putImageData(imgData, x1, y);
}

function drawHorizontalLineSphere(x1, x2, y, color, lightColor, spherePoint) {
	var imgData = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	for (var i=0;i<imgData.data.length;i+=4)
	{
		var newColor = calcColor([0,0,1],color, lightColor, {x:x1+i/4, y: y}, spherePoint)
		imgData.data[i+0] = newColor[0];
		imgData.data[i+1] = newColor[1];
		imgData.data[i+2] = newColor[2];
		imgData.data[i+3] = 255;
	}
	
	ctx.putImageData(imgData, x1, y);
}

function drawHorizontalLine2(x1, x2, y, imageData, xBitmap, yBitmap, w, h, lightColor, spherePoint, normalMapData, xNoMap, yNoMap, wNoMap, hNoMap) { // tekstura
	var imgData = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	var position = parseInt(( parseInt(xBitmap) + w * yBitmap ) * 4);
	var normalMPosition = parseInt(( parseInt(xNoMap) + wNoMap * yNoMap ) * 4);
	
	var endPosition = position + w*4;
	var nMapEndPosition = normalMPosition + wNoMap * 4;
	
	var startPosition = position;
	var nMapStartPosition = normalMPosition;
	for (var i=0;i<imgData.data.length;i+=4)
	{
		position += 4;
		normalMPosition +=4;
		var a = imageData.data[(position)];
		var b = imageData.data[(position+1)];
		var c = imageData.data[(position+2)];
		
		var n1 = normalMapData.data[(normalMPosition)];
		var n2 = normalMapData.data[(normalMPosition+1)];
		var n3 = normalMapData.data[(normalMPosition+2)];
		var newColor = calcColor([n1,n2,n3],[a, b, c], lightColor, {x:x1+i/4, y: y}, spherePoint)
		imgData.data[i+0] = newColor[0];
		imgData.data[i+1] = newColor[1];
		imgData.data[i+2] = newColor[2];
		imgData.data[i+3]=255;
		if (position >= endPosition)
			position = startPosition;
	}
	
	ctx.putImageData(imgData, x1, y);
}

function drawHorizontalLine2Sphere(x1, x2, y, imageData, xBitmap, yBitmap, w, h, lightColor,  spherePoint) {
	//ctx.fillStyle = '#ff0000';
	var imgData = ctx.createImageData(x2-x1+1, 1); // only do this once per page
	var position = parseInt(( parseInt(xBitmap) + w * yBitmap ) * 4);
	var endPosition = position + w*4;
	var startPosition = position;
	for (var i=0;i<imgData.data.length;i+=4)
	{
		position += 4;		
		var a = imageData.data[(position)];
		var b = imageData.data[(position+1)];
		var c = imageData.data[(position+2)];
		var d = imageData.data[position+3];
		var newColor = calcColor([0,0,1],[a, b, c], lightColor, {x:x1+i/4, y: y}, spherePoint)
		imgData.data[i+0] = newColor[0];
		imgData.data[i+1] = newColor[1];
		imgData.data[i+2] = newColor[2];
		imgData.data[i+3] = 255;
		if (position >= endPosition)
			position = startPosition;
	}
	
	ctx.putImageData(imgData, x1, y);
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

function parseColor(input) {
    if (input.substr(0,1)=="#") {
	var collen=(input.length-1)/3;
	var fact=[17,1,0.062272][collen-1];
	return [
	    Math.round(parseInt(input.substr(1,collen),16)*fact),
	    Math.round(parseInt(input.substr(1+collen,collen),16)*fact),
	    Math.round(parseInt(input.substr(1+2*collen,collen),16)*fact)
	];
    }
    else return input.split("(")[1].split(")")[0].split(",").map(Math.round);
}

function cosinusNL(Nx, Ny, Nz, Lx, Ly, Lz) {
	return Nx*Lx+Ny*Ly+Nz*Lz
}

function normalize(x, y, z) {
	var d = Math.sqrt(x*x + y*y + z*z);
	return [x/d, y/d, z/d];
}

function calcColor(N, color, lightColor, point, spherePoint) {
	var h = 50;
	var L = [spherePoint.x - point.x, spherePoint.y - point.y, h];
	L = normalize(L[0], L[1], L[2]);
	/*N[0] = (N[0] - 127) / 127;
	N[1] = (N[1] - 127) / 127;*/
	N = normalize(N[0], N[1], N[2]);
	var cos = 1;
	if (spherePoint != false) {
		cos = cosinusNL(N[0], N[1] , N[2], L[0], L[1], L[2]);
	}
	return [cos * lightColor[0] * color[0] / (255),cos * lightColor[1] * color[1] / (255),cos * lightColor[2] * color[2] / (255)];
}