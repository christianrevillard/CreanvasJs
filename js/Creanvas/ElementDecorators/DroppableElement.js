var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["droppable"] =
	{
		applyTo: function(element, droppableData)
		{
			// Externally usable - handle ADVANCED_OPTIMIZATION
			// droppableData.dropZone = droppableData.dropZone || droppableData["dropZone"];
			var dropZone = 	droppableData["dropZone"];
			
			element.isDroppable = true;
			element.elementDropZone = dropZone;
			if (DEBUG) element.debug("droppable.applyTo","Now droppable");

			Object.defineProperty(element, "dropZone", { get: function() {return this.elementDropZone; }, set: function(y) { this.elementDropZone = y; }});
		}
	};
}());
