// movableData:
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){

	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'movable',
		applyTo: function(element, movableData)
		{
			var isMoving = false;
			this.touchIdentifier = null;	
			var movingFrom = null;
			var isBlocked = movableData.isBlocked;			

			
			element.startMoving = function(e)
			{				
				element.controller.log('Starting moving - identifier: ' + e.touchIdentifier);
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
				element.controller.log('Completed move - identifier: ' + e.touchIdentifier);
				isMoving = false;
				movingFrom = null;
				if (element.isDroppable)
				{
					element.controller.log('Trigger drop - identifier: ' + e.touchIdentifier);
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
			
			element.events.addEventListener(
					{eventGroupType:'movable',
					eventId:'pointerDown', 
					handleEvent:beginMove,
					listenerId:element.id});

			var isMovingLogged = false;
			
			var move = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;
				
				if (!isMovingLogged)
				{
					isMovingLogged = true;
					element.controller.log('pointereMove event on movable ' + element.id + " (" + element.touchIdentifier + ")");
				}

				element.x += e.x-movingFrom.x;
				element.y += e.y-movingFrom.y;
				movingFrom = {x:e.x, y:e.y};	
				element.triggerRedraw();
			};	
	
			element.events.addEventListener(
				{eventGroupType:'movable',
				eventId:'pointerMove', 
				handleEvent:move,
				listenerId:element.id});
	
			var moveend = function(e) {
				if(!isMoving)
					return;

				if (isBlocked && isBlocked()) 
					return;

				element.controller.log('End detected for touch ' + element.touchIdentifier);
				var canvasXY = element.controller.getCanvasXYFromClientXY(e);	
				element.x += e.x-movingFrom.x;
				element.y += e.y-movingFrom.y;
				element.moveCompleted(e);	
				element.touchIdentifier = null;
				isMovingLogged = false;
				element.triggerRedraw();
			};
	
			element.events.addEventListener(
					{eventGroupType:'movable',
					eventId:'pointerUp', 
					handleEvent:moveend,
					listenerId:element.id});
		}
	});
}());