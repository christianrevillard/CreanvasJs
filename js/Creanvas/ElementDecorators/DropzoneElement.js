var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'dropzone',
		applyTo: function(element, dropzoneData)
		{
			var availableSpots = dropzoneData.availableSpots;
			var dropX = dropzoneData.dropX;
			var dropY = dropzoneData.dropY;
			
			element.droppedElements = [];
			
			var drop = function(e) {
				
				if(!e.element.isDroppable)
					return;

				if (availableSpots <= 0)
					return
					
				if(e.element.dropZone)
					return;

				if (!element.isPointInPath(e.moveEvent))
					return;
				
				availableSpots--;
				e.element.x = dropX || element.x;
				e.element.y = dropY || element.y;
				e.element.dropZone = element;
				element.droppedElements.push(e.element);
				e.element.events.dispatch('droppedElement', {dropZone:element, element:e.element});
				element.events.dispatch('droppedInZone', {dropZone:element, element:e.element});
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
	
				if (!element.isPointInPath(e.moveEvent))	
					return;
				
				e.element.dropZone = null;
				availableSpots++;
				element.droppedElements.splice(
						element.droppedElements.indexOf(e.element),1);	

				element.triggerRedraw();
			};
	
			element.controller.events.addEventListener({
				eventGroupType:'dropzone',
				eventId:'drag', 
				handleEvent:drag,
				listenerId:element.id});
		}
	});
}());
