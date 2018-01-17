$(document).ready( function(){
	donate();
});

async function donate() {
  //add up all the buns and all the patties, and take the lesser of the two. That's
  //how many burgers can be created.
  //go through each category, get each ingredient, get the stock of each one
  var buns = await countCategory('Bun');
  var patties = await countCategory('Meat');
  // console.log("Number of buns returned: " + buns);
  // console.log("Number of patties returned: " + patties);
  var totalBurgers = await Math.min(buns, patties);
  alert("There are " + totalBurgers + " burgers for donation!");
	console.log(totalBurgers);
	//$(totalBurgers).appendTo('#burgernum');

  return totalBurgers;
}



async function add_DOM(){
	var totalBurgers =  await donate();
	console.log(totalBurgers);


	$(totalBurgers).appendTo("#burgernum");

}


//helper function to return quantity of a single ingredient
function promiseIngQuan(ingName){
  return firebase.database().ref().child("Ingredient").child(ingName).child("Quantity").once('value').then(function(quanSnap) {
    return quanSnap.val();
  });
}

function promiseGetCategory(category){
  //this will get a datasnapshot containing the list of ingredients in that category
  return firebase.database().ref().child("Category").child(category).once('value').then(function(listSnap) {
    return listSnap.val();
  });
}


//count total quantity of a category
async function countCategory(category){
  var listSnap = await promiseGetCategory(category);
  // console.log(listSnap);
  var runningTotal = 0;
  for (let ingName of Object.keys(listSnap)) {
    //get the name of the item
    // console.log(ingName);
    //get the quantity of that item
    var ingQuan = await promiseIngQuan(ingName);
    //then get the quantity for each item
    // console.log(ingName + " quantity: " + ingQuan);
    runningTotal += ingQuan;
    // console.log("Running total of " + category + "s: " + runningTotal);
  }
  // console.log("Return: " + runningTotal);
  return runningTotal;
}
