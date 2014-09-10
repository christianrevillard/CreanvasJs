// movableData:
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){

	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["movable"] =
	{
		applyTo: function(element, movableData)
		{
			// Externally usable - handle ADVANCED_OPTIMIZATION
			// movableData.isBlocked = movableData.isBlocked || movableData["isBlocked"];

			var isMoving = false;
			this.touchIdentifier = null;	
			var movingFrom = null;
			var isBlocked = movableData.isBlocked;			
			
			element.startMoving = function(e)
			{				
				if (DEBUG)
				{
					element.controller.logMessage('Starting moving - identifier: ' + e.touchIdentifier);
				}
				isMoving = true;
				element.touchIdentifier = e.touchIdentifier;
				movingFrom = {x:e.x, y:e.y};	
				if (element.dropZone)
				{
					element.dropZone.drag(element);
					element.dropZone = null;
				}
			};
	
			element.moveCompleted = function(e)
			{
				if (DEBUG)
				{
					element.controller.logMessage('Completed move - identifier: ' + e.touchIdentifier);
				}
				isMoving = false;
				movingFrom = null;
				if (element.isDroppable)
				{
					if (DEBUG)
					{
						element.controller.logMessage('Trigger drop - identifier: ' + e.touchIdentifier);
					}
					
					element.controller.triggerPointedElementEvent(
							'drop', 
							{
								x:e.x,
								y:e.y,
								droppedElement:element
							}); 
				}
			};
			
	
			var beginMove = function(e) {
	
				if (isBlocked && isBlocked()) 
					return;
								
				element.startMoving(e);
			};
			
			element.elementEvents.addEventListenerX(
					{eventGroupType:'movable',
					eventId:'pointerDown', 
					handleEvent:beginMove,
					listenerId:element.elementId});

			var isMovingLogged = false;
			
			var move = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;
				
				if (!isMovingLogged)
				{
					isMovingLogged = true;
					if (DEBUG)
					{
						element.controller.logMessage('pointereMove event on movable ' + element.elementId + " (" + element.touchIdentifier + ")");
					}
				}

				element.elementX += e.x-movingFrom.x;
				element.elementY += e.y-movingFrom.y;
				movingFrom = {x:e.x, y:e.y};	
				element.triggerRedraw();
			};	
	
			element.elementEvents.addEventListenerX(
				{eventGroupType:'movable',
				eventId:'pointerMove', 
				handleEvent:move,
				listenerId:element.elementId});
	
			var moveend = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;

				if (DEBUG)
				{
					element.controller.logMessage('End detected for touch ' + element.touchIdentifier);
				}
				
				element.elementX += e.x-movingFrom.x;
				element.elementY += e.y-movingFrom.y;
				element.moveCompleted(e);	
				element.touchIdentifier = null;
				isMovingLogged = false;
				element.triggerRedraw();
			};
	
			element.elementEvents.addEventListenerX(
					{eventGroupType:'movable',
					eventId:'pointerUp', 
					handleEvent:moveend,
					listenerId:element.elementId});
		}
	};
}());