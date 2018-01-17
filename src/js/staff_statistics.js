

//SAMPLE GRAPH
// function barGraph (){
//     //variables
//     var margin  = {top: 20, right: 20, bottom: 100, left: 60},
//         width   = 800 - margin.left - margin.right,
//         height  = 500 - margin.top - margin.bottom,
//         x       = d3.scaleBand().rangeRound([0,width]).paddingInner(0.5),
//         y       = d3.scaleLinear().range([height,0]);
//
//         //draw axis
//     var xAxis   = d3.axisBottom().scale(x).ticks(6);
//     var yAxis   = d3.axisLeft().scale(y).ticks(5);
//
//     var svg     = d3.select("#graph")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
//     d3.json("../data/burgers.json", function (data)
//     {
//         x.domain(data.map(function (d)
//         {
//             return d.name;
//         }));
//
//         y.domain([0, d3.max(data, function (d)
//         {
//             return d.stock;
//         })]);
//
//         svg.append("g")
//             .attr("class", "x axis")
//             .attr("transform", "translate(0, " + height + ")")
//             .call(xAxis)
//             .selectAll("text")
//             .style("text-anchor", "end")
//             .attr("dx", "-0.5em")
//             .attr("dy", "-.55em")
//             .attr("y", 30)
//             .attr("transform", "rotate(-45)" );
//
//         svg.append("g")
//             .attr("class", "y axis")
//             .call(yAxis)
//             .append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", 5)
//             .attr("dy", "0.8em")
//             .attr("text-anchor", "end")
//             .text("Stock");
//
//         svg.selectAll("bar")
//             .data(data)
//             .enter()
//             .append("rect")
//             .style("fill", "white")
//             .attr("x", function(d)
//             {
//                 return x(d.name);
//             })
//             .attr("width", x.bandwidth())
//             .attr("y", function (d)
//             {
//                 return y(d.stock);
//             })
//             .attr("height", function (d)
//             {
//                 return height - y(d.stock);
//             })
//             .on("mouseover", function ()
//             {
//                 tooltip.style("display", null);
//             })
//             .on("mouseout", function ()
//             {
//                 tooltip.style("display", "none");
//             })
//             .on("mousemove", function (d)
//             {
//                 var xPos    = d3.mouse(this)[0] - 55;
//                 var yPos    = d3.mouse(this)[1] - 55;
//                 tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
//                 tooltip.select("text").text("Name: " + d.name + " : Stock: " + d.stock);
//             });
//
//         var tooltip     = svg.append("g")
//             .attr("class", "tooltip")
//             .style("display", "none");
//
//         tooltip.append("text")
//             .attr("x", 15)
//             .attr("dy", "1.2em")
//             .style("text-anchor", "middle")
//             .attr("font-size", "1.5em")
//             .attr("font-weight", "bold");
//     })
// }
// Waits for the document to be ready
$(document).ready(function(){
	barGraph();
	drawTable();

});

async function drawTable(){

  var totalBurger = await getBurgTotal();
  var ordersTotal= await getOrdTotal();
  var averageBurg= await getAvBurg();


  var table = `
  <table class="table-striped table-bordered table-hover">

  <tr>
  <td>TOTAL OF BURGERS</td>
  <td> ${totalBurger}</td>
  </tr>
  <tr>
  <td>TOTAL OF ORDERS</td>
  <td> ${ordersTotal}</td>
  </tr>
  <tr>
  <td>AVERAGE ORDERS PER BURGER</td>
  <td> ${averageBurg}</td>
  </tr>
  </table>`;

  $(table).appendTo('#stats_table');
}

async function barGraph (){
  //variables
  var margin  = {top: 20, right: 20, bottom: 100, left: 60},
  width   = 800 - margin.left - margin.right,
  height  = 500 - margin.top - margin.bottom,
  x       = d3.scaleBand().rangeRound([0,width]).paddingInner(0.5),
  y       = d3.scaleLinear().range([height,0]);

  //draw axis
  var xAxis   = d3.axisBottom().scale(x).ticks(6);
  var yAxis   = d3.axisLeft().scale(y).ticks(5);

  var svg     = d3.select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data=JSON.parse(await getAllCategoriesJSON());

  x.domain(data.map(function (d)
  {
    return d.name;
  }));

  y.domain([0, d3.max(data, function (d)
    {
      return d.stock;
    })]);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "-.55em")
    .attr("y", 30)
    .attr("transform", "rotate(-45)" );

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", "0.8em")
    .attr("text-anchor", "end")
    .text("Stock");

    svg.selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "white")
    .attr("x", function(d)
    {
      return x(d.name);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d)
    {
      return y(d.stock);
    })
    .attr("height", function (d)
    {
      return height - y(d.stock);
    })
    .on("mouseover", function ()
    {
      tooltip.style("display", null);
    })
    .on("mouseout", function ()
    {
      tooltip.style("display", "none");
    })
    .on("mousemove", function (d)
    {
      var xPos    = d3.mouse(this)[0] - 55;
      var yPos    = d3.mouse(this)[1] - 55;
      tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
      tooltip.select("text").text("Name: " + d.name + " : Stock: " + d.stock);
    });

    var tooltip     = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "1.5em")
    .attr("font-weight", "bold");

  }

//return all categories and quantities in JSON format
async function getAllCategoriesJSON(){
  var buns = await countCategory('Bun');
  var patties = await countCategory('Meat');
  var cheese = await countCategory('Cheese');
  var salad = await countCategory('Salad');
  var sauce = await countCategory('Sauce');
  var str = "";
  str += "{\"name\": \"Buns\", \"stock\":\"" + buns +"\"},";
  str += "{\"name\": \"Patties\", \"stock\":\"" + patties +"\"},";
  str += "{\"name\": \"Cheese\", \"stock\":\"" + cheese +"\"},";
  str += "{\"name\": \"Salad\", \"stock\":\"" + salad +"\"},";
  str += "{\"name\": \"Sauce\", \"stock\":\"" + sauce +"\"}";

  console.log(str);

  return str;
}

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
//helper function to return quantity of a single ingredient
function promiseIngQuan(ingName){
  return firebase.database().ref().child("Ingredient").child(ingName).child("Quantity").once('value').then(function(quanSnap) {
    return quanSnap.val();
  });
}

//helper function to return a list of ingredients in a category
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

//get total number of burgers ordered
function getBurgTotal(){
  return firebase.database().ref().child('Burger').once('value').then(function(snapshot) {
    //numbers of burgers
    return snapshot.numChildren();
  });
}

//get total number of orders
function getOrdTotal(){
  return firebase.database().ref().child('Ord_Burg').once('value').then(function(snapshot) {
    //console.log(snapshot.numChildren());
    //number of orders
    return snapshot.numChildren();
  });
}

//gets the average number of burgers per order
async function getAvBurg(){
  //get children from Ord_Burg
  var orders = await getOrdTotal();
  //then total burgers
  var burgers = await getBurgTotal();

  var average = (orders/burgers);
  //console.log(average);
  //average number of burgers per order
  return average;
}
