java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
	./js/CreanvasNodeClient/*.js ^
	./js/CreanvasNodeClient/ElementDecorators/*.js ^
--js_output_file out/CreanvasDebug.js ^
--define TEST=false ^
--define DEBUG=true ^
--externs js/externs.js ^
--formatting=pretty_print ^
--compilation_level WHITESPACE_ONLY

copy out\CreanvasDebug.js C:\Users\Christian\Development\WebApps\lib\CreanvasDebug.js
copy out\CreanvasDebug.js C:\Users\Christian\Development\NodeJs\TestNodeJs\resources\WebApps\lib\CreanvasDebug.js
