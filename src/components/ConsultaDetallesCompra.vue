<template>
    <v-layout align-start>
        <v-flex>
             <v-toolbar flat color="white">
              <v-toolbar-title>Reporte por detalles</v-toolbar-title>
                <v-btn class="primary" @click="abrirModalFiltro=1">
                FILTRO
                </v-btn>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
             </v-toolbar>
              <v-dialog v-model="abrirModalFiltro" max-width="500px">
              <v-card>
                <v-card-title>
                   <span class="headline">Escoja las fechas para poder filtrar:</span>
                </v-card-title>
                <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                          <v-flex xs12 sm6 md6>
                            <v-dialog
                              ref="dialog"
                              v-model="modal"
                              :return-value.sync="finicio"
                              persistent
                              width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="finicio"
                                    label="Fecha de inicio"
                                    prepend-icon="event"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="finicio" scrollable>
                                  <v-spacer></v-spacer>
                                  <v-btn text color="primary" @click="modal = false">Cancelar</v-btn>
                                  <v-btn
                                    text
                                    color="success"
                                    @click="$refs.dialog.save(finicio)"
                                  >Aceptar</v-btn>
                                </v-date-picker>
                              </v-dialog>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-dialog
                              ref="dialog1"
                              v-model="modal2"
                              :return-value.sync="ffin"
                              persistent
                              width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="ffin"
                                    label="Fecha de fin"
                                    prepend-icon="event"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="ffin" scrollable>
                                  <v-spacer></v-spacer>
                                  <v-btn text color="primary" @click="modal2 = false">Cancelar</v-btn>
                                  <v-btn
                                    text
                                    color="success"
                                    @click="$refs.dialog1.save(ffin)"
                                  >Aceptar</v-btn>
                                </v-date-picker>
                              </v-dialog>
                          </v-flex>
                          
                  </v-layout>
                </v-container>
                <v-container grid-list-md v-if="$store.state.usuario.codigoFarmacia == undefined||$store.state.usuario.rol=='5ee381d7005ebf28f0e5260b'">
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                              <v-autocomplete :items="inventario" v-model="codigoInventario" v-on:change="selectUsuariosF()" label="Farmacia:"></v-autocomplete>
                            </v-flex>
                             <v-flex xs12 sm12 md12 lg12 xl12>
                              <v-autocomplete :items="Us" v-model="codigoU" label="Usuario:"></v-autocomplete>
                            </v-flex>
                        </v-layout>
                      </v-container>  
                </v-card-text>
                   <v-card-actions>
                  <v-btn color="primary" @click="filtrarReporte()">Buscar</v-btn>
                   <v-btn color="secundary" @click="ocultarFiltro()">Cancelar</v-btn>
              </v-card-actions>
              </v-card>
            </v-dialog>
             <v-data-table
      
        :headers="cabeceraDT"
        :items="reporteDT"
        :search="search"
        class="elevation-1"
       >
        <template v-slot:items="props">
            <td>{{props.item.producto}}</td>
            <td >{{props.item.cantidad}}</td>
            <td v-if="props.item.fraccionesN">{{props.item.fraccionesN}}</td>
            <td v-else>0</td>
            <td>{{props.item.numComprobante}}</td>
            <td>{{props.item.descripcion}}</td>
            
            <td>{{formatearFecha(props.item.fecha)}}</td>
           
            <td>
            <div v-if="props.item.estado">
                <span class="green--text">Aceptado</span>
            </div>
            <div v-else>
                <span class="red--text">Anulado</span>
            </div>
            </td>
        </template>
        <template v-slot:no-data>
           <v-flex xs12 sm4 md4 lg4 xl4  class=" font-weight-bold red--text"
            style=" font-size:15px">
           Filtre por fecha y farmacia para poder ver los registros..
          </v-flex>
        </template>
               </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import Swal from "sweetalert2";
export default {
    data(){
        return{
            cabeceraDT:[
                { text: "Producto", value: "producto", sortable: false },
                { text: "Cantidad", value: "cantidad", sortable: false },
                { text: "Fracciones", value: "fraccionesN", sortable: false },
                { text: "Numero comprobante", value: "producto", sortable: false },
                { text: "Descripcion", value: "descripcion", sortable: false },
                { text: "Fecha", value: "producto", sortable: false },
                { text: "Estado", value: "producto", sortable: false },
                
            ],
            reporteDT:[],
            abrirModalFiltro:0,
            dialog:false,
            dialog1:false,
            modal:false,
            modal2:false,
            finicio:"",
            ffin:"",
            codigoInventario:"",
            inventario:[],
            codigoU:"",
            Us:[],
            search:""
          


        }
    },
    created() {
        this.selectInventario()
    },
    methods: {
        filtrarReporte(){
            let me = this;
            let header = { Token: this.$store.state.token };
            let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
            let codigoUser = this.$store.state.usuario.codigoUsuario;
            let fechaInicial = this.finicio;
            let fechaConverI = new Date(fechaInicial + " 00:00:01");
            let fechaFinal = this.ffin;
            let fechaConverF = new Date(fechaFinal + " 23:59:59");
            let configuracion = { headers: header };

            if (codigoFarmacia == undefined ||this.$store.state.usuario.rol=='5ee381d7005ebf28f0e5260b') {
                axios
                .get("ingresos/IngresosR?codigoFarmacia="+me.codigoInventario
                +"&fechaInicio="+fechaConverI.toISOString()
                +"&fechaFin="+fechaConverF.toISOString()
                +"&codigoUsuario="+me.codigoU, configuracion)
                .then(function (response) {
                  console.log(response.data)
                    me.reporteDT = response.data;
                    me.abrirModalFiltro=0
                })
                .catch(function (error) {
                    console.log(error);
                });
            } else {
                axios
                .get(
                    "ingresos/IngresosR?codigoFarmacia="+codigoFarmacia
                    +"&fechaInicio="+fechaConverI.toISOString()
                    +"&fechaFin="+fechaConverF.toISOString()
                    +"&codigoUsuario="+codigoUser,
                    configuracion
                )
                .then(function (response) {
                    console.log(response.data)
                    me.reporteDT = response.data;
                      me.abrirModalFiltro=0
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            }      
        },
        formatearFecha(value) {
            if (value) {
                return moment(String(value)).format("MM/DD/YYYY hh:mm");
            }
        },
        selectInventario() {
            let me = this;
            let personaArray = [];
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };

            axios
                .get("farmacia/list", configuracion)
                .then(function (response) {
                personaArray = response.data;
                personaArray.map(function (x) {
                    me.inventario.push({ text: x.descripcion, value: x._id });
                });
                })
                .catch(function (error) {
                console.log(error);
                });
        },
        selectUsuariosF() {
            this.Us=[]
            let me = this;
            let personaArray = [];
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };

            axios
                .get("login/listFiltro?codigoFarmacia=" + this.codigoInventario, configuracion)
                .then(function (response) {
                personaArray = response.data;
                personaArray.map(function (x) {
                    me.Us.push({ text: x.codigoUsuario.nombres, value: x.codigoUsuario._id });
                });
                })
                .catch(function (error) {
                console.log(error);
                });
        },
        ocultarFiltro(){
            this.abrirModalFiltro=0;
            this.limpiar()
        },
        limpiar(){
            this.finicio=""
            this.ffin=""
            this.codigoInventario=""
            this.codigoU=""
        }
    }
}
</script>

<style>

</style>