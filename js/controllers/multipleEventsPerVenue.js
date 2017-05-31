angular.module('MyApp')
  .controller('GridCtrl', function($scope) {

	 console.log("grid controller loaded");

     $scope.coordinates = "0,0"
     $scope.gridWidth   = 20;
     $scope.manhattanDistanceToSearch = 1;

     

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
            
		    venueEvents  = {};
            eventTickets = [];
     		randTicketsAmount = Math.floor(Math.random() * 6) + 1;
     		randomNumOfEvents = Math.floor(Math.random() * 10) + 1;

            var e = 0;
            
            while(e < randomNumOfEvents){

            	var randomBand = window.bandsList[Math.floor(Math.random() * 59) + 1];

            	var r = 0;
	            while(r < randTicketsAmount){
	     			randPrice = (Math.floor(Math.random() * 99) + 1) + "." + (Math.floor(Math.random() * 99) + 1);
	     			eventTickets.push(randPrice);
	     			r++;
	     		}
	     		venueEvents[randomBand] = eventTickets;
            	e++;
            }
     		


            var wYc = Math.ceil(i / gridX) * gridX;
            var wYf = Math.floor(i / gridX) * gridX; //i % gridX
            var yAxis = ((wYc / halfGrid) * halfX) - halfX;
            var eventCoords = {x: (i - (wYf))-halfX , y: yAxis};
            var theKey = eventCoords.x.toString() + ":" + eventCoords.y.toString();

            window.grid[theKey] = {name: theKey,eventCoords: eventCoords, venueEvents: venueEvents, selected: false};
            
            i++;
     	}

        $scope.grid = window.grid;
        $scope.eventBoxWidth = 100 / gridX;

     }
     $scope.generateGrid($scope.gridWidth);

    
    $scope.findNearest = function(Coords){
      $scope.clearSearch(); // clear any previous search.
      console.log("coords", Coords);
      $scope.coordinates = Coords; // set the textinput to the coordinates (incase selected from grid)

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
       var distance = parseInt($scope.manhattanDistanceToSearch);
       console.log("distance", distance);

       var step = distance;
       var nearCoords = [];


       var checkUniqueCoord = function(Coords){
          if(nearCoords.indexOf(Coords) == -1){
            nearCoords.push(Coords);
          }
       }

       while(step > 0){
         var i = 0;
         while(i < step){

           checkUniqueCoord((coords.x -i).toString() + ":" + (coords.y + i).toString());
           checkUniqueCoord((coords.x -i).toString() + ":" + (coords.y - i).toString());
           checkUniqueCoord((coords.x +i).toString() + ":" + (coords.y - i).toString());
           checkUniqueCoord((coords.x +i).toString() + ":" + (coords.y + i).toString());

           checkUniqueCoord((coords.x -i).toString() + ":" + (coords.y + step).toString());
           checkUniqueCoord((coords.x -i).toString() + ":" + (coords.y - step).toString());
           checkUniqueCoord((coords.x +i).toString() + ":" + (coords.y - step).toString());
           checkUniqueCoord((coords.x +i).toString() + ":" + (coords.y + step).toString());

           checkUniqueCoord((coords.x -step).toString() + ":" + (coords.y + i).toString());
           checkUniqueCoord((coords.x -step).toString() + ":" + (coords.y - i).toString());
           checkUniqueCoord((coords.x +step).toString() + ":" + (coords.y - i).toString());
           checkUniqueCoord((coords.x +step).toString() + ":" + (coords.y + i).toString());
          i++;
         }
         step--;
       }


      console.log("nearCoords", nearCoords);

       // Highlight nearest
       var i = 0;
       for(i in nearCoords){
          if($scope.grid[nearCoords[i]] != undefined){
            $scope.grid[nearCoords[i]].highlighted = true;
          }
       }
       

       var fourSurroundingEvents = nearCoords;
       console.log("fourSurroundingEvents", fourSurroundingEvents);
    
       var fiveNearestEvents = fourSurroundingEvents;
       //fiveNearestEvents.push(nearestEvent);

       var lowestTicketPerBand = {};

       var i = 0;
       var cheapestLocalTickets = [];
       for(i in nearCoords){
         var theVenue = $scope.grid[nearCoords[i]];
         console.log(nearCoords[i]);
         if(theVenue != undefined){
            console.log("theVenue", theVenue);
            var e = 0;
            $.each(theVenue.venueEvents, function(bandName,f){
                var EventTickets   =  theVenue.venueEvents[bandName];
                var cheapestTicket = Math.min.apply(Math,EventTickets);

            	console.log('EventTickets', bandName, EventTickets);
            	if(lowestTicketPerBand[bandName] == undefined  || cheapestTicket < lowestTicketPerBand[bandName]){
            		lowestTicketPerBand[bandName] = {cheapest: cheapestTicket, location: nearCoords[i]};
            	}
            	e++;
            })
            //for(e in theVenue.venueEvents){
            	
            //}
            //e++;
         }
       }
       $scope.lowestTicketPerBand = lowestTicketPerBand;
       console.log("lowestTicketPerBand", lowestTicketPerBand);
    }


   $scope.clearSearch = function(){
     console.log("reached clearSearch()");

     var i = 0;
     for(i in $scope.cheapestLocalTickets){
       var aEvent = $scope.cheapestLocalTickets[i];
       $scope.grid[aEvent.name].selected    = false;
       $scope.grid[aEvent.name].highlighted = false;
     }
     $scope.cheapestLocalTickets = [];
   }

  });
