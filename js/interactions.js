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

	// Add click listener to #print_data button, which will print the
	// JS object data on all the images in the top box 
	$("#print_data").on('click', function(){
		var img_contents = $("#contentEdit").imgSrc();
		var string_result = "";
		$('#result').html("");
		for (var i = 0; i  < img_contents.length; i++){
			var results = $('#result').html();
			$('#result').html(results +
				"{"+
				"'id': " + img_contents[i]['id'] + "\n" +
				"'top': " + img_contents[i]['top'] + "\n" +
				"'left': " + img_contents[i]['left'] + "\n" +
				"'height': " + img_contents[i]['height'] + "\n" +
				"'width': " + img_contents[i]['width'] + "\n" +
				"'data': " + img_contents[i]['data'] + "..." +
				"}"+"\n");
		}
	});

	$("#print_text").on('click', function(){
		var contents = $("#contentEdit").stringConvHTMLtoJS();
		$("#textbox").html(contents);
	});
	$("#help_display").hide();
	$("#help_text").hide();

	$("#helpicon").on('click', function(){
		$("#help_display").fadeIn();
		$("#help_text").fadeIn();
	});

	$("#exit_display").on('click', function(){
		$("#help_display").fadeOut();
		$("#help_text").fadeOut();
	});
});