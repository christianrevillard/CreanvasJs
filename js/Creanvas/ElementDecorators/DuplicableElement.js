// duplicableData:
// generatorCount : number of copies to make. Default: Infinity
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.duplicable =
	{
		applyTo : function(element, duplicableData) {
			
			var isBlocked = duplicableData.isBlocked;

			var generatorCount = duplicableData
					.hasOwnProperty('generatorCount') ? duplicableData.generatorCount
					: Infinity;
			
			duplicableData.generatorCount=0;

			var requiresTouch = false;
			
			var makeCopy = function(e) {
								
				if (e.touchIdentifier>=0)
				{
					// we'll work with touchstart, not mousedown!
					requiresTouch = true;
				}

				if (requiresTouch && e.touchIdentifier<0)
					return;
				
				if (isBlocked && isBlocked()) 
					return;

				if (generatorCount<=0) 
					return;
				
				if (DEBUG)
				{
					element.controller.log('pointereDown event on duplicable ' + element.id + ', count id  ' + generatorCount);
				}
				
				generatorCount--;

				var copy = element.clone();
				copy.name+= " (duplicate)";

				copy.removeDecorator('duplicable');

				copy.applyDecorators(
						["movable",
						{
							isBlocked : duplicableData.isBlocked
						}]);

				copy.startMoving(e);

				element.triggerRedraw();
			};

			
			element.events.addEventListener(
					{
						eventGroupType:'duplicable',
						eventId:'pointerDown', 
						handleEvent:makeCopy,
						listenerId:element.id});			
		}
	};
}());