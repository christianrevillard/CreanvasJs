// Basic Element
// Define position, drawing info

(function() {
	var creanvas = CreJs.CreanvasNodeClient;

	// decorators as additional arguments.
	creanvas.NodeJsElement = function(
			controller, 
			identificationData,
			imageData, 
			positionData) {

		var element = this;

		this.controller = controller;

		setIdentification(element, identificationData[1]);
		setImage(element, imageData[1]);
		setPosition(element, positionData[1]);

		this.drawMyself = function() {

			var element = this;

			element.controller.context.scale(element.controller.lengthScale,
					element.controller.lengthScale);

			element.controller.context.translate(element.elementX,
					element.elementY);
			element.controller.context.rotate(element.elementAngle || 0);
			element.controller.context.scale(element.elementScaleX || 1,
					element.elementScaleY || 1);

			controller.context.beginPath();
			element.draw(controller.context);
			controller.context.setTransform(1, 0, 0, 1, 0, 0);

		};

		this.drawMyEdges = function() {

			var element = this;
			if (element.edges && element.edges.length>0)
			{
	
				element.controller.context.scale(element.controller.lengthScale,
						element.controller.lengthScale);
	
				element.controller.context.translate(element.elementX,
						element.elementY);
				element.controller.context.rotate(element.elementAngle || 0);
				element.controller.context.scale(element.elementScaleX || 1,
						element.elementScaleY || 1);
			
				element.controller.context.beginPath();
				var current = element.edges[0];
				element.controller.context.moveTo(current.x, current.y);
				for (var i=1; i<element.edges.length; i++)
				{
					current = element.edges[i];
					element.controller.context.lineTo(current.x, current.y);
				}
				element.controller.context.closePath();
			}
			
			controller.context.setTransform(1, 0, 0, 1, 0, 0);
		};


	};

	var setIdentification = function(element, identificationData) {
		element.elementName = identificationData;
	};

	var setImage = function(element, imageData) {
		var width = imageData["width"];
		var height = imageData["height"];

		element.top = imageData["top"] == 0 ? 0 : imageData["top"]
				|| (-height / 2);
		element.left = imageData["left"] == 0 ? 0 : imageData["left"]
				|| (-width / 2);
		element.bottom = imageData["bottom"] == 0 ? 0 : imageData["bottom"]
				|| (element.top + height);
		element.right = imageData["right"] == 0 ? 0 : imageData["right"]
				|| (element.left + width);
		element.elementWidth = width || (element.right - element.left);
		element.elementHeight = height || (element.bottom - element.top);

		// scaling decorator ?? => should be
		element.elementScaleX = imageData["scaleX"] || 1;
		element.elementScaleY = imageData["scaleY"] || 1;

		element.draw = imageData["draw"];

		
		// Edges calculation to do in addElementDrawing, so only once per drawing, and allow shift without recalculation!
		
		// draw in a 50/50 points matrix
		var tempCanvas = element.controller.context.canvas.ownerDocument
				.createElement('canvas');
		element.temporaryRenderingContext = tempCanvas.getContext("2d");
		element.controller.context.canvas.ownerDocument.body.appendChild(tempCanvas);

		var stuff = 50;		
		
		tempCanvas.width = stuff;
		tempCanvas.height = stuff;

		element.temporaryRenderingContext.beginPath();
		element.temporaryRenderingContext.translate(-stuff*element.left/element.elementWidth, -stuff*element.top/element.elementHeight);
		element.temporaryRenderingContext.scale(stuff / element.elementWidth, stuff / element.elementHeight);
		element.draw.call(element, element.temporaryRenderingContext);
		
		var stuffImage = element.temporaryRenderingContext.getImageData(0, 0, stuff, stuff);
		element.edges = [];
		
		var startEdge = null;
		var transparencyLimit = 1;
		
		var imageX= null;
		var imageY = null;
		var currentEdge = null;
		
		var checkPoint = function(x,y,edge)
		{
			if (stuffImage.data[y*stuff*4 + x*4 + 3] < transparencyLimit)
				return false;
							
			var match = false;
			
			if (edge == "top")
			{
				match = y==0 || stuffImage.data[(y-1)*stuff*4 + x*4 + 3] < transparencyLimit;
				dx = 0.5; dy=0;
			}
			if (edge == "left")
			{
				match = x==0 || stuffImage.data[y*stuff*4 + (x-1)*4 + 3] < transparencyLimit;
				dx = 0; dy=0.5;
			}
			if (edge == "right")
			{
				match = x==stuff-1 || stuffImage.data[y*stuff*4 + (x+1)*4 + 3] < transparencyLimit;
				dx = 1; dy=0.5;
			}
			if (edge == "bottom")
			{
				match = y==stuff-1 || stuffImage.data[(y+1)*stuff*4 + x*4 + 3] < transparencyLimit;
				dx = 0.5; dy=1;
			};

			if (!match)
				return;
			
			element.edges.push({
				x: (x + dx)*element.elementWidth/stuff+ element.left,
				y: (y + dy)*element.elementHeight/stuff+ element.top}); 

			imageX = x;
			imageY = y;
			currentEdge = edge;

			return true;
		};
			
		for (var forX=0;forX<stuff; forX++)
		{
			for (var forY=0;forY<stuff; forY++)
			{
				if (checkPoint(forX, forY, "top"))
				{
					startEdge = {x:imageX, y:imageY};
					forX = stuff; forY=stuff;
				}
			}
		}

		if (startEdge)
		{						
			do 
			{
				if (currentEdge == "top")
				{
					if (imageX<stuff-1 && imageY>0 && checkPoint(imageX+1, imageY-1, "left"))
					{
						continue;
					}
					
					if (imageX<stuff-1 && checkPoint(imageX+1, imageY, "top"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "right"))
					{
						continue;
					}
				}
				else if (currentEdge == "right")
				{
					if (imageX<stuff-1 && imageY<stuff-1 && checkPoint(imageX+1, imageY+1, "top"))
					{
						continue;
					}
					
					if (imageY<stuff-1 && checkPoint(imageX, imageY+1, "right"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "bottom"))
					{
						continue;
					}
				}
				else if (currentEdge == "bottom")
				{
					if (imageX>0 && imageY<stuff-1 && checkPoint(imageX-1, imageY+1, "right"))
					{
						continue;
					}
					
					if (imageX>0 && checkPoint(imageX-1, imageY, "bottom"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "left"))
					{
						continue;
					}
				}
				else if (currentEdge == "left")
				{
					if (imageX>0 && imageY>0 && checkPoint(imageX-1, imageY-1, "bottom"))
					{
						continue;
					}
					
					if (imageY>0 && checkPoint(imageX, imageY-1, "left"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "top"))
					{
						continue;
					}
				}
			} while (imageX != startEdge.x || imageY != startEdge.y);
		}
	};

	var setPosition = function(element, position) {
		// position prop
		element.elementX = position["x"] || 0;
		element.elementY = position["y"] || 0;
		element.elementZ = position["z"] || 0;
		element.elementAngle = position["angle"] || 0;
	};

	creanvas.NodeJsElement.prototype.hit = function(pointerX, pointerY) {
		
		if (!this.edges)
			return false;

		var x = pointerX*this.controller.lengthScale;
		var y = pointerY*this.controller.lengthScale;

	//	if (x<this.elementX + this.left || x>this.elementX + this.right ||  y<this.elementY + this.top || y>this.elementY + this.bottom)
		//	return false;
		
		this.drawMyEdges();
		return this.controller.context.isPointInPath(x,y);
	};
}());