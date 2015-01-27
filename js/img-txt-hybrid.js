/* 
	imgTxtHybrid jQuery Extension 
	author: Dean Mercado
*/

// Determine browser hack
// FIND OUT HOW TO USE FEATURE DETECTION TO DIFFERENTIATE THE BELOW
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = window.hasOwnProperty("ActiveXObject");
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
if (is_chrome && is_safari) {is_safari=false;}

// Initialize GLOBAL SETTINGS variables
var RESIZE_OBJECT_SETTINGS, IMG_SETTINGS;

/////////////////////////////////////////////
// jQuery Extension Function Encapsulation //
/////////////////////////////////////////////

;(function($, doc, win) {
  "use strict";

	// Suppress default dragover and dragenter
	// behavior to prevent browser
	// reloading with just the image
	$.fn.suppressDefaults = function(){
		this.on("dragover", function(e){
			e.stopPropagation();
			e.preventDefault();
		});
		this.on("dragenter", function(e){
			e.stopPropagation();
			e.preventDefault();
		});
	};

	// Append a DELETE button to Drag and Drop Elements
	$.fn.attachDeleteButton = function(){
		// Set a convenient variable 
		var $TARGET, button, $button;
                $TARGET = this;

		if (this.find(".delImg").length < 1){
			// Create button jQuery object
			button = document.createElement('input');
			button.setAttribute('type', 'submit');
			button.setAttribute('value', 'X');
			button.setAttribute('class', 'delImg');
			$button = $(button);
			// Set element id of button
			$button.attr('id', 'delImg_'+ $TARGET[0].id);

			// Set styling for button
			$button.css({
					'position': 'relative',
					'bottom': '99%',
					'float': 'right',
					'right': '1px',
					'display':'none'
			});
			// Attach button to target element
			$TARGET.append($button);
		}
		else {
			$button = $("#"+ 'delImg_'+ $TARGET[0].id.replace(".","\\."));
			console.log($button);
		}

		// Add event listener for hiding/showing button 
		$TARGET.hover(function(){
			$button.show();
		}, function(){
			$button.hide();
		});

		// Add event listener for deleting target element with button
		$button.on('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				$(this).parent().remove();
		});
	};

  	// Helper Method: Appends soon-to-be interactive image to target element
  	function createAndAppendImage(imgsrc, file, $TARGET){
  		// Function Variables 
  		var $new_image_entity,
  	    	$div_wrapper,
  	    	new_div_entity,
  	    	new_image_entity,
  	    	final_width,
  	    	final_height,
  	    	target_height,
  	    	randomized_id,
  	    	randomized_id_2;

  	    // setup randomized ID
  	    randomized_id = Math.random()
  	    					.toString()
  	    					.slice(2);
  	    randomized_id_2 = Math.random()
  	    					.toString()
  	    					.slice(2);

  	    randomized_id +=  "_" + randomized_id_2;

  		// Branch for HD Sourced Images
  		if (file !== undefined) {
  			// create new image and set src to base64 string
  			new_image_entity = new Image();
			$new_image_entity = $(new_image_entity);
			$new_image_entity.attr('src', imgsrc);
  		}

	  	// Branch for Internet Sourced images
	  	else {
	  		// Create jquery new img entity 
	  		// off of imgsrc (which should be img tag)
	  		$new_image_entity = $(imgsrc);
	  	}

		// Wait for img to load before continuing everything else
		$new_image_entity[0].onload = function(){
			// Check img for errors, make alert
  			if ($new_image_entity[0].width <= 0 || $new_image_entity[0].height <= 0){
	  			alert('Upload Error! Try again\n');
	  			return false;
	  		}
			// Initialize and set styling for $div variable
		  	new_div_entity = doc.createElement('div');
			new_div_entity.setAttribute('contenteditable','false');
			new_div_entity.setAttribute('class','upload-image');
			$div_wrapper = $(new_div_entity);
			target_height = parseInt($TARGET.css('height').replace('px',''), 10);
			
			// Automatically resize image if the image is larger than the container
			// "target" element
			if ($new_image_entity[0].height > target_height){
				// set div height to half the container height
				final_height = target_height / 2;
				// set width, keeping h:w ratio constant
				final_width = ($new_image_entity[0].width/$new_image_entity[0].height) * final_height;
			}
			else {
				// propagate the same h:w sizes
				final_height = $new_image_entity[0].height;
				final_width = $new_image_entity[0].width;
			}

			// set styling for div wrapper
			$div_wrapper.css({
		  		'width': final_width + "px",
		  		'height': final_height + "px"
			});
			// Set ID on div to random number (FIX TO INCREASE POSSIBLE COMBINATIONS)
			$div_wrapper.attr('id', randomized_id);
			// Apply object settings/ append img to div
			$div_wrapper.objectSettings(RESIZE_OBJECT_SETTINGS);
			$new_image_entity.objectSettings(IMG_SETTINGS);
			$div_wrapper.append($new_image_entity);
			// Enable div draggable and sizeable/ attach delete button
			$div_wrapper.imgInteract();
			// Attach div+img onto target element 
			$TARGET.append($div_wrapper);
		};
  	}

	/* METHODS that handle the data transfer from various 
	   upload techniques */

    // Helper Function: takes drop event and target 
    // and appends the image to the target
	function fileDropHandler(event, $TARGET){
		var data,
			files,
			src,
			i;

		// Prevent default behavior from browser/ propagation
		event.preventDefault();
		event.stopPropagation();
		// Load data transfer array and set files variable
		// to the files in data array
		data = event.originalEvent.dataTransfer;
		files = data.files;

		if (files.length <= 0){
			src = event.originalEvent.dataTransfer.getData("URL");
		}

		// Function for handling multiple read files
		function handleReadFile(file) {
			var readFile = new FileReader();
			// Set onload and error methods of FileReader
	  		// object to run the following routines:
	  		readFile.onload= function(event){
	  		// Prevent default actions / propagation up the tree
				event.preventDefault();
				event.stopPropagation();
				createAndAppendImage(readFile.result, 
									file, 
									$TARGET, 
									RESIZE_OBJECT_SETTINGS, 
									IMG_SETTINGS);
			};
			// ... setting onError method
			readFile.onerror = function(){
				alert("Upload Failed! Try again.");
			};
			// Start loading the file
			readFile.readAsDataURL(file);
		}

		// IN_PROGRESS: Conditional branch for Internet sourced vs HD sourced images
		// if src !== undefined -- > internet sourced
		if ( src !== undefined) {
			alert("Try copy-pasting the image instead!");
		}

		else {
			for (i = 0; i < files.length; i ++) {
				handleReadFile(files[i]);
			}
		}

		$TARGET.attr('contenteditable', 'true');
	}

	// Helper Function: for handling img-paste events, takes event and target
	// and appends image to target
	function filePasteHandler(event, $TARGET){
		// initialize variables
		var imgsrc,
		    source,
		    result,
		    plaintext;	
		// prevents default pasting
		event.preventDefault();
		// alert(event.originalEvent.clipboardData.getData('text/html'));

		// IE
		if (is_explorer){
			// Get the URL from pasted data
			source = win.clipboardData.getData('URL');
			imgsrc = "<img src='" + source +"'/>";
			plaintext = win.clipboardData.getData('text');
			if (source === "" || source === undefined ) {
				result = plaintext;
			}
			else {result = imgsrc;}
		}
		// Chrome & Safari & Firefox
		else if(!is_explorer) {
			// Get text/html data from clipboard
			source = event.originalEvent.clipboardData.getData('text/html');
			// ALSO create a plaintext variable that has text/plain clipboard data
			plaintext = event.originalEvent.clipboardData.getData('text/plain');

			// Chrome and Safari
			if (is_chrome || is_safari) {
				// See if there's a regex match for imgs
				imgsrc = source.match(/<!--StartFragment-->(.*)<!--EndFragment-->/);
				// If there's a match, use the matched string as a result
				if (imgsrc !== null) { result = imgsrc[1]; }
			}
			// Firefox
			else {
				imgsrc = source;
				result = imgsrc;
			}

			// If there's no match...
			if (source === "" || result === undefined) {	
				// Check plaintext. If there's no plain
				if (plaintext === "" ) {
					alert("Try dragging and dropping the image!");
					plaintext = "";
				}
				result = plaintext;
			}
		}

		// If we're looking at an img tag from the internet
		if (result.indexOf("<img") > -1 ) {
			createAndAppendImage(result, 
								undefined, 
								$TARGET, 
								RESIZE_OBJECT_SETTINGS, 
								IMG_SETTINGS);
		}

		// If we're looking at regular text
		else {
			try { win.document.execCommand('insertText', false, result); }
			catch(ignore) { }
		}	
		// DEBUG AIDE 
		// alert(result);
	}

	// Creates an ondrop/onpaste event listener to do the following for each file:
	$.fn.imgEvent = function(){
		// Sets Variable for Target
		var $TARGET = this;
		// Sets the ondrop event
		$TARGET.on('drop', function(event) {
			fileDropHandler(event, $TARGET, RESIZE_OBJECT_SETTINGS, IMG_SETTINGS);
		});

		// Sets the onpaste event
		$TARGET.on('paste', function(event) {
			filePasteHandler(event, $TARGET, RESIZE_OBJECT_SETTINGS, IMG_SETTINGS);
		});
	};

	// Enables Inserting Tab Whitespace
	 $.fn.tabEnable = function(){
	 	var $TARGET = this;
	 	$TARGET.on('keydown', function (e) {
	    // Pressing TAB 
	 	  if (e.which === 9) {
		  	// Prevents focusing on next element
	 	    e.preventDefault();
	 	    win.document.execCommand('insertText', false, "    ");
		  }
	 	});
	};

	// Make images in an element interactive \
	//(ie draggable, resizeable, delete buttons)
	$.fn.imgInteract = function(){
		this.draggable({containment:'parent'});
		this.resizable({
			containment:"parent",
			handles: "s, e, se, w, sw"
		});

		this.attachDeleteButton();

		// Chrome Fix: Take ui-icon class out to fix
		// resizing se-icon problem
		if (is_chrome){
			this.find('.ui-icon-gripsmall-diagonal-se').attr({
				'class':'ui-resizable-handle ui-resizable-se ui-icon-gripsmall-diagonal-se'
			});
		}
	};

	// Primes first line of imgTxtHybrid item with div
	$.fn.primeDivs = function(){
		if (!is_firefox) {this.html('<div><br></div>');}
		else {this.html('<p></p>');}
	};

	// UTILITY: Apply settings with JS objects
	$.fn.objectSettings = function(setting_object){
		var $TARGET = this;
		$TARGET.css(setting_object);
	};

}(jQuery, document, window));

