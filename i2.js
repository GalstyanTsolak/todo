var todoList = [];
var $ul, filterAll, filterIncomplete,filterCompleted;
const ApiUrl = 'http://todo-backend-express.herokuapp.com/';
// DELETE method /
// https://github.com/dtao/todo-backend-express 
function renderList() {
	var html = '';
	for(var i=0; i<todoList.length; i++) {
		if(ACTIVE_FILTER === FILTER_TYPES.ALL) {
			html += getLi(i); 
		}
		if(ACTIVE_FILTER === FILTER_TYPES.Incomplete) {
			if(todoList[i].completed === false) {
				html += getLi(i); 
			}
		}
		if(ACTIVE_FILTER === FILTER_TYPES.Completed) {
			if(todoList[i].completed === true) {
				html += getLi(i); 
			}
		}
	}
	$ul.html(html);
	updateCount();
}
function getLi(i){
	return '<li data-id="' + todoList[i].id + '" complet= "' + todoList[i].completed+'"> ' + getCheckbox(todoList[i].completed) 
								+ ' ' + todoList[i].title + '<div class="checkmark"></div>' 
										+ '<span class="remove-todo">X</span></li>' + '<hr />';
}
function updateCount() {
	var count = 0;
	for(var i=0; i<todoList.length;i++) {
		if(todoList[i].completed) {
			count++;
		}
	}
	filterAll.innerHTML = todoList.length;
	filterIncomplete.innerHTML = todoList.length - count;
	filterCompleted.innerHTML = count;
}

function getCheckbox(state) {
	if(state) {
		return '<input type="checkbox" checked/>';
	}
	return  '<input type="checkbox" />';
}

function handleClick(event) {
	var target = event.target;
	if(target.tagName === 'LI') {
		var id = parseInt($(target).attr('data-id'), 10);
		var data;
		if($(target).attr('complet')==="false"){
			data = {completed: true}
		}
		else{
			data = {completed: false}
		}
		
		$.ajax({
		  type: "PATCH",
		  url: ApiUrl + id,
		  data: JSON.stringify(data),	  
		  contentType: 'application/json'
		}).done(function(data){
			loadData();	
		})
	} 
	if(target.tagName === 'SPAN') {
		deleteTodo(target);
	}
	
}

function deleteTodo(target) {
		var id = parseInt($(target).parent().attr('data-id'), 10);
		$.ajax({
		  type: "DELETE",
		  url: ApiUrl + id,
		  contentType: 'application/json'
		}).done(function(data){
			loadData();	
		});
}




function handleSubmit(event) {
	event.preventDefault();
	var input = document.getElementById("todoText");
	if(input.value){
		var newItem = {
			title: input.value,
			order: 0
		}
		$.ajax({
		  type: "POST",
		  url: ApiUrl,
		  data: JSON.stringify(newItem),	  
		  contentType: 'application/json'
		}).done(function(data){
			input.value = "";
			loadData();
		}).fail(function() {
		alert( "error" );
	  });
	}
	else{
		alert("Text is empty!!");
	}
	 

	
}

function clearAllTasks() {
	if(confirm("Are you sure???")){
		$.ajax({
			type: "DELETE",
			url: ApiUrl,	  
			contentType: 'application/json'
		  }).done(function(data){
			  loadData();
		  })
	}

}

function init() {
	$ul = $('#todoListUl');
	filterAll = $("#filterAllTasks span")[0];
	filterIncomplete = $("#filterIncompleteTasks span")[0];
	filterCompleted = $("#filterCompleted span")[0];
	loadData();
	$($ul).click(handleClick);
	$('#btnSubmit').click(handleSubmit);	
	$("#clearAllTasks").click(clearAllTasks);
}

function loadData() {
	$.get(ApiUrl).then(function(data){	
		data.forEach((item)=>{
			item.id = +item.url.split("/")[3];
		});
		todoList = data;
		renderList();
	});
}

var FILTER_TYPES = {
	"ALL": "ALL",
	"Incomplete": "Incomplete",
	"Completed": "Completed"
}
var ACTIVE_FILTER = FILTER_TYPES.ALL;

function filterTodo(type) {
	if(type === FILTER_TYPES.ALL) {
		ACTIVE_FILTER = FILTER_TYPES.ALL;
	}
	if(type === FILTER_TYPES.Incomplete) {
		ACTIVE_FILTER = FILTER_TYPES.Incomplete;
	}
	if(type === FILTER_TYPES.Completed) {
		ACTIVE_FILTER = FILTER_TYPES.Completed;
	}
	renderList();
}

$(document).ready(init);


