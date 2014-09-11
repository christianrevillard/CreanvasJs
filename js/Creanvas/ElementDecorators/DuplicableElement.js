// duplicableData:
// generatorCount : number of copies to make. Default: Infinity
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["duplicable"] =
	{
		applyTo: function(element, duplicableData) {
			
			// Externally usable - handle ADVANCED_OPTIMIZATION
			var isBlocked =  duplicableData["isBlocked"];
			var generatorCount = duplicableData["generatorCount"] || Infinity;
			
			if (DEBUG) element.debug("duplicable.applyTo","generatorCount is " + generatorCount);				
						
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
				
				if (DEBUG) element.debug('duplicable.makeCopy','GeneratorCount was: ' + generatorCount);

				if (generatorCount<=0) 
					return;

				generatorCount--;

				if (DEBUG) element.debug('duplicable.makeCopy','GeneratorCount is now: ' + generatorCount);

				var copy = element.cloneElement(['duplicable']);
				copy.elementName+= " (duplicate)";

				copy.applyElementDecorator(
					"movable",
					{
						isBlocked : isBlocked
					});

				copy.startMoving(e);

				element.triggerRedraw();
			};
			
			element.elementEvents.getEvent('pointerDown').addListener(
					{
						handleEvent:makeCopy,
						listenerId:element.elementId});			
		}
	};
}());