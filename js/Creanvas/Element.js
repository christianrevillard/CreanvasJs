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
		this.id = CreJs.CreHelpers.GetGuid();	
		this.name = elementData.name;	
		this.image = elementData.image; // TODO : switch betwwen multiple image
		var draw = elementData.draw;	
		this.width = elementData.width;
		this.height = elementData.height;
		this.angle = elementData.angle || 0;
		this.scaleX = elementData.scaleX || 1;
		this.scaleY = elementData.scaleY || 1;
		this.m = 1;
		
		this.radius = Math.sqrt(this.width*this.width + this.height*this.height)/2;
		
		
		
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
																	
//					toCheck.sort(function(a,b){ return a.id<b.id;}).forEach(
	//					function(element)
		//				{
							
							var rect1 = element.getClientRect();
							collisionContext.clearRect(0,0,collisionContext.canvas.width,collisionContext.canvas.height);

							collisionContext.strokeStyle="#0FF";
							collisionContext.beginPath();
							collisionContext.moveTo(rect1.left,rect1.top);
							collisionContext.lineTo(rect1.right,rect1.top);
							collisionContext.lineTo(rect1.right,rect1.bottom);
							collisionContext.lineTo(rect1.left,rect1.bottom);
							collisionContext.closePath();
							collisionContext.stroke();

							var center = element.getCenter();
							
							var others = toCheck.filter(function(other){ 
								if (other.id === element.id || (!other.vx && !other.vy  && !element.vx  && !element.vy))
									return false;
								
								var otherCenter = other.getCenter();
								
								if (Math.sqrt((center.x-otherCenter.x)*(center.x-otherCenter.x)+(center.y-otherCenter.y)*(center.y-otherCenter.y))>element.radius + other.radius)
									return false;
									
								return true;								
							});
							
							if (others.length==0)
								return true;
							
							var hasCollided = false;

							var isDrawn=false;
								
							others.forEach(
								function(other)
								{
									var rect2 = other.getClientRect();

									collisionContext.strokeStyle="#0F0";
									collisionContext.beginPath();
									collisionContext.moveTo(rect2.left,rect2.top);
									collisionContext.lineTo(rect2.right,rect2.top);
									collisionContext.lineTo(rect2.right,rect2.bottom);
									collisionContext.lineTo(rect2.left,rect2.bottom);
									collisionContext.closePath();
									collisionContext.stroke();

									var left = Math.max(rect1.left, rect2.left);
									var right = Math.min(rect1.right, rect2.right);
									var top = Math.max(rect1.top, rect2.top);
									var bottom = Math.min(rect1.bottom, rect2.bottom);
										
									if (bottom<=top || right<=left)
										return;

									collisionContext.strokeStyle="#00F";
									collisionContext.beginPath();
									collisionContext.moveTo(left-2,top-2);
									collisionContext.lineTo(right+2,top-2);
									collisionContext.lineTo(right+2,bottom+2);
									collisionContext.lineTo(left-2,bottom+2);
									collisionContext.closePath();
									collisionContext.stroke();


									if (!isDrawn)
										{
									collisionContext.clearRect(left-1,top-1,right-left+2,bottom-top+2);
									
									collisionContext.translate(element.x, element.y);
									collisionContext.rotate(element.angle || 0);
									collisionContext.scale(element.scaleX || 1, element.scaleY || 1);
									collisionContext.drawImage(
											element.temporaryRenderingContext.canvas,
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
									var imageDataBefore = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight).data;
									
									/*
									collisionContext.strokeStyle="#F00";
									collisionContext.beginPath();
									collisionContext.moveTo(left-2,top-2);
									collisionContext.lineTo(right+2,top-2);
									collisionContext.lineTo(right+2,bottom+2);
									collisionContext.lineTo(left-2,bottom+2);
									collisionContext.closePath();
									collisionContext.stroke();
*/
									collisionContext.translate(other.x, other.y);
									collisionContext.rotate(other.angle || 0);
									collisionContext.scale(other.scaleX || 1, other.scaleY || 1);
									collisionContext.globalCompositeOperation='destination-out';
									collisionContext.drawImage(
										other.temporaryRenderingContext.canvas,
										0, 0, other.width, other.height,
										-other.dx, -other.dy, other.width, other.height);		
									collisionContext.globalCompositeOperation='source-over';
									collisionContext.scale(1/(other.scaleX || 1), 1/(other.scaleY) || 1);
									collisionContext.rotate(- (other.angle || 0));
									collisionContext.translate(-other.x, - other.y);						
									
									var imageDataAfter = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight).data;

									var edges=[];
									var points=[];

									for (var imageX=1;imageX<imageWidth-1; imageX++)
									{
										for (var imageY=1;imageY<imageHeight-1; imageY++)
										{
												// check alpha only
											if (Math.abs(imageDataBefore[imageY*imageWidth*4 + imageX*4 + 3] - imageDataAfter[imageY*imageWidth*4 + imageX*4 + 3])>100)
											{

													points.push({x:imageX, y:imageY}); 
												var edge1=false;
												var edge2=false;
												for (var i=-1;i<2;i++)
												{
													for (var j=-1;j<2;j++)
													{
														if (imageDataAfter[((imageY+i)*imageWidth)*4 + (imageX+j)*4 + 3] > 150)
														{
															edge1 = true;
														}
														if (imageDataBefore[((imageY+i)*imageWidth)*4 + (imageX+j)*4 + 3] < 50)
														{
															edge2 = true;
														}
														if (edge1 && edge2)
														{
															j=2;
															i=2;
														}
													}													
												}
												if (edge1 && edge2)
												{
													edges.push({x:imageX, y:imageY});
												}
											}
										}
									}

									if (points.length == 0)
										return;

									if (edges.length == 0)
										return;

									if (edges.length == 1)
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
											}
										}
									}
																		
									var pente = (edges[theMax.i].y -  edges[theMax.j].y)/(edges[theMax.i].x -  edges[theMax.j].x);

									var imageX = (edges[theMax.i].x +  edges[theMax.j].x)/2 + left - 1;
									var imageY = (edges[theMax.i].y +  edges[theMax.j].y)/2 + top - 1;

