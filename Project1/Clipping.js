function clip() {
	var polygon1 = circles[0];
	var polygon2 = circles[1];
	var crossPoints1 = [];
	var crossPoints2 = [];
	var edges = []
	
	for(var i = 0; i < polygon1.length; i++) {
		crossPoints1[i] = [];
		edges[i] = [];
	}
	
	for(var i = 0; i < polygon2.length; i++) {
		crossPoints2[i] = [];
	}
	
	for(var i = 0; i < polygon1.length; i++) {
		for(var j = 0; j < polygon2.length; j++) {
			var p = crossPoint({x:polygon1[i].x, y:polygon1[i].y}, {x:polygon1[(i+1)% polygon1.length].x, y:polygon1[(i+1)% polygon1.length].y},
						   {x:polygon2[j].x, y:polygon2[j].y}, {x:polygon2[(j+1)% polygon2.length].x, y:polygon2[(j+1)% polygon2.length].y}); 
			if (p != false) {
				//crossPoints.push({point:p, e1:i, e2:j});
				crossPoints1[i].push({point:p, e1:i, e2:j});
				crossPoints2[j].push({point:p, e1:i, e2:j});				
			}
		}
	}
	var n1 = polygon1.length;
	var n2 = polygon2.length;
	for(var i = n1 - 1; i >= 0; i--) {
		for(var j = 0; j < crossPoints1[i].length; j++) {
			polygon1.splice(i+1, 0, crossPoints1[i][j]);
		}
	}
	for(var i = n2 - 1; i >= 0; i--) {
		for(var j = 0; j < crossPoints2[i].length; j++) {
			polygon2.splice(i+1, 0, crossPoints2[i][j]);
		}
	}

	for(var i = polygon1.length - 1; i >= 0; i--) {
		var idx1 = polygon1[i].e1;
		var idx2 = polygon1[i].e2;
		if (idx1 != undefined) {
			edges[idx1][idx2] = {idx1: i, idx2: 0};
		}
	}
	for(var i = polygon2.length - 1; i >= 0; i--) {
		var idx1 = polygon2[i].e1;
		var idx2 = polygon2[i].e2;
		if (idx1 != undefined) {
			edges[polygon2[i].e1][polygon2[i].e2] = {idx1: edges[polygon2[i].e1][polygon2[i].e2].idx1, idx2: i};
		}
	}
	var startIdx;
	for(var i = 0; i < polygon1.length; i++) {
		if (polygon1[i].e1 != undefined) {
			startIdx = i;
			break;
		}
	}
	
	var newPolygon = [];
	var currPolygon = 0;
	var polygons = [];
	polygons.push(polygon1);
	polygons.push(polygon2);
	var idx = startIdx;
	while(true) {
		newPolygon.push(polygons[currPolygon][idx]);
		if (polygons[currPolygon][idx].e1 != undefined) { // punkt przecięcia
			currPolygon = currPolygon == 0 ? 1 : 0;
			idx = currPolygon == 0 ? edges[polygons[currPolygon][idx].e1][polygons[currPolygon][idx].e2].idx1 :
				  edges[polygons[currPolygon][idx].e1][polygons[currPolygon][idx].e2].idx2;
		} else {
			
		}
		idx = (idx + 1) % (polygons[currPolygon].length);
		if(idx == startIdx && currPolygon == 0) {
			break;
		}
	}
	debugger;
}

function crossPoint(A, B, C, D) {
	if (SegmentIntersection(A, B, C, D)) {
		return {
			x:((B.x-A.x)*(D.x*C.y-D.y*C.x)-(D.x-C.x)*(B.x*A.y-B.y*A.x))/((B.y-A.y)*(D.x-C.x)-(D.y-C.y)*(B.x-A.x)),
			y:((D.y-C.y)*(B.x*A.y-B.y*A.x)-(B.y-A.y)*(D.x*C.y-D.y*C.x))/((D.y-C.y)*(B.x-A.x)-(B.y-A.y)*(D.x-C.x))
		}
	} else {
		return false;
	}
}

function SegmentIntersection(p1,p2,p3,p4) {
	var d1= CrossProduct(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y); // (p4-p3)×(p1-p3) położenie punktu p1 względem odcinka p3p4
	var d2= CrossProduct(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y); // (p4-p3)×(p2-p3); // położenie punktu p2 względem odcinka p3p4
	var d3= CrossProduct(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y); //(p2-p1)×(p3-p1); // położenie punktu p3 względem odcinka p1p2
	var d4= CrossProduct(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y); //(p2-p1)×(p4-p1); // położenie punktu p4 względem odcinka p1p2
	var d12=d1*d2; // „łączne” położenie punktów p1 i p2
	 // względem odcinka p3p4
	var d34=d3*d4; // „łączne” położenie punktów p3 i p4
	 // względem odcinka p1p2
	// końce jednego z odcinków leżą po tej samej stronie drugiego
	if ( d12>0 || d34>0 ) return false;
	// końce żadnego z odcinków nie leżą po tej samej stronie drugiego
	// i końce jednego z odcinków leżą po przeciwnych stronach drugiego
	if ( d12<0 || d34<0 ) return true
	// tu d12== 0 i d34==0
	// czyli wszystkie cztery punkty są współliniowe
	// lub odcinki mają wspólny koniec
	return OnRectangle(p1,p3,p4) || OnRectangle(p2,p3,p4) || OnRectangle(p3,p1,p2) || OnRectangle(p4,p1,p2);
}
// funkcja zwraca true
// jeśli punkt q należy do prostokąta wyznaczonego przez punkty p1 i p2
function OnRectangle(q,p1,p2) {
	// pi=(xi,yi), q=(x,y)
	return Math.min(p1.x,p2.x)<=q.x && q.x<=Math.max(p1.x,p2.x) && Math.min(p1.y,p2.y)<=q.y && q.y<=Math.max(p1.y,p2.y);
} 

function CrossProduct(x1, y1, x2, y2) {
	return x1 * y2 - x2 * y1;
}