// UTILITY: Function that, when called, automatically
// reloads and refreshes interactivity on any uploaded images
$.fn.refreshImgInteractions = function(){
	"use strict";
	var $upload_images, idx;

	$upload_images = this.find(".upload-image");
	for (idx = 0; idx < $upload_images.length; idx++){
		// Remove the old resize-handle div handles before calling imgInteract
		$($upload_images[idx]).contents().remove('div.ui-resizable-handle');
		$($upload_images[idx]).unbind();
		$($upload_images[idx]).imgInteract();
	}
	$upload_images.on('click', function(){
		$upload_images.css('z-index','0');
		$(this).css('z-index', '10');
	});
};

// UTILITY: Create ".upload-image" div
// Based slightly off of encapsulated 
// createAndAppendImg() function. Will attempt to replace the encapsulated
// function with this one.

// Use this function to create drag-and-resize-(and-delete)-able images
// based on data received from backend

function createAndAppendImgDivs (idGenFunction, img_source_str, css_obj, $target) {
	"use strict";
	// Function Generated Variables
	var $div_wrapper,
		$new_image,
		genIdFunction;

	// If an id-generating function is not supplied, 
	// use the generic randomized ID function
	if (idGenFunction !== undefined)	{
		genIdFunction = idGenFunction;	
	}

	else {
		genIdFunction = function(){
			var randomized_id, randomized_id_2;
			randomized_id = Math.random().toString().slice(2);
  	    	randomized_id_2 = Math.random().toString().slice(2);
  	    	return randomized_id + "_" + randomized_id_2;
		};
	}

	// Set div and img objects with appropriate attrs and css
	$div_wrapper = $(document.createElement('div'));
	$div_wrapper.attr({
				'id': genIdFunction(),
				'class': 'upload-image' 
			});

	$new_image = $(document.createElement('img'));
	$new_image.attr('src', img_source_str);

	// Apply global setings to div and img objects AND
	// any specific CSS stylings to be applied to the 
	// div wrapper
	$div_wrapper.objectSettings(RESIZE_OBJECT_SETTINGS);
	$div_wrapper.css(css_obj);
	$new_image.css(IMG_SETTINGS);
	
	// Append img to div and append div to target
	$div_wrapper.append($new_image);
	$target.append($div_wrapper);
}

