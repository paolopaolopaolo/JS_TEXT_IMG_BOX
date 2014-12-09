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

	// Apply settings with JS objects
	$.fn.objectSettings = function(setting_object){
		var $TARGET = this;
		$TARGET.css(setting_object);
	}

	// Creates drop event listener to do the following for each file:
	// (Overall) Create FileReader object, with an onload event that appends div
	// to the content box.
	$.fn.dropEvent = function(RESIZE_OBJECT_SETTINGS, IMG_SETTINGS){
		var $TARGET = this;
		$TARGET.on('drop', function(event) {
			// if (!is_firefox){
				// Prevent default drop behavior from browser
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
	  				// (a) Prevent default actions / propagation up the tree
	  				event.preventDefault();
	  				event.stopPropagation();
	  				// (b) Creates div and img jQuery objects
	  				var div = document.createElement('div');
	  				div.setAttribute('contenteditable','false');
	  				div.setAttribute('class','upload-image');
	  				var img = new Image();
	  				var $div = $(div);
	  				var $img = $(img);
	  				// (c) Set img src to data pointer
	  				$img.attr('src', readFile.result);
	  				
	  				
		  			if ($img[0].width <= 0 || $img[0].height <= 0){
		  				console.log(file);
	  					alert('Upload Error! Try again\n'+'Filename:'+file.name);
	  					return false;
	  				}
	  				// (d) Set height and width of div 
	  				// to a quarter of the size of img
		  			$div.css({
		  				'width': $img[0].width/4,
		  				'height': $img[0].height/4,
		  			});

		  			$div.attr('id', Math.random().toString().replace(".","_") + 
		  				"_"+ file.name);

		  			// (e) Apply object settings/ append img to div
			  		$div.objectSettings(RESIZE_OBJECT_SETTINGS);
			  		$img.objectSettings(IMG_SETTINGS);
			  		$div.append($img);
			  		// (f) Enable div draggable and sizeable/ attach delete button
			  		$div.imgInteract();
			  		// (g) Attach div+img onto target element 
			  	 	$TARGET.append($div)
			 		}
			 		// ... setting onError method
			 		readFile.onerror = function(event){
			 			alert("Upload Failed! Try again.");
			 		}
			 		// Start loading the file
			 		readFile.readAsDataURL(file);
				}

				// FIX: In this for block, there are issues with uploading multiple
				// files to be images.

				for (var i = 0; i < files.length; i ++) {
					handleReadFile(files[i]);
				}
			$TARGET.attr('contenteditable', 'true');
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
			console.log("issue fixed");
		}
	}

	// Primes first line of imgTxtHybrid item with div
	$.fn.primeDivs = function(){
		this.html('<div><br></div>');
	}

})(jQuery, document, window);


// UTILITY: Function that, when called, automatically
// reloads and refreshes interactivity on any uploaded images
$.fn.refreshImgInteractions = function(){
	$upload_images = this.find(".upload-image");
	for (var idx = 0; idx < $upload_images.length; idx++){
		// Remove the old resize-handle div handles before calling imgInteract
		$($upload_images[idx]).contents().remove('div.ui-resizable-handle');
		$($upload_images[idx]).imgInteract();
	}
}

// UTILITY: counts the number of images in a given element
$.fn.countImages = function(){
	console.log(this.find('img').length);
	return this.find('img').length;
}

// UTILITY: returns an object array of the srcs of the uploaded images in a given element
$.fn.imgSrc = function(){
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

		// Store styling information of img
		img_top = $(img_list[img_idx]).parent().css('top');
		img_left = $(img_list[img_idx]).parent().css('left');
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
			'format': base64data_format,
			'datasource': base64data_source,
		};
		// Append object to the result array
		result.push(item_obj);
	}
	return result;
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
	
	// Force this element to be relative
	this.css('position', 'relative');

	// Run the encapsulated functions
	this.suppressDefaults();
	this.primeDivs();
	this.dropEvent(RESIZE_OBJECT_SETTINGS, IMG_SETTINGS);
}