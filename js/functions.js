// Determine browser hack
var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}

// Supress Default behavior
function suppressDefaults(str){
	$(str).on('dragover', function(e) {
			if(!is_firefox){
				e.preventDefault();
				e.stopPropagation();
			}	
	});
	$(str).on('dragenter', function(e) {
		if(!is_firefox){
			e.preventDefault();
			e.stopPropagation();
		}
	});
}

// Takes selector string: makes element alternate
// float:left and float:right by clicking it.
function clickCycle(str){
	$(str).unbind();
	$(str).on('click', function(){
	if ($(this).css('float') == 'left'){
		$(this).css('float','right');
		$(this).css('margin-right','30%');
	}
	else{
		$(this).css('float','left');
		$(this).css('margin-right','0');
	}
	});
}

function dropEvent(str){
	$(str).on('drop', function(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    var data = e.originalEvent.dataTransfer;
			var files = data.files;
	  	for (var i = 0; i < files.length; i++) {
	  		var url = files[i];
	  		var reader = new FileReader();
	  		reader.onload= function(e){
		  		var image = document.createElement('img');
		  		image.setAttribute('class', 'floatCycle');
		  		image.setAttribute('src', reader.result);
		  		image.innerHTML = ""	
		  		$(str).append(image);
		  		// clickCycle('.floatCycle');
	  		}
	  		reader.readAsDataURL(url);
	    }
	});
}

function tabEnable(contentEditableSelector){
	var cursor = window.getSelection();
	document.querySelector(contentEditableSelector).addEventListener('keydown', function (e) {
	    if (e.which == 9) {
	        e.preventDefault();
	        var start = cursor.anchorOffset; 
	        var end = cursor.focusOffset;
	        $(contentEditableSelector).html($(contentEditableSelector).html().substring(0, start) + 
	        	"&emsp;" + $(contentEditableSelector).html().substring(end));
	        var range = document.createRange();
	        range.setStart($(contentEditableSelector)[0].childNodes[0], start+1);
	        range.setEnd($(contentEditableSelector)[0].childNodes[0], end+1);
	        cursor.removeAllRanges();
	        cursor.addRange(range);
	    }
	});
}