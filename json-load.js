var articleArray = [1, 2, 3, 4, 5];
var articleTitles = [];
var currentArticle = 0;
var elements = {heading: 'h2', paragraph: 'p', image: 'img', list: 'ul', ordered: 'ol'};

articleArray.sort(function(){return 0.5 - Math.random()});

$(document).ready(function(){
	var contentElement = document.querySelector('.content');
	loadArticle(contentElement, articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
});

function loadArticle(contentElement, previous, current, next){
	$.ajax({
		type: 'GET', 
		url: 'api/article/get.php?id='+current, 
		dataType: 'json', 
		ContentType: 'application/json', 
		success: function(article){
			article = JSON.parse(article.message);
			createElement(contentElement, 'h1', article.title);
			document.title = article.title;
			articleTitles[current] = article.title;
			var bodyDiv = createElement(contentElement, 'div', '', void 0, 'article-body');

			for(var element in article.body){
				var elementType = elements[article.body[element].type];
				if(elementType == 'img'){
					createElement(bodyDiv, elementType, void 0, void 0, void 0, article.body[element].model.url, article.body[element].model.altText);
				}
				else if(elementType == 'ul'){
					if(article.body[element].model.type == 'ordered'){
						elementType = elements[article.body[element].model.type];
					}
					var listElement = createElement(bodyDiv, elementType, '');
					for(var list in article.body[element].model.items){
						createElement(listElement, 'li', article.body[element].model.items[list]);
					}
				}
				else{
					createElement(bodyDiv, elementType, article.body[element].model.text);
				}
			}
			var buttons = createElement(contentElement, 'div', '', void 0, 'nav-buttons');
			if(previous){
				var previousButton = createElement(buttons, 'button', 'Previous Article', 'previous');
				$(previousButton).bind('click', function(){
					currentArticle--;
					clearPage(contentElement);
					loadArticle(contentElement, articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
				});
			}
			if(next){
				var nextButton = createElement(buttons, 'button', 'Next Article', 'next');
				$(nextButton).bind('click', function(){
					currentArticle++;
					clearPage(contentElement);
					loadArticle(contentElement, articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
				});
			}
			else{
				var rateButton = createElement(buttons, 'button', 'Rate Articles', 'rate');
				$(rateButton).bind('click', function(){
					clearPage(contentElement);
					loadRater(contentElement, articleArray);
				});
			}
		}, 
		error: function(){
			clearPage(contentElement);
			errorPage(contentElement);
		}
	});
}

function loadRater(contentElement, articleArray){
	createElement(contentElement, 'h1', 'Rate the articles');
	document.title = 'Rate the articles';
	createElement(contentElement, 'p', 'Please rate the articles you have just read in order of preference, with the highest rated article at the top and the lowest rated article at the bottom.');
	var ol = createElement(contentElement, 'ol', void 0, void 0, 'ratings');

	for(var article in articleArray){
		var li = createElement(ol, 'li', void 0, articleArray[article], 'articleRateBox');
		var span1 = createElement(li, 'span', articleTitles[articleArray[article]], void 0, 'pull-left');
		var span2 = createElement(li, 'span', void 0, void 0, 'pull-right');
		var upButton = createElement(span2, 'button', 'Up', void 0, 'rateUp');
		upButton.setAttribute('aria-label','Move up article '+articleTitles[articleArray[article]]);
		var downButton = createElement(span2, 'button', 'Down', void 0, 'rateDown');
		downButton.setAttribute('aria-label','Move down article '+articleTitles[articleArray[article]]);
	}
	disableArrowButtons();
	$('.rateUp').bind('click', function(){
		var current = $(this).closest('li')
		var previous = current.prev('li');
		if(previous.length !== 0){
			current.insertBefore(previous);
		}
		disableArrowButtons();
	});
	$('.rateDown').bind('click', function(){
		var current = $(this).closest('li')
		var next = current.next('li');
		if(next.length !== 0){
			current.insertAfter(next);
		}
		disableArrowButtons();
	});
	var buttons = createElement(contentElement, 'div', '', void 0, 'nav-buttons');
	var submit = createElement(buttons, 'button', 'Submit Ratings', 'submit');
	$(submit).bind('click', function(){
		var data = {};
		for(i = 0; i < 5; i++){
			// This sends the data in the format { articleID: rating }
			data[$('ol li')[i].id] = i+1;
		}
		$.ajax({
			type: 'POST', 
			url: 'api/rating/post.php', 
			dataType: 'json', 
			ContentType: 'application/json', 
			data: {'data': JSON.stringify(data)}, 
			success: function(){
				clearPage(contentElement);
				loadSuccess(contentElement);
			}, 
			error: function(){
				clearPage(contentElement);
				errorPage(contentElement);
			}
		});
	});
}

function loadSuccess(contentElement){
	createElement(contentElement, 'h1', 'Rating submission successful');
	document.title = 'Rating submission successful';
	createElement(contentElement, 'p', 'Thank you, your article ratings have been submitted.');
	var buttons = createElement(contentElement, 'div', '', void 0, 'nav-buttons');
	var start = createElement(buttons, 'button', 'Start Again', 'start');
	$(start).bind('click', function(){
		window.location.href = 'http://localhost:8000/';
	});
}

function createElement(parentElement, elementType, textContent, id, className, src, alt){
	var newElement = document.createElement(elementType);
	if(textContent){
		newElement.textContent = textContent;
	}
	if(id){
		newElement.id = id;
	}
	if(className){
		newElement.className = className;
	}
	if(src){
		newElement.src = src;
	}
	if(alt){
		newElement.alt = alt;
	}
	parentElement.appendChild(newElement);
	return newElement;
}

function clearPage(contentElement){
	while(contentElement.firstChild){
		contentElement.removeChild(contentElement.firstChild);
	}
}

function disableArrowButtons(){
	$('ol li:gt(0) button.rateUp').prop('disabled', false);
	$('ol li:lt(4) button.rateDown').prop('disabled', false);
	$('ol li:lt(1) button.rateUp').prop('disabled', true);
	$('ol li:gt(3) button.rateDown').prop('disabled', true);
}

function errorPage(contentElement){
	createElement(contentElement, 'h1', 'Error');
	document.title = 'Error';
	createElement(contentElement, 'p', 'Sorry, there was an error while trying to load your content. Please try again.');
	var buttons = createElement(contentElement, 'div', '', void 0, 'nav-buttons');
	var start = createElement(buttons, 'button', 'Start Again', 'start');
	$(start).bind('click', function(){
		window.location.href = 'http://localhost:8000/';
	});
}