// UTILITY: converts pixel css to percentage css
// $.fn.px_to_percent = function(){

// 	var $THIS = this;
// 	// Subfunction that takes a quality (ie 'top','height', etc)
// 	// and a boolean and returns a float value of the pixels
// 	// in each quality. 
// 	function numerify(quality, parent){
// 		var target;
// 		if (parent) {
// 			target =  $THIS.parent();
// 		}
// 		else {
// 			target = $THIS;
// 		}
// 		return parseFloat(target.css(quality)
// 					.replace("auto","0")
// 					.replace("px",""));
// 	}
// 	// Takes a number and turns it into a string.
// 	function stringify(number){
// 		return number.toString();
// 	}

// 	// Variable initialization
// 	var height_at_100_float, width_at_100_float, 
// 		top_at_100_float, left_at_100_float, 
// 		item_height_float, item_width_float,
// 		item_top_float, item_left_float;

// 	// Take height and width of the parent element
// 	height_at_100_float = numerify('height', true);
// 	width_at_100_float = numerify('width', true);

// 	// Take height, width, top and left of the target element
// 	item_height_float = numerify('height', false);
// 	item_width_float =  numerify('width', false);
// 	item_top_float = numerify('top', false);
// 	item_left_float = numerify('left', false);

//     // Calculates percentages 
// 	percent_height_percent = 100 * ( item_height_float / height_at_100_float);
// 	percent_width_percent = 100 * ( item_width_float / width_at_100_float);
// 	percent_top_percent = 100 * ( item_top_float / height_at_100_float);
// 	percent_left_percent = 100 * ( item_left_float / width_at_100_float);

