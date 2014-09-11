var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["dropzone"] =
	{
		applyTo: function(element, dropzoneData)
		{
			// Externally usable - handle ADVANCED_OPTIMIZATION
			var availableSpots = dropzoneData["availableSpots"];
			var dropX = dropzoneData["dropX"];
			var dropY = dropzoneData["dropY"];
			
			element.droppedElementsList = [];
			
			var drop = function(e) {
				
				if (availableSpots <= 0)
					return
									
				if (DEBUG)
				{
					element.controller.logMessage('drop event on dropzone ' + element.elementId + ', dropped ' + e.droppedElement.id);
				}

				availableSpots--;
				e.droppedElement.x = dropX || element.elementX;
				e.droppedElement.y = dropY || element.elementY;
				e.droppedElement.dropZone = element;
				element.droppedElementsList.push(e.droppedElement);
				e.droppedElement.elementEvents.dispatch('dropped', {dropZone:element, droppedElement:e.droppedElement});
				element.elementEvents.dispatch('droppedIn', {dropZone:element, droppedElement:e.droppedElement});
				element.triggerRedraw();
			};
	
			element.elementEvents.getEvent('drop').addListener({
				handleEvent:drop,
				listenerId:element.elementId});
	
			element.drag = function(draggedElement) {
	
				if (DEBUG)
				{
					element.controller.logMessage('dragging from dropzone ' + element.elementId + ', dragged ' + draggedElement.id);
				}
				
				draggedElement.dropZone = null;
				availableSpots++;
				element.droppedElementsList.splice(
						element.droppedElementsList.indexOf(draggedElement),1);	

				element.triggerRedraw();
			};
			
			Object.defineProperty(element, "droppedElements", { get: function() {return this.droppedElementsList; }});
		}
	};
}());
