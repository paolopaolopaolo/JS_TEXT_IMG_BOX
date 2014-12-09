$(document).ready(function(){

	// Call imgTxtHybrid on top box, 
	// passing through desired CSS styling
	$("#contentEdit").imgTxtHybrid({
		'overflow': 'hidden',
		'position':'absolute',
		'white-space':'pre-wrap',
		'display':'inline-block',
		'border-radius':'10px',	
		});
	$("#copySide").imgTxtHybrid({
		'overflow': 'hidden',
		'position':'absolute',
		'white-space':'pre-wrap',
		'display':'inline-block',
		'border-radius':'10px',	
		});

	// Add click listener to #print_data button, which will print the
	// JS object data on all the images in the top box 
	$("#print_data").on('click', function(){
		var img_contents = $("#contentEdit").imgSrc();
		var string_result = "";
		$('#result').html("");
		for (var i = 0; i  < img_contents.length; i++){
			var results = $('#result').html();
			$('#result').html(results +
				"{\n"+
				"'id': " + img_contents[i]['id'] + "\n" +
				"'top': " + img_contents[i]['top'] + "\n" +
				"'left': " + img_contents[i]['left'] + "\n" +
				"'height': " + img_contents[i]['height'] + "\n" +
				"'width': " + img_contents[i]['width'] + "\n" +
				"'data': " + img_contents[i]['data'].slice(0,10) + "...\n" +
				"'format': " + img_contents[i]['format'] + "\n" +
				"'datasource': " + img_contents[i]['datasource'].slice(0,30) + "...\n" +
				"}\n");
		}
	});

	// Add click listener to #copy_box button, which will use 
	// the data from the top box to recreate an uneditable version 
	// of the top box.

	$("#copy_box").on('click', function(){
		var text_contents = $("#contentEdit").html();
		$("#copySide").html(text_contents);
		$upload_images = $("#copySide").find(".upload-image");
		for (var idx = 0; idx < $upload_images.length; idx++){
			$($upload_images[idx]).contents().remove('div.ui-resizable-handle');
			$($upload_images[idx]).imgInteract();
		}
	});
});