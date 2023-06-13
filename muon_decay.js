
var start_stop = document.getElementById("start_stop");
var my_count;
var amplitude1;
var amplitude2;
var lifetime = 2000; //  ns
var tau_pulse = 100; //  ns
var deltaT;
var deltaTime = [];
var deltaTimeHisto = new Array(100).fill(0);
var deltaTimeHisto_back_sub = new Array(100).fill(0);

var deltaTimeHistoLog = new Array(100).fill(0);
var deltaTimeHistoLog_back_sub = new Array(100).fill(0);
var Y_histogram =[];
var m; var b; var sigma_m;
var m1; var delta_m1;
var fit_type = 0;

var N_evts = 0;
var N_noise = 0;
var T_data = [];
var T_data1 = [];
var Y_fitted = [];
var T_dataHalf = [];
var T_extrap = [];
var Y_extrap = [];

for (var i =0;i<20000;i=i+200){
    T_data.push(i);
}

for (var i =0;i<10000;i=i+200){
    T_dataHalf.push(i);
}

var X_data = [];
for (var i = 0; i < 21000; i=i+8) {
    X_data.push(i);
}

var my_element = document.getElementById("my_element");
my_element.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "nearest"
});
var start_stop = document.getElementById("start_stop");

function step(){
    var rate = parseInt(document.getElementById('rate').value);
    Y_fitted = [];
   
    if (start_stop.value == "Stop"){ 
    amplitude1 = (20 + (100-20)*Math.random());
    amplitude2 = (20 + (50-20)*Math.random());
    var condition = 0;
    while (condition == 0){

    deltaT = (20000)*Math.random();
    var random_vert = Math.random()*1.1;

//    if (random_vert < .1) { N_noise ++;
//N_evts ++;
//condition = 1;
//deltaTimeHisto[ Math.floor(deltaT/200)] += 1;
//} 
//else if (random_vert < Math.exp(-deltaT/lifetime) +.1){
if (random_vert < Math.exp(-deltaT/lifetime) +.1){

//N_evts ++;
condition = 1;
//    deltaTimeHisto[ Math.floor(deltaT/200)] += 1;

}
//    < Math.exp(-deltaT/lifetime) +.1){ // total area of rectangle is 1.1*20
 //            N_evts += 1;
 //   deltaTimeHisto[ Math.floor(deltaT/200)] += 1;
 //      condition = 1;
    
}
N_evts ++;
deltaTimeHisto[ Math.floor(deltaT/200)] += 1;
if (deltaT > 10000){ N_noise +=2}


}



    draw();
if(start_stop.value == "Stop"){ 
setTimeout(function(){ //throttle requestAnimationFrame to 20fps
        
        requestAnimationFrame(step)
    }, parseInt(1000/rate))
}


}



function start(){

start_stop = document.getElementById("start_stop");
if(start_stop.value == "Stop"){   
      start_stop.value = "Start";
}
else if (start_stop.value == "Start"){
      start_stop.value = "Stop";
      step();}
}
function reset(){
    deltaTimeHisto = new Array(100).fill(0);
    N_noise = 0;
    N_evts = 0;
    step();
    
}



draw();


step();




  

