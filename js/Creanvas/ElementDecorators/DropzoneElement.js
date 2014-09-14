var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["dropzone"] =
	{
		applyTo: function(element, dropzoneData)
		{
			var availableSpots = dropzoneData["availableSpots"];
			var dropX = dropzoneData["dropX"];
			var dropY = dropzoneData["dropY"];
			
			element.droppedElementsList = [];
			
			var drop = function(e) {
				
				if (availableSpots <= 0)
					return
									
				if (DEBUG) element.debug('dropzone.drop', 'dropping: ' + e.droppedElement.id);

				availableSpots--;
				e.droppedElement.x = dropX || element.elementX;
				e.droppedElement.y = dropY || element.elementY;
				e.droppedElement.dropZone = element;
				element.droppedElementsList.push(e.droppedElement);
				e.droppedElement.elementEvents.getEvent('dropped').dispatch({dropZone:element, droppedElement:e.droppedElement});
				element.elementEvents.getEvent('droppedIn').dispatch({dropZone:element, droppedElement:e.droppedElement});
				element.triggerRedraw();
			};
	
			element.elementEvents.getEvent('drop').addListener(drop);
	
			element.drag = function(draggedElement) {
	
				if (DEBUG) element.debug('dropzone.drag', 'dragging  ' + draggedElement.id);
				
				draggedElement.dropZone = null;
				availableSpots++;
				element.droppedElementsList.splice(
						element.droppedElementsList.indexOf(draggedElement),1);	

				element.triggerRedraw();
			};
			
			Object.defineProperty(element, "droppedElements", { get: function() {return element.droppedElementsList; }});
		}
	};
}());
