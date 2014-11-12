var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
var ITEMS;
if ((is_chrome)&&(is_safari)) {is_safari=false;}

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
		if(!is_firefox){
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
		  		$(str).append(image);
		  		clickCycle('.floatCycle');
	  		}
	  		reader.readAsDataURL(url);
	    }
  	}

	});

}
