var CreJs = CreJs || {};

(function(){
	var creanvas = CreJs.Creanvas = CreJs.Creanvas || {};		
	
	creanvas.Element = function(elementData){
	
		if (!elementData.hasOwnProperty('controller'))
		{
			return; // TODO error throw / handling
		};
	
		if (!elementData.hasOwnProperty('draw'))
		{
			return; // TODO error throw / handling
		};
		
		var cachedResults = [];
		
		
		this.controller = elementData.controller;
		this.x = elementData.x || 0;
		this.y = elementData.y || 0;
		this.z = elementData.z || 0;
		this.omega = elementData.omega || 0;
		this.id = CreJs.CreHelpers.GetGuid();	
		this.name = elementData.name;	
		this.image = elementData.image; // TODO : switch betwwen multiple image
		var draw = elementData.draw;	
		this.width = elementData.width;
		this.height = elementData.height;
		this.angle = elementData.angle || 0;
		this.scaleX = elementData.scaleX || 1;
		this.scaleY = elementData.scaleY || 1;
		this.vx = elementData.vx || 0;
		this.vy = elementData.vy || 0;
		this.m = 1;

		this.getM = function()
		{				
			return element.m / 12 * (element.width*element.scaleX * element.width*element.scaleX + element.height*element.scaleY * element.height*element.scaleY); // square...};
		};
		
		this.geRadiusCache = function()
		{				
			return Math.sqrt(element.width*element.width*element.scaleX*element.scaleX + element.height*element.height*element.scaleY*element.scaleY)/2;
		};

		this.getRadius = function()
		{				
			var key = element.width + '' + element.height + '' + element.scaleX+ '' + element.scaleY ;
			if (cachedResults['getRadius'] && cachedResults['getRadius'].key == key)
			{
				return cachedResults['getRadius'].value;
			}
			var value = element.geRadiusCache();
			cachedResults['geRadius'] = {key:key, value:value};
			return value;
		};
				
		var translate = elementData.translate || {dx:elementData.width/2, dy:elementData.height/2};			
		this.dx = translate.dx;
		this.dy = translate.dy;
		var element = this;
		
		if (elementData.rules)
		{
			element.rules = [];
			elementData.rules.forEach(function(rule)
			{
				var  ruleId = element.rules.length;
				element.rules.push(rule);
				setInterval(
						function()
						{
							element.rules[ruleId].rule.call(element);					
							element.triggerRedraw();
						},
						rule.checkTime);
			});
		};
							
		this.events = new CreJs.Creevents.EventContainer();			
			
		this.isPointInPath = function(clientXY){

			var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	

			return element.controller.noDrawContext.isPointInPath(element, draw, canvasXY);
		};

		if (CreJs.Creanvas.elementDecorators)
		{
			for(var decoratorId=0; decoratorId<creanvas.elementDecorators.length; decoratorId++)
			{
				var decorator = CreJs.Creanvas.elementDecorators[decoratorId];
				if (elementData.hasOwnProperty(decorator.type) && elementData[decorator.type])
				{
					decorator.applyTo(element, elementData[decorator.type]);
				}
			}
		}
		
		this.hit = function(pointerX,pointerY)
		{
			var imageX = Math.round(pointerX - element.x + element.dx);
			var imageY = Math.round(pointerY - element.y + element.dy);
			
			return imageX >= 0 && 
			imageX <= element.width &&
			imageY >= 0 &&
			imageY <= element.height && 
			element.image.data[4*imageY*element.width + 4*imageX + 3]>0;
		};

		this.clone = function()
		{
			var newElement = element.controller.addElementWithoutContext(elementData);
			newElement.temporaryRenderingContext = element.temporaryRenderingContext;
			newElement.image = element.image;
			return newElement;
		};
	
		this.applyDecorator = function(decorator, decoratorData)
		{
			decorator.applyTo(element, decoratorData);
		};
		
		this.removeDecorator = function (decoratorType)
		{
			element.events.removeEventListener(
					{eventGroupType:decoratorType,
						listenerId:element.id});
		};
		
		this.canHandle = function(eventId)
		{
			// click, pointerDown, always stopped by top element, even if not handled
			return eventId == 'click' || eventId == 'pointerDown' || 
			element.events.hasEvent(eventId);
		};
		
		this.deactivate = function ()
		{
			element.controller.events.removeEventListener({listenerId:element.id});
			element.temporaryRenderingContext = null;
		};
		
		element.controller.events.addEventListener(
		{
			eventId: 'deactivate', 
			listenerId:element.id,
			handleEvent: function(e) { element.deactivate(); }
		});


		this.triggerRedraw = function()
		{
			element.controller.redraw();
		};	
		
		
		// move to element
		this.getCanvasXY=function(imageX, imageY)
		{
			return {
				x: Math.round(element.x + imageX*element.scaleX*Math.cos(element.angle) - imageY*element.scaleY*Math.sin(element.angle)),
				y: Math.round(element.y + imageX*element.scaleX*Math.sin(element.angle) + imageY*element.scaleY*Math.cos(element.angle))
			};
		};

		this.getElementXY=function(canvasX, canvasY)
		{
			return {
				x: Math.round(((canvasX- element.x)*Math.cos(element.angle) + (canvasY-element.y)*Math.sin(element.angle))/element.scaleX),
				y: Math.round(((canvasY- element.y)*Math.cos(element.angle)-(canvasX-element.x)*Math.sin(element.angle))/element.scaleY),
			};
		};
		
		
		this.getCenter = function()
		{
			return element.getCanvasXY(-element.dx + element.width/2, -element.dy + element.height/2);
		};
		
		var corners=[];
		corners.push({x:- element.dx, y: -element.dy});
		corners.push({x:- element.dx + element.width, y:-element.dy});
		corners.push({x:- element.dx + element.width, y:-element.dy + element.height});
		corners.push({x:- element.dx, y:-element.dy + element.height});

		this.getClientCornersCache = function()
		{				
			return corners.map(function(point){return element.getCanvasXY(point.x, point.y);});
		};

		this.getClientCorners = function()
		{				
			var key = element.x + '' + element.y + '' + element.angle + '' + element.scaleX + '' + element.scaleX;
			if (cachedResults['getClientCorners'] && cachedResults['getClientCorners'].key == key)
			{
				return cachedResults['getClientCorners'].value;
			}
			var value = element.getClientCornersCache();
			cachedResults['getClientCorners'] = {key:key, value:value};
			return value;
		};

		this.getClientRectCache = function()
		{			
			var clientCorners = element.getClientCorners();
			
			return {
				top: clientCorners.reduce(function(a,b){ return Math.min(a,b.y);}, Infinity),
				bottom: clientCorners.reduce(function(a,b){ return Math.max(a,b.y);}, -Infinity),
				left: clientCorners.reduce(function(a,b){ return Math.min(a,b.x);}, Infinity),
				right: clientCorners.reduce(function(a,b){ return Math.max(a,b.x);}, -Infinity)
			};
		};

		this.getClientRect = function()
		{			
			var key = element.x + '' + element.y + '' + element.angle + '' + element.scaleX + '' + element.scaleX;
			if (cachedResults['getClientRect'] && cachedResults['getClientRect'].key == key)
			{
				return cachedResults['getClientRect'].value;
			}
			var value = element.getClientRectCache();
			cachedResults['getClientRect'] = {key:key, value:value};
			return value;
		};

		this.preMove = function()
				 {
					if (!this.collidable)
						return true;
				
					toCheck = element.controller.elements.filter(function(e){ return e.collidable;});					
																								
					var rect1 = element.getClientRect();

					var center = element.getCenter();
					
					var others = toCheck.filter(function(other){ 
						if (other.id === element.id || (!other.vx && !other.vy  && !element.vx  && !element.vy))
							return false;
						
						var otherCenter = other.getCenter();
						
						if (Math.sqrt((center.x-otherCenter.x)*(center.x-otherCenter.x)+(center.y-otherCenter.y)*(center.y-otherCenter.y))>element.getRadius() + other.getRadius())
							return false;
							
						return true;								
					});
					
					if (others.length==0)
						return true;
					
					var hasCollided = false;

					var isDrawn=false;

					collisionContext.clearRect(0,0,collisionContext.canvas.width,collisionContext.canvas.height);
						
					others.forEach(
						function(other)
						{
							if (hasCollided)
								return; // take just the first one...
							
							var rect2 = other.getClientRect();
							var left = Math.max(rect1.left, rect2.left);
							var right = Math.min(rect1.right, rect2.right);
							var top = Math.max(rect1.top, rect2.top);
							var bottom = Math.min(rect1.bottom, rect2.bottom);
								
							if (bottom<=top || right<=left)
								return;

							if (!isDrawn)
								{

								collisionContext.clearRect(left-1,top-1,right-left+2,bottom-top+2);
							
							collisionContext.translate(element.x, element.y);
							collisionContext.rotate(element.angle || 0);
							collisionContext.scale(element.scaleX || 1, element.scaleY || 1);
							collisionContext.drawImage(
									element.collisionContext.canvas,
									0, 0, element.width, element.height,
									-element.dx, -element.dy, element.width, element.height);
						
							collisionContext.scale(1/(element.scaleX || 1), 1/(element.scaleY) || 1);
							collisionContext.rotate(- (element.angle || 0));
							collisionContext.translate(-element.x, -element.y);	
								isDrawn = true;
								};
							
							
							// save this image
							var imageWidth = right-left+2;
							var imageHeight = bottom-top+2;
							var imageBefore = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight);
							
						
							collisionContext.translate(other.x, other.y);
							collisionContext.rotate(other.angle || 0);
							collisionContext.scale(other.scaleX || 1, other.scaleY || 1);
							collisionContext.globalCompositeOperation='destination-out';
							collisionContext.drawImage(
								other.collisionContext.canvas,
								0, 0, other.width, other.height,
								-other.dx, -other.dy, other.width, other.height);		
							collisionContext.globalCompositeOperation='source-over';
							collisionContext.scale(1/(other.scaleX || 1), 1/(other.scaleY) || 1);
							collisionContext.rotate(- (other.angle || 0));
							collisionContext.translate(-other.x, - other.y);						
							
							var imageAfter = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight);

							var edges=[];

							for (var imageX=1;imageX<imageWidth-1; imageX++)
							{
								for (var imageY=1;imageY<imageHeight-1; imageY++)
								{
										// check alpha only
									if (imageBefore.data[imageY*imageWidth*4 + imageX*4 + 3] > 160 && imageAfter.data[imageY*imageWidth*4 + imageX*4 + 3] < 90)
									{
										edges.push({x:imageX, y:imageY});
									}
								}
							}

							if (edges.length < 2)
								return;

							var d,dmax = 0;
							var theMax = {i:0, j:edges.length-1};
							for (var i = 1; i<edges.length; i++)
							{
								for (var j = i+1; j<edges.length; j++)
								{
									var dx = edges[i].x-edges[j].x;
									var dy = edges[i].y-edges[j].y;
									d = Math.sqrt(dx*dx+dy*dy);
									if (d>dmax)
									{
										dmax=d;
										theMax.i = i;
										theMax.j = j;
									};
								};																			
							};

							collisionContext.putImageData(imageAfter, left-1,top-1);

							
							var colVectors = CreJs.Core.getUnitVectors(edges[theMax.i].x, edges[theMax.i].y,  edges[theMax.j].x , edges[theMax.j].y);
							 
							var imageX = (edges[theMax.i].x +  edges[theMax.j].x)/2 + left - 1;
							var imageY = (edges[theMax.i].y +  edges[theMax.j].y)/2 + top - 1;


							//element.events.dispatch('collision', {element:other, contactPoint:{x:left+imageX,y:top+imageY}});									
							//other.events.dispatch('collision', {element:element, contactPoint:{x:left+imageX,y:top+imageY}});
							
							var collisionPoint = {x:imageX, y:imageY};
							// CreJs.Core.drawUnitVectors(collisionContext, collisionPoint.x, collisionPoint.y, colVectors, "#0F0");

							var speedElement = new CreJs.Core.Vector(element.vx, element.vy);
							var speedOther = new CreJs.Core.Vector(other.vx, other.vy);

							var localSpeedElement = speedElement.getCoordinates(colVectors);
							var localSpeedOther = speedOther.getCoordinates(colVectors);
							
							var centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x-element.x, collisionPoint.y-element.y);								
							var l1 = CreJs.Core.VectorProduct(centerCollisionElement, colVectors.v);		
							var d1;
							if (Math.abs(l1)<1)
								d1 = Infinity;
							else
								d1 = l1;

							var centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x-other.x, collisionPoint.y-other.y);								
							var l2= CreJs.Core.VectorProduct(centerCollisionOther, colVectors.v);		
							var d2;
							if (Math.abs(l2)<1)
								d2 = Infinity;
							else
								d2 = l2;

							// F selon colVectors.v
							var F = 2 / (1/other.m + 1/element.m)*(localSpeedOther.v-localSpeedElement.v)
							+ 2 * (1/other.getM() + 1/element.getM())*(-other.omega/d2 + element.omega/d1);
							
							element.vx += F/element.m*colVectors.v.x;
							element.vy += F/element.m*colVectors.v.y;
							other.vx -= F/other.m*colVectors.v.x;
							other.vy -= F/other.m*colVectors.v.y;
							element.omega += 1*F * l1 / element.getM();
							other.omega -= 1*F * l2 / other.getM();
															
							hasCollided = true;
							element.controller.log('collision : ' + element.name + " and " + other.name);
						});
					
							return !hasCollided;
			};				
		
	};

}());