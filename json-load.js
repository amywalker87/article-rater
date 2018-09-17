var articleArray = [1,2,3,4,5];
var articleTitles = [];
var currentArticle = 0;
var elements = {heading: 'h2', paragraph: 'p', image: 'img', list: 'ul', ordered: 'ol'};

articleArray.sort(function(){return 0.5 - Math.random()});

$(document).ready(function(){
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
});

$(document).on('click','#next', function(){
	currentArticle++;
	clearPage(document.querySelector('.content'));
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
})

$(document).on('click','#previous', function(){
	currentArticle--;
	clearPage(document.querySelector('.content'));
	loadArticle(articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
})

$(document).on('click','#rate', function(){
	clearPage(document.querySelector('.content'));
	loadRater(articleArray);
})

$(document).on('click','.rateUp', function(){
	var current = $(this).closest('li')
	var previous = current.prev('li');
	if(previous.length !== 0){
		current.insertBefore(previous);
	}
	$('ol li:lt(1) button.rateUp').prop('disabled',true);
	$('ol li:gt(0) button.rateUp').prop('disabled',false);
	$('ol li:gt(3) button.rateDown').prop('disabled',true);
	$('ol li:lt(4) button.rateDown').prop('disabled',false);
});

$(document).on('click','.rateDown', function(){
	var current = $(this).closest('li')
	var next = current.next('li');
	if(next.length !== 0){
		current.insertAfter(next);
	}
	$('ol li:lt(1) button.rateUp').prop('disabled',true);
	$('ol li:gt(0) button.rateUp').prop('disabled',false);
	$('ol li:gt(3) button.rateDown').prop('disabled',true);
	$('ol li:lt(4) button.rateDown').prop('disabled',false);
});

$(document).on('click','#submit', function(){
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
		success: function( message ){
			// add success
		},
		error: function( message ){
			// add error
		}
	})
});

function loadArticle(previous, current, next){
	$.getJSON('api/article/get.php?id='+current, function(article){
		article = JSON.parse(article.message);
		var contentElement = document.querySelector('.content');

		var h1 = document.createElement('h1');
		h1.textContent = article.title;
		contentElement.appendChild(h1);
		document.title = article.title;
		articleTitles[current] = article.title;

		var bodyDiv = document.createElement('div');
		bodyDiv.className = 'article-body';
		contentElement.appendChild(bodyDiv);

		for(var element in article.body){
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
				for(var list in article.body[element].model.items){
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
		contentElement.appendChild(buttons);
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
		else{
			var rateButton = document.createElement('button');
			rateButton.textContent = 'Rate Articles';
			rateButton.id = 'rate';
			buttons.appendChild(rateButton);
		}
	});
}

function loadRater(articleArray){
	var contentElement = document.querySelector('.content');

	var h1 = document.createElement('h1');
	h1.textContent = 'Rate the articles';
	contentElement.appendChild(h1);
	document.title = h1.textContent;

	var p = document.createElement('p');
	p.textContent = 'Please rate the articles you have just read in order of preference, with the highest rated article at the top and the lowest rated article at the bottom';
	contentElement.appendChild(p);

	var ol = document.createElement('ol');
	contentElement.appendChild(ol);
	for(var article in articleArray){
		var li = document.createElement('li');
		li.textContent = articleTitles[articleArray[article]];
		li.className = 'articleRateBox';
		li.id = articleArray[article];
		ol.appendChild(li);
		var span = document.createElement('span');
		span.className = 'pull-right';
		li.appendChild(span);
		var buttonUp = document.createElement('button');
		buttonUp.textContent = 'Up';
		buttonUp.className = 'rateUp';
		span.appendChild(buttonUp);
		var buttonDown = document.createElement('button');
		buttonDown.textContent = 'Down';
		buttonDown.className = 'rateDown';
		span.appendChild(buttonDown);
	}
	$('ol li:lt(1) button.rateUp').prop('disabled',true);
	$('ol li:gt(3) button.rateDown').prop('disabled',true);
	var buttons = document.createElement('div');
	buttons.className = 'nav-buttons';
	contentElement.appendChild(buttons);
	var subButton = document.createElement('button');
	subButton.textContent = 'Submit Ratings';
	subButton.id = 'submit';
	buttons.appendChild(subButton);
}

function clearPage(contentElement){
	while(contentElement.firstChild){
		contentElement.removeChild(contentElement.firstChild);
	}
}