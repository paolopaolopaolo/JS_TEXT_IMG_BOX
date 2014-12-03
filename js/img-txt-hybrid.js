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

// Variable SETTING Objects:
// (see $.fn.dropEvent)

var RESIZE_OBJECT_SETTINGS = {
	'overflow': 'hidden',
	'position':'absolute',
	'white-space':'pre-wrap',
	'display':'inline-block',	
}

var IMG_SETTINGS = {
	'display':'block',
	'width': 100 + '%',
	'height': 100 + '%',
}

// COUNTERS

var IMG_COUNTER = 0;

///////////////////////
// Utility Functions //
///////////////////////

// This function takes the value of the current line and retrieves 
function getChildNode(currentLine, childNodes){
	for (var i = 0; i < childNodes.length; i++) {
		// FIX: Currently, this function finds line where the
		// cursor is based on the value of the line. This will
		// not do (esp in cases of duplicate lines), and we 
		// need another way of determining the correct line.
  	if($.trim(currentLine) == $.trim(childNodes[i].textContent)) {
  		return i;
  	}
	}
	return -1
}


////////////////////////////////
// jQuery Extension Functions //
////////////////////////////////

// Suppress default drag and drop
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
	$TARGET = this;

	// Create random id# to apply to both button and corresponding item
	var buttonid = Math.random().toString().replace('.', '_');

	// Create button jQuery object
	var button = document.createElement('input');
	button.setAttribute('type', 'submit');
	button.setAttribute('value', 'X');
	button.setAttribute('class', 'delImg');
	$button = $(button);

	// Set element ids of target object and button
	$button.attr('id', 'delImg'+ buttonid);
	$TARGET.attr('id', buttonid);

	// Set styling for button
	$button.css({
			'position': 'relative',
			'bottom': '99%',
			'float': 'right',
			'right': '1px',
			// 'z-index': '1000',
			'display':'none,'
	});

	// Attach button to target element
	$TARGET.append($button);

	// Add event listener for hiding/showing button 
	$TARGET.hover(function(){
		$('#' + button.id).fadeIn();
	}, function(){
		$('#' + button.id).fadeOut();
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
	$TARGET = this;
	$TARGET.css(setting_object);
}

// Creates drop event listener to do the following for each file:
// (Overall) Create FileReader object, with an onload event that appends div
// to the content box.
$.fn.dropEvent = function(){
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

			// For each file:
  		for (var i = 0; i < files.length; i++) {
  			// (1) Create a FileReader Object and set url
  			var url = files[i];
  			var readFile = new FileReader();
  			
  			// (2) Set onload method of FileReader
  			// object to run the following routines:

  			readFile.onload = function(event){
  				// (a) Prevent default actions / propagation up the tree
  				event.preventDefault();
  				event.stopPropagation();

  				// (b) Creates div and img jQuery objects
  				var div = document.createElement('div');
  				div.setAttribute('contenteditable','false');
  				div.setAttribute('class','upload-image');
  				var img = new Image();
  				$div = $(div);
  				$img = $(img);

  				// (c) Set img src to data pointer
  				$img.attr({'src': readFile.result,});

  				// (d) Set height and width of div 
  				// to a quarter of the size of img
	  			$div.css({
	  				'width': $img[0].width/4,
	  				'height': $img[0].height/4,
	  			});
  				
	  			// (e) Apply object settings/ append img to div
		  		$div.objectSettings(RESIZE_OBJECT_SETTINGS);
		  		$img.objectSettings(IMG_SETTINGS);
		  		$div.append($img);

		  		// (f) Enable div draggable and sizeable
		  		$div.draggable({containment:"parent"});
		  		$div.resizable({containment:"parent"});

		  		// (g) Chrome Fix: Take ui-icon class out to fix
		  		// resizing se-icon problem
		  		if (is_chrome){
			  		$div.find('.ui-icon-gripsmall-diagonal-se').attr({
			  			'class':'ui-resizable-handle \
			  			ui-resizable-se \
			  			ui-icon-gripsmall-diagonal-se',
			  		});			  
		  		}

		  		// (h) Attach delete button to image
		  		$div.attachDeleteButton();

		  		// (e) Attach div+img onto target element  
		  		$TARGET.append($div);
		 		}
	  		readFile.readAsDataURL(url);
	  	// }
		}
	});
	$TARGET.attr('contenteditable', 'true');
}

// Enables Inserting Tab Whitespace
$.fn.tabEnable = function(){
	var cursor = window.getSelection();
	var $TARGET = this;
	$TARGET.on('keydown', function (e) {
		// Pressing TAB 
	  if (e.which == 9) {
	  	// Prevents focusing on next element
	    e.preventDefault();

	    if (!is_firefox){
	    // Define Child Nodes Array 
	    // and current cursor position
		    var childNodes = $TARGET[0].childNodes;
		    var currentLine = cursor.anchorNode.data;
		    var start = cursor.anchorOffset; 
		    var end = cursor.focusOffset;

		    // Determine which row the cursor is currently in
		    // then create jQuery object that selects that row

		    var lineIdx = getChildNode(currentLine, childNodes);

				var $childSelector = $("#" + $TARGET[0].id + " div:nth-child("+(lineIdx+1)+")"); 
				console.log(typeof $childSelector !== 'undefined');
				console.log($childSelector);
				// Insert &emsp; into line.
				var html_str = $childSelector.html();

				$childSelector.html(
					html_str.substring(0,start) +
					"&emsp;" +
					html_str.substring(end)
				);

		    // Put caret in correct position after pressing
		    // TAB, based on current row and current column

					// FIX: Reposition caret in correct position
					// in line when pressing TAB

				var range = document.createRange();
		    range.setStart(childNodes[lineIdx], 1);
		    range.setEnd(childNodes[lineIdx], 1);
		    cursor.removeAllRanges();
		    cursor.addRange(range);
		  }
		  else {
		  	// Fill dis bitch in
		  }
		}
	});
}


// Primes first line of imgTxtHybrid item with div
$.fn.primeDivs = function(){
	this.html('<div><br></div>');
}

$.fn.countImages = function(){
	console.log(this.find('img').length);
	return this.find('img').length;
}

// Extend jQuery with the new functionality

$.fn.imgTxtHybrid = function(){
	// Start with ContentEditable native widget
	this.attr('contenteditable', 'true');
	
	// Force this element to be relative
	this.css('position', 'relative');

	// Initialize the other functions
	this.suppressDefaults();
	this.primeDivs();
	IMG_COUNTER = this.countImages();
	this.dropEvent();
	// this.tabEnable();
}