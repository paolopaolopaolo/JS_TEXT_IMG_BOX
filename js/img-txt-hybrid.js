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
RESIZE_OBJECT_SETTINGS = {
	'overflow': 'hidden',
	'position':'absolute',
	'white-space':'pre-wrap',
	'display':'inline',
	// 'z-index':-1000,
}

IMG_SETTINGS = {
	'display':'inline-block',
	'width': 100 + '%',
	'height': 100 + '%',
}

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
	this.on("drop", function(e){
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

			// For each file, create a FileReader Object
	  		for (var i = 0; i < files.length; i++) {
	  			var url = files[i];
	  			var readFile = new FileReader();
	  			
	  			// Set onload method of FileReader object
	  			readFile.onload = function(){
	  				console.log('item dropped!');
	  				// Creates div and img jQuery objects
	  				var div = document.createElement('div');
	  				div.setAttribute('contenteditable','false');
	  				var img = new Image();
	  				$div = $(div);
	  				$img = $(img);

	  				// Set img src to data pointer
	  				$img.attr({
	  					'src': readFile.result,
	  				});

	  				// Set height and width of div 
	  				// to a quarter of the size of img
	  				$div.css({
	  					'width': $img[0].width/4,
	  					'height': $img[0].height/4,
	  				});
	  				
		  			// Apply object settings/ append img to div
		
			  		$div.objectSettings(RESIZE_OBJECT_SETTINGS);
			  		$img.objectSettings(IMG_SETTINGS);
			  		$div.append($img);

			  		// Enable div draggable and sizeable
			  		$div.draggable({containment:"parent"});
			  		$div.resizable({containment:"parent"});
			  		
			  		// Tack div+img onto document  
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


$.fn.primeDivs = function(){
	this.html('<div><br></div>');
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
	this.dropEvent();
	// this.tabEnable();
}