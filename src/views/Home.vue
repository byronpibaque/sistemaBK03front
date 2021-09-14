<template>

 <v-container grid-list-m>
      <template v-if="$store.state.usuario.codigoFarmacia==undefined">
      <v-container grid-list-m>
         <span class="blue--text " style="font-size: 20px " >Filtrar por Farmacia</span>
        <v-layout wrap>

             <v-flex xs12 sm6 md6 lg6 xl6>
            <v-autocomplete :items="farmacias" v-model="codigoFarmacia" v-on:change="listarMasVende(),listarProducto(),listar(),listarF()"  label="Seleccione una farmacia"></v-autocomplete>
          </v-flex>
        </v-layout>
        </v-container>
      </template>
   <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
             <span class="blue--text " style="font-size: 18px" >TOTAL DE VENTAS POR MES</span>
          <canvas id="myChart">

          </canvas>
        </div>
      </v-flex>
       <v-flex xs12 sm12 md12>

        <div class="ct-chart">
           <span class="blue--text " style="font-size: 18px" >PRODUCTOS MÁS VENDIDOS</span>
          <canvas id="myChart2">

          </canvas>
        </div>
      </v-flex>
       <v-flex xs12 sm12 md12>
        <div class="ct-chart">
             <span class="blue--text " style="font-size: 18px" >DEPENDIENTES</span>
          <canvas id="myChart3">

          </canvas>
        </div>
      </v-flex>
   </v-layout>
    <span class="blue--text " style="font-size: 18px" >PRODUCTOS POR CADUCAR</span>
      <v-data-table :headers="headersF" :items="articulosF"  class="elevation-1">
        <template v-slot:items="props">

          <td class="blue--text">{{ props.item.codigoBarras }}</td>
          <td>{{props.item.codigoInventario.descripcion}}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.nombreComercial }}</td>
          <td class="green--text">{{ props.item.stock }}</td>
          <td class="green--text">{{ props.item.fraccionesTotales }}</td>
          <td>{{ props.item.fraccionCaja }}</td>
          <td class="red--text">{{ props.item.fechaCaducidad }}</td>
           <td>{{ props.item.codigoLaboratorio.nombre }}</td>

        </template>
        <template v-slot:no-data>
          <span class="red--text">No hay productos próximos a caducar.</span>
        </template>
      </v-data-table>
 </v-container>

</template>

<script>

