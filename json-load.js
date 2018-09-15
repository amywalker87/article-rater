var articleArray = [1,2,3,4,5];
var randomIndex = Math.ceil(Math.random() * articleArray.length);

$(document).ready(loadArticle(randomIndex));

function loadArticle(id){
	$.getJSON("api/article/get.php?id="+id, function(article){
		article = JSON.parse(article.message);
        $("h1").append(article.title);
        for (var element in article.body){
        	if(article.body[element].type == "heading"){
        		$("div.article-body").append('<h2>'+article.body[element].model.text+'</h2>');
        	}
        	else if(article.body[element].type == "paragraph"){
        		$("div.article-body").append('<p>'+article.body[element].model.text+'</p>');
        	}
        	else if(article.body[element].type == "image"){
        		$("div.article-body").append('<img src="'+article.body[element].model.url+'" height="'+article.body[element].model.height+'" width="'+article.body[element].model.width+'" alt="'+article.body[element].model.altText+'"/>');
        	}
        	else if(article.body[element].type == "list"){
        		var listTag = "ol>";
        		if(article.body[element].model.type == "unordered"){
        			listTag = "ul>";
        		}
    			var listHtml = "<"+listTag;
    			for (var list in article.body[element].model.items){
    				listHtml += "<li>";
    				listHtml += article.body[element].model.items[list];
    				listHtml += "</li>";
    			}
    			listHtml += "</";
    			listHtml += listTag;
    			$("div.article-body").append(listHtml);
        	}
        }
    });
}