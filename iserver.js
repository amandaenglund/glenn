var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("website"));

app.listen(3000, listening);
function listening(){
   console.log("listening . . .");
}

////////////

//IMPORTERAR JSON LISTAN
let fs = require('fs');
let path = 'lista.json';
let data = fs.readFileSync(path);
let lista = JSON.parse(data);


//Skriver ut formuläret på /getform sidan från PUG-filen
app.get('/getform', function(request, response){
   response.render('post_form');
});


//VISA GLENNLISTA
app.post('/getform/visalista', function(request, response){
   let svar = "";
   for (glenn in lista) {
      svar += "Vilken Glenn? Jo " + `${glenn}` + " Vilket betyg? Jo " + `${lista[glenn]}` + " poäng. </br>";
   }
   response.send(svar);
});


//LÄGGA TILL GLENN
app.post('/getform/result', function(request, response){
   let namn = request.body.namn
   let nummer = request.body.nummer

   if(lista[namn]){
      dontAddGlenn();
   } else {
      addGlenn();
   }

   
   function dontAddGlenn(){
      response.send('Den goa gubben '+ namn + ' FINNS redan i vår lista. Prova med en annan Glenn.');
   }

   function addGlenn(){
   //Skriver ut svaret på sidan
   response.send(`Grattis du har lagt till ${namn} i listan och gav hen ${nummer} poäng!`);
   //Gör om nummer till en int och lägger till namn+nummer i min JSON
   lista[namn] = parseInt(nummer);
   let myJSON = JSON.stringify(lista, false, 2);
   fs.writeFileSync(path, myJSON);
   }
   


   
});


//ÄNDRA GLENN
app.post('/getform/changeGlenn', function(request, response){

   let changed = request.body.namn;
   let newPoint = request.body.nummer

   if(lista[changed]){
      showResultChange();
   } else {
      showResultNoChange();
   }

   function showResultChange(){
      //Gör om nummer till en int och lägger till namn+nummer i min JSON
      lista[changed] = parseInt(newPoint);
      let myJSON = JSON.stringify(lista, false, 2);
      fs.writeFileSync(path, myJSON);
      
      var change = `Du har ändrat ${changed}'s poäng till ${newPoint}!`;
      response.send(change);
   }
   
   function showResultNoChange(){
      var noChange = 'Den goa gubben '+ changed + ' finns tyvärr INTE i vår lista. Prova med en annan Glenn.';
      response.send(noChange);
   }

});



//TA BORT GLENN
app.post('/getform/deleteglenn', function(request, response){
   
   let searched = request.body.namn;

   if(lista[searched]){
      showResultYes();
   } else {
      showResultNo();
   }

   function showResultYes(){
      delete lista[searched];
      let myJSON = JSON.stringify(lista, false, 2);
      fs.writeFileSync(path, myJSON);
      var svarJa = 'Den goa gubben '+ searched + ' har tyvärr lämnat vår lista';
      response.send(svarJa);
   }
   
   function showResultNo(){
      var svarNej = 'Den goa gubben '+ searched + ' finns tyvärr INTE i vår lista';
      response.send(svarNej);
   }
});

