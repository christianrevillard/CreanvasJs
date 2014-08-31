var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.droppable =
	{
		applyTo: function(element, droppableData)
		{
			element.isDroppable = true;
			element.dropZone = droppableData.dropZone;
			if (DEBUG)
			{
				element.controller.log('Now droppable: ' + element.id);
			}
		}
	};
}());