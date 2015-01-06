/* 
	imgTxtHybrid jQuery Extension 
	author: Dean Mercado
*/

// Determine browser hack
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}

alert(is_safari);

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
	}

	// Takes selector string: makes element alternate
	// float:left and float:right by clicking it.
	$.fn.clickCycle = function(){
		this.unbind();
		$(this).on('click', function(){
			console.log($(this).css('float'));
			if ($(this).css('float') === 'left'){
				$(this).css('float','right');
				$(this).css('margin-right','30%');
			}
			else{
				$(this).css('float','left');
				$(this).css('margin-right','0');
			}
		});
	}

	// Append a DELETE button to Drag and Drop Elements
	$.fn.attachDeleteButton = function(){
		// Set a convenient variable 
		var $TARGET = this;

		if (this.find(".delImg").length < 1){
			// Create button jQuery object
			var button = document.createElement('input');
			button.setAttribute('type', 'submit');
			button.setAttribute('value', 'X');
			button.setAttribute('class', 'delImg');
			var $button = $(button);
			// Set element id of button
			$button.attr('id', 'delImg_'+ $TARGET[0].id);

			// Set styling for button
			$button.css({
					'position': 'relative',
					'bottom': '99%',
					'float': 'right',
					'right': '1px',
					'display':'none',
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

	}

  // Helper Method: Appends soon-to-be interactive image to target element

  function createAndAppendImage(imgsrc, file, $TARGET){
  	// Variables
  	var $img, $div, div, img;
  	img = new Image();
  	
  	// Branch for Drag N Drop images
  	if (typeof(file) !== 'undefined') {
  		$img = $(img);
	  	//Set img src to data pointer
	  	$img.attr('src', imgsrc);
	  	// Check img for errors
  		if ($img[0].width <= 0 || $img[0].height <= 0){
		  	console.log(file);
	  		alert('Upload Error! Try again\n'+'Filename:'+file.name);
	  		return false;
	  	}
  	}

  	// Branch for Copy Paste images
  	else {
  		$img = $(imgsrc);
  		var canvas = document.createElement('canvas');
  		var ctx = canvas.getContext("2d");
  		ctx.drawImage($img[0], 10, 10, $img[0].width-110, $img[0].height-20);
  		$img.attr('src', canvas.toDataURL());
  	}

  	// Initialize and customize $div variable
  	div = document.createElement('div');
	  div.setAttribute('contenteditable','false');
	  div.setAttribute('class','upload-image');
	  $div = $(div);
	  $div.css({
		  'width': $img[0].width/4,
		  'height': $img[0].height/4,
		});
		// Set ID on div to random number (FIX TO INCREASE POSSIBLE COMBINATIONS)
		$div.attr('id', Math.random().toString().replace(".","_"));
		// Apply object settings/ append img to div
		$div.objectSettings(RESIZE_OBJECT_SETTINGS);
		$img.objectSettings(IMG_SETTINGS);
		$div.append($img);
		// Enable div draggable and sizeable/ attach delete button
		$div.imgInteract();
		// Attach div+img onto target element 
		$TARGET.append($div)
  }


	// METHODS that handle the data transfer from various 
	// upload techniques
	// (Overall) Create FileReader object, with an onload event that appends div
	// to the content box, for EVERY object

	function fileDropHandler(event, $TARGET){
		// Prevent default behavior from browser
		event.preventDefault();
		event.stopPropagation();
		// Load data transfer array and set files variable
		// to the files in data array
		var data = event.originalEvent.dataTransfer;
		var files = data.files;
		// Function for handling multiple read files
		function handleReadFile(file) {
			var readFile = new FileReader();
			// Set onload and error methods of FileReader
	  	// object to run the following routines:
	  	readFile.onload= function(event){
	  		// Prevent default actions / propagation up the tree
				event.preventDefault();
				event.stopPropagation();
				createAndAppendImage(readFile.result, file, $TARGET);
			}
			// ... setting onError method
			readFile.onerror = function(event){
				alert("Upload Failed! Try again.");
			}
			// Start loading the file
			readFile.readAsDataURL(file);
		}

		for (var i = 0; i < files.length; i ++) {
			handleReadFile(files[i]);
		}

		$TARGET.attr('contenteditable', 'true');
	}

	// When handling copy pasted images, create a canvas object 
	// to render the images as base64 data objects
	function filePasteHandler(event, $TARGET){
		event.preventDefault();
		event.stopPropagation();
		var imgsrc;
		if(!is_firefox & !is_explorer) {
			var source = event.originalEvent.clipboardData.getData('text/html');
			imgsrc = source.slice(source.indexOf("<img"),source.indexOf("<!--End"));
		}

		else if (is_explorer){
			imgsrc = window.clipboardData.getData('text/html');
		}

		else {
			imgsrc = event.originalEvent.clipboardData.getData('text/html');
			imgsrc = imgsrc.replace(/id=\"+[\w\d_\-!]*\"+/ , "");
		}
		createAndAppendImage(imgsrc, undefined, $TARGET);
	}

	// Creates an ondrop/onpaste event listener to do the following for each file:
	$.fn.imgEvent = function(RESIZE_OBJECT_SETTINGS, IMG_SETTINGS){
		// Sets Variable for Target
		var $TARGET = this;
		// Sets the ondrop event
		$TARGET.on('drop', function(event) {
			fileDropHandler(event, $TARGET);
		});

		// Sets the onpaste event
		$TARGET.on('paste', function(event) {
			filePasteHandler(event, $TARGET);
		});
	}

	// Enables Inserting Tab Whitespace
	// $.fn.tabEnable = function(){
	// 	var cursor = window.getSelection();
	// 	var $TARGET = this;
	// 	$TARGET.on('keydown', function (e) {
	// 		// Pressing TAB 
	// 	  if (e.which == 9) {
	// 	  	// Prevents focusing on next element
	// 	    e.preventDefault();

	// 	    if (!is_firefox){
	// 	    // Define Child Nodes Array 
	// 	    // and current cursor position
	// 		    var childNodes = $TARGET[0].childNodes;
	// 		    var currentLine = cursor.anchorNode.data;
	// 		    var start = cursor.anchorOffset; 
	// 		    var end = cursor.focusOffset;

	// 		    // Determine which row the cursor is currently in
	// 		    // then create jQuery object that selects that row

	// 		    var lineIdx = getChildNode(currentLine, childNodes);

	// 				var $childSelector = $("#" + $TARGET[0].id + " div:nth-child("+(lineIdx+1)+")"); 
	// 				console.log(typeof $childSelector !== 'undefined');
	// 				console.log($childSelector);
	// 				// Insert &emsp; into line.
	// 				var html_str = $childSelector.html();

	// 				$childSelector.html(
	// 					html_str.substring(0,start) +
	// 					"&emsp;" +
	// 					html_str.substring(end)
	// 				);

	// 		    // Put caret in correct position after pressing
	// 		    // TAB, based on current row and current column

	// 					// FIX: Reposition caret in correct position
	// 					// in line when pressing TAB

	// 				var range = document.createRange();
	// 		    range.setStart(childNodes[lineIdx], 1);
	// 		    range.setEnd(childNodes[lineIdx], 1);
	// 		    cursor.removeAllRanges();
	// 		    cursor.addRange(range);
	// 		  }
	// 		  else {
	// 		  	// Fill dis bitch in
	// 		  }
	// 		}
	// 	});
	// }

	// Make images in an element interactive \
	//(ie draggable, resizeable, delete buttons)
	$.fn.imgInteract = function(){
		this.draggable({containment:'parent'});
		this.resizable({
			containment:"parent",
			handles: "s, e, se, w, sw",
		});

		this.attachDeleteButton();

		// Chrome Fix: Take ui-icon class out to fix
		// resizing se-icon problem
		if (is_chrome){
			this.find('.ui-icon-gripsmall-diagonal-se').attr({
				'class':'ui-resizable-handle ui-resizable-se ui-icon-gripsmall-diagonal-se',
			});
		}
	}

	// Primes first line of imgTxtHybrid item with div
	$.fn.primeDivs = function(){
		if (!is_firefox) {this.html('<div><br></div>');}
		else {this.html('<p></p>');}
	}

})(jQuery, document, window);


// UTILITY: Apply settings with JS objects
$.fn.objectSettings = function(setting_object){
	var $TARGET = this;
	$TARGET.css(setting_object);
}

// UTILITY: Function that, when called, automatically
// reloads and refreshes interactivity on any uploaded images
$.fn.refreshImgInteractions = function(){
	$upload_images = this.find(".upload-image");
	for (var idx = 0; idx < $upload_images.length; idx++){
		// Remove the old resize-handle div handles before calling imgInteract
		$($upload_images[idx]).contents().remove('div.ui-resizable-handle');
		$($upload_images[idx]).unbind();
		$($upload_images[idx]).imgInteract();
	}
}

// UTILITY: converts pixel css to percentage css
$.fn.px_to_percent = function(){
	var $THIS = this;
	// Subfunction that takes a quality (ie 'top','height', etc)
	// and a boolean and returns a float value of the pixels
	// in each quality. 
	function numerify(quality, parent){
		var target;
		if (parent) {
			target =  $THIS.parent();
		}
		else {
			target = $THIS;
		}
		return parseFloat(target.css(quality)
					.replace("auto","0")
					.replace("px",""));
	}
	// Takes a number and turns it into a string.
	function stringify(number){
		return number.toString();
	}

	// Variable initialization
	var height_at_100_float, width_at_100_float, 
		top_at_100_float, left_at_100_float, 
		item_height_float, item_width_float,
		item_top_float, item_left_float;

	// Take height and width of the parent element
	height_at_100_float = numerify('height', true);
	width_at_100_float = numerify('width', true);

	// Take height, width, top and left of the target element
	item_height_float = numerify('height', false);
	item_width_float =  numerify('width', false);
	item_top_float = numerify('top', false);
	item_left_float = numerify('left', false);

    // Calculates percentages 
	percent_height_percent = 100 * ( item_height_float / height_at_100_float);
	percent_width_percent = 100 * ( item_width_float / width_at_100_float);
	percent_top_percent = 100 * ( item_top_float / height_at_100_float);
	percent_left_percent = 100 * ( item_left_float / width_at_100_float);

	return ([
			stringify(Math.floor(percent_top_percent)) + "%",
			stringify(Math.ceil(percent_left_percent)) + "%",
			stringify(percent_height_percent) + "%",
			stringify(percent_width_percent) + "%",
			]);
}

// UTILITY: counts the number of images in a given element
$.fn.countImages = function(){
	console.log(this.find('img').length);
	return this.find('img').length;
}

// UTILITY: returns an object array of the srcs of the uploaded images in a given element
$.fn.imgSrc = function(percent){
	if (typeof percent === 'undefined') {percent = false;}
	var result = [];
	var img_list = this.find('img');
	for (var img_idx = 0; img_idx < img_list.length; img_idx++) {
		// Initialize Variables
		var item_obj;
		var img_id,
			img_top, img_left, img_height, img_width, 
		    base64data_source, base64data_start, base64data,
		    base64data_format_start, base64data_format_end, base64data_format;

		// Get and store img id
		img_id =  $(img_list[img_idx]).parent().attr('id');

		// Store styling information of img + parent entity
		if (percent){
			var img_params = $(img_list[img_idx]).parent().px_to_percent();
			img_top = img_params[0];
			img_left = img_params[1];
		}
		else{
			img_top = $(img_list[img_idx]).parent().css('top');
			img_left = $(img_list[img_idx]).parent().css('left');
		}
		
		img_height = $(img_list[img_idx]).parent().css('height');
		img_width = $(img_list[img_idx]).parent().css('width');

		
		// Isolate and store data information of img
		base64data_source = img_list[img_idx]['src'];
		base64data_start = base64data_source.indexOf('base64') + 7;
		base64data = base64data_source.slice(base64data_start, base64data_source.length);

		// Isolate store format information of img
		base64data_format_start = base64data_source.indexOf('image/')+6;
		base64data_format_end = base64data_source.indexOf(';base64');
		base64data_format = base64data_source.slice(base64data_format_start, base64data_format_end);

		// Populate object with stored styling, data and format data
		item_obj = {
			'id': img_id,
			'top': img_top,
			'left': img_left,
			'height': img_height,
			'width': img_width,
			'data': base64data,
		};
		// Append object to the result array
		result.push(item_obj);
	}
	return result;
}

// UTILITY: From the HTML, go to JS String
$.fn.getText = function(){
	var result = "";
	var buffer = "";
	// Split actions based on platform
	if(!is_firefox) {
		// Get jQuery array of elements that are not uploaded images
		$TARGET = this.contents().not(".upload-image");

		// Go through elements and add the containing text + newline to buffer str
		for (var i = 0; i < $TARGET.length ; i++){ 
			buffer += jQuery($TARGET[i]).text() + "\n";
		}
		// replace all HTML spaces with JS spaces and add buffer to result
		buffer = buffer.replace(/&nbsp;/g, " ");
		result += buffer;
	}
	else {
		// Take the html of the target element
		string = this.html();
		// HACK: Fix this part so it can't be fuggled up.
		// Establish end of string portion at beginning of DIV
		str_end = string.indexOf('<div');
		result += string.slice(0,str_end).replace(/<br>/g, '\n');
	}
	return result;
}

// JS UTILITY: Based on Browser, handle line breaks 
// when going from JS strings to HTML
function handleLineBreaks(multiline_str){
	if (is_firefox) { 
		return multiline_str.replace(/\n/g,'<br>');
	}
	else {
		// initialize result AND split strings by newline
		var result = "";
		var strings = multiline_str.split("\n");

		// For each item in strings, initialize the insert item
		// and then either insert <br> or the source string replaced with 
		// html whitespace markup. Couch the insert item in div tags
		for (var str = 0; str < strings.length; str++) {
			var insert_item;
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
}


// The main function! 

$.fn.imgTxtHybrid = function(obj_settings){
	// Initialize SETTINGS variables
	var RESIZE_OBJECT_SETTINGS, IMG_SETTINGS;

  // Run default object style settings if no arguments are passed
  // Else pass any parameter object style settings 
	if (typeof obj_settings ==='undefined') {
		RESIZE_OBJECT_SETTINGS = {
		'overflow': 'hidden',
		'position':'absolute',
		'white-space':'pre-wrap',
		'display':'inline-block',	
		}
	}
	else {
		// Catch errors that happen when uploading your own styling
		try {
			RESIZE_OBJECT_SETTINGS = obj_settings;
		}
		catch(error){
			console.log(error);
		}
	}

	// Set img settings
	IMG_SETTINGS = {
		'display':'block',
		'width': 100 + '%',
		'height': 100 + '%',
	}

	// Start with ContentEditable native widget
	this.attr('contenteditable', 'true');
	
	// Force this element to be relative and have overflow:auto
	this.css({
		'position':'relative',
		'overflow':'auto',
	});

	// Run the encapsulated functions
	this.suppressDefaults();
	this.primeDivs();
	this.imgEvent(RESIZE_OBJECT_SETTINGS, IMG_SETTINGS);
}