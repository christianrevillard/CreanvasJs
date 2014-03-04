var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'movable',
	applyTo: function(element, eventsToHandle, movableData)
	{
		var isMoved = false;
		var touchIdentifier = null;	
		var movingFrom = null;
		
		element.startMoving = function(e, id)
		{
			// for one-time droppable - TODO
			//if (this.isDropped)
			//	return;
			
			isMoved = true;
			movingFrom = element.controller.getCanvasXYFromClientXY(e);	
			touchIdentifier = id;
			element.controller.dispatchEvent('drag', {moveEvent:e, element:element});
		};

		element.moveCompleted = function(e)
		{
			isMoved = false;
			movingFrom = null;
			element.controller.dispatchEvent('drop', {moveEvent:e, element:element});
		};

		var beginMove = function(e) {
			eventsToHandle.push(function()
			{
				var doMove = function(e)
				{
					if (element.isPointInPath(e))
					{
						element.startMoving(e, e.identifier);
						return true;
					}
					return false;
				};
				
				if (e.targetTouches)
				{
					for (var touch = 0; touch<e.targetTouches.length; touch++)			
					{
						if (doMove(e.targetTouches[touch]))
							break;
					}					
				}
				else
				{
					doMove(e);
				}
			});
		};

		element.controller.addEventListener('mousedown', beginMove);
		element.controller.addEventListener('touchstart', beginMove);
			
		var move = function(e) {
			eventsToHandle.push(function()
					{		
						var doMove = function(e)
						{
							if (e.identifier == touchIdentifier) // both null/undefined on desktop
							{
								var canvasXY = element.controller.getCanvasXYFromClientXY(e);	
								element.x += canvasXY.x-movingFrom.x;
								element.y += canvasXY.y-movingFrom.y;
								movingFrom = canvasXY;	
								return true;
							}
							return false;
						};
				
						if (isMoved)
						{
							if (e.targetTouches)
							{
								for (var touch=0; touch<e.targetTouches.length; touch++)
								{
									if (doMove(e.targetTouches[touch]))
										break;
								}
							}
							else
							{
								doMove(e);
							}
						}
					});
			element.triggerRedraw();
		};	

		element.controller.addEventListener('mousemove', move);
		element.controller.addEventListener('touchmove', move);

		var moveend = function(e) {
			eventsToHandle.push(function()
			{
				var doMove = function(e)
				{
					if (e.identifier == touchIdentifier) // both null/undefined on desktop
					{
						var canvasXY = element.controller.getCanvasXYFromClientXY(e);	
						element.x += canvasXY.x-movingFrom.x;
						element.y += canvasXY.y-movingFrom.y;
						element.moveCompleted(e);	
						touchIdentifier = null;
						return true;					
					}
					return false;					
				};
				
				if (isMoved)
				{
					if (e.changedTouches)
					{
						for (var touch=0; touch<e.changedTouches.length; touch++)
						{
							if (doMove(e.changedTouches[touch]))
								break;
						}
					}
					else
					{
						doMove(e);
					}
				}
			});
			element.triggerRedraw();
		};

		element.controller.addEventListener('mouseup', moveend);
		element.controller.addEventListener('touchend', moveend);		
	}
});
