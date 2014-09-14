var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["droppable"] =
	{
		applyTo: function(element, droppableData)
		{
			element.isDroppable = true;
			element.elementDropZone = droppableData["dropZone"];
			if (DEBUG) element.debug("droppable.applyTo","Now droppable");

			Object.defineProperty(element, "dropZone", { get: function() {return this.elementDropZone; }, set: function(y) { this.elementDropZone = y; }});
		}
	};
}());
