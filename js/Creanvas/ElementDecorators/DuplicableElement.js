// duplicableData:
// generatorCount : number of copies to make. Default: Infinity
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type : 'duplicable',
		applyTo : function(element, duplicableData) {
			
			var isBlocked = duplicableData.isBlocked;

			var generatorCount = duplicableData
					.hasOwnProperty('generatorCount') ? duplicableData.generatorCount
					: Infinity;

			var getTarget = function(e)
			{
				if (e.targetTouches)
				{
					for (var touch = 0; touch< e.targetTouches.length; touch++)			
					{
						if (element.isPointInPath( e.targetTouches[touch]))
						{
							return e.targetTouches[touch];
						};			
					};		
				} else
				{
					if (element.isPointInPath(e))
					{
						return e;
					};
				}
				
				return null;
			};
			
			var makeCopy = function(e) {
				if (isBlocked && isBlocked()) 
					return;

				if (generatorCount<=0) 
					return;

				var target = getTarget(e);
				
				if (!target) 
					return;
				
				generatorCount--;

				var copy = element.clone();

				copy.removeDecorator('duplicable');

				copy.applyDecorator(
						CreJs.Creanvas.getElementDecorator('movable'),
						{
							isBlocked : duplicableData.isBlocked
						});

				copy.startMoving(target);

				element.triggerRedraw();
			};
			
			element.controller.events.addEventListener({
				eventGroupType:'duplicable',
				eventId:'pointerDown', 
				handleEvent:makeCopy,
				listenerId:element.id});
		}
	});
}());