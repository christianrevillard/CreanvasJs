if (TEST)
{
	var CreJsTest = CreJsTest || {};
	
	(function()
	{
		var core = CreJsTest.Core= CreJs.Core|| {};
		
		core.test_Vector_constructor = function()
		{
			var x=1, y=2, z=3;
			
			var vector = new CreJs.Core.Vector(x,y,z);
			
			if(vector.x != x)
			{
				return "FAILED! vector.x: Expected " + x + ", was " + vector.x;
			}
			
			if(vector.y != y)
			{
				return "FAILED! vector.y: Expected " + y + ", was " + vector.y;
			}

			if(vector.z != z)
			{
				return "FAILED! vector.z: Expected " + z + ", was " + vector.z;
			}
			
			return "OK";
		};

		// vector.draw = function(context, x, y, color)
		// vector.getCoordinates = function(unitVectors)
		// vector.setCoordinates = function(unitVectors, u, v, w)
		
		// core.getUnitVectors = function(x1, y1, x2, y2)
		// core.drawUnitVectors = function(context, x, y, unitVectors, color)
		// core.drawCoordinateVector = function(context, x, y, unitVectors, ux, vx, color)
		// core.scalarProduct = function(v1, v2)
		//	core.VectorProduct = function(v1,v2)
			
	})();
};