function draw(){


var Y_data =[];
for (var i = 0; i < 21000; i=i+8) {
    Y_data.push(P(i));
}
for (var i = 0; i < 100; i++) {
    deltaTimeHisto_back_sub[i] = deltaTimeHisto[i]- N_noise/100;
    deltaTimeHistoLog[i] = Math.log(deltaTimeHisto[i]);
    deltaTimeHistoLog_back_sub[i] = Math.log(deltaTimeHisto[i]- N_noise/100);
}



if (document.getElementById("logscale").checked == true) { 
    if (document.getElementById("back_subtracted").checked == true) { 
        fit_type = 0;
        Y_histogram = deltaTimeHistoLog_back_sub;
        Y_fitted = [];
        for (var i =0;i<20000;i=i+200){
            Y_fitted.push(b+m*i);
        }
        var trace_noise = {};
    }
}

if (document.getElementById("logscale").checked == true) { 
    if (document.getElementById("back_subtracted").checked == false) { 
        fit_type = 1;
        Y_histogram = deltaTimeHistoLog;
        Y_fitted = [];
        for (var i =0;i<20000;i=i+200){
            Y_fitted.push(Math.log(Math.exp(b+m*i) +N_noise/100));
        }
    }
    var trace_noise = {
    x: [0,20000],
    y: [Math.log(N_noise/100),Math.log(N_noise/100)],
    mode: 'lines',
    type: 'line',
    name: 'Log(Background Noise Events / 200 ns)',
    line:{
            color: 'green',
            width: 2,
            dash:'dot'
        }
  };
} 
if (document.getElementById("logscale").checked == false) { 
    if (document.getElementById("back_subtracted").checked == true) { 
    fit_type = 2;
        Y_histogram = deltaTimeHisto_back_sub;
        Y_fitted = [];
        for (var i =0;i<20000;i=i+200){
            Y_fitted.push(Math.exp(b+m*i));
            }
        
    }
} 
if (document.getElementById("logscale").checked == false) { 
    if (document.getElementById("back_subtracted").checked == false) { 
        fit_type = 3;
        Y_fitted = [];
                for (var i =0;i<20000;i=i+200){
            Y_fitted.push(Math.exp(b+m*i)+N_noise/100);
        }
        Y_histogram = deltaTimeHisto;

        var trace_noise = {
    x: [0,20000],
    y: [N_noise/100,N_noise/100],
    mode: 'lines',
    type: 'line',
    name: 'Background Noise Events / 200 ns',

    line:{
            color: 'green',
            width: 2,
            dash:'dot'
        }
  };
    }
}
 



      var layout = {
          xaxis: {
              //   range: [0, N],
              title: "Time (ns)"
          },
          yaxis: {
                 range: [-150, 0],
              title: "Amplitude (mV)"
          },
          title: {
            text:"Muon Decay Simulation <br> Delta Time: " + (deltaT/1000).toFixed(3) +" us",
          font: {
      family: 'Times New Roman',
      size: 24
    },
}
      };
      var data = [{
          x: X_data,
          y: Y_data,
          mode: "lines+markers",
          type: 'line',
            marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.
    }
  }

    
      }];

Plotly.newPlot("plot1", data, layout);
var N_pos =0;
var y1 = deltaTimeHisto_back_sub[0]
while (y1 > 0){
    N_pos ++;
        y1 = deltaTimeHisto_back_sub[N_pos]
}




[m1,delta_m1,T_data1,Y_fitted,T_extrap,Y_extrap] = linear_regression2(T_data,deltaTimeHisto)
var trace2 = {
    x: T_data,
    y: Y_histogram,
    type: 'bar',
    name: 'Data',
marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5
    }
  }

  };

var trace_fit = {
    x: T_data1,
    y: Y_fitted,
    mode: 'lines',
    type: 'line',
    name: 'Fitted Curve',
    line:{
            color: 'black',
            width: 2,
            dash:'solid'
        }
  };
  

  

var trace_fit_extrap = {
    x: T_extrap,
    y: Y_extrap,
    mode: 'lines',
    type: 'line',
    name: 'Extrapolation of Fitted Curve',
    line:{
            color: 'blue',
            width: 2,
            dash:'dot'
        }
  };
if (m1 > 0){
    var data2 = [trace2];
}else  if  (document.getElementById("back_subtracted").checked == true) { 
    var data2 = [trace2, trace_fit,trace_fit_extrap]; 
}else { var data2 = [trace2, trace_fit,trace_fit_extrap,trace_noise]; }
//}

