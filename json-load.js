var articleArray = [1,2,3,4,5];
var randomIndex = Math.ceil(Math.random() * articleArray.length);

var elements = {heading: 'h2', paragraph: 'p', image: 'img', list: 'ul', ordered: 'ol'}

$(document).ready(loadArticle(randomIndex));

function loadArticle(id){
	$.getJSON('api/article/get.php?id='+id, function(article){
		article = JSON.parse(article.message);
		var articleElement = document.querySelector('.article');

		var h1 = document.createElement('h1');
		h1.textContent = article.title;
		h1.className = 'border-bottom border-info p-2 mt-3';
		h1.setAttribute('style','border-width:2px !important');
		articleElement.appendChild(h1);
		document.title = article.title;

		var bodyDiv = document.createElement('div');
		bodyDiv.className = 'article-body';
		articleElement.appendChild(bodyDiv);

		for (var element in article.body){
			var elementType = elements[article.body[element].type];
			var newElement = document.createElement(elementType);
			if(elementType == 'img'){
				newElement.src = article.body[element].model.url;
				newElement.alt = article.body[element].model.altText;
				newElement.height = article.body[element].model.height;
				newElement.width = article.body[element].model.width;
				newElement.className = 'mx-auto d-block p-2 mb-3 shadow-sm';
			}
			else if(elementType == 'ul'){
				if(article.body[element].model.type == 'ordered'){
					elementType = elements[article.body[element].model.type];
					newElement = document.createElement(elementType);
				}
				for (var list in article.body[element].model.items){
    				var listItem = document.createElement('li');
    				listItem.textContent = article.body[element].model.items[list];
    				newElement.appendChild(listItem);
    			}
			}
			else{
				newElement.textContent = article.body[element].model.text;
			}
			bodyDiv.appendChild(newElement);
		}
	});
}