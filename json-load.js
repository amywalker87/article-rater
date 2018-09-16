var articleArray = [1,2,3,4,5];
var randomIndex = Math.ceil(Math.random() * articleArray.length);
var currentArticle = 4;

var elements = {heading: 'h2', paragraph: 'p', image: 'img', list: 'ul', ordered: 'ol'}

$(document).ready(function(){
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
});

$(document).on('click','#next', function(){
	currentArticle++;
	var myNode = document.querySelector('.article');
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
})

$(document).on('click','#previous', function(){
	currentArticle--;
	var myNode = document.querySelector('.article');
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
}) 

function loadArticle(previous, current, next){
	$.getJSON('api/article/get.php?id='+current, function(article){
		article = JSON.parse(article.message);
		var articleElement = document.querySelector('.article');

		var h1 = document.createElement('h1');
		h1.textContent = article.title;
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
		var buttons = document.createElement('div');
		buttons.className = 'nav-buttons';
		articleElement.appendChild(buttons);
		if(previous){
			var prevButton = document.createElement('button');
			prevButton.textContent = 'Previous Article';
			prevButton.id = 'previous';
			prevButton.value = previous;
			buttons.appendChild(prevButton);
		}
		if(next){
			var nextButton = document.createElement('button');
			nextButton.textContent = 'Next Article';
			nextButton.id = 'next';
			nextButton.value = next;
			buttons.appendChild(nextButton);
		}
		else {
			var rateButton = document.createElement('button');
			rateButton.textContent = 'Rate Articles';
			rateButton.id = 'rate';
			buttons.appendChild(rateButton);
		}
	});
}