if (m1<0){
var layout2 = {
          xaxis: {
                 range: [-100, 20000],
              title: "Time (ns)" 
          },
          yaxis: {
                 //range: [0, -150],
              title: "Events/200 ns" 
          },
          title: {
            text:"Muon Decay Simulation " +N_evts+" Events <br> Measured Background Noise "+N_noise +" Events <br> Measured Lifetime " +(-1/m1/1000).toFixed(3) +" +- "+ (delta_m1/m1**2/1000).toFixed(3)+ " us" ,
      
font: {
      family: 'Times New Roman',
      size: 24
    },
}

      };
  }else{
var layout2 = {
          xaxis: {
                 range: [-100, 20000],
              title: "Time (ns)" 
          },
          yaxis: {
                 //range: [0, -150],
              title: "Events/200 ns" 
          },
          title: {
            text:"Muon Decay Simulation " +N_evts+" Events <br> Measured Background Noise "+N_noise +" Events" ,
      
font: {
      family: 'Times New Roman',
      size: 24
    },
}

      };
  }

Plotly.newPlot("plot2", data2,layout2);
}




  function P(t){
    var t_trig = 1000;
    
     if (t<t_trig){
    Y = 0 ;
} else if (t< t_trig+deltaT){
    Y = amplitude1 * Math.exp(-(t-t_trig)/tau_pulse) ;
} else {
        Y = amplitude1 * Math.exp(-(t-t_trig)/tau_pulse) + amplitude2 * Math.exp(-(t-t_trig-deltaT)/tau_pulse);
}
    return -Y 
}


function linear_regression(input_x, input_y) {
    var N_pos =0;
    var y1 = input_y[0]
    while (y1 > N_noise/100){
        N_pos ++;
        y1 = input_y[N_pos]
    }

    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;

    var x = 0;
    var y = 0;
    var y1 = 0;


    for (let i = 0; i< N_pos; i++) {
        x = input_x[i];
        y = Math.log(input_y[i]- N_noise/100) ;
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
    }

    var m = (N_pos*xy_sum - x_sum*y_sum) / (N_pos*xx_sum - x_sum*x_sum);
    var b = (y_sum - m*x_sum)/N_pos;
var s2y = 0;
var s2x = 0;
for (let i = 0; i< N_pos; i++) {
        x = input_x[i];
        y = Math.log(input_y[i]- N_noise/100) ;
        s2y +=  Math.pow((y - y_sum/N_pos),2);
        s2x +=  Math.pow((x - x_sum/N_pos),2);
    }


    var delta_m = Math.sqrt(s2y/(N_pos-2)/s2x);
console.log (delta_m/m)
    var results_x = [];
    var results_y = [];

    var extrapolated_x = [];
    var extrapolated_y = [];
// Data_Noise_Subtracted = Data - Noise
// Data_Noise_Subtracted_Linear = log (Data_Noise_Subtracted)
    for (let i = 0; i < N_pos; i++) {
        x = input_x[i];
        if (fit_type == 0){ // Data_Noise_Subtracted_Linear
           y = x * m + b; 
       } else if (fit_type == 1){ // Data_Noise_Subtracted_Linear

         y =  Math.log(Math.exp(x * m + b)+N_noise/100);
       }else if (fit_type == 2){

         y = Math.exp(x * m + b);
       }else if (fit_type == 3){

         y = Math.exp(x * m + b)+N_noise/100; 
       }
        
        results_x.push(x);
        results_y.push(y);
    }

    for (let i = N_pos; i < 100; i++) {
        x = input_x[i];
        if (fit_type == 0){ // Data_Noise_Subtracted_Linear
           y = x * m + b; 
       } else if (fit_type == 1){ // Data_Noise_Subtracted_Linear

         y =  Math.log(Math.exp(x * m + b)+N_noise/100);
       }else if (fit_type == 2){

         y = Math.exp(x * m + b);
       }else if (fit_type == 3){

         y = Math.exp(x * m + b)+N_noise/100; 
       }
        
        extrapolated_x.push(x);
        extrapolated_y.push(y);
    }

    return [m,delta_m,results_x, results_y,extrapolated_x,extrapolated_y];
}