import axios from 'axios'
import Chart from 'chart.js'
import moment from "moment"
import Swal from 'sweetalert2'
export default{
  created () {
    this.selectFarmacia()
  },
  data(){return{
      farmacias:[],
      codigoFarmacia:"",
      valores:[],
      meses:[],
      totales:[],
      datos:[],
      productos:[],
      tota:[],
      vendedor:[],
      vend:[],
      to:[],
      articulosF: [],
      headersF: [

        { text: "Codigo de Barras", value: "codigoBarras", sortable: false },
        { text: "Inventario", value: "codigoInventario", sortable: true },
        { text: "Producto", value: "nombre", sortable: true },
        { text: "Nombre comercial", value: "nombreComercial", sortable: true },
        { text: "Stock/Caja", value: "stock", sortable: false },
        {
          text: "Total/Fracciones",
          value: "fraccionesTotales",
          sortable: true
        },
        { text: "Fracciones/Caja", value: "fraccionCaja", sortable: false },
        { text: "Fecha caducidad", value: "fechaCaducidad", sortable: true },
         { text: "Laboratorio", value: "codigoLaboratorio", sortable: false },
         ]

  }},
  methods:{
    limpiar () {
      this.valores=[],
      this.meses=[],
      this.totales=[],
      this.datos=[],
      this.productos=[],
      this.tota=[],
      this.vendedor=[],
      this.vend=[],
      this.to=[],
      this.articulosF= []
    },
    selectFarmacia() {
      let me = this;
      let arrayF = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios
        .get("farmacia/list", configuracion)
        .then(function (response) {
          arrayF = response.data;
          arrayF.map(function (x) {
            me.farmacias.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarMasVende(){//TOTAL DE LOS DEPENDIENTES CON MAS VENTAS
       this.limpiar()
       let me=this;
        let codeFarmacia = this.$store.state.usuario.codigoFarmacia;
          let header={"Token":this.$store.state.token};
          let configuracion = {headers:header};
          if(this.$store.state.usuario.codigoFarmacia!=undefined){

            axios.get('ventas/graficomasvende?codigoFarmacia='+codeFarmacia,configuracion).then(function (response){
            me.vendedor=response.data;
            me.graficar3(codeFarmacia);
            }).catch(function(error){
              console.log(error);
            });
          }else{
            if(me.codigoFarmacia){
               axios.get('ventas/graficomasvende?codigoFarmacia='+me.codigoFarmacia,configuracion).then(function (response){
                me.vendedor=response.data;
                me.graficar3(me.codigoFarmacia);
                }).catch(function(error){
                  console.log(error);
                });
            }

          }

    },
    listarProducto(){//MUESTRA LOS PRODUCTOS MAS VENDIDOS
    this.limpiar()
     let codef = this.$store.state.usuario.codigoFarmacia;
     let me=this;
      let header={"Token":this.$store.state.token};
      let configuracion = {headers:header};
        if(this.$store.state.usuario.codigoFarmacia!=undefined){
              axios.get('ventas/graficomasvendido?codigoFarmacia='+codef,configuracion)
            .then(function (response){
            me.datos=response.data;
            me.graficar2(codef);
          }).catch(function(error){
            console.log(error);
          });
        }else{
          if(me.codigoFarmacia){
            axios.get('ventas/graficomasvendido?codigoFarmacia='+me.codigoFarmacia,configuracion)
                .then(function (response){
                  me.datos=response.data;

                  me.graficar2(me.codigoFarmacia);
                }).catch(function(error){
              console.log(error);
            });
          }

        }



    },
    listar(){//GRAFICO QUE MUESTRA LAS VENTAS DE LOS ULTIMOS 12 MESES
    this.limpiar()
          let codeF = this.$store.state.usuario.codigoFarmacia;
          let me=this;
          let header={"Token":this.$store.state.token};
          let configuracion = {headers:header};

            if(this.$store.state.usuario.codigoFarmacia!=undefined){
                axios.get('ventas/grafico12Meses?codigoFarmacia='+codeF,configuracion)
                .then(function (response){
                  me.valores=response.data;
                  me.graficar(codeF);
                }).catch(function(error){
                  console.log(error);
                });
            }
            else{
              if(me.codigoFarmacia){
                axios.get('ventas/grafico12Meses?codigoFarmacia='+me.codigoFarmacia,configuracion)
                    .then(function (response){
                      me.valores=response.data;
                      me.graficar(me.codigoFarmacia);
                    }).catch(function(error){
                  console.log(error);
                });
              }

            }

    },
    graficar(code){

      let me = this;
      let mesn='';
     // console.log(me.valores);
       me.valores.map(function (x){
          if(code==x._id.codigoFarmacia){
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
              me.meses.push(mesn+'/'+x._id.year)
              me.totales.push(x.total)
          }

       })
          var ctx = document.getElementById('myChart');
          var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: me.meses,
                  datasets: [
                    {
                      label: 'Venta de los ultimos doce meses.',
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
    },
    graficar2(code){
          let me = this;
           let codeF = this.$store.state.usuario.codigoFarmacia;

      if(code){
          me.datos.map(function(x) {
                        me.productos.push(x._id.producto)
                        me.tota.push(x.total)

        })
      }else{
          me.datos.map(function(x) {
                        me.productos.push(x._id.producto)
                        me.tota.push(x.total)
        })
      }



          var ctx = document.getElementById('myChart2');
          var myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: me.productos,
                  datasets: [
                    {
                      label: 'Productos vendidos',
                      data: me.tota,
                      backgroundColor: [
                          'rgba(253,0,46,0.2)',
                          'rgba(11,107,172,0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 25, 132, 0.2)',
                          'rgba(54, 39, 235, 0.2)',
                          'rgba(255, 250, 86, 0.2)',
                          'rgba(75, 20, 192, 0.2)',
                          'rgba(153, 14, 255, 0.2)',
                          'rgba(255, 33, 64, 0.2)',
                          'rgba(255, 78, 132, 0.2)',
                          'rgba(54, 80, 235, 0.2)',
                          'rgba(54, 45, 234, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(219,116,3,0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(253,0,46,0.2)',
                          'rgba(11,107,172,0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 25, 132, 0.2)',
                          'rgba(54, 39, 235, 0.2)',
                          'rgba(255, 250, 86, 0.2)',
                          'rgba(75, 20, 192, 0.2)',
                          'rgba(153, 14, 255, 0.2)',
                          'rgba(255, 33, 64, 0.2)',
                          'rgba(255, 78, 132, 0.2)',
                          'rgba(54, 80, 235, 0.2)',
                          'rgb(168,243,146)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(219,116,3,0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(253,0,46,0.2)',
                          'rgba(11,107,172,0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 25, 132, 0.2)',
                          'rgba(54, 39, 235, 0.2)',
                          'rgba(255, 250, 86, 0.2)',
                          'rgba(75, 20, 192, 0.2)',
                          'rgba(153, 14, 255, 0.2)',
                          'rgba(255, 33, 64, 0.2)',
                          'rgba(255, 78, 132, 0.2)',
                          'rgba(54, 80, 235, 0.2)',
                          'rgb(168,243,146)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(219,116,3,0.2)',
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(253,0,46,0.2)',
                          'rgba(11,107,172,0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 25, 132, 0.2)',
                          'rgba(54, 39, 235, 0.2)',
                          'rgba(255, 250, 86, 0.2)',
                          'rgba(75, 20, 192, 0.2)',
                          'rgba(153, 14, 255, 0.2)',
                          'rgba(255, 33, 64, 0.2)',
                          'rgba(255, 78, 132, 0.2)',
                          'rgba(54, 80, 235, 0.2)',
                          'rgb(168,243,146)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(219,116,3,0.2)',
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
    },
    graficar3(code){

          let me=this;
          let header={"Token":this.$store.state.token};
          let configuracion = {headers:header};
           let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
            me.vendedor.map(function (x){
              if(code==x._id.codigoFarmacia){
                    axios.get('usuario/query?_id='+x._id.codigo,configuracion)
                    .then(function (response){

                                me.vend.push(response.data.nombres)
                                me.to.push(x.total)
                                var ctx = document.getElementById('myChart3');
                                var myChart = new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: me.vend,
                                        datasets: [
                                          {
                                            label: 'Dependientes - Ventas',
                                            data: me.to,
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

                              }).catch(function(error){
                                console.log(error);
                              });
              }



       })

    },
    listarF() {//PRODUCTOS POR CADUCAR
      let arregloArticulos=[]
      let me = this;
      const codigo = "";
      let header1 = { Token: this.$store.state.token };
      let configuracion1 = { headers: header1 };
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      var fechaActual=moment().format("DD-MM-yyyy")
      var diaA=fechaActual.slice(0, 2);
      var mesA=fechaActual.slice(3, 5);
      var anioA=fechaActual.slice(6, 10);

      if (codigoFarmacia == undefined) {
        if(me.codigoFarmacia){
          axios
              .get("inventario/query?_id=" + me.codigoFarmacia, configuracion1) //#1
              .then(function(codigoInvenatio) {
                //Buscar los productos que pertenecen al inventario...
                axios
                    .get(
                        "productos/listB?valor=" + codigoInvenatio.data._id,
                        configuracion
                    )
                    .then(function(response) {

                      arregloArticulos = response.data;
                      arregloArticulos.forEach(element => {
                        var diaV = element.fechaCaducidad.slice(8, 10);
                        var mesV = element.fechaCaducidad.slice(5, 7);
                        var anioV = element.fechaCaducidad.slice(0, 4);
                        if(element.fechaCaducidad){
                          if(anioV-anioA==0&&mesV-mesA<4&&diaV-diaA<15){
                            if(element.stok!=0) {
                              if(element.fraccionesTotales!=0){
                                me.articulosF.push(element)
                                //  Swal.fire('Notificación','Hay productos que están próximos a caducar.','warning')
                              }

                            }

                          }

                        }

                      });
                    })
                    .catch(function(error) {
                      console.log(error);
                    });
              })
              .catch(function(error) {
                console.log(error);
              });
        }

      } else {
        //Buscar el inventario a traves del codigo farmacia...
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
          .then(function(codigoInvenatio) {
            //Buscar los productos que pertenecen al inventario...
            axios
              .get(
                "productos/listB?valor=" + codigoInvenatio.data._id,
                configuracion
              )
              .then(function(response) {

                arregloArticulos = response.data;
              arregloArticulos.forEach(element => {
              var diaV = element.fechaCaducidad.slice(8, 10);
              var mesV = element.fechaCaducidad.slice(5, 7);
              var anioV = element.fechaCaducidad.slice(0, 4);
              if(element.fechaCaducidad){

                 if(anioV-anioA==0&&mesV-mesA<4&&diaV-diaA<15){
                    if(element.stok!=0) {
                      if(element.fraccionesTotales!=0){
                          me.articulosF.push(element)
                        //  Swal.fire('Notificación','Hay productos que están próximos a caducar.','warning')
                      }

                    }

                  }

             }

            });
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(function(error) {
            console.log(error);
          });

      }

    },
  },

  mounted() {
    this.listarF()
    this.listarProducto();
    this.listar();
    this.listarMasVende();

 }
}
</script>
