<template>
<v-layout align-start>
    <v-flex>
            <v-toolbar flat color="white" >
        <v-toolbar-title>Ventas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        
    
        <v-dialog v-model="dialog"  max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
                <v-checkbox 
              style="margin-top:15px" 
              color="success"
              v-model="checkbox"
              label="Buscar en todas las farmacias"
              @change="limpiararri()"
          ></v-checkbox>
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
                            <v-icon small class="mr-2" @click="agregarDetalle(props.item)">add</v-icon>
                          </td>
                           <td class="blue--text">{{props.item.codigoInventario.descripcion}}</td>
                          <td>{{ props.item.nombreComercial }}</td>
                          <td>{{ props.item.nombre }}</td>
                           <td class="green--text">${{((props.item.precioUni)-((props.item.precioUni*props.item.descuento)/100)).toFixed(2)}}</td>
                          <td class="green--text">${{props.item.precioUni}}</td>
                          <td class="blue--text">{{  Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja)) }}</td>
                          <td  class="green--text" v-if="props.item.fraccionCaja!=1">{{
                            Math.round(((props.item.fraccionesTotales/props.item.fraccionCaja - Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja))))*props.item.fraccionCaja)
                            }}</td>
                            <td class="green--text" v-else>
                            {{props.item.fraccionCaja*props.item.fraccionesTotales}}
                            </td>
                          <td>${{ props.item.pvp}}</td>
                          <td>{{ props.item.descuento}}%</td>
                        
                           <td class="blue--text">{{ props.item.codigoBarras }}</td>
                          
                          <td class="green--text">{{ props.item.codigoLaboratorio.abreviatura }}</td>
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
      
     
        </v-toolbar>
        <v-dialog v-model="agregarclienteModal" max-width="700px">
            <v-card>
            <v-card-title class="headline">Agregar Cliente: <hr> </v-card-title>
                <v-card-text>
                <v-container grid-list-md>
                <v-layout wrap>

                    <v-flex xs12 sm12 md12>
                    <v-text-field v-model="nombres" required onkeyup="javascript:this.value=this.value.toUpperCase();" label="Nombres"></v-text-field>
                    </v-flex>
                    

                    <v-flex xs12 sm6 md6>
                        <v-select v-model="tipodocumento" :items="documetos" label="Tipo documento"></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="numDocumento" required label="Numero documento"></v-text-field>
                    </v-flex>
                        <v-flex  xs12 sm3 md3 lg3 xl3 >
                    <v-autocomplete v-model="codigoRegion" @change="listarProvincias(codigoRegion)" :items="regiones" label="Selecciona una region"
                    ></v-autocomplete>
                    </v-flex>
                    <v-flex  xs12 sm4 md4 lg4 xl4 >
                    <v-autocomplete v-model="codigoProvincia" :items="provincias" @change="listarCiudades(codigoProvincia)" label="Selecciona una provincia"
                    ></v-autocomplete>
                    </v-flex>
                    <v-flex  xs12 sm4 md4 lg4 xl4 >
                    <v-autocomplete v-model="codigoCiudad" :items="ciudades" label="Selecciona una ciudad"
                    ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                    <v-text-field v-model="parroquia" label="Parroquia" onkeyup="javascript:this.value=this.value.toUpperCase();" ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="direccion" required onkeyup="javascript:this.value=this.value.toUpperCase();" label="Direccion"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="telefono" required type="number" label="Telefono"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="email" required type="email" label="Email"></v-text-field>
                    </v-flex>
                </v-layout>
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
            
                <v-btn color="blue darken-1" flat @click="guardarCliente">Guardar</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container grid-list-sm class="pa-4 white" >
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
            COTIZACION
            </v-flex>

            <v-flex xs12 sm12 md12 lg12 xl12>
            </v-flex>
            <v-flex xs3 sm3 md3 lg3 xl3>
                <v-text-field v-model="cedula" label="Cedula" @keyup.enter="buscarporcedula(cedula)"></v-text-field>
            </v-flex> 
            <v-flex xs1 sm1 md1 lg1 xl1>
            <v-btn small fab dark color="teal" @click="buscarporcedula(cedula)">
                <v-icon dark>search</v-icon>
            </v-btn>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
            <v-btn small fab dark color="teal" @click="selectPersona()">
                <v-icon dark>visibility</v-icon>
            </v-btn>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4 xl4>
            <v-autocomplete :items="personas" v-model="codgioPersona" label="Cliente"></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostraragregarclientemodal()">
                <v-icon dark>edit</v-icon>
            </v-btn>
            </v-flex>
            
            <v-flex xs12 sm12 md12 lg12 xl12>
            </v-flex>
            <v-flex xs6 sm6 md6 lg6 x6>
            <v-text-field v-model="codigoBarras" label="Código/Producto" @keyup.enter="buscarCodigo()"></v-text-field>
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
                    <td class="text-xs-center green--text" v-if="props.item.fraccionesTotales">
                        {{ props.item.codigoInventario.descripcion }}</td>
                     <td class="text-xs-center white--text" v-else bgcolor="#DF7878">
                        {{ props.item.codigoInventario.descripcion }}</td>   

                    <td class="text-xs-center blue--text" v-if="props.item.fraccionesTotales">{{ props.item.codigoB }}</td>
                    <td class="text-xs-center white--text" v-else bgcolor="#DF7878">
                        {{ props.item.codigoB  }}</td> 
                    <td class="text-xs-center blue--text"  v-if="props.item.fraccionesTotales">{{ props.item.producto }}</td>
                       <td class="text-xs-center white--text" v-else bgcolor="#DF7878">
                        {{ props.item.producto  }}</td> 
                    <td class="text-xs-center colortext" bgcolor="#4682dd">
                    <v-text-field id="cantidad" v-model="props.item.cantidad"  ></v-text-field>
                    </td>
                    <td class="text-xs-center colortext" bgcolor="#15A5EB"  v-if="props.item.fraccionCaja!=1">
                    <v-text-field v-model="props.item.fracciones" ></v-text-field>
                    </td>
                    <td class="text-xs-center colortext" bgcolor="#15A5EB"  v-else>
                    <span class="white--text">SOLO CAJAS</span>
                    </td>
                    <td class="text-xs-center white--text" bgcolor="#F88066"  >
                    
                    <div v-if="props.item.cantidad==0">
                        {{((props.item.fracciones * props.item.precioUni)
                        -(((props.item.fracciones*props.item.precioUni)*props.item.descuento)/100)).toFixed(2)
                        }}
                    </div>
                    <div v-else>
                    <div v-if="props.item.iva!=0">
                        {{              
                        (((props.item.cantidad * props.item.precioVenta)
                        +(props.item.fracciones * props.item.precioUni))-
                        (((props.item.cantidad * props.item.precioVenta)+(props.item.fracciones * props.item.precioUni))
                        *props.item.descuento)/100).toFixed(2)
                        
                        }}
                            
                        </div>
                        <div v-else>
                                {{ 
                            (((props.item.cantidad * props.item.precioVenta)+(props.item.fracciones * props.item.precioUni))-
                            (((props.item.cantidad * props.item.precioVenta)+(props.item.fracciones * props.item.precioUni))*props.item.descuento)/100).toFixed(2)
                            
                            
                            }}
                        </div>
                        
                    </div>
                    </td>
                    <!--<td class="text-xs-center">
                    <v-text-field id="cantidad"   v-model="props.item.bonificacion"  ></v-text-field>
                    </td>-->
                    
                    
                    <td class="text-xs-center green--text">
                    {{ Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja)) }}
                    </td>
                <td  class="green--text" v-if="props.item.fraccionCaja!=1">{{
                    Math.round(((props.item.fraccionesTotales/props.item.fraccionCaja - Math.floor((props.item.fraccionesTotales/props.item.fraccionCaja))))*props.item.fraccionCaja)
                    }}</td>
                    <td class="green--text" v-else>
                    {{props.item.fraccionCaja*props.item.fraccionesTotales}}
                    </td>                
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
                        {{ 
                            ((props.item.fracciones * props.item.precioUni))*0.12
                        }}
                        </div>
                        <div v-else>
                        {{
                        ((props.item.cantidad * props.item.precioVenta)*0.12)+
                            ((props.item.fracciones * props.item.precioUni)*0.12)
                        
                        }}
                        </div>
                    </div>
                    <div class="red--text" v-else>No</div>
                    </td>
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
                <v-flex class="text-xs-right">
                
                </v-flex>
                
                
            </template>
            </v-flex>

        </v-layout>
        </v-container>
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
                dialog: false,
                articulos:[],
                texto:"",
                checkbox:false,
                documetos: [],
                tipodocumento: "",
                parroquia:"",
                ciudades:[],
                codigoCiudad:"",
                regiones:[],
                codigoRegion:"",
                provincias:[],
                codigoProvincia:"",
                nombres: "",
                tipodocumento: "",
                numDocumento: "",
                direccion: "",
                telefono: "",
                email: "tuahorrocomprobantes@gmail.com",
                agregarclienteModal:0,
                Farmacia:"",
                cedula:"",
                personas:[],
                codgioPersona:"",
                codigoBarras:"",
                errorArticulo:"",
                cabeceraArticulos: [
                    { text: "Seleccionar", value: "seleccionar", sortable: false },
                    { text: "Farmacia", value: "codigoInventario", sortable: true },
                    { text: "Nombre Comercial", value: "nombreComercial", sortable: true },
                    { text: "Nombre", value: "nombre", sortable: true },
                    {
                    text: "Precio",
                    value: "precio",
                    sortable: true,
                    },
                    {
                    text: "P. Unit",
                    value: "precioUni",
                    sortable: true,
                    },
                    { text: "Cajas", value: "cajas" },
                    { text: "Fracciones", value: "fracciones", sortable: false },
                    
                    { text: "Precio Venta", value: "precioVenta", sortable: false },
                    { text: "Descuento", value: "descuento", sortable: false },
                
                    { text: "Código", value: "codigo", sortable: false },
                    {
                    text: "Laboratorio",
                    value: "codigoLaboratorio.abreviatura",
                    sortable: true,
                    },
                ],
                cabeceraDetalles: [
                    { text: "Borrar", value: "borrar", sortable: false },
                    { text: "Farmacia", value: "codigoInventario", sortable: false },
                    { text: "Codigo", value: "codigoB", sortable: false },
                    { text: "Producto", value: "producto", sortable: false },
                    { text: "Cant", value: "cantidad", sortable: false },
                    { text: "F/C", value: "fracciones", sortable: false },
                    { text: "Pre. con Desc.", value: "precio", sortable: false },
                    // { text: "Bonif", value: "bonificacion", sortable: false },
                    {
                    text: "Cajas",
                    value: "cajas",
                    sortable: false,
                    },
                    { text: "Fracciones", value: "fracciones", sortable: false },
                    
                
                    { text: "P. Venta", value: ["precioVenta", "precioUni"], sortable: false },
                    { text: "P Unitario", value: "precioUni", sortable: false },
                    { text: "Descuento", value: "descuento", sortable: false },
                    { text: "IVA?", value: "iva", sortable: false },
                    { text: "Subtotal", value: "subtotal", sortable: false },
                ],
                detalles: [],
                farmacias:[],
                Farmacia:""
            }            
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
        created() {
            this.selectPersona();
            this.listarProvincias()
            this.listarRegiones()
            this.listarCiudades()
            this.selectTipoDocumentos()
            this.ObtenerFa();
        },
        watch: {
            dialog(val) {
            val || this.close();
            },
        },
         methods: {
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
                buscarCodigo() {
                        let me = this;
                        me.errorArticulo = null;
                        let header1 = { Token: this.$store.state.token };
                        let configuracion1 = { headers: header1 };
                        let header = { Token: this.$store.state.token };
                        let configuracion = { headers: header };
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                        let codigoBarr = this.codigoBarras;
                        if(!isNaN(codigoBarr)){
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
                        }else{
                            me.dialog=1
                            me.texto=codigoBarr
                            me.listarArticulosnombres()
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
                    if (i !== -1) {
                        arr.splice(i, 1);
                    }
                },
                agregarDetalle(data) {
   
                    this.errorArticulo = null;
                    let resp;
                    let me = this;
                    let promocion;
                    let producto;
                    let bonificacion;
                    let fechainicio, fechafin;
                    let anoi, mesi, diai;
                    let anof, mesf, diaf;
                    let date_ob = new Date();
                    // current date
                    // adjust 0 before single digit date
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    // current month
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    // current year
                    let year = date_ob.getFullYear();
                    // current hours
                    let hours = date_ob.getHours();
                    // current minutes
                    let minutes = date_ob.getMinutes();
                    // current seconds
                    let seconds = date_ob.getSeconds();
                    // prints date in YYYY-MM-DD format
                    //let dat = year + "-" + month + "-" + date;
                    let dat = date + "/" + month + "/" + year;

                   
                        axios
                        .get("promocion/existe?codigoProducto=" + data._id)
                        .then(function (response) {
                            if (response.status != 204) {
                            resp = response.data;
                            
                            resp.forEach((element) => {
                                if (element.tipopromocion == "bonificacion") {
                                me.globalpromo = element.promocion;
                                promocion = element.promocion;
                                producto = promocion.slice(0, 1);
                                me.promocionGlo = producto;

                                bonificacion = promocion.slice(2, 3);
                                fechainicio = me.formatearFechaC(element.fechainicio);
                                fechafin = me.formatearFechaC(element.fechafin);

                                diai = fechainicio.slice(0, 2);

                                mesi = fechainicio.slice(3, 5);

                                anoi = fechainicio.slice(6, 10);

                                diaf = fechafin.slice(0, 2);

                                mesf = fechafin.slice(3, 5);

                                anof = fechafin.slice(6, 10);

                                //SI LA FECHA DE ACTUAL ESTA ENTRE LA FECHA DE INICIO Y FIN DE LA PROMOCION
                                if (dat >= fechainicio && dat <= fechafin) {
                                    if (me.encuentra(data._id) == true) {
                                    me.errorArticulo = "El artículo ya ha sido agregado.";
                                    } else {
                                    me.errorArticulo = "El artículo ESTA CON BONIFICACION!";
                                    me.detalles.push({
                                        _id: data._id,
                                        codigoInventario: data.codigoInventario,
                                        codigoB: data.codigoBarras,
                                        producto: data.nombreComercial,
                                        cantidad: producto,
                                        bonificacion: promocion,
                                        stock: data.stock,
                                        iva: data.iva,
                                        fracciones: data.fraccionCaja,
                                        fraccionesTotales: data.fraccionesTotales,
                                        precioVenta: data.pvp,
                                        precioUni: data.precioUni,
                                        descuento: data.descuento,
                                    });
                                    me.codigoBarras = "";
                                    }
                                }
                                //SI LA FECHA DE ACTUAL NOOO ESTA ENTRE LA FECHA DE INICIO Y FIN DE LA PROMOCION
                                else {
                                    if (me.encuentra(data._id) == true) {
                                    me.errorArticulo = "El artículo ya ha sido agregado.";
                                    } else {
                                    me.errorArticulo = "El artículo YA NO TIENE BONIFICACION";
                                    me.detalles.push({
                                        _id: data._id,
                                        codigoInventario: data.codigoInventario,
                                        codigoB: data.codigoBarras,
                                        producto: data.nombreComercial,
                                        cantidad: 0,
                                        bonificacion: 0,
                                        stock: data.stock,
                                        iva: data.iva,
                                        fracciones: data.fraccionCaja,
                                        fraccionesTotales: data.fraccionesTotales,
                                        precioVenta: data.pvp,
                                        precioUni: data.precioUni,
                                        descuento: data.descuento,
                                    });
                                    me.codigoBarras = "";
                                    }
                                }
                                } else if (element.tipopromocion == "descuento") {
                                promocion = element.promocion;

                                fechainicio = me.formatearFechaC(element.fechainicio);
                                fechafin = me.formatearFechaC(element.fechafin);

                                diai = fechainicio.slice(0, 2);

                                mesi = fechainicio.slice(3, 5);

                                anoi = fechainicio.slice(6, 10);

                                diaf = fechafin.slice(0, 2);

                                mesf = fechafin.slice(3, 5);

                                anof = fechafin.slice(6, 10);

                                //SI LA FECHA DE ACTUAL ESTA ENTRE LA FECHA DE INICIO Y FIN DE LA PROMOCION
                                if (dat >= fechainicio && dat <= fechafin) {
                                    if (me.encuentra(data._id) == true) {
                                    me.errorArticulo = "El artículo ya ha sido agregado.";
                                    } else {
                                    
                                    me.errorArticulo = "El artículo ESTA CON DESCUENTO ESPECIAL!";
                                    me.detalles.push({
                                    _id: data._id,
                                        codigoInventario: data.codigoInventario,
                                        codigoB: data.codigoBarras,
                                        producto: data.nombreComercial,
                                        cantidad: 0,
                                        bonificacion: 0,
                                        stock: data.stock,
                                        iva: data.iva,
                                        fracciones: 0,
                                        fraccionCaja:data.fraccionCaja,
                                        fraccionesTotales: data.fraccionesTotales,
                                        precioVenta: data.pvp,
                                        precioUni: data.precioUni,
                                        descuento: parseInt(promocion.slice(0, 2))+parseInt(data.descuento),
                                    });
                                    me.codigoBarras = "";
                                    }
                                }
                                //SI LA FECHA DE ACTUAL NOOO ESTA ENTRE LA FECHA DE INICIO Y FIN DE LA PROMOCION
                                else {
                                    if (me.encuentra(data._id) == true) {
                                    me.errorArticulo = "El artículo ya ha sido agregado.";
                                    } else {
                                    me.errorArticulo = "El artículo YA NO TIENE DESCUENTO!";
                                    me.detalles.push({
                                    _id: data._id,
                                    codigoInventario: data.codigoInventario,
                                    codigoB: data.codigoBarras,
                                    producto: data.nombreComercial,
                                    cantidad: 0,
                                    bonificacion: 0,
                                    stock: data.stock,
                                    iva: data.iva,
                                    fracciones: 0,
                                    fraccionCaja:data.fraccionCaja,
                                    fraccionesTotales: data.fraccionesTotales,
                                    precioVenta: data.pvp,
                                    precioUni: data.precioUni,
                                        descuento: data.descuento,
                                    });
                                    me.codigoBarras = "";
                                    }
                                }
                                }
                            });
                            } else {
                            if (me.encuentra(data._id) == true) {
                                me.errorArticulo = "El artículo ya ha sido agregado.";
                            } else {
                                me.detalles.push({
                                _id: data._id,
                                codigoInventario: data.codigoInventario,
                                codigoB: data.codigoBarras,
                                producto: data.nombreComercial,
                                cantidad: 0,
                                bonificacion: 0,
                                stock: data.stock,
                                iva: data.iva,
                                fracciones: 0,
                                fraccionCaja:data.fraccionCaja,
                                fraccionesTotales: data.fraccionesTotales,
                                precioVenta: data.pvp,
                                precioUni: data.precioUni,
                                descuento: data.descuento,
                                });
                                me.codigoBarras = "";
                            }
                            }
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
                            if (this.checkbox) {
                            if(!isNaN(text)){
                                me.articulos=[]
                                //agregar busqueda por codigo de barras...
                                axios
                                    .get(
                                        "productos/busquedaAvanzadaT?codigoBarras="+text,
                                        configuracion
                                    )
                                    .then(function(response) {
                                        if(response.data.length>0){
                                        me.articulos = response.data;
                                        }else{
                                    Swal.fire("Informacion","No hay resultados","info")
                                    }
                                        

                                    })
                                        .catch(function(error) {
                                        console.log(error);
                                        });
                            }else{
                                me.articulos=[]
                            axios
                                .get("productos/listtotal?valor=" + this.texto, configuracion)
                                .then(function (response) {
                                if(response.data.length>0){
                                        me.articulos = response.data;

                                        }else{
                                    Swal.fire("Informacion","No hay resultados","info")
                                    }
                                })
                                .catch(function (error) {
                                console.log(error);
                                });

                            }
                            
                            } else {
                            if(!isNaN(text)){
                                axios
                                    .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                                    .then(function(codigoInvenatio) {
                                    //Buscar los productos que pertenecen al inventario...
                                    axios
                                    .get(
                                        "productos/busquedaAvanzada?codigoInventario=" +
                                        codigoInvenatio.data._id+"&codigoBarras="+text,
                                        configuracion
                                    )
                                    .then(function(response) {
                                        
                                        if(response.data.length>0){
                                        me.articulos = response.data;
                                        }else{
                                    Swal.fire("Informacion","No hay resultados","info")
                                    }

                                    })
                                        .catch(function(error) {
                                        console.log(error);
                                        });
                                    })
                                    .catch(function(error) {
                                    console.log(error);
                                    });
                            }else{
                                me.articulos=[]
                            axios
                                .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                                .then(function (codigoInvenatio) {
                                //Buscar los productos que pertenecen al inventario...
                                if (text.indexOf("*") > -1) {
                                    var arreglo = text.split("*");

                                    axios
                                    .get(
                                        "productos/caracter?valor=" +
                                        codigoInvenatio.data._id +
                                        "&car1=" +
                                        arreglo[0] +
                                        "&car2=" +
                                        arreglo[1],
                                        configuracion
                                    )
                                    .then(function (response) {
                                        if(response.data.length>0){
                                        me.articulos = response.data;
                                        }else{
                                    Swal.fire("Informacion","No hay resultados","info")
                                    }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                                } else {
                                    axios
                                    .get(
                                        "productos/list?valor=" +
                                        codigoInvenatio.data._id +
                                        "&producto=" +
                                        text,
                                        configuracion
                                    )
                                    .then(function (response) {
                                        if(response.data.length>0){
                                        me.articulos = response.data;
                                        }else{
                                    Swal.fire("Informacion","No hay resultados","info")
                                    }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                                }
                                })
                                .catch(function (error) {
                                console.log(error);
                                });
                            }
                            
                            }
                        }
                },
                limpiarCliente() {
                this._id = "";
                this.nombres = "";
                this.tipopersona = "";
                this.numDocumento = "";
                this.direccion = "";
                this.telefono = "";
                this.email = "";

                this.valida = 0;
                },
                guardarCliente() {
                    let me = this;
                    axios
                        .post("persona/add", {
                        'nombres': this.nombres,
                        'tipodocumento': this.tipodocumento,
                        'tipopersona': "5ee385fb23f8e71e10e3ae94", //ID PARA CLIENTE
                        'numDocumento': this.numDocumento,
                        'direccion': this.direccion,
                        'telefono': this.telefono,
                        'email': this.email,
                        'ciudad':this.codigoCiudad,
                            'region':this.codigoRegion,
                            'parroquia':this.parroquia
                        })
                        .then(function (response) {
                        me.limpiarCliente();
                        me.ocultaragregarclientemodal();
                        me.selectPersona();
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                },
                selectTipoDocumentos() {
                    let me = this;
                    let TipoDocuArray = [];
                    let header = { Token: this.$store.state.token };
                    let configuracion = { headers: header };
                    axios
                        .get("tipodocumento/list", configuracion)
                        .then(function (response) {
                        TipoDocuArray = response.data;
                        TipoDocuArray.map(function (x) {
                            me.documetos.push({ text: x.descripcion, value: x._id });
                        });
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                },
                listarRegiones(){
                    let me=this;
                    let arrai=[];
                    let header={"Token" : this.$store.state.token};
                    let configuracion= {headers : header};            
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                    if(codigoFarmacia==undefined){
                        axios.get('ubicacion/list',configuracion).then(function (response){
                        
                        arrai=response.data;
                        arrai.map(function(x){
                            me.regiones.push({text:x.nombreRegion});
                        });
                        }).catch(function(error){
                            console.log(error);
                        });
                    }else{
                        axios.get('farmacia/query?_id='+codigoFarmacia,configuracion)
                        .then(function (response){
                            me.regiones.push({text:response.data.region})
                            me.codigoRegion=response.data.region
                            me.provincias.push({text:response.data.provincia})
                            me.codigoProvincia=response.data.provincia
                            me.ciudades.push({text:response.data.ciudad})
                            me.codigoCiudad=response.data.ciudad
                            me.parroquia=response.data.parroquia;


                        }).catch(function(error){
                            console.log(error);
                        });

                    }  
                },
                listarProvincias(codigoRegion){
                    let me=this;
                    let provinciasArray=[];
                    let arr  = []
                    let header={"Token" : this.$store.state.token};
                    let configuracion= {headers : header};            
                    axios.get('ubicacion/list',configuracion).then(function (response){
                    
                        provinciasArray=response.data;
                        provinciasArray.forEach(element => {
                            if(element.nombreRegion==codigoRegion){
                            arr = element.provincias
                            arr.map(function (x) {
                                me.provincias.push({text:x.nombreProvincia})
                            })
                            }
                        });
                    }).catch(function(error){
                        console.log(error);
                    });
                },
                listarCiudades(codigoProvincia){
                    let me=this;
                    let provinciasArray=[];
                    let arr  = []
                    let arrCity=[]
                    let header={"Token" : this.$store.state.token};
                    let configuracion= {headers : header};            
                    axios.get('ubicacion/list',configuracion).then(function (response){
                        provinciasArray=response.data;
                        provinciasArray.forEach(element => {
                            arr = element.provincias
                            arr.forEach(elmt => {
                                if(elmt.nombreProvincia==codigoProvincia){
                                arrCity=elmt.ciudades
                                arrCity.map(function (x) {
                                    me.ciudades.push({text:x.nombreCiudad})
                                })
                                }
                            });
                        });
                    }).catch(function(error){
                        console.log(error);
                    });
                },
                mostraragregarclientemodal(item) {
                this.agregarclienteModal = 1;
                },
                ocultaragregarclientemodal(item) {
                this.agregarclienteModal = 0;
                },
                buscarporcedula(cedula){
                if(cedula.length==0){
                    Swal.fire('Error',"Debe ingresar un numero de cedula",'error')
                }else{
                    this.personas=[]
                    let me = this;
                    let header = { Token: this.$store.state.token };
                    let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                    let personaArray = [];
                    let configuracion = { headers: header };
                    axios
                        .get(
                        "persona/queryci?cedula=" + cedula,
                        configuracion
                        )
                        .then(function (response) {
                        if(response.status==200){
                            personaArray = response.data;
                            personaArray.map(function (x) {
                                me.personas.push({ text: x.nombres, value: x._id });
                                if(x.numDocumento==cedula){
                                me.codgioPersona=x._id
                              
                                }
                            });
                            me.cedula=""
                        }else{
                            Swal.fire('Aviso',"No hay resultados encontrados para la cedula:"+cedula,'warning')
                        }
                    
                    })
                }
                
                },
                selectPersona() {
                    this.cedula=""
                    this.personas=[]
                    let me = this;
                    let personaArray = [];
                    let header = { Token: this.$store.state.token };
                    let configuracion = { headers: header };
                    axios
                        .get("persona/listCliente", configuracion)
                        .then(function (response) {
                        personaArray = response.data;
                        personaArray.map(function (x) {
                            me.personas.push({ text: x.nombres, value: x._id });
                            if(x.nombres=="CONSUMIDOR FINAL"){
                            me.codgioPersona=x._id
                            }
                        });
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                },
                limpiararri(){
                    this.articulos=[]
                },
                close() {
                    this.dialog = false;
                    this.articulos=[]
                    this.texto=""
                    this.checkbox=false
                },
                mostrarModalArticulos() {
                  this.dialog = 1;
                },
         }
    }
</script>

<style scoped>

</style>