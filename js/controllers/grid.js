angular.module('MyApp')
  .controller('GridCtrl', function($scope) {

	 console.log("grid controller loaded");

     $scope.coordinates = "0,0"

     function forIn(obj, fn, thisObj){
		  var key, i = 0;
		  for (key in obj) {
		    if (exec(fn, obj, key, thisObj) === false) {
		      break;
		    }
		  }
		  function exec(fn, obj, key, thisObj){
		    return fn.call(thisObj, obj[key], key, obj);
		  }
		  return forIn;
	  };

     var gridX = 20;
     var gridY = 20;
     window.grid = {};

     $scope.generateGrid = function(){
     	var randTicketsAmount = 0;
        var eventTickets = [];

		var i = 0;
     	while(i < (gridX * gridY)){
            eventTickets = [];
     		randTicketsAmount = Math.floor(Math.random() * 6) + 1;


     		var r = 0;
     		while(r < randTicketsAmount){
     			randPrice = (Math.floor(Math.random() * 99) + 1) + "." + (Math.floor(Math.random() * 99) + 1);
     			eventTickets.push(randPrice);
     			r++;
     		}

            // if(i >= 0 && i < 20){
            //     window.grid[i] = {x: i - 10, y: -10};
            // }
            // if(i >= 20 && i < 40){
            //     window.grid[i] = {x: i - 30, y: -9};
            // }
            var wYc = Math.ceil(i / 20) * 20;
            var wYf = Math.floor(i / 20) * 20; //i % 20
            var yAxis = ((wYc / 200) * 10) - 10;
            var eventCoords = {x: (i - (wYf))-10 , y: yAxis};
            var theKey = eventCoords.x.toString() + ":" + eventCoords.y.toString();
            console.log("theKey", theKey);

            window.grid[theKey] = {name: theKey,eventCoords: eventCoords, tickets: eventTickets, selected: false};
            
            i++;
     	}

        $scope.grid = window.grid;

     }
     $scope.generateGrid();

    
    $scope.findNearest = function(Coords){
       var coords = {x: (parseInt(Coords.split(",")[0]) ), y: (parseInt(Coords.split(",")[1]) )}
       var coordsKey = coords.x.toString() + ":" +coords.y.toString();

       console.log("using findNearest() coords", coords, "and coordsKey", coordsKey);
       
       var nearestEvent = window.grid[coordsKey];
       console.log("found event", nearestEvent);
       // Highlight event
       $scope.grid[coordsKey].selected = "event-selected";

       var nearCoords = {
           oneUp   : coords.x.toString() + ":" + (coords.y - 1).toString(),
           oneDown : coords.x.toString() + ":" + (coords.y + 1).toString(),
           oneLeft : (coords.x -1).toString() + ":" + (coords.y).toString(),
           oneRight: (coords.x +1).toString() + ":" + (coords.y).toString()
       }
       // Highlight nearest
       var i = 0;
       for(i in nearCoords){
          $scope.grid[nearCoords[i]].highlighted = true;
       }
       

       var fourSurroundingEvents = [window.grid[nearCoords.oneUp], window.grid[nearCoords.oneDown], window.grid[nearCoords.oneLeft], window.grid[nearCoords.oneRight] ];
       console.log("fourSurroundingEvents", fourSurroundingEvents);
    
       var fiveNearestEvents = fourSurroundingEvents;
       fiveNearestEvents.push(nearestEvent);

       var i = 0;
       var cheapestLocalTickets = [];
       for(i in fiveNearestEvents){
         var theEvent = fiveNearestEvents[i]
         var cheapestTicket = Math.min.apply(Math,theEvent.tickets);
         cheapestLocalTickets.push({eventName: theEvent.name,cheapestTicket: cheapestTicket})
       }
       $scope.cheapestLocalTickets = cheapestLocalTickets;
       console.log("cheapestLocalTickets", cheapestLocalTickets);
    }


   $scope.clearSearch = function(){
     console.log("reached clearSearch()");

     var i = 0;
     for(i in $scope.cheapestLocalTickets){
       var aEvent = $scope.cheapestLocalTickets[i];
       $scope.grid[aEvent.eventName].selected    = false;
       $scope.grid[aEvent.eventName].highlighted = false;
     }
     $scope.cheapestLocalTickets = [];
   }

  });