/*
									element.controller.context.strokeStyle="#F00";
									element.controller.context.lineWidth=5;
									element.controller.context.beginPath();
									element.controller.context.moveTo(left+imageX,top.imageY);
									element.controller.context.lineTo(left+imageX + 50, top+imageY + 50 * pente);
									element.controller.context.lineTo(left+imageX - 50, top+imageY - 50 * pente);
									element.controller.context.stroke();
	*/								
									//element.events.dispatch('collision', {element:other, contactPoint:{x:left+imageX,y:top+imageY}});
									
									//other.events.dispatch('collision', {element:element, contactPoint:{x:left+imageX,y:top+imageY}});
									
									//inverse speed. Must work the physics here...
									
									// to do: point vitesse, not element
									// later. first consequence...
									
									
									
									var tangente = Math.atan(pente);
									var vn1 = -element.vx * Math.sin(tangente) + element.vy*Math.cos(tangente);
									var vn2 = -(other.vx || 0) * Math.sin(tangente) + (other.vy || 0)*Math.cos(tangente);

									var vt1 = element.vx * Math.cos(tangente) + element.vy*Math.sin(tangente);
									var vt2 = (other.vx || 0) * Math.cos(tangente) + (other.vy || 0)*Math.sin(tangente);

									var ptransfered = 2 * Math.min(element.m, other.m)/(1 + Math.min(element.m, other.m)/Math.max(element.m, other.m))*(vn2-vn1);

									
									var colPoint = {x:imageX, y:imageY};
									
									element.controller.context.beginPath();
									element.controller.context.arc(colPoint.x, colPoint.y, 5, 0, 6);
									element.controller.context.stroke();

									var pente1 = (element.y - colPoint.y)/(element.x - colPoint.x);
									var tangente1 = Math.atan(pente1);
									var d1 = Math.sqrt((element.y - colPoint.y)*(element.y - colPoint.y)+(element.x - colPoint.x)*(element.x - colPoint.x));
									var d2 = Math.sqrt((other.y - colPoint.y)*(other.y - colPoint.y)+(other.x - colPoint.x)*(other.x - colPoint.x));

									
									element.controller.context.beginPath();
									element.controller.context.strokeStyle="#888";
									element.controller.context.beginPath();
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(tangente));
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(Math.PI/2 + tangente));
									element.controller.context.stroke();
									element.controller.context.strokeStyle="#000";

									
									
									ptrot1 = ptransfered*Math.cos(Math.abs(tangente1-tangente));
									ptvit1 = ptransfered*Math.sin(Math.abs(tangente1-tangente));

									element.controller.context.beginPath();
									element.controller.context.strokeStyle="#00F";
									element.controller.context.arc(element.x, element.y, 5, 0, 6);
									element.controller.context.stroke();
									element.controller.context.beginPath();
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(tangente1));
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(Math.PI/2 + tangente1));
									element.controller.context.stroke();

									var pente2 = (other.y - colPoint.y)/(other.x - colPoint.x);
									var tangente2 = Math.atan(pente2);
									ptrot2 = ptransfered*Math.cos(Math.abs(tangente2-tangente));
									ptvit2 = ptransfered*Math.sin(Math.abs(tangente2-tangente));

									element.controller.context.beginPath();
									element.controller.context.strokeStyle="#F00";
									element.controller.context.arc(other.x, other.y, 5, 0, 6);
									element.controller.context.stroke();
									element.controller.context.beginPath();
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(tangente2));
									element.controller.context.moveTo(colPoint.x, colPoint.y);
									element.controller.context.lineTo(colPoint.x + 100, colPoint.y + 100*Math.tan(Math.PI/2 + tangente2));
									element.controller.context.stroke();
									element.controller.context.strokeStyle="#000";

									var vn1new = vn1 + ptvit1/element.m;
									var vn2new = vn2 - ptvit2/other.m;
																		
									
									element.vx = vt1*Math.cos(tangente) - vn1new*Math.sin(tangente);	
									element.vy = vt1*Math.sin(tangente) + vn1new*Math.cos(tangente);	
									element.omega += ptrot1/d1/element.m;
									other.omega -= ptrot2/d2/other.m;

									other.vx = vt2*Math.cos(tangente) - vn2new*Math.sin(tangente);	
									other.vy = vt2*Math.sin(tangente) + vn2new*Math.cos(tangente);	

									hasCollided = true;
									element.controller.log('collision : ' + element.name + " and " + other.name);

								});
							
			//		 		});
							// to do, update...
							return !hasCollided;
			};				
		
	};

}());