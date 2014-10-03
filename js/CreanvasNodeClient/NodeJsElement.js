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
		// scaling decorator ?? => should be
		element.elementScaleX = imageData["scaleX"] || 1;
		element.elementScaleY = imageData["scaleY"] || 1;

		element.draw = imageData["draw"];
		element.edges = imageData["edges"];
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