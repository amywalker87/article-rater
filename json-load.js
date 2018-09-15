var articleArray = [1,2,3,4,5];
var randomIndex = Math.ceil(Math.random() * articleArray.length);

$(document).ready(loadArticle(randomIndex));

function loadArticle(id){
	$.getJSON("api/article/get.php?id="+id, function(article){
		article = JSON.parse(article.message);
        $("h1").append(article.title);
        for (var element in article.body){
        	$("div.article-body").append('<div class="'+article.body[element].type+'">stuff</div>');
        }
    });
}