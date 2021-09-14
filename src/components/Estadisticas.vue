<template>
    <v-layout align-start>
        <v-flex>
        <v-toolbar flat color="white">
            <v-toolbar-title>Reportes</v-toolbar-title>
             <v-spacer></v-spacer>
            <v-flex xs5 sm5 md5 lg5 xl5>
                <v-autocomplete :items="reportes" v-model="tiporeporte" @change="mostrarReporte()"  label="Escoja un tipo de reporte:"></v-autocomplete>
            </v-flex>
        </v-toolbar>
        <v-container grid-list-sm class="pa-4 white" v-if="banderaRV">
            <v-layout row wrap>
                  <v-toolbar-title>Reportes de ventas</v-toolbar-title>
                   <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
                     <v-flex xs3 sm3 md3 lg3 xl3>
                       <v-checkbox
                            v-model="checkboxRV"
                            label="Linea de tiempo"
                            @change="limpiarGrafica()"
                        ></v-checkbox>
                    </v-flex>
                    <v-flex xs4 sm4 md4 lg4 xl4>
                      <v-autocomplete :items="anios" v-model="anio" label="Escoja un año"></v-autocomplete>
                    </v-flex>
                  <v-flex xs4 sm4 md4 lg4 xl4>
                      <v-autocomplete :items="Meses" v-model="mes" label="Escoja un mes"></v-autocomplete>
                    </v-flex>
                    <v-flex xs2 sm2 md2 lg2 xl2>
                       <v-btn class="success" @click="graficarVentasXfarmacia()">
                        <v-icon dark>analytics</v-icon>
                        </v-btn>
                    </v-flex>
                  <v-flex xs12 sm12 md12>
                    <div class="ct-chart">
                    <canvas id="graficoVentasFarmacias">

                    </canvas>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
         <v-container grid-list-sm class="pa-4 white" v-if="banderaRP">
            <v-layout row wrap>
                  <v-toolbar-title>Reportes de productos</v-toolbar-title>
                   <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
                     <v-flex xs3 sm3 md3 lg3 xl3>
                       <v-checkbox
                            v-model="checkboxRP"
                            label="Linea de tiempo"
                           
                        ></v-checkbox>
                    </v-flex>
                    <v-flex xs3 sm3 md3 lg3 xl3>
                      <v-autocomplete :items="anios" v-model="anio" label="Escoja un año"></v-autocomplete>
                    </v-flex>
                  <v-flex xs3 sm3 md3 lg3 xl3>
                      <v-autocomplete :items="Meses" v-model="mes" label="Escoja un mes"></v-autocomplete>
                    </v-flex>
                     <v-flex xs2 sm2 md2 lg2 xl2>
                      <v-text-field v-model="limite" label="Defina el limite de ventas"></v-text-field>
                    </v-flex>
                    <v-flex xs2 sm2 md2 lg2 xl2>
                       <v-btn class="success" @click="graficarVentasXProducto(limite,anio,mes)">
                        <v-icon dark>analytics</v-icon>
                        </v-btn>
                    </v-flex>
                  <v-flex xs12 sm12 md12>
                    <div class="ct-chart">
                    <canvas id="graficoVentasProducto">

                    </canvas>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js'
import moment from "moment"
import Swal from 'sweetalert2'

