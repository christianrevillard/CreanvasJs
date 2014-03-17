var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'collidable',
		applyTo: function(element, collidableData)
		{	
			element.collidable = true;
			
			element.events.addEventListener(
					{
						eventId:'collision',
						handleEvent:function()
					{
						alert('collision');
						element.y+=10;
					}});
		}
	});
}());
