var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'droppable',
		applyTo: function(element, droppableData)
		{
			element.isDroppable = true;
			element.dropZone = droppableData.dropZone;
		}
	});
}());