var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'droppable',
	applyTo: function(element, eventsToHandle, droppableData)
	{
		element.isDroppable = true;
		element.dropZone = droppableData.dropZone;
	}
});
