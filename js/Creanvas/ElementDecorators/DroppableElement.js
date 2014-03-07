var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators.push(
{
	type: 'droppable',
	applyTo: function(element, eventsToHandle, droppableData)
	{
		element.isDroppable = true;
		element.dropZone = droppableData.dropZone;
	}
});
