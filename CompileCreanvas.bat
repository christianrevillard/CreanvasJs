java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
	./js/CreanvasNodeClient/*.js ^
--js_output_file out/Creanvas.js ^
--define TEST=false ^
--define DEBUG=false ^
--externs js/externs.js ^
--compilation_level ADVANCED_OPTIMIZATIONS

REM --formatting=pretty_print ^

copy out\Creanvas.js C:\Users\Christian\Development\WebApps\lib\Creanvas.js
copy out\Creanvas.js C:\Users\Christian\Development\NodeJs\TestNodeJs\resources\WebApps\lib\Creanvas.js

