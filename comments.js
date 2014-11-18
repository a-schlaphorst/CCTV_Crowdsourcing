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
			
			for(var i = 0; i < comments.length; i++){
				var comment = comments[i].properties.comments
				var div = $("<div class='comment'>");
				div.append("<p class=\"description\">" + comment + "</p>");
				div.append("</div>");

				resultDiv.append(div);
			}
	
			resultDiv.append("</div>");
			$('#comments_container').replaceWith(resultDiv);
		}
	}
	
	xmlhttp.open("GET","getcomments.php?cameraid=" + id,true);
	xmlhttp.send();
}

function addComment(){
	if(!selectedCameraId){
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
			alert(xmlhttp.responseText);
		}
	}
	xmlhttp.open("GET","postcomment.php?cameraid=" + commentCamera + "&comment=" + comment,true);
	xmlhttp.send();
}