function linear_regression2(input_x, input_y){

var first_bin_to_fit = parseInt(document.getElementById("bin").value)-1;
//var first_bin_to_fit = 0;
var N_pos =first_bin_to_fit;
var y1 = input_y[N_pos]
while (y1 > N_noise/100){
    N_pos ++;
    y1 = input_y[N_pos]
}
var x = [];
var y = [];
var weights = [];

for (let i = first_bin_to_fit; i< N_pos; i++) {
        x.push(input_x[i]);
        y.push(Math.log(input_y[i]- N_noise/100)) ;
        weights.push(input_y[i]- N_noise/100)
    }




// Sample data
//const x = [1, 2, 3, 4, 5]; // Independent variable
//const y = [2, 4, 6, 8, 10]; // Dependent variable
//const weights = [1, 1, 1, 1, 1]; // Weights for each data point

// Calculate weighted linear regression
const n = x.length;
let sumX = 0;
let sumY = 0;
let sumWX = 0;
let sumWY = 0;
let sumW = 0;
let sumWXX = 0;
let sumWXY = 0;

for (let i = 0; i < n; i++) {
  const weight = weights[i];
  sumX += x[i] * weight;
  sumY += y[i] * weight;
  sumWX += x[i] * weight * x[i];
  sumWY += x[i] * weight * y[i];
  sumW += weight;
}

const meanX = sumX / sumW;
const meanY = sumY / sumW;
const covXY = (sumWY - meanX * sumY) / sumW;
const varX = (sumWX - meanX * sumX) / sumW;

const m = covXY / varX;
const b = meanY - m * meanX;

// Calculate error on the slope
let sumSquaredResiduals = 0;
let sumSquaredWeights = 0;

for (let i = 0; i < n; i++) {
  const predicted = m * x[i] + b;
  const residual = y[i] - predicted;
  const squaredWeight = weights[i] * weights[i];
  
  sumSquaredResiduals += squaredWeight * residual * residual;
  sumSquaredWeights += squaredWeight;
}

const delta_m = Math.sqrt(sumSquaredResiduals / ((n - 2) * varX * sumSquaredWeights));

console.log('Slope:', m);
console.log('Intercept:', b);
console.log('Error on Slope:', delta_m);


var results_x = [];
    var results_y = [];
    var x1;
    var y1;

    var extrapolated_x = [];
    var extrapolated_y = [];
// Data_Noise_Subtracted = Data - Noise
// Data_Noise_Subtracted_Linear = log (Data_Noise_Subtracted)
    for (let i = first_bin_to_fit; i < N_pos; i++) {
        x1 = input_x[i];
        if (fit_type == 0){ // Data_Noise_Subtracted_Linear
           y1 = x1 * m + b;
       } else if (fit_type == 1){ // Data_Noise_Subtracted_Linear

         y1 =  Math.log(Math.exp(x1 * m + b)+N_noise/100);
       }else if (fit_type == 2){

         y1 = Math.exp(x1 * m + b);
       }else if (fit_type == 3){

         y1 = Math.exp(x1 * m + b)+N_noise/100;
       }

        results_x.push(x1);
        results_y.push(y1);
    }

    for (let i = N_pos; i < 100; i++) {
        x1 = input_x[i];
        if (fit_type == 0){ // Data_Noise_Subtracted_Linear
           y1 = x1 * m + b;
       } else if (fit_type == 1){ // Data_Noise_Subtracted_Linear

         y1 =  Math.log(Math.exp(x1 * m + b)+N_noise/100);
       }else if (fit_type == 2){

         y1 = Math.exp(x1 * m + b);
       }else if (fit_type == 3){

         y1 = Math.exp(x1 * m + b)+N_noise/100;
       }

        extrapolated_x.push(x1);
        extrapolated_y.push(y1);
    }

    return [m,delta_m,results_x, results_y,extrapolated_x,extrapolated_y];



//return [slope,errorOnSlope,results_x, results_y,extrapolated_x,extrapolated_y];
}

