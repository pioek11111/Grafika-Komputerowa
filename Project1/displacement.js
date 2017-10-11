			function mouseDown(e)
			{
				var i, len = circles.length;
				var bRect = canvas.getBoundingClientRect();
				mouseX = (e.clientX - bRect.left);
				mouseY = (e.clientY - bRect.top);
				for (i=0; i < len; i++) {
					if(inCircle(circles[i], mouseX, mouseY)) 
					{
						console.log(i);
						drag = true;
						dragHoldX = mouseX - circles[i].x;
						dragHoldY = mouseY - circles[i].y;
						dragIndex = i;
					}
				}
				if (drag) 
				{
					window.addEventListener("mousemove", mouseMove, false);
				}
				canvas.removeEventListener("mousedown", mouseDown, false);
				window.addEventListener("mouseup", mouseUp, false);
				return false;		
			}
			
			function mouseMove(e)
			{
				var posX, posY;
				var radius = circles[dragIndex].r;
				var minX = radius;
				var maxX = canvas.width - radius;
				var minY = radius;
				var maxY = canvas.height - radius;

				var bRect = canvas.getBoundingClientRect();
				mouseX = (e.clientX - bRect.left);
				mouseY = (e.clientY - bRect.top);
				
				posX = mouseX - dragHoldX;
				posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
				posY = mouseY - dragHoldY;
				posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
				
				if (edgeStatus[dragIndex == 0? circles.length - 1 : dragIndex - 1] === horizontal) {
					circles[dragIndex == 0? circles.length - 1 : dragIndex - 1].y = posY;
				}
				
				if (edgeStatus[dragIndex] === horizontal) {
					circles[dragIndex == circles.length-1 ? 0 : dragIndex + 1].y = posY;
				}
				
				circles[dragIndex].x = posX;
				circles[dragIndex].y = posY;

				ctx.fillStyle = 'white';
				ctx.fillRect(0,0,cw,ch);
				drawCircles();
				drawPolygon();
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
			}	