// 	return ([
// 			stringify(Math.floor(percent_top_percent)) + "%",
// 			stringify(Math.ceil(percent_left_percent)) + "%",
// 			stringify(percent_height_percent) + "%",
// 			stringify(percent_width_percent) + "%",
// 			]);
// }

// // UTILITY: counts the number of images in a given element
// $.fn.countImages = function(){
// 	console.log(this.find('img').length);
// 	return this.find('img').length;
// }

// UTILITY: returns an object array of the srcs of the uploaded images in a given element
$.fn.imgSrc = function(){
	"use strict";
	var result,
		img_list,
		item_obj,
		img_id,
		img_top, img_left, img_height, img_width, 
		base64data_source, base64data_start, base64data,
		img_idx;

	//if (typeof(percent) === 'undefined') {percent = false;}
	
	result = [];
	img_list = this.find('img');

	for (img_idx = 0; img_idx < img_list.length; img_idx++) {
		// Get and store img id
		img_id =  $(img_list[img_idx]).parent().attr('id');
		// Store styling information of img + parent entity
		// if (percent){
		// 	img_params = $(img_list[img_idx]).parent().px_to_percent();
		// 	img_top = img_params[0];
		// 	img_left = img_params[1];
		// }
		// else{
		img_top = $(img_list[img_idx]).parent().css('top');
		img_left = $(img_list[img_idx]).parent().css('left');
		// }
		
		img_height = $(img_list[img_idx]).parent().css('height');
		img_width = $(img_list[img_idx]).parent().css('width');

		// Isolate and store data information of img
		base64data_source = img_list[img_idx].src;

		// If base64data_source has base64 marker, then extract the data...
		if (base64data_source.indexOf('base64') > -1) {
			base64data_start = base64data_source.indexOf('base64') + 7;
			base64data = base64data_source.slice(base64data_start, base64data_source.length);
		}
		// ... otherwise, feed the http string to the 'data' parameter of the object
		else {
			base64data = base64data_source;
		}

		// Populate object with stored styling, data and format data
		item_obj = {
			'id': img_id,
			'top': img_top,
			'left': img_left,
			'height': img_height,
			'width': img_width,
			'data': base64data
		};
		// Append object to the result array
		result.push(item_obj);
	}
	return result;
};

