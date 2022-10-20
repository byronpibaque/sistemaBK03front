<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Egresos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-btn class="primary" @click="mostrarFarmacias" v-if="$store.state.usuario.codigoFarmacia==undefined"> Farmacias </v-btn>
        <v-btn class="success" @click="mostrarExportar"> Fechas </v-btn>
        <v-btn @click="crearPDF()">
          <v-icon>print</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="orange"
          v-if="verNuevo == 0"
          @click="mostrarNuevo()"
          dark
          class="mb-2"
          >Pedir Autorizacion</v-btn
        >
        <v-dialog v-model="FarmaciasModal" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline"
                >Seleccione una farmacia para filtrar:</span
              >
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-autocomplete
                      :items="inventario"
                      v-model="codigoInventario"
                      label="Farmacia:"
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="filtrarFarmacias()">Buscar</v-btn>
              <v-btn color="secundary" @click="ocultarFarmacias()"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="ExportarModal" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione el rango de fechas:</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-dialog
                      ref="dialog1"
                      v-model="modal1"
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
                        <v-btn text color="primary" @click="modal1 = false"
                          >Cancelar</v-btn
                        >
                        <v-btn
                          text
                          color="success"
                          @click="$refs.dialog1.save(finicio)"
                          >Aceptar</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
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
                        <v-btn text color="primary" @click="modal = false"
                          >Cancelar</v-btn
                        >
                        <v-btn
                          text
                          color="success"
                          @click="$refs.dialog.save(ffin)"
                          >Aceptar</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="filtrarFechas()">Buscar</v-btn>
              <v-btn color="secundary" @click="ocultarExportar()"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="texto"
                      @keyup.enter="listarArticulosnombres()"
                      class="text-xs-center"
                      append-icon="search"
                      label="Búsqueda"
                    ></v-text-field>
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="justify-center layout px-0">
                            <v-icon
                              small
                              class="mr-2"
                              @click="agregarDetalle(props.item)"
                              >add</v-icon
                            >
                          </td>
                          <td class="blue--text">
                            {{ props.item.codigoBarras }}
                          </td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.nombreComercial }}</td>
                          <td class="green--text">
                            {{ props.item.codigoLaboratorio.abreviatura }}
                          </td>
                           <td class="text-xs-center green--text">
                          {{ Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja)) }}
                          </td>
                        <td  class="green--text" v-if="props.item.fraccionCaja!=1">{{
                          Math.round(((props.item.fraccionesTotales/props.item.fraccionCaja - Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja))))*props.item.fraccionCaja)
                          }}</td>
                          <td class="green--text" v-else>
                          {{0}}
                          </td>     
                          <td>${{ props.item.pvp }}</td>
                          <td>{{ props.item.descuento }}%</td>
                          <td>{{ props.item.codigoInventario.descripcion }}</td>

                          <td>
                            <div v-if="props.item.estado">
                              <span class="blue--text">Activo</span>
                            </div>
                            <div v-else>
                              <span class="red--text">Inactivo</span>
                            </div>
                          </td>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1"
              >Aprobar egreso</v-card-title
            >
            <v-card-title class="headline" v-if="adAccion == 2"
              >No aprobar</v-card-title
            >
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion == 1">Aprobar</span>
              <span v-if="adAccion == 2">Anular</span>
              el egreso # {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activarDesactivarCerrar()"
                color="green darken-1"
                flat="flat"
                >Cancelar</v-btn
              >
              <v-btn
                v-if="adAccion == 1"
                @click="activar()"
                color="orange darken-4"
                flat="flat"
                >Activar</v-btn
              >
              <v-btn
                v-if="adAccion == 2"
                @click="desactivar()"
                color="orange darken-4"
                flat="flat"
                >Desactivar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="verNuevo == 0 "
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verIngreso(props.item)"
              >tab</v-icon
            >
            <template v-if="props.item.estado">
              <v-icon small @click="imprimirTicket(props.item)">print</v-icon>
            </template>
           
             <template v-if="$store.state.usuario.codigoFarmacia==undefined">
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template>
            </template>
          </td>
          <td>{{ props.item.codigoInventarioE.descripcion }}</td>
          <td>{{ props.item.codigoInventarioR.descripcion }}</td>
          <td>{{ props.item.codigoUsuario.nombres }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>{{ props.item.numComprobante }}</td>
          <td>{{ formatearFecha(props.item.createdAt) }}</td>
          <td>
            <div v-if="props.item.estado">
              <span class="green--text">Aceptado</span>
            </div>
            <div v-else>
              <span class="orange--text">Pendiente</span>
            </div>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex
            xs12
            sm12
            md12
            lg12
            xl2
            class="font-weight-bold green--text"
            style="font-size: 20px"
          >
            <span>Farmacia: {{ Farmacia }}</span>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-autocomplete
              :items="inventarioV"
              v-model="codigoInventarioV"
              label="Farmacia:"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field
              v-model="descripcion"
              label="Descripcion"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field
              v-model="codigoBarras"
              label="Código"
              @keyup.enter="buscarCodigo()"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="detalles"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-icon
                      small
                      class="mr-2"
                      @click="eliminarDetalle(detalles, props.item)"
                      >delete</v-icon
                    >
                  </td>
                 
                  <td class="text-xs-center blue--text">
                    {{ props.item.producto }}
                  </td>
             
                 

                  <td class="text-xs-center green--text">
                    <v-text-field
                      v-model="props.item.fracciones"
                    
                    ></v-text-field>
                  </td>
                  <td
                    class="text-xs-center blue--text"
                    bgcolor="#4682dd"
                  >
                    <v-text-field
                    
                      v-model="props.item.cajas"
                      readonly
                     
                    ></v-text-field>
                  </td>
                   <td
                   bgcolor="#4682dd"
                    class="text-xs-center blue--text"
                   
                  >
                    <v-text-field
                      v-model="props.item.fraccion"
                      readonly
                      
                    ></v-text-field>
                  </td>
                  <td
                  bgcolor="#4682dd"
                    class="text-xs-center blue--text"
                   
                  >
                    <v-text-field
                      v-model="props.item.fraccionesTotales"
                      readonly
                     
                    ></v-text-field>
                  </td>
                  <td>{{props.item.precioVenta}}</td>
                   <td>{{props.item.precioUni}}</td>
                    <td>{{props.item.descuento}}</td>
                  <td class="text-xs-right">
                  
                    <div v-if="props.item.cantidad==0">
                      {{(props.item.fracciones * props.item.precioUni)
                      }}
                    </div>
                    <div v-else>
                    <div v-if="props.item.iva!=0">
                      {{ 
                        ((props.item.cantidad * props.item.precioVenta)-(props.item.cantidad * props.item.precioVenta)*0.12)
                        +((props.item.fracciones * props.item.precioUni)-(props.item.fracciones * props.item.precioUni)*0.12)
                        
                        }}
                         
                         </div>
                          <div v-else>
                              {{ 
                            (props.item.cantidad * props.item.precioVenta)
                            +(props.item.fracciones * props.item.precioUni)
                            
                            }}
                          </div>
                     
                    </div>
                  </td>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Subtotal:</strong>
                $
                {{totalParcial=(caltularSubtotal).toFixed(2)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total descuento:</strong>
                $
                {{totaldescuento=(caltulardescuento).toFixed(2)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Impuesto:</strong>
                $ {{totalImpuesto=(calcularIva).toFixed(2)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total:</strong>
                $ {{total=calcularTotal.toFixed(2)}}
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn
              color="success"
              v-if="verDetalle == 0"
              @click.native="guardar()"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      inventarioV:[],
      codigoInventarioV:"",
      finicio: "",
      ffin: "",
      modal: false,
      modal1: false,
      ExportarModal: 0,
      dialog: false,
      search: "",
      ingresos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Farmacia Emite", value: "codigoInventarioE" },
        { text: "Farmacia Recibe", value: "codigoInventarioR" },
        { text: "Usuario", value: "codigoUsuario.nombres", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: false },
        {
          text: "Número comprobante",
          value: "numComprobante",
          sortable: false,
        },
        { text: "Fecha", value: "createdAt", sortable: true },
        { text: "Estado", value: "estado", sortable: false },
      ],
      _id: "",
      codigoInventario: "",
      inventario: [],
      codigoTipoComprobante: "",
      tiposcomprobantes: [],
      serieComprobante: "",
      numComprobante: "",
      codigo: "",
      cabeceraDetalles:
       [{ text: "Borrar", value: "borrar", sortable: false },
         
          { text: "Producto", value: "producto", sortable: false },
       
       
          { text: "Fracciones a egresar", value: "fracciones", sortable: false },
          {
            text: "Cajas",
            value: "cajas",
            sortable: false,
          },
          {
            text: "Fracciones",
            value: "fraccion",
            sortable: false,
          },
          {
            text: "Fracciones Totales",
            value: "fraccionesTotales",
            sortable: false,
          },
           {
            text: "PVP",
            value: "precioVenta",
            sortable: false,
          },
          {
            text: "P. uni",
            value: "precioUni",
            sortable: false,
          },
          {
            text: "Dscto",
            value: "descuento",
            sortable: false,
          },
          {
            text: "SubTotal",
            value: "subtotal",
            sortable: false,
          },
          ],
     
      detalles: [],
      verNuevo: 0,
      errorArticulo: null,
      total: 0.0,
      totalParcial: 0.0,
      totalImpuesto: 0.0,
      articulos: [],
      texto: "",
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: true },
        {
          text: "Laboratorio",
          value: "codigoLaboratorio.abreviatura",
          sortable: true,
        },
        { text: "Cajas", value: "cajas", sortable: false },
        { text: "Fracciones", value: "fracciones", sortable: false  },
        { text: "PVP", value: "pvp", sortable: false  },
        { text: "Descuento", value: "descuento", sortable: false  },
        { text: "Farmacia", value: "codigoInventario", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      verDetalle: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      codigoBarras: "",
      iva: 0,
      descripcion: "",
      Farmacia: "",
      farmacias: [],
      invFar: "",
      Far: [],
      conteo: "",
      FarmaciasModal: 0,
      detalleEgreso:[]
    };
  },
  computed: {
    calcularFormaPago: function () {
      let total = this.calcularTotal.toFixed(2);
      let val = 0;
      if (this.chckCr && this.chckEfectivo) {
        let suma = parseFloat(this.credito_Val) + parseFloat(this.Efec_Val);
        val = total - suma;
      }

      return val.toFixed(2);
    },
    calcularTotal: function () {
      return (this.caltularSubtotal + this.calcularIva)-this.caltulardescuento;
    },
    caltularSubtotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].cantidad == 0) {
          if(this.detalles[i].iva!=0){
            resultado =
            resultado +
           ( this.detalles[i].fracciones * this.detalles[i].precioUni)-(this.detalles[i].fracciones * this.detalles[i].precioUni*0.12)
          }else{
            resultado =
            resultado +
            this.detalles[i].fracciones * this.detalles[i].precioUni
          }
         
        } else {
              if(this.detalles[i].iva!=0){
                 resultado =
                resultado +
                  ((this.detalles[i].cantidad * this.detalles[i].precioVenta)-(this.detalles[i].cantidad * this.detalles[i].precioVenta)*0.12)
                   + ((this.detalles[i].fracciones * this.detalles[i].precioUni)-(this.detalles[i].fracciones * this.detalles[i].precioUni)*0.12)

              }else{
                 resultado =
            resultado +
            this.detalles[i].cantidad * this.detalles[i].precioVenta + this.detalles[i].fracciones * this.detalles[i].precioUni

              }
         
        }
      }
      return resultado;
    },
    caltulardescuento: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].cantidad == 0) {
          resultado =
            resultado +
            (this.detalles[i].fracciones *
              this.detalles[i].precioUni *
              this.detalles[i].descuento) /
              100
        } else {
          resultado =
            resultado +
            ((this.detalles[i].cantidad *
              this.detalles[i].precioVenta *
              this.detalles[i].descuento) /
              100)+((this.detalles[i].fracciones *
              this.detalles[i].precioUni *
              this.detalles[i].descuento) /
              100)
        }
      }
      return resultado;
    },
    calcularIva: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].iva != 0) {
          if (this.detalles[i].cantidad == 0) {
            resultado =
              resultado +
              (this.detalles[i].fracciones * this.detalles[i].precioUni *0.12)
          } else {
            resultado =
              resultado +
              ((this.detalles[i].cantidad * this.detalles[i].precioVenta)*0.12)+((this.detalles[i].fracciones * this.detalles[i].precioUni) *0.12)
          }
        }
      }
      return resultado;
    },
    calcularDcto: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].iva != 0) {
          if (this.detalles[i].cantidad == 0) {
            resultado =
              resultado +
              (this.detalles[i].fracciones *
                this.detalles[i].precioUni *
                this.detalles[i].descuento) /
                100
          } else {
            resultado =
              resultado +
             ( (this.detalles[i].cantidad *
                this.detalles[i].precioVenta *
                this.detalles[i].descuento) /
                100)+  (this.detalles[i].fracciones *
                this.detalles[i].precioUni *
                this.detalles[i].descuento) /
                100
          }
        }
      }
      return resultado;
    },
    calcularPagoaCredito: function () {
      if(this.banderaCredito){
        let topeMax = this.topeMaximo
        let topeMin = this.topeMinimo
        let result = (parseFloat(topeMax)-parseFloat(topeMin))-this.calcularTotal
        if(result<0){
          this.bandera=false
        }else{
          this.bandera=true
        }
        return result
      }
      
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
   // this.listar();
    this.selectInventario();
    this.selectInventarioV();
    this.selectTipocomprobante();
    // this.selectFarmacias();
    this.ObtenerFa();
    this.obtenerIDINV();
    this.contarEgresos();
    this.notificacion();
  },
  methods: {
    encabezadosXML (emite,recibe,usuario,descripcion,numeroComprobante,total) {

      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios
        .post(
          "http://localhost:25000/api/xml/xmlEgreso",
          {
            egreso: {
              farmaciaEmite: emite,
              farmaciaRecibe: recibe,
              usuario: usuario,
              descripcion: descripcion,
              numeroComprobante: numeroComprobante,
               total: total,
            },
            detalles:{
              detalle:this.detalleEgreso
            }
          },
          configuracion
        )
        .then((response) => {
         this.limpiar()
        }) 
       
    },
    imprimirTicket (item) { 
     
      this.detalleEgreso.push(item.detalles)
      this.encabezadosXML(
        item.codigoInventarioE.descripcion,
        item.codigoInventarioR.descripcion,
        item.codigoUsuario.nombres,
        item.descripcion,
        item.numComprobante,
        item.total
        )   
      
    },
    async obtenerInventario () {
       let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
       if(codigoFarmacia==undefined){

       }else{
          let me = this;
          let ArrayT = [];
          let header = { Token: this.$store.state.token };
          let configuracion = { headers: header };
          const response = await axios.get("inventario/query?_id=" + codigoFarmacia);
          return response
       }
    },
    filtrarFarmacias() {
    
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
      if (codigoFarmacia == undefined) {
        axios
          .get(
            "egreso/listfiltrado?valor=" + me.codigoInventario,
            configuracion
          )
          .then(function (response) {
            me.ingresos = response.data;
            me.ocultarFarmacias()
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
         
      }
    },
    notificacion() {
      Swal.fire(
        "Notificación",
        "Todos los egresos que realice deben ser autorizados por un superior,\npor seguridad y políticas internas.",
        "warning"
      );
    },
    contarEgresos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("egreso/contarventas")
        .then(function (response) {
          me.conteo = response.data;
        
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obtenerIDINV() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      if (codigoFarmacia == undefined) {
        me.invFar = "ADMINISTRADOR";
      } else {
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion)
          .then(function (response) {
            me.Far = response.data;

            me.invFar = me.Far._id;
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
    ObtenerFa() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      if (codigoFarmacia == undefined) {
        me.Farmacia = "ADMINISTRADOR";
      } else {
        axios
          .get("farmacia/query?_id=" + codigoFarmacia, configuracion)
          .then(function (response) {
            me.farmacias = response.data;

            me.Farmacia = me.farmacias.descripcion;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    selectFarmacias() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
      if (codigoFarmacia == undefined) {
        axios
          .get("farmacia/list", configuracion)
          .then(function (response) {
            ArrayT = response.data;
            ArrayT.map(function (x) {
              me.farmacias.push({ text: x.descripcion, value: x._id });
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        axios
          .get("farmacia/query?_id=" + codigoFarmacia, configuracion)
          .then(function (response) {
            me.farmacias.push({
              text: response.data.descripcion,
              value: response.data._id,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    selectInventario() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("inventario/list", configuracion)
        .then(function (response) {
          personaArray = response.data;
          personaArray.map(function (x) {
            me.inventario.push({ text: x.descripcion, value: x._id });
          //  me.inventarioV.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectInventarioV() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("inventario/list", configuracion)
        .then(function (response) {
          personaArray = response.data;
          personaArray.map(function (x) {
           // me.inventario.push({ text: x.descripcion, value: x._id });
            me.inventarioV.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectTipocomprobante() {
      let me = this;
      let tipocomprobanteArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("tipocomprobante/list", configuracion)
        .then(function (response) {
          tipocomprobanteArray = response.data;
          tipocomprobanteArray.map(function (x) {
            me.tiposcomprobantes.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    buscarCodigo() {
      let me = this;
      me.errorArticulo = null;
      let header1 = { Token: this.$store.state.token };
      let configuracion1 = { headers: header1 };
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let codigoBarr = this.codigoBarras;

      if (codigoFarmacia == undefined) {
        axios
          .get(
            "productos/query?codigoBarras=" + this.codigoBarras,
            configuracion
          )
          .then(function (response) {
            me.agregarDetalle(response.data);
          })
          .catch(function (error) {
            me.errorArticulo = "No existe el artículo.";
          });
      } else {
        //Buscar el inventario a traves del codigo farmacia...
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
          .then(function (codigoInvenatio) {
            //Buscar los productos que pertenecen al inventario...
            axios
              .get(
                "productos/queryB?valor=" +
                  codigoInvenatio.data._id +
                  "&codigoBarras=" +
                  codigoBarr,
                configuracion
              )
              .then(function (response) {
               
                     me.agregarDetalle(response.data);
            
             
              })
              .catch(function (error) {
                me.errorArticulo = "No existe el artículo.";
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    agregarDetalle(data) {
      this.errorArticulo = null;
       if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
        } 
        else {
        
        Math.floor()
        let cajas = 0
        let fraccion = 0
        
        if(parseInt(data.fraccionCaja)==1){
          cajas = Math.floor((parseInt(data.fraccionesTotales)/parseInt(data.fraccionCaja)))
          fraccion=0
        }else{
          cajas=Math.floor((parseInt(data.fraccionesTotales)/parseInt(data.fraccionCaja)))
          fraccion= Math.round(((parseInt(data.fraccionesTotales)/parseInt(data.fraccionCaja) - Math.floor((parseInt(data.fraccionesTotales)/parseInt(data.fraccionCaja)))))*parseInt(data.fraccionCaja))
        }
        this.detalles.unshift({
          _id: data._id,
          codigoBarras: data.codigoBarras,
          producto: data.nombreComercial,
          cantidad: 0,
          stock: data.stock,
          fracciones:0,
          cajas:cajas,
          fraccion:fraccion,
          fraccionesTotales: data.fraccionesTotales,
          precioVenta: data.pvp,
          precioUni: data.precioUni,
          descuento: data.descuento,
           iva: data.iva,
        });
        this.codigoBarras = "";
      }
    }, 
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    listarArticulos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("productos/list?valor=" + this.texto, configuracion)
        .then(function (response) {
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarArticulosnombres() {
      let me = this;
      const codigo = "";
      let text = this.texto;
      let header1 = { Token: this.$store.state.token };
      let configuracion1 = { headers: header1 };
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;

      if (codigoFarmacia == undefined) {
        axios
          .get("productos/listtotal?valor=" + this.texto, configuracion)
          .then(function (response) {
            me.articulos = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Buscar el inventario a traves del codigo farmacia...
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
          .then(function (codigoInvenatio) {
            //Buscar los productos que pertenecen al inventario...
            axios
              .get(
                "productos/list?valor=" +
                  codigoInvenatio.data._id +
                  "&producto=" +
                  text,
                configuracion
              )
              .then(function (response) {
                if(response.status==200){
                  me.articulos = response.data;
                }else{
                  Swal.fire("Informacion","No hay resultados","info")
                }
                
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    mostrarModalArticulos() {
      this.dialog = 1;
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("egreso/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      this.limpiar()
      this.descripcion = item.descripcion;
      this.codigoInventarioV = item.codigoInventarioR._id;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
    },
    listar() {
      
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoUsuario= this.$store.state.usuario.codigoUsuario
  
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
       let invFarm =""
      if (codigoFarmacia == undefined) {
        axios
          .get("egreso/list", configuracion)
          .then(function (response) {
            me.ingresos = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
         axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion)
          .then(function (response) {
            let Farm = response.data;

          invFarm = Farm._id;
          axios
          .get("egreso/listU?valor="+invFarm+"&valor2="+codigoUsuario, configuracion)
          .then(function (resp) {
            me.ingresos = resp.data;
          })
          .catch(function (error) {
            console.log(error);
          });
          })
          .catch(function (error) {
            console.log(error);
          });
         

      }
    },
    limpiar() {
   
      this.descripcion = "";
      this._id = "";
      this.codigoTipoComprobante = "";
      this.serieComprobante = "";
      this.numComprobante = "";
      this.impuesto = 0.12;
      this.codigoBarras = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.detalles = [];
      this.verNuevo = 0;
      this.valida = 0;
      this.validaMensaje = [];
      this.verDetalle = 0;
      this.detalleEgreso=[]
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
        for (let index = 0; index < this.detalles.length; index++) {
          if(parseInt(this.detalles[index].cantidad)==0 ||   parseInt(this.detalles[index].cantidad)>0){
            
          }else{
            this.validaMensaje.push(
                  "Cantidad no puede ser un valor vacío."
                );
          }
          if(parseInt(this.detalles[index].fracciones)==0 ||   parseInt(this.detalles[index].fracciones)>0){
          
          }else{
              this.validaMensaje.push(
                  "Fracciones no puede ser un valor vacío."
                );
          }
          if (this.detalles[index].cantidad == 0) {
            if (this.detalles[index].fracciones > 0) {
             
            } else {
              this.validaMensaje.push("Fracciones no pueden ser negativas.");
            }
          } else {
            if (this.detalles[index].cantidad > 0) {
              
            } else {
              this.validaMensaje.push("Cantidad no puede ser negativa.");
            }
          }
         
        }
      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artículo al detalle");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    EnviarInformacion(email, mensaje, asunto) {
      let me = this;
      axios
        .post("email/correo", {
          email: email,
          mensaje: mensaje,
          asunto: asunto,
        })
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      //Código para guardar
      axios
        .post(
          "egreso/add",
          {
            codigoUsuario: this.$store.state.usuario.codigoUsuario,
            codigoInventarioE: this.invFar,
            codigoInventarioR: this.codigoInventarioV,
            descripcion: this.descripcion,
            numComprobante: this.conteo,
            impuesto: this.calcularIva,
            total: this.total,
            detalles: this.detalles,
          },
          configuracion
        )
        .then(function (response) {
          Swal.fire(
            "Notificación",
            "Por favor este pendiente del correo,\npronto administrativo aceptara su pedido de egreso.",
            "success"
          );

          me.limpiar();
          me.close();
          me.listar();
          me.contarEgresos()
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.numComprobante;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let farmaci = [];
      let correoFarmaciaR = "";
      let farmacii = [];
      let correoFarmaciaE = "";
      axios
        .put("egreso/deactivate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
         me.filtrarFarmacias()
          me.activarDesactivarCerrar()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("egreso/activate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
         me.filtrarFarmacias()
          me.activarDesactivarCerrar()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
    },
    validarF() {
      this.valida = 0;
      this.validaMensaje = [];

      var Ainicio = this.finicio.slice(0, 4);

      var Minicio = this.finicio.slice(5, 7);

      var Dinicio = this.finicio.slice(8, 10);

      var Afin = this.ffin.slice(0, 4);

      var Mfin = this.ffin.slice(5, 7);

      var Dfin = this.ffin.slice(8, 10);
      if (
        parseInt(Ainicio) <= parseInt(Afin) &&
        parseInt(Minicio) <= parseInt(Mfin) &&
        parseInt(Dinicio) <= parseInt(Dfin)
      ) {
      } else {
        this.validaMensaje.push("Debe ingresar una fecha de incio.");
      }
      if (!this.finicio) {
        this.validaMensaje.push("Debe ingresar una fecha de incio.");
      }
      if (!this.ffin) {
        this.validaMensaje.push("Debe ingresar una fecha de fin.");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    filtrarFechas() {
      let me = this;
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
  
      let fechaInicial = this.finicio;
      let fechaConverI = new Date(fechaInicial + " 00:00:01");
      let fechaFinal = this.ffin;
      let fechaConverF = new Date(fechaFinal + " 23:59:59");
      if (codigoFarmacia == undefined) {
        axios
          .get(
            "egreso/listporfechasad?fechainicio=" +
             fechaConverI.toISOString() +
              "&fechafin=" +
              fechaConverF.toISOString() +
              ""
          )
          .then(function (response) {
            me.ingresos = response.data;
            me.ocultarExportar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        
        axios
          .get(
            "egreso/listporfechas?valor=" +
              me.invFar +
              "&fechainicio=" +
               fechaConverI.toISOString() +
              "&fechafin=" +
              fechaConverF.toISOString() +
              ""
          )
          .then(function (response) {
            console.log(response);
            me.ingresos = response.data;
            me.ocultarExportar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    mostrarFarmacias() {
      this.FarmaciasModal = 1;
    },
    ocultarFarmacias(item) {
   
      this.validaMensaje = [];
      this.FarmaciasModal = 0;
    },
    mostrarExportar(item) {
      this.ExportarModal = 1;
    },
    ocultarExportar(item) {
     
      this.validaMensaje = [];
      this.ExportarModal = 0;
    },
    crearPDF() {
      let me = this;
      var img =
        "data:image/jpeg;base64,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ugfvcVKDuFGnQOZrcjinD8dGqSmsiv1FOqiHboFFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiio5bjZwvJoGlce7hBzUElwz9OBTCxc+tSxW+OW/Kp1ZdlHVjYoDJ7CpkjEY4pxbaOagluc/d/OjRC1kSSTiP3NQPI0h5ptFK5cYpBRRRSKCiiigAooooAKKKKACiiigAooooAKKcsbP0FHl46sooAbRTsKO7H8KXzFHRB+PNAhnWnbGP8LflTvtDew+gppmY/wAVGgah5Lf3TS+Qx/hpPMY/xN+dJuJ7mgNR/wBnb/Jo+ztUdFAajvIb+7QI2Ham5pd7epoHqKUb+7SFSOxpfMb+8fzoEzDvQLUbRT/OPfB+oo3qeq/lQMZRT8I3crSiIg/KVagVyOinHg/Mv5cUYUnhsfWgY2inFGUf1ptABSq5Q8UlFAEyXX979KlVgw4qpQGKniq5iHBdC5RUCXRH3ualSZXp3IcWh1FFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKCcCkZtgyarSzGQ+3pSbKjG46W43cL0piqXOBSxxGQ/1qwqrCv8zS3NLpaIbFD5fPVqdJMsf19KhluC3C8Co6L9ieW+rHPIZDzTaKKk0CiiigAooooAKKKKACiiigAooAzTsAdaAG04Rkj0+tG/H3eKaTk0AOwo77vpRvx0AFNooAUsW6nNJRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFADllZe9BcMOV/EU2igADFelPD5HK596ZTkkMZ4oACqt90/nTSu0805nVx93B9qbnigAopyy4GGG4U5osjcvI9KBXI6KKKBk0Vx2b86mqnT45zH7iqUjOUOxZopqSCQcU6qMwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKa8gjXmiSQRrVZ3Ltk0myoxuLJIZDTaANx4qxFB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iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmyRCT6+tOooAqyRNGf602rhGRUUltn7vHtU8ppGfcgopWUqeaSpNBzIVGe3qKbTkkKHihtrj+63p2NAhtFFFAwooooAKKKKACiiigAooooAKKKKACgNiiigB3mN/eb86PMb+83502igB3mN/eb86PMY/xN+dNooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACgDJp8cLSew9anjiWP8Axp2JlJIjjtv735VMBgUUVZk5NhRRRQIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBGUOOaie1/u/lU1FBSk0VGUqeaSrjKGHNQva/3fyNTylqa6kNFOeNk6im1JYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFPSBn9vrUyQKnuadiXJIhSFpPp61MkCp7mn0VVjNybCiiimSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAHWo3t1b2+lSUUBdorvbMv+1UZGDVygruHNTymiqdynRVhrZT04qNrZh70rMrmRHRSsjL1FJSKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopyxs/RaetqT1NFhcyRFSqhfoKnW3Vff61IBgVXKR7TsQpak/eNSJEqdB+NOoqrEuTYUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFNaJW/hp1FAEbWqnpkUw2reoqeilZFczKxgYfw00ow/hP5VbopcpXtGU6KuEZpvlr/dX8qOUPaFWirRhU/w0n2dfT9aOUftEVqKsfZ1/wAmj7Ov+TRyj50V6Ks/Z19P1o8hR/DRyi9oitRVryl/uilCKP4R+VHKL2hUpwjY/wAJq1jFFHKHtCuLdjTha/7VTUU+UnnZGLZR6mnLGq9Fp1FMXMwooooEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z";

      var columns = [
        { title: "Farmacia Emite", dataKey: "codigoInventarioE" },
        { title: "Farmacia Recibe", dataKey: "codigoInventarioR" },
        { title: "Usuario", dataKey: "codigoUsuario" },
        { title: "Descripcion", dataKey: "descripcion" },
        { title: "Número comprobante", dataKey: "numComprobante" },
        { title: "Fecha", dataKey: "createdAt" },
      ];
      var rows = [];
      this.ingresos.map(function (x) {
        rows.push({
          codigoInventarioE: x.codigoInventarioE.descripcion,
          codigoInventarioR: x.codigoInventarioR.descripcion,
          codigoUsuario: x.codigoUsuario.nombres,
          descripcion: x.descripcion,
          numComprobante: x.numComprobante,
          createdAt: me.formatearFecha(x.createdAt),
        });
      });

      var doc = new jsPDF();
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text("Reporte de egresos", 80, 20);
          doc.setTextColor("blue");
          doc.text("LINEA DE FARMACIAS TU AHORRO", 60, 30);
          doc.text(me.Farmacia, 85, 40);
          doc.addImage(img, "JPEG", 160, 10, 35, 35);
        },
      });
      doc.save("ReporteEgresos.pdf");
    },
  },
};
</script>
