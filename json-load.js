var articleArray = [1,2,3,4,5];
var articleTitles = [];
var currentArticle = 0;
var elements = {heading: 'h2', paragraph: 'p', image: 'img', list: 'ul', ordered: 'ol'};

articleArray.sort(function(){return 0.5 - Math.random()});

$(document).ready(function(){
	var contentElement = document.querySelector('.content');
	loadArticle(contentElement,articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
});

function loadArticle(contentElement,previous, current, next){
	$.getJSON('api/article/get.php?id='+current, function(article){
		article = JSON.parse(article.message);

		createElement(contentElement,'h1',article.title);
		document.title = article.title;
		articleTitles[current] = article.title;

		var bodyDiv = createElement(contentElement,'div','',void 0,'article-body');

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
		var buttons = createElement(contentElement,'div','',void 0,'nav-buttons');
		if(previous){
			createElement(buttons,'button','Previous Article','previous');
			$('#previous').bind('click',function(){
				currentArticle--;
				clearPage(contentElement);
				loadArticle(contentElement,articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
			});
		}
		if(next){
			createElement(buttons,'button','Next Article','next');
			$('#next').bind('click',function(){
				currentArticle++;
				clearPage(contentElement);
				loadArticle(contentElement,articleArray[currentArticle - 1], articleArray[currentArticle], articleArray[currentArticle + 1]);
			});
		}
		else{
			createElement(buttons,'button','Rate Articles','rate');
			$('#rate').bind('click',function(){
				clearPage(contentElement);
				loadRater(contentElement,articleArray);
			});
		}
	});
}

function loadRater(contentElement,articleArray){
	createElement(contentElement,'h1','Rate the articles');
	document.title = 'Rate the articles';

	createElement(contentElement,'p','Please rate the articles you have just read in order of preference, with the highest rated article at the top and the lowest rated article at the bottom.');

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
		createElement(span,'button','Up',void 0,'rateUp');
		createElement(span,'button','Down',void 0,'rateDown');
	}
	$('ol li:lt(1) button.rateUp').prop('disabled',true);
	$('ol li:gt(3) button.rateDown').prop('disabled',true);
	$('.rateUp').bind('click',function(){
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
	$('.rateDown').bind('click',function(){
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
	var buttons = createElement(contentElement,'div','',void 0,'nav-buttons');
	createElement(buttons,'button','Submit Ratings','submit');

	$('#submit').bind('click',function(){
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
				clearPage(document.querySelector('.content'));
				loadSuccess(contentElement);
			},
			error: function( message ){
				alert('There was an error submitting, please try again');
			}
		});
	});
}

function loadSuccess(contentElement){
	createElement(contentElement,'h1','Rating submission successful');
	document.title = 'Rating submission successful';

	createElement(contentElement,'p','Thank you, your article ratings have been submitted.');

	var buttons = createElement(contentElement,'div','',void 0,'nav-buttons');
	createElement(buttons,'button','Start Again','start');

	$('#start').bind('click',function(){
		window.location.href = 'http://localhost:8000/';
	});
}

function createElement(parentElement,elementType,textContent,id,className,){
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
	parentElement.appendChild(newElement);
	return newElement;
}

function clearPage(contentElement){
	while(contentElement.firstChild){
		contentElement.removeChild(contentElement.firstChild);
	}
}