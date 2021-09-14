<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-flex xs12 sm12 md12 lg12 >

    
      
        <v-btn class="primary" @click="mostrarmodalfarmacias">
          Fechas
        </v-btn>
     

         </v-flex>
         <v-dialog v-model="FarmaciasModal" max-width="500px">
              <v-card>
                <v-card-title>
                   <span class="headline">Escoja las fechas, y la farmacia que desea filtrar:</span>
                </v-card-title>
                <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                          <v-flex xs12 sm6 md6>
                            <v-dialog
                              ref="dialog2"
                              v-model="modal5"
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
                                  <v-btn text color="primary" @click="modal5 = false">Cancelar</v-btn>
                                  <v-btn
                                    text
                                    color="success"
                                    @click="$refs.dialog2.save(finicio)"
                                  >Aceptar</v-btn>
                                </v-date-picker>
                              </v-dialog>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-dialog
                              ref="dialog3"
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
                                    @click="$refs.dialog3.save(ffin)"
                                  >Aceptar</v-btn>
                                </v-date-picker>
                              </v-dialog>
                          </v-flex>
                            <v-flex xs12 sm12 md12 v-show="valida">
                              <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                            </v-flex>
                  </v-layout>
                </v-container>
                      <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12 >
                                <v-autocomplete :items="farmacias" v-if="$store.state.usuario.codigoFarmacia == undefined" v-model="codigoFar" label="Farmacia:"></v-autocomplete>
                            </v-flex>
                        </v-layout>
                      </v-container>  
                </v-card-text>
                   <v-card-actions>
                  <v-btn color="primary" @click="consultarporfechas()">Buscar</v-btn>
                   <v-btn color="secundary" @click="ocultarmodalfarmacias()">Cancelar</v-btn>
              </v-card-actions>
              </v-card>
            </v-dialog>



      </v-toolbar>
      <v-data-table
      
        :headers="headers"
        :items="compras"
        :search="search"
        class="elevation-1"
        v-if="verNuevo==0">
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verIngreso(props.item)">tab</v-icon>
                    </td>
          <td>{{ props.item.codigoFarmacia.descripcion }}</td>
          <td>{{ props.item.codigoUsuario.nombres }}</td>
          <td>{{ props.item.codgioPersona.nombres }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>{{ props.item.codigoTipoComprobante.descripcion }}</td>
          <td>{{ props.item.serieComprobante }}</td>
          <td>{{ props.item.numComprobante }}</td>
          <td>{{formatearFecha(props.item.createdAt)}}</td>
          <td>{{ props.item.impuesto }}</td>
          <td>{{ props.item.total }}</td>
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
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12 xl2 class="font-weight-bold green--text" style="font-size:20px">
            <span>Farmacia: {{Farmacia}}</span>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
                v-model="codigoTipoComprobante"
                :items="tiposcomprobantes"
                label="Tipo Comprobante"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="serieComprobante" readonly label="Serie Comprobante"></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="numComprobante" label="Número Comprobante"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-autocomplete :items="personas" v-model="codgioPersona" label="Proveedor"></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field v-model="codigoBarras" label="Código" @keyup.enter="buscarCodigo()"></v-text-field>
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
                    <v-icon small class="mr-2 " @click="eliminarDetalle(detalles,props.item)">delete</v-icon>
                  </td>
                  <td class="text-xs-center blue--text">{{ props.item.producto }}</td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.cantidad" type="number"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    {{ props.item.fracciones*props.item.cantidad}}
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.costoNeto" type="number"></v-text-field>
                  </td>
                  <td>
                    <div v-if="props.item.iva">
                      {{props.item.costoNeto*0.12}}

                    </div>
                    <div v-else>
                      0
                    </div>
                  </td>
                  <td class="text-xs-right">


                    {{ (props.item.cantidad * props.item.costoNeto)  }}


                  </td>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Total Parcial:</strong>
                $
                {{totalParcial=(caltularSubtotal).toFixed(5)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Impuesto:</strong>
                $ {{totalImpuesto=(calcularIva).toFixed(5)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total:</strong>
                $ {{total=calcularTotal.toFixed(5)}}
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Cancelar</v-btn>
            <v-btn color="success" v-if="verDetalle==0" @click.native="guardar()">Guardar</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
// -------------------------------------------->
<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import Swal from "sweetalert2";


export default {
  data() {
    return {
      codigoFar:"",
      finicio: "",
      ffin: "",

      modal5:false,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4:false,
      ExportarModal: 0,
      ImprimirModal: 0,
      Idfactrua: "",
      clave: "",
      Efec_Val: 0,
      credito_Val: 0,
      credito_Pla: "dias",
      credito_Tiem: 15,
      credito_plazo: 15,
      chckTarjetaC: false,
      chckTarjetaD: false,
      chckCr: false,
      chckEfectivo: true,
      documetos: [],
      dialog: false,
      search: "",
      compras: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Farmacia", value: "codigoFarmacia" },

        { text: "Usuario", value: "codigoUsuario.nombres", sortable: true },
        { text: "Proveedor", value: "codgioPersona.nombres", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: true },
        {
          text: "Tipo Comprobante",
          value: "codigoTipoComprobante.descripcion",
          sortable: true
        },
        {
          text: "Serie comprobante",
          value: "serieComprobante",
          sortable: false
        },
        {
          text: "Número comprobante",
          value: "numComprobante",
          sortable: false
        },
        { text: "Fecha", value: "createdAt", sortable: true },
        { text: "Impuesto", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false }
      ],
      _id: "",
      codgioPersona: "",
      personas: [],
      codigoTipoComprobante: "",
      tiposcomprobantes: [],
      serieComprobante: "001",
      numComprobante: "",
      codigo: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Producto", value: "producto", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Fraccion", value: "fracciones", sortable: false },
        { text: "Costo Neto", value: "costoNeto", sortable: false },
        { text: "IVA?", value: "iva", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false }
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
        { text: "Stock", value: "stock", sortable: false },
        { text: "Fracciones totales", value: "fraccionesTotales" },
        { text: "Precio Venta", value: "precioVenta", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      verDetalle: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      obj: [],
      codigoBarras: "",
      iva: 0,
      descripcion: "",
      Farmacia: "",
      farmacias: [],
      detalleXml: [],
      contador: "",
      clientes: [],
      contarCantidades: "",
      tipo: "",
      comprobanteModal: 0,
      facturaModal: 0,
      formaspagoModal: 0,
      fecha: null,
      FarmaciasModal: 0,

    };
  },
  computed: {
    calcularTotal: function() {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if(this.detalles[i].iva==1){
          resultado =
              resultado + (this.detalles[i].cantidad * this.detalles[i].costoNeto*0.12) + (this.detalles[i].cantidad * this.detalles[i].costoNeto);
        }else{
          resultado =
              resultado + this.detalles[i].cantidad * this.detalles[i].costoNeto;
        }
      }
      return resultado;
    },
    caltularSubtotal: function() {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {

        resultado =
            resultado + this.detalles[i].cantidad * this.detalles[i].costoNeto;

      }
      return resultado;
    },
    calcularIva: function() {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        if(this.detalles[i].iva==1){
          resultado =
              resultado + (this.detalles[i].cantidad * this.detalles[i].costoNeto*0.12) ;
        }
      }
      return resultado;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.selectFarmacias()
    this.selectTipocomprobante()
    this.selectPersona()
  },
  methods: {
    selectPersona() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
          .get("persona/listProveedor", configuracion)
          .then(function(response) {
            personaArray = response.data;
            personaArray.map(function(x) {
              me.personas.push({ text: x.nombres, value: x._id });
            });
          })
          .catch(function(error) {
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
          .then(function(response) {
            tipocomprobanteArray = response.data;
            tipocomprobanteArray.map(function(x) {
              me.tiposcomprobantes.push({ text: x.descripcion, value: x._id });
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    mostrarmodalfarmacias(){
      this.FarmaciasModal=1
    },
    ocultarmodalfarmacias(){
      this.FarmaciasModal=0
    },
    consultarporfechas(){
      let me = this;
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let fechainicial = new Date(this.finicio+' 07:00:00')
      let fechafinal = new Date(this.ffin+' 23:00:00')
      if (codigoFarmacia == undefined) {
        axios
            .get("ingresos/listporfechas?valor=" + me.codigoFar+"&fechainicio="+fechainicial.toISOString()+"&fechafin="+fechafinal.toISOString())
            .then(function(response) {
              me.compras = response.data;
              me.ocultarmodalfarmacias()
            })
            .catch(function(error) {
              console.log(error);
            });
      }
      else {
        axios
            .get("ingresos/listporfechas?valor=" + codigoFarmacia+"&fechainicio="+fechainicial.toISOString()+"&fechafin="+fechafinal.toISOString())
            .then(function(response) {
              me.compras = response.data;
              me.ocultarmodalfarmacias()
            })
            .catch(function(error) {
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
            .then(function(response) {
              ArrayT = response.data;
              ArrayT.map(function(x) {
                me.farmacias.push({ text: x.descripcion, value: x._id });
              });
            })
            .catch(function(error) {
              console.log(error);
            });
      }
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm')
      }
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
          .get("ingresos/query?_id=" + id, configuracion)
          .then(function(response) {
            me.detalles = response.data.detalles;
          })
          .catch(function(error) {
            console.log(error);
          });
    },
    verIngreso(item) {
      this.limpiar();

      this.codigoTipoComprobante = item.codigoTipoComprobante._id;
      this.descripcion=item.descripcion;
      this.serieComprobante = item.serieComprobante;
      this.numComprobante = item.numComprobante;
      this.codgioPersona = item.codgioPersona._id;
      this.impuesto = item.impuesto;

      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
    },
    limpiar() {
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
    },

  },
};
</script>
<style>
#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  border-radius: 15px;
  float: left;
  width: 45%;
}
#imagen {
  display: block;
  margin-left: 5%;
  width: 340px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
}

#datos {
  border-style: solid;
  border-width: 1px;

  width: 97%;
}

#encabezado {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
}

#facliente {
  margin-top: 1%;
  border-style: solid;
  border-width: 1px;
  width: 97%;
  border-collapse: collapse;
  border-spacing: 0px;
  margin-bottom: 1px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 97%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: blue;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}

#compro {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  text-align: center;
}

#fact1 {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  width: 90%;
}

#datos1 {
  width: 90%;
}

#encabezado1 {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
  width: 90%;
}

section {
  clear: left;
}

#cliente1 {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
}

#facliente1 {
  width: 90%;
  border-collapse: collapse;
  border-spacing: 0px;
}

#fa1 {
  color: black;
  font-size: 14px;
}

#facarticulo1 {
  width: 90%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
}

#facarticulo1 thead {
  padding: 20px;
  background: white;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias1 {
  margin-left: 1%;
  text-align: left;
}
</style>
 