export default {
    data(){
        return{
            limite:0,
            checkboxRV:false,
            checkboxRP:false,
            reportes:["REPORTE DE VENTAS","REPORTE DE PRODUCTOS"],
            tiporeporte:"",
            banderaRV:0,
            banderaRP:0,
            totalesP:[],
            mesesP:[],
            totales:[],
            meses:[],
            Meses:[
                {text:'ENERO',value:1},
                 {text:'FEBRERO',value:2},
                  {text:'MARZO',value:3},
                   {text:'ABRIL',value:4},
                    {text:'MAYO',value:5},
                     {text:'JUNIO',value:6},
                      {text:'JULIO',value:7},
                       {text:'AGOSTO',value:8},
                        {text:'SEPTIEMBRE',value:9},
                         {text:'OCTUBRE',value:10},
                          {text:'NOVIEMBRE',value:11},
                           {text:'DICIEMBRE',value:12},
            ],
            mes:"",
            anios:[
                      {text:'2021'},
                       {text:'2022'},
                        {text:'2023'},
                         {text:'2024'},
                          {text:'2025'},
                           {text:'2026'},
            ],
            anio:''
        }
       
    },
    methods:{
        limpiarGrafica(){
            if(this.checkboxRV==true){
               
            }else{
                this.meses=[]
                this.totales=[]
            }
        },
        mostrarReporte(){
            if(this.tiporeporte=="REPORTE DE VENTAS"){
                this.banderaRV=1 
            }else if(this.tiporeporte=="REPORTE DE PRODUCTOS"){
                this.banderaRP=1
            }
        },
        graficarVentasXfarmacia(){
            this.totales=[]
            this.meses=[]
              var ctx
                var myChart
                              ctx = document.getElementById('graficoVentasFarmacias');
            let codef = this.$store.state.usuario.codigoFarmacia;
            let me=this;
            let datosagraficar=[]
             let mesn='';
            let header={"Token":this.$store.state.token};
            let configuracion = {headers:header};
             axios.get('estadisticas/ventas',configuracion)
                        .then(function (response){
                       
                       if(response.status==200){
                            datosagraficar=response.data
                            datosagraficar.map(function(x) {
                                
                                if(me.checkboxRV){
                                            switch (parseInt(x._id.mes)) {
                                            case 1:
                                            mesn='Enero';
                                            break;
                                            case 2:
                                            mesn='Febrero';
                                            break;
                                            case 3:
                                            mesn='Marzo';
                                            break;
                                            case 4:
                                            mesn='Abril';
                                            break;
                                            case 5:
                                            mesn='Mayo';
                                            break;
                                            case 6:
                                            mesn='Junio';
                                            break;
                                            case 7:
                                            mesn='Julio';
                                            break;
                                            case 8:
                                            mesn='Agosto';
                                            break;
                                            case 9:
                                            mesn='Septiembre';
                                            break;
                                            case 10:
                                            mesn='Octubre';
                                            break;
                                            case 11:
                                            mesn='Noviembre';
                                            break;
                                            case 12:
                                            mesn='Diciembre';
                                            break;
                                                            
                                        
                                            default:
                                            mesn='Error';
                                             }

                                        me.meses.push(x._id.codigoFarmacia.descripcion+'-'+mesn+'/'+x._id.year)
                                        me.totales.push(x.total)

                                }else{
                                      
                                    if(me.anio==x._id.year && me.mes==x._id.mes){
                                        switch (parseInt(x._id.mes)) {
                                            case 1:
                                            mesn='Enero';
                                            break;
                                            case 2:
                                            mesn='Febrero';
                                            break;
                                            case 3:
                                            mesn='Marzo';
                                            break;
                                            case 4:
                                            mesn='Abril';
                                            break;
                                            case 5:
                                            mesn='Mayo';
                                            break;
                                            case 6:
                                            mesn='Junio';
                                            break;
                                            case 7:
                                            mesn='Julio';
                                            break;
                                            case 8:
                                            mesn='Agosto';
                                            break;
                                            case 9:
                                            mesn='Septiembre';
                                            break;
                                            case 10:
                                            mesn='Octubre';
                                            break;
                                            case 11:
                                            mesn='Noviembre';
                                            break;
                                            case 12:
                                            mesn='Diciembre';
                                            break;
                                                            
                                        
                                            default:
                                            mesn='Error';
                                             }
                                        me.meses.push(x._id.codigoFarmacia.descripcion+'-'+mesn+'/'+x._id.year)
                                        me.totales.push(x.total)

                                    }else{

                                    }

                                }
                                
                                
                            })
                           
                              
                                 myChart = new Chart(ctx, {
                                    type: 'bar',
                                    data: {
                                        labels: me.meses,
                                        datasets: [
                                            {
                                            label: 'Reporte de ventas',
                                            data: me.totales,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)'
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)'
                                            ],
                                            borderWidth: 1
                                            }
                                            
                                            ]
                                    },
                                    options: {
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    }
                                });
                            }
                           
                      
                        }).catch(function(error){
                    console.log(error);
                    });
               

                
        },
        graficarVentasXProducto(limite,anio,mes){
            console.log(limite);
            console.log(anio);
            console.log(mes);
            this.totalesP=[]
            this.mesesP=[]
              var ctx
                var myChart
                              ctx = document.getElementById('graficoVentasProducto');
            let codef = this.$store.state.usuario.codigoFarmacia;
            let me=this;
            let datosagraficar=[]
            let mesn='';
            let header={"Token":this.$store.state.token};
            let configuracion = {headers:header};
             axios.get('estadisticas/productos?limite='+limite,configuracion)
                        .then(function (response){
                       
                       if(response.status==200){

                            datosagraficar=response.data
                            
                            datosagraficar.map(function(x) {
                                
                                if(me.checkboxRP){
                                            switch (parseInt(x._id.mes)) {
                                            case 1:
                                            mesn='Enero';
                                            break;
                                            case 2:
                                            mesn='Febrero';
                                            break;
                                            case 3:
                                            mesn='Marzo';
                                            break;
                                            case 4:
                                            mesn='Abril';
                                            break;
                                            case 5:
                                            mesn='Mayo';
                                            break;
                                            case 6:
                                            mesn='Junio';
                                            break;
                                            case 7:
                                            mesn='Julio';
                                            break;
                                            case 8:
                                            mesn='Agosto';
                                            break;
                                            case 9:
                                            mesn='Septiembre';
                                            break;
                                            case 10:
                                            mesn='Octubre';
                                            break;
                                            case 11:
                                            mesn='Noviembre';
                                            break;
                                            case 12:
                                            mesn='Diciembre';
                                            break;
                                                            
                                        
                                            default:
                                            mesn='Error';
                                             }

                                        me.mesesP.push(x._id.producto.nombreComercial+' -C:'+x.cantidad+' -F:'+x.fracciones+' - '+x._id.inventario.descripcion)
                                        me.totalesP.push(x.total)

                                }else{
                                      
                                    if(anio==x._id.year && mes==x._id.mes){
                                        switch (parseInt(x._id.mes)) {
                                            case 1:
                                            mesn='Enero';
                                            break;
                                            case 2:
                                            mesn='Febrero';
                                            break;
                                            case 3:
                                            mesn='Marzo';
                                            break;
                                            case 4:
                                            mesn='Abril';
                                            break;
                                            case 5:
                                            mesn='Mayo';
                                            break;
                                            case 6:
                                            mesn='Junio';
                                            break;
                                            case 7:
                                            mesn='Julio';
                                            break;
                                            case 8:
                                            mesn='Agosto';
                                            break;
                                            case 9:
                                            mesn='Septiembre';
                                            break;
                                            case 10:
                                            mesn='Octubre';
                                            break;
                                            case 11:
                                            mesn='Noviembre';
                                            break;
                                            case 12:
                                            mesn='Diciembre';
                                            break;
                                                            
                                        
                                            default:
                                            mesn='Error';
                                             }
                                        me.mesesP.push(x._id.producto.nombreComercial+' -C:'+x.cantidad+' -F:'+x.fracciones+' - '+x._id.inventario.descripcion)
                                        me.totalesP.push(x.total)

                                    }

                                }
                                
                                
                            })
                           
                              
                                 myChart = new Chart(ctx, {
                                    type: 'bar',
                                    data: {
                                        labels: me.mesesP,
                                        datasets: [
                                            {
                                            label: 'Reporte de productos vendidos con limite='+limite,
                                            data: me.totalesP,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                 'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                 'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)'
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)'
                                            ],
                                            borderWidth: 1
                                            }
                                            
                                            ]
                                    },
                                    options: {
                                        
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    }
                                });
                            }
                           
                      
                        }).catch(function(error){
                    console.log(error);
                    });
               

        }
    }
}
</script>

<style>

</style>