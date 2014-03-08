// movableData:
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators.push(
{
	type: 'movable',
	applyTo: function(element, eventTarget, movableData)
	{
		var isMoved = false;
		var touchIdentifier = null;	
		var movingFrom = null;
		var isBlocked = movableData.isBlocked;
		
		element.startMoving = function(e, id)
		{
			// for one-time droppable - TODO
			//if (this.isDropped)
			//	return;
			
			isMoved = true;
			movingFrom = element.controller.getCanvasXYFromClientXY(e);	
			touchIdentifier = id;
			if (element.isDroppable)
			{
				element.controller.events.dispatch('drag', {moveEvent:e, element:element});
			}
		};

		element.moveCompleted = function(e)
		{
			isMoved = false;
			movingFrom = null;
			if (element.isDroppable)
			{
				element.controller.events.dispatch('drop', {moveEvent:e, element:element});
			}
		};

		var beginMove = function(e) {

			if (isBlocked && isBlocked()) 
				return;
			
			eventTarget.queueEvent(function()
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

		element.controller.events.addEventListener({
			eventGroupType:'movable',
			eventId:'pointerDown', 
			handleEvent:beginMove,
			listenerId:element.id});
			
		var move = function(e) {
			if (isBlocked && isBlocked()) 
				return;
			
			eventTarget.queueEvent(function()
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

		element.controller.events.addEventListener({
			eventGroupType:'movable',
			eventId:'pointerMove', 
			handleEvent:move,
			listenerId:element.id});

		var moveend = function(e) {
			if (isBlocked && isBlocked()) 
				return;
			
			eventTarget.queueEvent(function()
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

		element.controller.events.addEventListener({
			eventGroupType:'movable',
			eventId:'pointerUp', 
			handleEvent:moveend,
			listenerId:element.id});
	}
});
