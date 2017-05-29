angular.module('MyApp')
  .controller('GridCtrl', function($scope) {

	 console.log("grid controller loaded");

     $scope.coordinates = "0,0"
     $scope.gridWidth   = 20;

     

     $scope.generateGrid = function(gridX){

        window.grid = {};

         var gridX          = gridX,
             gridY          = gridX,
             halfX          = gridX / 2,
             totalLocations = gridX * gridY,
             halfGrid       = (totalLocations) / 2;

     	var randTicketsAmount = 0;
        var eventTickets = [];

		var i = 0;
     	while(i < (totalLocations)){
            eventTickets = [];
     		randTicketsAmount = Math.floor(Math.random() * 6) + 1;


     		var r = 0;
     		while(r < randTicketsAmount){
     			randPrice = (Math.floor(Math.random() * 99) + 1) + "." + (Math.floor(Math.random() * 99) + 1);
     			eventTickets.push(randPrice);
     			r++;
     		}

            var wYc = Math.ceil(i / gridX) * gridX;
            var wYf = Math.floor(i / gridX) * gridX; //i % gridX
            var yAxis = ((wYc / halfGrid) * halfX) - halfX;
            var eventCoords = {x: (i - (wYf))-halfX , y: yAxis};
            var theKey = eventCoords.x.toString() + ":" + eventCoords.y.toString();

            window.grid[theKey] = {name: theKey,eventCoords: eventCoords, tickets: eventTickets, selected: false};
            
            i++;
     	}

        $scope.grid = window.grid;
        $scope.eventBoxWidth = 100 / gridX;

     }
     $scope.generateGrid($scope.gridWidth);

    
    $scope.findNearest = function(Coords){

       var coords = {x: (parseInt(Coords.split(",")[0]) ), y: (parseInt(Coords.split(",")[1]) )}
       var coordsKey = coords.x.toString() + ":" +coords.y.toString();

       if(Math.abs(coords.x) > ($scope.gridWidth / 2) || Math.abs(coords.y) > ($scope.gridWidth / 2) ){
         return alert("those coordinates do not exist on the current map");
       }

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
          if($scope.grid[nearCoords[i]] != undefined){
            $scope.grid[nearCoords[i]].highlighted = true;
          }
       }
       

       var fourSurroundingEvents = [window.grid[nearCoords.oneUp], window.grid[nearCoords.oneDown], window.grid[nearCoords.oneLeft], window.grid[nearCoords.oneRight] ];
       console.log("fourSurroundingEvents", fourSurroundingEvents);
    
       var fiveNearestEvents = fourSurroundingEvents;
       fiveNearestEvents.push(nearestEvent);

       var i = 0;
       var cheapestLocalTickets = [];
       for(i in fiveNearestEvents){
         var theEvent = fiveNearestEvents[i];
         if(theEvent != undefined){
            var cheapestTicket = Math.min.apply(Math,theEvent.tickets);
            cheapestLocalTickets.push({eventName: theEvent.name,cheapestTicket: cheapestTicket});
         }
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
