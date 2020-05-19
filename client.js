// CONEXION WEBSOCKET

const socket = io('wss://le-18262636.bitzonte.com', {
    path: '/stocks'
});

// Variables Globales

const companies_names = [];
const valor_acciones_tiempo = [];
const companies_dict = {};
const buyDict = {"AAPL": [], "FB": [], "SNAP": [], "IBM": [], "TWTR": []};
let todos = [];


// Funciones

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

function getUpdate() {
  socket.on('UPDATE', (data) => {

    companies_dict[data.ticker].push([data.time, data.value]);
    companies_dict [data.ticker].push([data.time, data.value]);

  
    for (var i in companies_dict ) {
      if(data.ticker == i){
        var nombre_grafico = `${data.ticker}`;
        drawChart(companies_dict [data.ticker], i, nombre_grafico);
        todos.push({
          "key": data.ticker,
          "value":  data.value,
        });
       
      };
    };
    getLastPrice(todos);    
  } );
}

function getBuy() {
  socket.on('BUY', (data) => {
    buyDict[data.ticker].push(data.volume);
    if(data.ticker == "FB"){
      const obj2 = [{
        "key": data.ticker,
        "value":  data.volume,
      }];
      getVolume(obj2)
    };
  } );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getLastPrice(diccionario) {

        
  var tbody = document.getElementById('tbody');
  var tr = "<tr>";
  for (var i = 0; i < diccionario.length; i++) {
      tr = "<td>Ultimo precio de "+diccionario[0].key+": $" + diccionario[i].value.toString() + "</td></tr>";
      tbody.innerHTML = tr;
  }

}

function getVolume(diccionario) {

  var tbody2 = document.getElementById('tbody2');
  var tr2 = "<tr>";
  var suma_volumen = 0;
  for (var i = 0; i < diccionario.length; i++) {
    suma_volumen += diccionario[i].value
      tr2 += "<td>Volumen total transado: " +diccionario[0].key + "</td>" + "<td>$" +  suma_volumen.toString() + "</td></tr>";
      tbody2.innerHTML = tr2;
        }

}

function addTableSockets(nombre, ticker, pais, id_nombre ) {
  var titulo = "<table><tr><th>Nombre</th><th>Ticker</th><th>Pais</th>";
  var informacion = "<tr><th>"+nombre+"</th><th>"+ticker+"</th><th>"+pais+"</th></table>"; 
  var html = titulo+informacion;   
  document.getElementById("infotabla").innerHTML = html;
}



// Google Charts 

google.charts.load('current', {'packages':['line']});
      //google.charts.setOnLoadCallback(drawChart);

    function drawChart(datos, id, nombre) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Tiempo');
      data.addColumn('number', 'Valor Accion');


      data.addRows(
        datos
      );

      var options = {
        chart: {
          title: 'Accion de '+nombre
        },
        width: 900,
        height: 250,
        colors: getRandomColor(),
      };

      var chart = new google.charts.Line(document.getElementById(id));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }


// MENU


function runSocket() {

  // se entregan todas las empresas listadas en la bolsa

  socket.emit('STOCKS');
  socket.on('STOCKS', (data) => {    
      for (var i = 0; i < data.length; i++) {
        companies_dict[data[i].ticker] = [];
        var grafico = document.createElement('div');
        grafico.setAttribute("id", `${data[i].ticker}`);
        acciones.appendChild(grafico);
        addTableSockets(data[i].company_name, data[i].ticker, data[i].country);
        }
  
      getUpdate();    
      getBuy();
  
  });

}

// PROGRAMA

runSocket();

