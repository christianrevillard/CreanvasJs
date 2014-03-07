// duplicableData:
// generatorCount : number of copies to make. Default: Infinity
// isBlocked: function that allow to block the duplication

var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators
		.push({
			type : 'duplicable',
			applyTo : function(element, eventHandler, duplicableData) {
				
				var isBlocked = duplicableData.isBlocked;

				var generatorCount = duplicableData
						.hasOwnProperty('generatorCount') ? duplicableData.generatorCount
						: Infinity;

				var makeCopy = function(e) {
					if (isBlocked && isBlocked()) 
						return;
					
					if (generatorCount > 0) {
						eventHandler.addPendingEvent(function() {
									var doDuplicate = function(e) {
										if (element.isPointInPath(e)) {
											generatorCount--;

											var copy = element.clone();

											copy.removeDecorator('duplicable');

											copy.applyDecorator(
													CreJs.Creanvas.getElementDecorator('movable'),{
														isBlocked : duplicableData.isBlocked
													});

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
				
				element.controller.events.addEventListener({
					eventGroupType:'duplicable',
					eventId:'mousedown', 
					handleEvent:makeCopy,
					listenerId:element.id});

				element.controller.events.addEventListener({
					eventGroupType:'duplicable',
					eventId:'touchstart', 
					handleEvent:makeCopy,
					listenerId:element.id});
			}
		});
