#Image Text Hybrid (aka JS Image Text Box):
###Author: Dean Mercado

####What it does:

  'imgTxtHybrid()' is a jQuery plugin function that enables one to take a jQuery object and turn it into both a simple text editor AND an image canvas.

  Images can be dragged and dropped into the text-editor/canvas, and then dragged and resized while on display.

  The entire code base for the above function is in this repository, with the exception of jQuery (v 1.11.1) and jQuery-UI (v 1.11.2). 

####Usage Example/Requirements:

######Requirements:
* jQuery 
* jQuery-UI

######HTML Example:
```
   <!DOCTYPE html> 
   <html>
   		<head>
   			<link href='./css/style.css' rel='stylesheet' type='text/css'/>
				<link href='./css/jquery-ui.min.css' rel='stylesheet' type='text/css'/>
				<script src='./js/jquery-1.11.1.min.js' type='text/javascript'>
				</script>
				<script src='./js/jquery-ui-1.11.2.custom/jquery-ui.min.js'type='text/javascript'>
				</script>
				<script src="./js/img-txt-hybrid.js" type='text/javascript'></script>
				<script>
					  $('#editBox').imgTxtHybrid();
				</script>
   		</head>
   		<body>
   			<div id='editBox' style='width:400px; height:300px; border: 1px dotted blue'>
   			</div>
   		</body>
   </html> 
```
######CURRENT FEATURES:
* Support for copy-pasting images from the Web
* "         " drag-and-dropping images from local file folders
* Image interactivity (images can be dragged, resized, and deleted)
* Tab-whitespace enabled (pressing TAB produces extra whitespace)

######FUNCTION LIST:
* $(<ELEMENT>).imgTxtHybrid() : 
  Turns element into a image-friendly content-editable text box. 

* $(<ELEMENT>).imgSrc() :
  Takes any images in the element and returns an array of IMG objects. Each
  IMG object has the following attributes. [NOTE: if sending results from this
  function to the backend, pass this function call into a serializer (ie JSON.stringify) 
  first]. 

  ** IMG.id:
    Random numerical id that is assigned to the IMG as it is uploaded on the text box.
  
  ** IMG.top, IMG.left:
     Position of the image within the text box (in px)
  
  ** IMG.height, IMG.width:
     Size of the image (in px)
  
  ** IMG.data: 
     If the image was uploaded from your hard-drive, it will be a base-64 encoded string carrying
     the image data. If copy pasted from another source online, it will be the URL of that image file.

* $(<ELEMENT>).stringConvHTMLtoJS():
  Converts all the elements in the target ELEMENT into a JS string that can be saved in databases.

* stringConvHTMLtoJS(string):
  Takes JS strings and converts it into the appropriate HTML [Note: this function is NOT a jQuery function, just a regular JS function].

* createAndAppendImgDivs(getIDFunction, image_source_string, css_object, $target):
  Takes the following attributes and re-renders interactive images onto the content box.

  ** getIDFunction:
    a Javascript function that will either load the element id or generate a new one.
    Generates a new id by default

  ** image_source_string:
    a string that indicates either the base64 or the URL source of the image

  ** css_object:
    a JSON object that is a set of key-value pairs for CSS properties (including top, left,
    height and width).

  ** $target:
     a jQuery object (preferably with the same selector that imgTxtHybrid() is called on). 

