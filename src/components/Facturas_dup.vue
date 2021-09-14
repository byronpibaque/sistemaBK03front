<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Facturas duplicadas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
         <v-btn class="primary" @click="mostrarFarmacias">
          Filtrar
        </v-btn>
        <v-spacer></v-spacer>
       
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table :headers="headers" :items="accesos" :search="search" class="elevation-1">
         <template v-slot:items="props">
                                  <td class="justify-center layout px-0">
                                  <template v-if="props.item.estado">
                                      <v-icon small @click="activarDesactivarMostrarT(2,props.item)">block</v-icon>
                                    </template>
                                    <template v-else>
                                      <v-icon small @click="activarDesactivarMostrarT(1,props.item)">check</v-icon>
                                    </template>
                                  </td>
                                  <td>
                                    <div class="blue--text"> {{ props.item.numComprobante }}</div>
                                  </td>
                                  <td>
                                    <div > {{ props.item.total }}</div>
                                  </td>
                                  <td>
                                    <div > {{ props.item.impuesto }}</div>
                                  </td>
                                  <td>
                                    <div> {{ props.item.ca }}</div>
                                  </td>
                                   <td>
                                    <div class="blue--text"> {{ formatearFecha(props.item.fecha) }}</div>
                                  </td>
                                   
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
          <v-btn color="primary" @click="listar()">RECARGAR</v-btn>
        </template>
      </v-data-table>
    
      <v-dialog v-model="adModalT" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion==1">Activar </v-card-title>
            <v-card-title class="headline" v-if="adAccion==2">Anular</v-card-title>
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion==1">Activar</span>
              <span v-if="adAccion==2">Anular</span>
              la factura con Num. Comprobante: {{adNombre}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="activarDesactivarCerrarT()" color="green darken-1" flat="flat">Cancelar</v-btn>
              <v-btn
                v-if="adAccion==1"
                @click="activarT()"
                color="orange darken-4"
                flat="flat"
              >Activar</v-btn>
              <v-btn
                v-if="adAccion==2"
                @click="desactivarT()"
                color="orange darken-4"
                flat="flat"
              >Desactivar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
                         <v-container grid-list-md v-if="$store.state.usuario.codigoFarmacia == undefined||$store.state.usuario.rol=='5ee381d7005ebf28f0e5260b'">
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                              <v-autocomplete :items="Farmacias" v-model="codigoFarmacia" v-on:change="selectUsuarios()" label="Farmacia:"></v-autocomplete>
                            </v-flex>
                             <v-flex xs12 sm12 md12 lg12 xl12>
                              <v-autocomplete :items="Usuarios" v-model="codigoUsuario" label="Usuario:"></v-autocomplete>
                            </v-flex>
                        </v-layout>
                      </v-container>  
                </v-card-text>
                   <v-card-actions>
                  <v-btn color="primary" @click="listar()">Buscar</v-btn>
                   <v-btn color="secundary" @click="ocultarFarmacias()">Cancelar</v-btn>
              </v-card-actions>
              </v-card>
            </v-dialog>
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
      codigoFarmacia:"",
      codigoUsuario:"",
      FarmaciasModal:0,
      finicio: "",
      ffin: "",
      modal2:false,
      modal5:false,
      CabezadetalleTransfer:[  
        { text: "Producto", value: "producto", sortable: false },
        { text: "Cant", value: "cantidad", sortable: false },
        { text: "F/C", value: "fracciones", sortable: false },
        { text: "P. Venta", value: ["precioVenta", "precioUni"], sortable: false },
        { text: "P Unitario", value: "precioUni", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "IVA?", value: "iva", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false },
        ],
      detalleTransfer:[],
      textobusqueda:'',
      transfer:[],
      cabezatransfer:[
        { text: "Opciones", value: "opciones", sortable: false },
        {
          text: "Farmacia E",
          value: "descripcion",
          sortable: true,
        },
          {
          text: "Farmacia R",
          value: "descripcion",
          sortable: true,
        },
        { text: "Num Comprobante", value: "numComprobante", sortable: false },
        { text: "Usuario", value: "nombres", sortable: false },
        { text: "Cliente", value: "nombres", sortable: false },
      
        { text: "Fecha", value: "createdAt", sortable: true },
       
        { text: "Estado", value: "estado", sortable: false },
      ],
      adIdT: "",
      modalTransferencias:0,
      transferenciaView:0,
      adModalT:0,
      numComT:"",
      FarmaciaEmiT:"",
      FarmaciaRecT:"",
      UsuarioT:"",
      Cliente:"",
      Fecha:"",
      dialog: false,
      search: "",
      accesos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Num. Comprobante", value: "numComprobante", sortable: true },
       
        { text: "Total", value: "total", sortable: false },
        { text: "Impuesto", value: "impuesto", sortable: false },
      
        { text: "CA/NA", value: "claveAcceso", sortable: false },
         { text: "Fecha", value: "createdAt", sortable: true },
        { text: "Estado", value: "estado", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      user:'',
      Usuarios:[],
      rol: "",
      roles: [],
      farma:'',
      Farmacias:[],
      email: "",
      password: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    
    this.selectrFarmacia();
    
  },
  methods: {
 
  formatearFecha(value) {
    if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
  },
 
  selectrFarmacia(){
    let me=this;
    let RolesArray=[];
    let header={"Token" : this.$store.state.token};
    let configuracion= {headers : header};            
    axios.get('farmacia/list',configuracion).then(function (response){
        RolesArray=response.data;
        RolesArray.map(function(x){
            me.Farmacias.push({text:x.descripcion, value:x._id});
        });
    }).catch(function(error){
        console.log(error);
    });
  },
  selectUsuarios(){
    this.Usuarios=[]
    let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
 
      axios
        .get("login/listFiltro?codigoFarmacia=" + this.codigoFarmacia, configuracion)
        .then(function (response) {
          personaArray = response.data;
          personaArray.map(function (x) {
            me.Usuarios.push({ text: x.codigoUsuario.nombres, value: x.codigoUsuario._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  listar() {
    let me = this;
    let header = { Token: this.$store.state.token };
    let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
    let codigoUsuario = this.$store.state.usuario.codigoUsuario;
    let configuracion = { headers: header };
    let arrito=[]
   
    if(codigoFarmacia==undefined){
     axios
        .get(
          "ventas/facturasdup?codigoFarmacia="+this.codigoFarmacia+"&start="+this.finicio+"&end="+this.ffin+"&codigoUsuario="+this.codigoUsuario,
          configuracion
        )
        .then(function (response) {
          
         me.accesos=response.data

        })
        .catch(function (error) {
          console.log(error);
        });
    }else{
      axios
        .get(
          "ventas/facturasdup?codigoFarmacia="+codigoFarmacia+"&start="+this.finicio+"&end="+this.ffin+"&codigoUsuario="+codigoUsuario,
          configuracion
        )
        .then(function (response) {
          me.accesos=response.data

        })
        .catch(function (error) {
          console.log(error);
        });
    }
    
  },
  limpiar() {
  this._id = "";
  this.user = "";
  this.rol="";
  this.email = "";
  this.password = "";
  this.valida = 0;
  this.validaMensaje = [];
  this.editedIndex = -1;
  },

  
  activarT() {
  let me = this;
  let header = { Token: this.$store.state.token };
  let configuracion = { headers: header };
  axios
    .put("ventas/activated", { _id: this.adIdT }, configuracion)
    .then(function (response) {
      me.adModalT = 0;
      me.adAccion = 0;
      me.adNombre = "";
      me.adIdT = "";
      me.listar();
      
      
    })
    .catch(function (error) {
      console.log(error);
    });
    },
  desactivarT() {
    let me = this;
    let header = { Token: this.$store.state.token };
    let configuracion = { headers: header };

    axios
      .put("ventas/deactivated", { _id: this.adIdT }, configuracion)
      .then(function (response) {
        me.adModalT = 0;
        me.adAccion = 0;
        me.adNombre = "";
        me.adIdT = "";
        me.listar();
        
      })
      .catch(function (error) {
        console.log(error);
      });
  }, 
  activarDesactivarCerrarT() {
    this.adModalT = 0;
  },  
  activarDesactivarMostrarT(accion, item) {
    this.adModalT = 1;
    this.adNombre = item.numComprobante;
    this.obj = item;
    this.adIdT = item._id;
   
    if (accion == 1) {
      this.adAccion = 1;
    } else if (accion == 2) {
      this.adAccion = 2;
    } else {
      this.adModalT = 0;
    }
  }, 
  verTransferencia(item){
    this.transferenciaView=1
    this.numComT=item.numComprobante
    this.detalleTransfer=item.detalles
    this.FarmaciaEmiT=item.codigoFarmaciaE.descripcion
    this.FarmaciaRecT=item.codigoFarmaciaR.descripcion
    this.UsuarioT=item.codigoUsuario.nombres
    this.Cliente=item.codigoPersona.nombres
    this.Fecha=this.formatearFecha(item.createdAt)
  },
  ocultarTransferencia(){
  this.transferenciaView=0
  },
   mostrarFarmacias() {
      this.FarmaciasModal = 1;
    },
    ocultarFarmacias() {
      this.FarmaciasModal = 0;
    },
  },
  
};
</script>
