Image Text Hybrid (aka JS Image Text Box):
Author: Dean Mercado

What it does:

  'imgTxtHybrid()' is a jQuery plugin function that enables one to take a jQuery object and turn it into both a simple text editor AND an image canvas.

  Images can be dragged and dropped into the affected element, and then dragged and resized while on display.

  The codebase for this function is on the img-txt-hybrid.js file in the ./js directory. 'contenteditable.html' is a working demo of the plug-in's capabilities.

Usage Example/Requirements:

  Requirements:
    - jQuery 
    - jQuery-UI

	HTML Example:
<!--<!DOCTYPE html> -->
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

Future developments: 
  - Ability to delete images
  - Option to allow tab-whitespace