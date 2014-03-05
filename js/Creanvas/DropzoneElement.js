var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'dropzone',
	applyTo: function(element, eventsToHandle, dropzoneData)
	{
		element.droppedElements = [];
		
		var drop = function(e) {
			
			if(!e.element.isDroppable)
				return;
			
			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e.moveEvent))			
				{
					if (dropzoneData.availableSpots > 0 && !e.element.dropZone)
					{
						dropzoneData.availableSpots--;
						e.element.x = dropzoneData.dropX || element.x;
						e.element.y = dropzoneData.dropY || element.y;
						e.element.dropZone = element;
						element.droppedElements.push(e.element);
						element.controller.dispatchEvent('dropped', {dropZone:element, element:e.element});
					}
				}
			});

			element.triggerRedraw();
		};

		element.controller.addEventListener('drop', drop);

		var drag = function(e) {

			if(e.element.dropZone !== element)
				return;

			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e.moveEvent))			
				{
					e.element.dropZone = null;
					dropzoneData.availableSpots++;
					element.droppedElements.splice(
							element.droppedElements.indexOf(e.element),1);	
				}
			});
			element.triggerRedraw();
		};

		element.controller.addEventListener('drag', drag);
	}
});
