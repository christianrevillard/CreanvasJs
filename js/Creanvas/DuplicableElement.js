// duplicableData:
// generatorCount : number of copies to make. Default: Infinity
// isBlocked: function that allow to block the duplication

var Creanvas = Creanvas || {};

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators
		.push({
			type : 'duplicable',
			applyTo : function(element, eventsToHandle, duplicableData) {
				
				var isBlocked = duplicableData.isBlocked;

				var generatorCount = duplicableData
						.hasOwnProperty('generatorCount') ? duplicableData.generatorCount
						: Infinity;

				var makeCopy = function(e) {
					if (isBlocked && isBlocked()) 
						return;
					
					if (generatorCount > 0) {
						eventsToHandle.push(function() {
									var doDuplicate = function(e) {
										if (element.isPointInPath(e)) {
											generatorCount--;

											var copy = element.clone();

											copy.removeDecorator('duplicable');

											copy.applyDecorator(
													Creanvas.getElementDecorator('movable'),{});

											copy.startMoving(e, e.identifier);

											return true;
										}
										return false;
									};

									if (e.targetTouches) {
										for ( var touch = 0; touch < e.targetTouches.length; touch++) {
											if (doDuplicate(e.targetTouches[touch]))
												break;
										}
									} else {
										doDuplicate(e);
									}
								});
					}
					element.triggerRedraw();
				};
				
				element.addEventListener({
					decoratorType:'duplicable',
					eventId:'mousedown', 
					handler:makeCopy});

				element.addEventListener({
					decoratorType:'duplicable',
					eventId:'touchstart', 
					handler:makeCopy});
			}
		});
