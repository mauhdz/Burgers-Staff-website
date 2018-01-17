// Waits for the document to be ready
$(document).ready(function(){

	listStock();

	//Calls restock method
	$(".restock_btn").click(function(){
		restock();
	});

});


function getQuantity(ingName){
	return firebase.database().ref().child('Ingredient').child(ingName).child('Quantity').once("value").then(function(quantity){
		return quantity.val();
	});
}
//retrieves the list of all ingredients in a category
function promiseListCat(selectCat) {
	return firebase.database().ref().child('Category').child(selectCat).once('value').then(function(snapshot){
		var catList = snapshot.val();
		console.log(catList);
		var ingList = [];
		for (var key in catList) {
			if (catList.hasOwnProperty(key)) {
				ingList.push(key);
			}
		}
		return ingList;
	});
}
//retrieve a list of ingredients, with their quantities
async function listStock() {
	var categories = ["Bun", "Cheese", "Meat", "Salad", "Sauce"];
	var stockList = new Map;
	var table = "";

	for (i = 0; i < categories.length ; i++) {

		var ingList = await promiseListCat(categories[i]);
		// database.ref().child('Ingredient').on('value', function(snapshot){
		// 	//this will get the list of ingredients. Now create a map that matches their names to their prices.
		// 	//first get the ingredients.
		// 	var ingList = snapshot.val();
		console.log(ingList);
		table += `
			<tr>
			<th colspan ="2" style="color:white;background-color:grey;">${categories[i]}</th>
			</tr>
			<tr>
			<th>Item</th>
			<th>Quantity</th>
			</tr>`;

		//then go through them and retrieve their key and the child at 'Quantity'.
		for (j = 0; j < ingList.length ; j++) {
			var key = ingList[j];
			//find the quantity of this particular key, by getting the child of the key (quan and price) and then quan
			var quan = await getQuantity(key);
			console.log(key + ", " + quan);
			table+=`
			<tr>
			<td>${key}</td>
			<td>${quan}</td>
			</tr>`;

			//   	console.log(quan);
			stockList.set(key, quan);

		}

	}
	console.log(stockList);
	console.log(table);
	$(table).appendTo('.stocklist_table');
}



function restock(){
	//top up all ingredients to 200.
	//first step: get all the ingredients and their quantities. Asynchronicity is a pain, since I've already done this.
	//but I can't see a way to do it without copying code.
	firebase.database().ref().child('Ingredient').on('value', function(snapshot){
		//this will get the list of ingredients. Now create a map that matches their names to their prices.
		//first get the ingredients.
		var ingList = snapshot.val();
		var map = new Map;
		var restockMin = 50;
		//then go through them and retrieve their key and the child at 'Quantity'.
		for (var key in ingList) {
			if (ingList.hasOwnProperty(key)) {
				//find the quantity of this particular key, by getting the child of the key (quan and price) and then quan
				var quan = snapshot.child(key).child('Quantity').val();
				console.log(quan);
				//check if the quantity is low
				if(quan < restockMin){
					firebase.database().ref().child('Ingredient').child(key).child('Quantity').set(restockMin);
				}
			}
		}
	});
	console.log("res");
}
