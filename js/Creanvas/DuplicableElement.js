// duplicableData:
// generatorCount : number of copies to make. Default: Infinity

var Creanvas = Creanvas || {};

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators
		.push({
			type : 'duplicable',
			applyTo : function(element, eventsToHandle, duplicableData) {
				var generatorCount = duplicableData
						.hasOwnProperty('generatorCount') ? duplicableData.generatorCount
						: Infinity;

				var makeCopy = function(e) {
					if (duplicableData.isBlocked && duplicableData.isBlocked()) 
						return;
					
					if (generatorCount > 0) {
						eventsToHandle.push(function() {
									var doDuplicate = function(e) {
										if (element.isPointInPath(e)) {
											generatorCount--;

											var elementData = element.elementData;
											elementData.x = element.x;
											elementData.y = element.y;
											elementData.originalDuplicable = elementData.originalDuplicable || elementData.duplicable
											elementData.duplicable = false;
											elementData.movable = {isBlocked:elementData.originalDuplicable.isBlocked};

											var copy = new Creanvas.Element(
													elementData);

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

				element.controller.addEventListener('mousedown', makeCopy);
				element.controller.addEventListener('touchstart', makeCopy);
			}
		});
