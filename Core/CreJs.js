/**
 * @define {boolean} 
 */
var TEST = true;

/**
 * @define {boolean} 
 */
var DEBUG = true;

var CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};

// Export
window["CreJs"] = CreJs;
CreJs["Creanvas"] = CreJs.Creanvas;

if (TEST)
{
	CreJs.Test = CreJs.Test|| {};
	CreJs["Test"] = CreJs.Test;
}