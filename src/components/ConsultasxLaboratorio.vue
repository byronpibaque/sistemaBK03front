<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Consulta de Ventas por Laboratorio</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-toolbar>
             <v-container grid-list-md class="white">
                <v-layout wrap> 
                <v-flex xs12 sm4 md4 lg4 xl4>
                <v-autocomplete :items="inventarios" v-model="codigoInventario"  v-on:change="listarLaboratorios()"   label="Inventarios:"></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm4 md4 lg4 xl4 v-if="codigoInventario">
                <v-autocomplete :items="laboratorios" v-model="codigoLaboratorio" v-on:change="listarProductos()" label="Laboratorios:"></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm4 md4 lg4 xl4 v-if="codigoLaboratorio">
                <v-autocomplete :items="productos" v-model="codigoProducto" v-on:change="listarVentasporLaboratorios()" label="Productos:"></v-autocomplete>
                </v-flex>
                </v-layout>
            </v-container>
              <v-data-table :headers="headers"
                            :items="ventas"
                            :search="search"
                            class="elevation-1"
                            v-if="verNuevo==0"  >
                    <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                       <v-icon small class="mr-2" @click="verIngreso(props.item)">tab</v-icon>
                       <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">print</v-icon>
                    </td>
                    
                    <td>
                            <div
                            class="blue--text"
                            v-if="props.item.codigoFarmacia"
                            >{{ props.item.codigoFarmacia.descripcion }}</div>
                            <div v-else>
                            <span class="red--text">Indefinida</span>
                            </div>
                        </td>
                        <td class="green--text">{{ props.item.numComprobante }}</td>
                        <td>{{ props.item.codigoUsuario.nombres }}</td>
                        <td class="pink--text">{{ props.item.codgioPersona.nombres }}</td>
                        <td>{{ props.item.codigoTipoComprobante.descripcion }}</td>

                        <td>{{formatearFecha(props.item.createdAt)}}</td>
                        
                        
                        
                        <td>
                            <div v-if="props.item.impuesto">{{ props.item.impuesto }}</div>
                            <div v-else>
                            <span class="red--text">No</span>
                            </div>
                        </td>
                        <td>{{props.item.total }}</td>
                        
                        <td>{{props.item.formapago}}</td>
                        <td>{{props.item.claveAcceso}}</td>
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
                    <span class="red--text">No hay datos</span>
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
            style="font-size:20px"
          >
            <span>Farmacia: {{Farmacia}}</span>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4  class=" font-weight-bold blue--text"
            style=" font-size:35px">
            FACTURA
          </v-flex>

          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="serieComprobante" readonly label="Serie Comprobante"></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="numComprobante" readonly label="Número Comprobante"></v-text-field>
          </v-flex>
          <v-flex xs14 sm4 md4 lg4 xl4>
            <v-autocomplete :items="formaPagos" v-on:change="formaPago()"   v-model="fpago" label="Forma de Pago"></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-autocomplete :items="personas" v-model="codgioPersona" label="Cliente"></v-autocomplete>
          </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostraragregarclientemodal()">
              <v-icon dark>edit</v-icon>
            </v-btn>
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
                    <v-icon small class="mr-2" @click="eliminarDetalle(detalles,props.item)">delete</v-icon>
                  </td>
                  <!-- <td class="text-xs-center blue--text">{{ props.item.codigoB }}</td> -->
                  <td class="text-xs-center blue--text">{{ props.item.producto }}</td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.cantidad" type="number" ></v-text-field>
                  </td>
                   <!-- <td class="text-xs-center green--text">
                    <v-text-field v-model="props.item.stock" readonly type="number"></v-text-field>
                  </td> -->
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.fracciones" type="number"></v-text-field>
                  </td>
                  <!-- <td class="text-xs-center blue--text">
                    <v-text-field v-model="props.item.fraccionesTotales" readonly type="number"></v-text-field>
                  </td> -->
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.precioVenta" type="number"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.precioUni" type="number"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.item.descuento" type="number"></v-text-field>
                  </td>
                  <td>
                    <div v-if="props.item.iva!=0">
                      <div v-if="props.item.cantidad==0">
                        {{ ((props.item.fracciones * props.item.precioUni)
                        - ((props.item.fracciones * props.item.precioUni)*props.item.descuento)/100)*0.12}}
                      </div>
                      <div v-else>
                        {{ ((props.item.cantidad * props.item.precioVenta)
                        - ((props.item.cantidad * props.item.precioVenta)*props.item.descuento)/100)*0.12}}
                      </div>
                    </div>
                    <div class="red--text" v-else>No</div>
                  </td>
                  <td class="text-xs-right">
                    <div v-if="props.item.cantidad==0">
                      {{(props.item.fracciones * props.item.precioUni)
                      - ((props.item.fracciones * props.item.precioUni)*props.item.descuento)/100}}
                    </div>
                    <div v-else>
                      {{(props.item.cantidad * props.item.precioVenta)
                      - ((props.item.cantidad * props.item.precioVenta)*props.item.descuento)/100 }}
                    </div>
                  </td>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Total Parcial:</strong>
                $
                {{totalParcial=(caltularSubtotal).toFixed(2)}}
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
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()"><v-icon>home</v-icon>Atras</v-btn>
            <v-btn color="success" v-if="verDetalle==0"  @click.native="guardar()">
              <v-icon>save</v-icon>
               Guardar</v-btn>
            <v-btn color="success" v-if="verDetalle==0" @click.native="imprimirComprobante()"><v-icon>print</v-icon>Imprimir</v-btn>
            <v-btn color="secondary" v-if="verDetalle==0" @click.native="mostrarFactura()"><v-icon>computer</v-icon>Ver</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from "axios";
    import jsPDF from "jspdf";
    import html2canvas from 'html2canvas';
    import moment from "moment";
    import Swal from 'sweetalert2'

    export default {
        data(){
            return{
                dialog: false,
                search:'',
                editedIndex: -1,
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
                headers: [
                            { text: "Opciones", value: "opciones", sortable: false },
                            { text: "Farmacia", value: "codigoFarmacia.descripcion", sortable: false},
                            { text: "Num Comprobante", value: "numComprobante", sortable: false },
                            { text: "Usuario", value: "codigoUsuario.nombres", sortable: false },
                            { text: "Cliente", value: "codgioPersona.nombres", sortable: false },
                            { text: "Tipo Comprobante", value: "codigoTipoComprobante.descripcion",sortable: false},
                            { text: "Fecha", value: "createdAt", sortable: true },
                            { text: "Impuesto", value: "impuesto", sortable: false },
                            { text: "Total", value: "total", sortable: false },
                            { text: "Forma de pago", value: "formapago", sortable: false },
                            { text: "CA/NA", value: "claveAcceso", sortable: false },
                            { text: "Estado", value: "estado", sortable: false }
                        ],
                ventas:[],
                laboratorios:[],
                codigoLaboratorio:"",
                productos:[],
                codigoProducto:"",
                inventarios:[],
                codigoInventario:'',
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
                    //{ text: "Codigo", value: "codigoB", sortable: false },
                    { text: "Producto", value: "producto", sortable: false },
                    { text: "Cantidad", value: "cantidad", sortable: false },
                // { text: "Stock", value: "stock", sortable: false },
                    { text: "Fraccion/Caja", value: "fracciones", sortable: false },
                // { text: "Fracciones totales", value: "fraccionesTotales", sortable: false },
                    { text: "PVP", value: ["precioVenta", "precioUni"], sortable: false },
                    { text: "Precio Unit.", value: "precioUni", sortable: false },
                    { text: "Descuento", value: "descuento", sortable: false },
                    { text: "IVA?", value: "iva", sortable: false },
                    { text: "Sub Total", value: "subtotal", sortable: false }
                ],
                detalles: [],
                verNuevo: 0,
                errorArticulo: null,
                total: 0.0,
                totalParcial: 0.0,
                totalImpuesto: 0.0,
                verDetalle: 0,
                valida: 0,
                validaMensaje: [],
                adModal: 0,
                adAccion: 0,
                adNombre: "",
                adId: "",
                obj:[],
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
                comprobanteModal:0,
                facturaModal:0,
                formaspagoModal:0,
                fecha:null,
                formaPagos:['Efectivo','Otra forma de pago'],
                fpago:"Efectivo",
                claveAc:null,
                row:null,
                agregarclienteModal:0,
                nombres:'',
                tipodocumento:'',
                numDocumento:'',
                direccion:'',
                telefono:'',
                email:'',
                inventario:[],
                codigoInventario:'',
                FarmaciasModal:0
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            },
                calcularFormaPago: function () {
                let total = this.calcularTotal.toFixed(2);
                let val=0
                if(this.chckCr && this.chckEfectivo){
                let suma = parseFloat(this.credito_Val)+parseFloat(this.Efec_Val)
                val = total-suma
                }
                
                return val.toFixed(2)
                },
                calcularTotal: function() {
                let resultado = 0.0;
                for (var i = 0; i < this.detalles.length; i++) {
                    if (this.detalles[i].iva != 0) {
                    resultado = this.caltularSubtotal + this.calcularIva;
                    } else {
                    if (this.detalles[i].cantidad == 0) {
                        resultado =
                        resultado +
                        this.detalles[i].fracciones * this.detalles[i].precioUni -
                        ((this.detalles[i].fracciones *
                            this.detalles[i].precioUni *
                            this.detalles[i].descuento) /
                            100);
                    } else {
                        resultado =
                        resultado +
                        this.detalles[i].cantidad * this.detalles[i].precioVenta -
                        ((this.detalles[i].cantidad *
                            this.detalles[i].precioVenta *
                            this.detalles[i].descuento) /
                            100);
                    }
                    }
                }
                return resultado;
                },
                caltularSubtotal: function() {
                let resultado = 0.0;
                for (var i = 0; i < this.detalles.length; i++) {
                    if (this.detalles[i].cantidad == 0) {
                    resultado =
                        resultado +
                        this.detalles[i].fracciones * this.detalles[i].precioUni -
                        (this.detalles[i].fracciones *
                        this.detalles[i].precioUni *
                        this.detalles[i].descuento) /
                        100;
                    } else {
                    resultado =
                        resultado +
                        this.detalles[i].cantidad * this.detalles[i].precioVenta -
                        (this.detalles[i].cantidad *
                        this.detalles[i].precioVenta *
                        this.detalles[i].descuento) /
                        100;
                    }
                }
                return resultado;
                },
                calcularIva: function() {
                let resultado = 0.0;
                for (var i = 0; i < this.detalles.length; i++) {
                    if (this.detalles[i].iva != 0) {
                    if (this.detalles[i].cantidad == 0) {
                        resultado =
                        resultado +
                        (this.detalles[i].fracciones * this.detalles[i].precioUni -
                            (this.detalles[i].fracciones *
                            this.detalles[i].precioUni *
                            this.detalles[i].descuento) /
                            100) *
                            0.12;
                    } else {
                        resultado =
                        resultado +
                        (this.detalles[i].cantidad * this.detalles[i].precioVenta -
                            (this.detalles[i].cantidad *
                            this.detalles[i].precioVenta *
                            this.detalles[i].descuento) /
                            100) *
                            0.12;
                    }
                    }
                }
                return resultado;
                },
                calcularDcto: function() {
                let resultado = 0.0;
                for (var i = 0; i < this.detalles.length; i++) {
                    if (this.detalles[i].iva != 0) {
                    if (this.detalles[i].cantidad == 0) {
                        resultado =
                        resultado +
                        
                            (this.detalles[i].fracciones *
                            this.detalles[i].precioUni *
                            this.detalles[i].descuento) /100;
                    } else {
                        resultado =
                        resultado +
                        
                            (this.detalles[i].cantidad *
                            this.detalles[i].precioVenta *
                            this.detalles[i].descuento) /
                            100;
                    }
                    }
                }
                return resultado;
                }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {

            this.listarInventarios()
        },
        methods: {
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
                } else {
                    axios
                    .get("farmacia/query?_id=" + codigoFarmacia, configuracion)
                    .then(function(response) {
                        me.farmacias.push({
                        text: response.data.descripcion,
                        value: response.data._id
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }
                },
            selectPersona() {
                let me = this;
                let personaArray = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("persona/listCliente", configuracion)
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
                    .get("ventas/query?_id=" + id, configuracion)
                    .then(function(response) {
                    me.detalles = response.data.detalles;
                    })
                    .catch(function(error) {
                    console.log(error);
                    });
            },
            verIngreso(item) {
                this.codigoTipoComprobante = item.codigoTipoComprobante._id;
                this.serieComprobante = item.serieComprobante;
                this.numComprobante = item.numComprobante;
                this.codgioPersona = item.codgioPersona._id;
                this.impuesto = item.impuesto;
                this.listarDetalles(item._id);
                this.verNuevo = 1;
                this.verDetalle = 1;
            },
            listarVentasporLaboratorios(){
                
                let me = this;
                me.selectPersona();
                me.selectFarmacias();
                let header = { Token: this.$store.state.token };
                // let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                // let codigoUser = this.$store.state.usuario.codigoUsuario;

                let configuracion = { headers: header };

                
                    axios
                    .get(
                        "ventas/listLaboratorios?valor=" + me.codigoProducto ,
                        configuracion
                    )
                    .then(function(response) {
                        
                             me.ventas = response.data;
                       
                       
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                
            },
            listarInventarios(){
            let me = this;
            let LaboratorioArray = [];
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };
            axios
                .get("inventario/list", configuracion)
                .then(function(response) {
                LaboratorioArray = response.data;
                LaboratorioArray.map(function(x) {
                    me.inventarios.push({ text: x.descripcion, value: x._id });
                });
                })
                .catch(function(error) {
                console.log(error);
                });


        },
            listarLaboratorios(){
            let me = this;
            me.laboratorios=[]
            me.codigoLaboratorio=""
            let LaboratorioArray = [];
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };
            axios
                .get("laboratorio/list", configuracion)
                .then(function(response) {
                LaboratorioArray = response.data;
                LaboratorioArray.map(function(x) {
                    me.laboratorios.push({ text: x.nombre, value: x._id });
                });
                })
                .catch(function(error) {
                console.log(error);
                });


        },
            listarProductos(){
                let me = this;
                me.productos=[]
                me.codigoProducto="" 
                let LaboratorioArray = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("productos/listA?valor="+me.codigoLaboratorio+"&valor2="+me.codigoInventario, configuracion)
                    .then(function(response) {
                    LaboratorioArray = response.data;
                    LaboratorioArray.map(function(x) {
                        me.productos.push({ text: x.nombre, value: x._id });
                    });
                    })
                    .catch(function(error) {
                    console.log(error);
                    });

            },
            limpiar(){
               
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            editItem (item) {
             
                this.dialog = true;
                this.editedIndex=1;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.descripcion;
                this.adId=item._id;
                if (accion==1){
                    this.adAccion=1;
                } else if(accion==2){
                    this.adAccion=2;
                } else{
                    this.adModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                axios.put('rol/activate',{'_id':this.adId})
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            desactivar(){
                let me=this;
                axios.put('rol/deactivate',{'_id':this.adId})
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            close () {
                this.dialog = false;
            },
             mostrarNuevo() {
                this.verNuevo = 1;
                this.ObtenerConteoVenta();
            },
            ocultarNuevo() {
                this.verNuevo = 0;
                this.limpiar();
                this.listar();
            },
        }
    }
</script>
