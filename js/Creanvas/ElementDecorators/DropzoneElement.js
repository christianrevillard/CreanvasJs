var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators.push(
{
	type: 'dropzone',
	applyTo: function(element, eventTarget, dropzoneData)
	{
		var availableSpots = dropzoneData.availableSpots;
		var dropX = dropzoneData.dropX;
		var dropY = dropzoneData.dropY;
		
		element.droppedElements = [];
		
		var drop = function(e) {
			
			if(!e.element.isDroppable)
				return;
			
			eventTarget.queueEvent(function()
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
						e.element.events.dispatch('droppedElement', {dropZone:element, element:e.element});
						element.events.dispatch('droppedInZone', {dropZone:element, element:e.element});
					}
				}
			});

			element.triggerRedraw();
		};

		element.controller.events.addEventListener({
			eventGroupType:'dropzone',
			eventId:'drop', 
			handleEvent:drop,
			listenerId:element.id});

		var drag = function(e) {

			if(e.element.dropZone !== element)
				return;

			eventTarget.queueEvent(function()
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

		element.controller.events.addEventListener({
			eventGroupType:'dropzone',
			eventId:'drag', 
			handleEvent:drag,
			listenerId:element.id});
	}
});
