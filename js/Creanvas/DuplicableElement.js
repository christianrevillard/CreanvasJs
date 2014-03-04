var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'duplicable',
	applyTo: function(element, eventsToHandle, duplicableData)
	{
		var makeCopy = function(e) {
			eventsToHandle.push(function()
			{		
				if (element.isPointInPath(e))			
				{
					if (duplicableData.generatorCount>0)
					{
						var copy = new Creanvas.Element(
						{ 
							controller: element.controller,
							x: element.x,
							y: element.y,
							draw: element.draw,
							movable:true
						});
						
						copy.startMoving(e);
						
						duplicableData.generatorCount--;
					}
				}
			});

			element.triggerRedraw();
		};

		var makeCopypad = function(e) {
			eventsToHandle.push(function()
					{		
					for (var touch = 0; touch<e.targetTouches.length; touch++)				
						{
						if (element.isPointInPath(e.targetTouches[touch]))
						{						
							var copy = new Creanvas.Element(
									{ 
										controller: element.controller,
										x: element.x,
										y: element.y,
										draw: element.draw,
										movable:true});
							copy.startMoving(e, e.targetTouches[touch].identifier);						
						}
					}
			element.triggerRedraw();
			});
		};

		element.controller.addEventListener('mousedown', makeCopy);
		element.controller.addEventListener('touchstart', makeCopypad);
	}
});
