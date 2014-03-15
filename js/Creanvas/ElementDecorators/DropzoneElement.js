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
				
				if (availableSpots <= 0)
					return
									
				element.controller.log('drop event on dropzone ' + element.id + ', dropped ' + e.droppedElement.id);

				availableSpots--;
				e.droppedElement.x = dropX || element.x;
				e.droppedElement.y = dropY || element.y;
				e.droppedElement.dropZone = element;
				element.droppedElements.push(e.droppedElement);
				e.droppedElement.events.dispatch('dropped', {dropZone:element, droppedElement:e.droppedElement});
				element.events.dispatch('droppedIn', {dropZone:element, droppedElement:e.droppedElement});
				element.triggerRedraw();
			};
	
			element.events.addEventListener({
				eventGroupType:'dropzone',
				eventId:'drop', 
				handleEvent:drop,
				listenerId:element.id});
	
			element.drag = function(draggedElement) {
	
				element.controller.log('dragging from dropzone ' + element.id + ', dragged ' + draggedElement.id);

				draggedElement.dropZone = null;
				availableSpots++;
				element.droppedElements.splice(
						element.droppedElements.indexOf(draggedElement),1);	

				element.triggerRedraw();
			};
		}
	});
}());