// UTILITY: From the HTML, go to JS String
$.fn.stringConvHTMLtoJS = function(){
	"use strict";
	var result, buffer, i, $TARGET, string, str_end;
	result = "";
	buffer = "";
	// Split actions based on browser.

	// If NOT Firefox...
	if(!is_firefox) {
		// Get jQuery array of elements that are not uploaded images
		$TARGET = this.contents().not(".upload-image");

		// Go through elements and add the containing text + newline to buffer str
		for (i = 0; i < $TARGET.length ; i++){ 
			buffer += jQuery($TARGET[i]).text() + "\n";		
		}
		// replace all HTML spaces with JS spaces and add buffer to result
		buffer = buffer.replace(/&nbsp;/g, " ");
		result += buffer;
	}
	// If Firefox...
	else {
		// Take the html of the target element
		string = this.html();
		// Firefox HACK: 
		// Establish end of string portion at beginning of the first child DIV
		str_end = string.indexOf('<div');
		// Slice the string from the beggining to the index of the first
		// child Div. Replace all <br> tags with \n
		result += string.slice(0,str_end).replace(/<br>/g, '\n');
	}
	return result;
};

// UTILITY: Based on Browser, handle line breaks 
// when going from JS strings to HTML
function stringConvJStoHTML(multiline_str){
	"use strict";
	var result,
		strings,
		insert_item,
		str;

	// return a simple replacement if Firefox
	if (is_firefox) { 
		return multiline_str.replace(/\n/g,'<br>');
	}
	
	// initialize result AND split strings by newline
	result = "";
	strings = multiline_str.split("\n");

	// For each item in strings, initialize the insert item
	// and then either insert <br> or the source string replaced with 
	// html whitespace markup. Couch the insert item in div tags
	for (str = 0; str < strings.length; str++) {
		if ( strings[str] === "" ){
			insert_item = "<br>";
		}
		else {
			insert_item = strings[str].replace(" ", "&nbsp;");
		}
		result += "<div>" + insert_item + "</div>";
	}
	return result;
	
}

// The main function! 
$.fn.imgTxtHybrid = function(obj_settings){
  "use strict";
  var BASE_SETTINGS, property;

  BASE_SETTINGS = {
	'overflow': 'hidden',
	'position':'absolute',
	'white-space':'pre-wrap',
	'display':'inline-block'	
  };

  // FIRST: set global object variables	

  // Run default object style settings if no arguments are passed
  // Else pass any parameter object style settings 

  RESIZE_OBJECT_SETTINGS = BASE_SETTINGS;
	
  if (obj_settings !== undefined) {
	// Catch errors that happen when uploading your own styling
	try {
		RESIZE_OBJECT_SETTINGS = BASE_SETTINGS;
		for (property in obj_settings){
			RESIZE_OBJECT_SETTINGS[property] = obj_settings[property];
		}
	}
	catch(error){
		console.log(error);
	}
  }

	// Set global img settings (cannot be messed with or it wont work out)
  IMG_SETTINGS = {
	'display':'block',
	'width': 100 + '%',
	'height': 100 + '%'
  };

  // Start with ContentEditable native widget
  this.attr('contenteditable', 'true');

  // Force this element to be relative and have overflow:auto
  this.css({
  	'position':'relative',
  	'overflow':'auto'
  });

  // Run the encapsulated functions
  this.suppressDefaults();
  this.primeDivs();
  this.imgEvent();
  this.tabEnable();
};