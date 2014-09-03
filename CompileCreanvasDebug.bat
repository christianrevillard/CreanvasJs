java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
--js_output_file out/CreanvasDebug.js ^
--define TEST=false ^
--define DEBUG=true ^
--formatting=pretty_print ^
--compilation_level WHITESPACE_ONLY

copy out\CreanvasDebug.js C:\Users\Christian\Development\WebApps\lib\CreanvasDebug.js
