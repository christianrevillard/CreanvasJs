var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'dropzone',
	applyTo: function(element, eventsToHandle, dropzoneData)
	{
		var drop = function(e) {
			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e.moveEvent))			
				{
					if (dropzoneData.dropCount>0 && !e.element.isDropped)
					{
						dropzoneData.dropCount--;
						e.element.x = dropzoneData.dropX;
						e.element.y = dropzoneData.dropY;
						e.element.isDropped = true;
					}
				}
			});

			element.triggerRedraw();
		};

		element.controller.addEventListener('drop', drop);

		var drag = function(e) {
			eventsToHandle.push(function()
					{		
				if (element.isPointInPath(e.moveEvent))			
				{
					if (e.element.isDropped)
					{
						e.element.isDropped = false;
						dropzoneData.dropCount++;
					}
				}
			});
			element.triggerRedraw();
		};

		element.controller.addEventListener('drag', drag);
	}
});
