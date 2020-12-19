$(document).ready(function() {
    $("#swap").on('click', function (ev) {
	    swaper();
	});
	$("#send").on('click', function (ev) {
	    go();
	});

	function swaper () {
   		var start=$("#start").val();
    	$("#start").val($("#end").val());
    	$("#end").val(start);
	}
    
    function go(){
		$('#table').hide();
		var start = $("#start").val();
		var end = $("#end").val();
		if(start == end ){
			$('#error').show();
		}else{
	    	$('#rolling').show();
			$('#error').hide();
			httpGet(start,end);
		}
	}

	function httpGet(start,end){
		var theUrl = "https://api.sncf.com/v1/coverage/sncf/journeys?from=stop_area:" + start + "&to=stop_area:" + end +"&is_journey_schedules=True&min_nb_journeys=15";
	    var token = "76291488-6a8c-4b22-899b-f9e7e1872814";
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() {
	    	if (this.readyState == 4 && this.status == 200) {
	    		var myArr = JSON.parse(this.responseText);
	    		myFunction(myArr);
	    	}
	    };
	    xmlHttp.open( "GET", theUrl, true );
	    xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(token + ":"));
	    xmlHttp.send( null );
	    return xmlHttp.responseText;
	}

	function myFunction(arr) {
		var i;
		var i2;
		var out = "";
		var img = "";
		for(i = 0; i < arr.journeys.length; i++) {
			var icon = "";
			
			var datedepart = (arr.journeys[i].departure_date_time);
			console.log(datedepart);
			date = datedepart.slice(6,8) + " / " + datedepart.slice(4, 6) + " / " + datedepart.slice(0,4);  

			heuredepart = datedepart.slice(9,11);
			minutedepart = datedepart.slice(11,13);

			var datearriver = (arr.journeys[i].arrival_date_time);

			heurearriver = datearriver.slice(9,11);
			minutearriver = datearriver.slice(11,13);

			var duration = (arr.journeys[i].duration);
			duration = duration/60;

			for ( i2 = 0; i2 < arr.journeys[i].sections.length; i2++) {


				if(typeof arr.journeys[i].sections[i2].type !== 'undefined' && arr.journeys[i].sections[i2].type == "public_transport"){
					for (i3 = 0; i3 < arr.journeys[i].sections[i2].links.length; i3++) {
						if(typeof arr.journeys[i].sections[i2].links[i3].type !== 'undefined' && arr.journeys[i].sections[i2].links[i3].type == "physical_mode"){
							switch(arr.journeys[i].sections[i2].links[i3].id){
								case 'physical_mode:Coach': img = 'Coach'; break;

								case 'physical_mode:Bus':
								case 'physical_mode:BusRapidTransit':
								case 'physical_mode:Trolleybus':
								img = 'Bus'; break;

								case 'physical_mode:RapidTransit':
								case 'physical_mode:LocalTrain':
								case 'physical_mode:LongDistanceTrain':
								case 'physical_mode:Train':
								img = 'Train'; break;

								default:
								break;
							}
							icon += '<img src="icons/'+img+'.svg" style="width: 25px;"> ';

						}
					}
				}
			}

			out += '<tr><td> '+date+' </td><td> ' + heuredepart + ':' + minutedepart + ' </td><td> '+icon+' </td><td> '+ heurearriver + ':' + minutearriver + '</td><td><img src="icons/duration.svg" style="width: 25px;"> '+ duration +'min</p></td>';
		}
		$('#rolling').hide();
		$('#table').show();
		$("tbody").html(out);
	}
});