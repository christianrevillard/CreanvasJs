var Creanvas = Creanvas || {};	

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.getElementDecorator = function(type)
{
	var match = Creanvas.elementDecorators.filter(function(d){ return d.type == type;});
	
	if (match.length == 0)
		return null;
	
	return match[0];
};


