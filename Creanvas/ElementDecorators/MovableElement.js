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
			var isMoving = false;
			this.touchIdentifier = null;	
			var movingFrom = null;
			var isBlocked = movableData.isBlocked;			
			
			element.startMoving = function(e)
			{				
				if (DEBUG) element.debug('movable.startMoving', 'identifier: ' + e.touchIdentifier);

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
				if (DEBUG) element.debug('movable.moveCompleted', 'identifier: ' + e.touchIdentifier);

				isMoving = false;
				movingFrom = null;
				if (element.isDroppable)
				{
					if (DEBUG) element.debug('movable.moveCompleted', 'trigger drop - identifier: ' + e.touchIdentifier);
					
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
			
			element.elementEvents.getEvent('pointerDown').addListener(beginMove);

			var isMovingLogged = false;
			
			var move = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;
				
				if (!isMovingLogged)
				{
					isMovingLogged = true;
					if (DEBUG) element.debug('movable.move', 'identifier: ' + element.touchIdentifier);
				}

				element.elementX += e.x-movingFrom.x;
				element.elementY += e.y-movingFrom.y;
				movingFrom = {x:e.x, y:e.y};	
				element.triggerRedraw();
			};	
	
			element.elementEvents.getEvent('pointerMove').addListener(move);
	
			var moveend = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;

				if (DEBUG) element.debug('movable.moveend', 'identifier: ' + element.touchIdentifier);
				
				element.elementX += e.x-movingFrom.x;
				element.elementY += e.y-movingFrom.y;
				element.moveCompleted(e);	
				element.touchIdentifier = null;
				isMovingLogged = false;
				element.triggerRedraw();
			};
	
			element.elementEvents.getEvent('pointerUp').addListener(moveend);
		}
	};
}());