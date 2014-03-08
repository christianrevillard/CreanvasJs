var CreJs = CreJs || {};

(function(){

	CreJs.Creanvas = CreJs.Creanvas || {};		

	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.getElementDecorator = function(type)
	{
		var match = CreJs.Creanvas.elementDecorators.filter(function(d){ return d.type == type;});
		
		if (match.length == 0)
			return null;
		
		return match[0];
	};
}());

