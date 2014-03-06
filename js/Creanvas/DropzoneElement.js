var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'dropzone',
	applyTo: function(element, eventsToHandle, dropzoneData)
	{
		var availableSpots = dropzoneData.availableSpots;
		var dropX = dropzoneData.dropX;
		var dropY = dropzoneData.dropY;
		
		element.droppedElements = [];
		
		var drop = function(e) {
			
			if(!e.element.isDroppable)
				return;
			
			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e.moveEvent))			
				{
					if (availableSpots > 0 && !e.element.dropZone)
					{
						availableSpots--;
						e.element.x = dropX || element.x;
						e.element.y = dropY || element.y;
						e.element.dropZone = element;
						element.droppedElements.push(e.element);
						element.controller.dispatchEvent('dropped', {dropZone:element, element:e.element});
					}
				}
			});

			element.triggerRedraw();
		};

		element.addEventListener({
			decoratorType:'dropzone',
			eventId:'drop', 
			handler:drop});

		var drag = function(e) {

			if(e.element.dropZone !== element)
				return;

			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e.moveEvent))			
				{
					e.element.dropZone = null;
					availableSpots++;
					element.droppedElements.splice(
							element.droppedElements.indexOf(e.element),1);	
				}
			});
			element.triggerRedraw();
		};

		element.addEventListener({
			decoratorType:'dropzone',
			eventId:'drag', 
			handler:drag});
	}
});
