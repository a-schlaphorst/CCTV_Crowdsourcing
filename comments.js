function fillCommentsPage(id){
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var results = JSON.parse(xmlhttp.responseText);
			
			var resultDiv = $("<div id='comments_container'>");
			var comments = results.features;
			// reverse comments, so that last one is displayed on top
			comments.reverse();
			
			for(var i = 0; i < comments.length; i++){
				var comment = comments[i].properties.comment
				var div = $("<div class='comment'>");
				div.append("<p class=\"description\">" + comment + "</p>");
				div.append("</div>");

				resultDiv.append(div);
			}
	
			resultDiv.append("</div>");
			$('#comments_container').replaceWith(resultDiv);
		}
	}
	
	xmlhttp.open("GET","getcomments.php?camid=" + id,true);
	xmlhttp.send();
}

function addComment(){
	// Do not add comment if no camera is selected or comment is empty
	if(!selectedCameraId || $('#comment-text').val() == ""){
		return;
	}
	
	var comment = $('#comment-text').val();
	var commentCamera = selectedCameraId;
	
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			$('#comment-text').val("");
			fillCommentsPage(commentCamera);
			$( "#commentRegisteredPopup" ).popup();
			$( "#commentRegisteredPopup" ).popup( "open" );
			setTimeout(function(){
				$( "#commentRegisteredPopup" ).popup("close")
			}, 2000);
		}
	}
	xmlhttp.open("GET","postcomment.php?camid=" + commentCamera + "&comment=" + comment,true);
	xmlhttp.send();
}