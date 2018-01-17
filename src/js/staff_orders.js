// Waits for the HTML document to be ready and
//then calls the function getOrders() and listStock()
$(document).ready(function(){

	getOrders();
	//Displays the stock
	listStock();

	//Calls restock method
	$(".restock_btn").click(function(){
		restock();
	});

});

//Retrieves the quantity of each ingredient
function getQuantity(ingName){
	return firebase.database().ref().child('Ingredient').child(ingName).child('Quantity').once("value").then(function(quantity){
		return quantity.val();
	});
}

//Retrieves the list of all ingredients in a category
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

//Retrieve a list of ingredients, with their quantities
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

//Restocks to a minimun of 50 each ingredient
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
}

//Gets and displays all not completed orders
async function getOrders(){
	var the_order_tile= "";
	var order_list= await orderPromise();

	for (let thisOrdKey of Object.keys(order_list)){
		var status= await orderStatusPromise(thisOrdKey);
		if(status != "Complete"){
			the_order_tile += `
			<div class="col-sm-12" id="${thisOrdKey}>
			<div class="card bg-primary text-center card-form">
			<div class="card-body">`;

			//Gets customer name
			var orderCustomer = await orderCustomerPromise(thisOrdKey);
			the_order_tile += `<h3> Customer: ${orderCustomer} </h3>`;

			//Gets burgers
			var burgListSnap = await getBurgerListPromise(thisOrdKey);
			console.log(burgListSnap);
			for (let thisBurgKey of  Object.keys(burgListSnap)){

				var thisBurgSnap = await getBurgSnapPromise(thisBurgKey);

				the_order_tile += `
				<table class="table-striped table-bordered table-hover">
				<tr>
				<th>Ingredient</th>
				<th>Quantity</th>
				</tr>`;

				//We get the ingredients and loop
				var ingredients = thisBurgSnap.child("ingredientMap").val();

				for (var key in ingredients) {
					if (ingredients.hasOwnProperty(key)) {
						the_order_tile += `
						<tr>
						<td> ${key} </td>
						<td> ${ingredients[key]} </td>
						</tr>`;
					}
				}

				//We get the price
				var price = thisBurgSnap.child("Price").val();
				the_order_tile +=`
				<tr>
				<td>PRICE</td>
				<td> ${price}</td>
				</tr>
				</table>
				<hr>`;
			}

			the_order_tile += `
			<input type="button" value="FINISH ORDER" class="btn btn-outline-danger btn_start" id="${thisOrdKey}">
			</div>
			</div>
			</div>`;
		}
		else {
			console.log("Completed");
		}
	}
		the_order_tile += `
			<script>
			//Button start order
				$(".btn_start").click(function(){
					console.log("start was clicked");
					var o_key= event.target.id;
					//console.log(o_key);
					completeOrder(o_key);
					//Removes the tile
					var orderDocket = document.getElementById(o_key);
					orderDocket.parentNode.removeChild(orderDocket);
				});
			</script>`;

	console.log(the_order_tile);
	$(the_order_tile).appendTo("#order_info");
}

//Changes the status of an order to Complete
function completeOrder(orderKey) {
	firebase.database().ref().child('Order').child(orderKey).child('Status').set('Complete');
}

//Retrieves an order
function orderPromise(){
	//Two nested promises
	return firebase.database().ref().child("Ord_Burg").once("value").then(function(orderListSnap){
		console.log(orderListSnap.val());
		return orderListSnap.val();
	});
}

//Retrieves the status of an order
function orderStatusPromise (thisOrdKey){
	return firebase.database().ref().child("Order").child(thisOrdKey).child("Status").once("value").then(function(statusSnap){
		return statusSnap.val();
	});
}

//Retrieves the name of the Customer order
function orderCustomerPromise(thisOrdKey){
	return firebase.database().ref().child("Order").child(thisOrdKey).child("Customer").once("value").then(function(custSnap){
		return custName = custSnap.val();
	});
}

// Restrives a burger list from an order
function getBurgerListPromise(thisOrdKey){
	return firebase.database().ref().child("Ord_Burg").child(thisOrdKey).once("value").then(function(burgListSnap){
		return burgListSnap.val();
	});
}

//Retrieves a burger, this will let us access to the ingredients
//and quantities
function getBurgSnapPromise(thisBurgKey){
	return firebase.database().ref().child("Burger").child(thisBurgKey).once("value").then(function(thisBurgSnap){
		console.log(thisBurgKey);
		console.log(thisBurgSnap.val());
		return thisBurgSnap;
	});
}
