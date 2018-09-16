var articleArray = [1,2,3,4,5];
var randomIndex = Math.ceil(Math.random() * articleArray.length);

$(document).ready(loadArticle(randomIndex));

function loadArticle(id){
	$.getJSON('api/article/get.php?id='+id, function(article){
		article = JSON.parse(article.message);
		var articleElement = document.querySelector('.article');

		var h1 = document.createElement('h1');
		h1.textContent = article.title;
		h1.className = 'bg-primary text-white';
		articleElement.appendChild(h1);

		var bodyDiv = document.createElement('div');
		bodyDiv.className = 'article-body';
		articleElement.appendChild(bodyDiv);

        for (var element in article.body){
        	if(article.body[element].type == 'heading'){
        		var h2 = document.createElement('h2');
        		h2.textContent = article.body[element].model.text;
        		bodyDiv.appendChild(h2);
        	}
        	else if(article.body[element].type == 'paragraph'){
        		var p = document.createElement('p');
        		p.textContent = article.body[element].model.text;
        		bodyDiv.appendChild(p);
        	}
        	else if(article.body[element].type == 'image'){
        		var img = document.createElement('img');
        		img.className = 'img-fluid mx-auto d-block shadow-sm p-2 mb-3';
        		img.src = article.body[element].model.url;
        		img.alt = article.body[element].model.altText;
        		img.height = article.body[element].model.height;
        		img.width = article.body[element].model.width;
        		bodyDiv.appendChild(img);
        	}
        	else if(article.body[element].type == 'list'){
        		var li = document.createElement('ol');
        		if(article.body[element].model.type == 'unordered'){
        			li = document.createElement('ul');
        		}
    			for (var list in article.body[element].model.items){
    				var li2 = document.createElement('li');
    				li2.textContent = article.body[element].model.items[list];
    				li.appendChild(li2);
    			}
    			bodyDiv.appendChild(li);
        	}
        }
    });
}