// CONEXION WEBSOCKET

const socket = io('wss://le-18262636.bitzonte.com', {
    path: '/stocks'
});




// EVENTOS

// Emitidos por el servidor

const companies_names = [];
const valor_acciones_tiempo = [];
const companies_dict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};
const buyDict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};

socket.emit('STOCKS');
socket.on('STOCKS', (data) => {    
    for (var i in data) {
      companies_names.push(data[i].company_name)
    }

    socket.on('UPDATE', (data) => {
      x = document.getElementById('ticker');
      x.innerHTML = data.ticker;
      y = document.getElementById('value');
      y.innerHTML = data.value;
      z = document.getElementById('time');
      z.innerHTML = data.time;
      // companies_dict[data.ticker].push([data.time, data.value]);
      // dibujarGrafico(data, companies_dict);
      companies_dict[data.ticker].push([data.time, data.value]);
      if(data.ticker == "FB"){
        drawChart(companies_dict[data.ticker]);
        const obj = [{
          "key": data.ticker,
          "value":  data.value,
        }];

        var tbody = document.getElementById('tbody');
        var tr = "<tr>";
        for (var i = 0; i < obj.length; i++) {
            
        
            // /* Verification to add the last decimal 0 */
            // if (obj[i].value.toString().substring(obj[i].value.toString().indexOf('.'), obj[i].value.toString().length) < 2) 
            //     obj[i].value += "0";
        
            // /* Must not forget the $ sign */
            // tr += "<td>" + obj[0].key + "</td>" + "<td>$" + obj[i].value.toString() + "</td></tr>";
            tr = "<td>$" + obj[i].value.toString() + "</td></tr>";
        
        
            /* We add the table row to the table body */
            tbody.innerHTML = tr;
        }

      };
    } );


    socket.on('BUY', (data) => {
      buyDict[data.ticker].push(data.volume);
      if(data.ticker == "FB"){
        const obj2 = [{
          "key": data.ticker,
          "value":  data.volume,
        }];

        var tbody2 = document.getElementById('tbody2');
        var tr2 = "<tr>";
        var suma = 0;
        for (var i = 0; i < obj2.length; i++) {
            suma += obj2[i].value
            tr2 += "<td>" + obj2[0].key + "</td>" + "<td>$" +  suma.toString() + "</td></tr>";
            tbody2.innerHTML = tr2;
        }

      };
    } );

});





// function dibujarGrafico(data, companies_dict) {
//   for (var i in companies_dict) {
//     if(data.ticker in companies_dict){
//       drawChart(companies_dict[data.ticker]);
//     }
//   }
// }


function ManualSocketDisconnect() {
  socket.emit("manual-disconnection", socket.id);
  socket.close();
  console.log("Socket Closed ");
}

function ManualSocketConnect() {
  socket.emit("manual-connection", socket.id);
  socket.open();
  console.log("Socket open ");
}





google.charts.load('current', {'packages':['line']});
      //google.charts.setOnLoadCallback(drawChart);

    function drawChart(datos) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'time');
      data.addColumn('number', 'Value');


      data.addRows(
        datos
      );

      var options = {
        chart: {
          title: 'Grafico'
        },
        width: 900,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('linechart_material'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }


