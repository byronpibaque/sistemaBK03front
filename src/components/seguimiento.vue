<template>
<v-layout align-start>
    <v-flex>
    <v-toolbar flat color="white" >
        <v-toolbar-title>Seguimiento</v-toolbar-title>
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
                      class="text-xs-left"
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
                            <v-icon small class="mr-2" @click="limpiarContenido(),agregarDetalle(props.item)">add</v-icon>
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
     
        <v-container grid-list-sm class="pa-4 white" >
        <v-layout row wrap>  
              <v-flex xs12 sm5 md5  v-if="$store.state.usuario.codigoFarmacia==undefined">
                    <v-autocomplete
                      v-model="codigoInventario"
                      :items="inventario"
                      label="Inventario"
                    ></v-autocomplete>
                  </v-flex>         
            <v-flex xs12 sm12 md12 lg12 xl12>
            </v-flex>
            <v-flex xs6 sm6 md6 lg6 x6>
            <v-text-field v-model="codigoBarras" label="Código de barras" @keyup.enter="limpiarContenido(),limpiarErroarticulo(),buscarCodigo()"></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
                <v-icon dark>list</v-icon>
            </v-btn>
            </v-flex>
              <v-flex xs12 sm12 md12 lg12 xl12 class="text-xs-center" >
                <div class="red--text" v-for="v in errorArticulo" :key="v" v-text="v"></div>
                </v-flex>
           
              <v-flex xs12 sm12 md12 lg12 xl12>
            </v-flex>
            <v-flex xs12 sm2 md12 lg12 xl2 >
                            <span style="font-size:30px  " class="blue--text">PRODUCTO: </span>
                            <span style="font-size:30px  " class="orange--text">{{nombreComercialP}}</span>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
            </v-flex>
            <div  class="">
                <v-flex  xs6 sm6 md6 lg6 xl6>
                <table style="border: 1px solid #789FDF;" WIDTH="500">
                    <tr >
                            <td  colspan="2" style="font-size:30px  " class="blue--text text-xs-center">ACTUALIZACIONES</td>
                            
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultimo usuario:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{usuario}}</td>
                    </tr>
                        <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultima fecha:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{fechaModifica}}</td>
                    </tr>
                    </table>
                </v-flex>
                <v-flex  xs6 sm6 md6 lg6 xl6>
                <table style="  border: 1px solid #789FDF;" WIDTH="500">
                    <tr >
                            <td  colspan="2" style="font-size:30px  " class="blue--text text-xs-center">INGRESOS</td>
                            
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultimo usuario:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{usuarioIngreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultima fecha:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{fechaModificaIngreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Cantidad:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{cantidadIngreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Num Comprobante:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{numComprobanteIngreso}}</td>
                    </tr>
                    </table>
                </v-flex>
                <v-flex  xs6 sm6 md6 lg6 xl6>
                <table style="  border: 1px solid #789FDF;" WIDTH="500">
                    <tr >
                            <td  colspan="2" style="font-size:30px  " class="blue--text text-xs-center">EGRESOS</td>
                            
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultimo usuario:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{usuarioEgreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultima fecha:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{fechaModificaEgreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Cantidad:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{cantidadEgreso}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Num Comprobante:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{numComprobanteEgreso}}</td>
                    </tr>
                    </table>
                </v-flex>
                <v-flex  xs6 sm6 md6 lg6 xl6>
                <table style="  border: 1px solid #789FDF;" WIDTH="500">
                    <tr >
                            <td  colspan="2" style="font-size:30px  " class="blue--text text-xs-center">VENTAS</td>
                            
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultimo usuario:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{usuarioVenta}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Ultima fecha:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{fechaModificaVenta}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Cantidad:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{cantidadVenta}}</td>
                    </tr>
                    <tr>
                        <td style="font-size:20px" class="orange--text text-xs-left">Num Comprobante:</td>
                        <td style="font-size:20px" class="black--text text-xs-right">{{numComprobanteVenta}}</td>
                    </tr>
                    </table>
                </v-flex>
            </div>
            

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
                inventario:[],
                codigoInventario:"",
                nombreComercialP:"",
                numComprobanteVenta:"",
                cantidadVenta:"",
                usuarioVenta:"",
                fechaModificaVenta:"",
                numComprobanteEgreso:"",
                cantidadEgreso:"",
                usuarioEgreso:"",
                fechaModificaEgreso:"",
                numComprobanteIngreso:"",
                cantidadIngreso:"",
                usuarioIngreso:"",
                fechaModificaIngreso:"",
                usuario:"",
                fechaModifica:"",
                dialog: false,
                articulos:[],
                texto:"",
                checkbox:false,
                codigoBarras:"",
                errorArticulo:[],
                valida:0,
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
           this.consultarInventario()
        },
        watch: {
            dialog(val) {
            val || this.close();
            },
        },
         methods: { 
    consultarInventario () { 
      let me = this;
      let ArrayT = [];
      const codigo = "";
      let header1 = { Token: this.$store.state.token };
      let configuracion1 = { headers: header1 };
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;

      if (codigoFarmacia == undefined) {
        axios
          .get("inventario/list", configuracion)
          .then(function(response) {
            ArrayT = response.data;
            ArrayT.map(function(x) {
              me.inventario.push({ text: x.descripcion, value: x._id });
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
                limpiarContenido(){
                        this.nombreComercialP=""
                        this.numComprobanteVenta=""
                        this.cantidadVenta=""
                        this.usuarioVenta=""
                        this.fechaModificaVenta=""
                        this.numComprobanteEgreso=""
                        this.cantidadEgreso=""
                        this.usuarioEgreso=""
                        this.fechaModificaEgreso=""
                        this.numComprobanteIngreso=""
                        this.cantidadIngreso=""
                        this.usuarioIngreso=""
                        this.fechaModificaIngreso=""
                        this.usuario=""
                        this.fechaModifica=""
                },
                nombreProducto(nombre){
                    this.nombreComercialP=nombre
                },
                buscarVenta(codigoBarra){
                        let me = this;
                        
                        let header1 = { Token: this.$store.state.token };
                        let configuracion1 = { headers: header1 };
                        let header = { Token: this.$store.state.token };
                        let configuracion = { headers: header };
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                        if (codigoFarmacia==undefined) {
                            if(this.codigoInventario){
                                axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    this.codigoInventario +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   if(producto.length!=0){
                                        axios
                                            .get(
                                                "ventas/queryHistorial?valor=" +
                                                producto.data._id 
                                                ,
                                                configuracion
                                            )
                                            .then(function (Venta) {
                                             
                                                if(Venta.length!=0){
                                                    me.usuarioVenta=Venta.data.codigoUsuario.nombres
                                                    me.fechaModificaVenta=me.formatearFecha(Venta.data.createdAt)
                                                   me.numComprobanteVenta=Venta.data.numComprobante;
                                                   Venta.data.detalles.forEach(x => {
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadVenta=`C=${x.cantidad}-F=${x.fracciones}`
                                                       }
                                                   });
                                                }
                                            })
                                            .catch(function (error) {
                                                me.valida=1
                                                me.errorArticulo.push("No hay historial de ventas para el articulo.") 
                                            });
                                   }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                     me.errorArticulo.push("No hay historial de ventas para el articulo.") 
                                });
                            }else{
                                Swal.fire("Error","Seleccione una farmacia","error")
                            }
                        
                        } else {
                           axios
                            .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                            .then(function (codigoInvenatio) {
                                //Buscar los productos que pertenecen al inventario...
                            axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    codigoInvenatio.data._id +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   if(producto.length!=0){
                                        axios
                                            .get(
                                                "ventas/queryHistorial?valor=" +
                                                producto.data._id 
                                                ,
                                                configuracion
                                            )
                                            .then(function (Venta) {
                                             
                                                if(Venta.length!=0){
                                                    me.usuarioVenta=Venta.data.codigoUsuario.nombres
                                                    me.fechaModificaVenta=me.formatearFecha(Venta.data.createdAt)
                                                   me.numComprobanteVenta=Venta.data.numComprobante;
                                                   Venta.data.detalles.forEach(x => {
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadVenta=`C=${x.cantidad}-F=${x.fracciones}`
                                                       }
                                                   });
                                                }
                                            })
                                            .catch(function (error) {
                                                me.valida=1
                                                me.errorArticulo.push("No hay historial de ventas para el articulo.") 
                                            });
                                   }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                     me.errorArticulo.push("No hay historial de ventas para el articulo.") 
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            }); 
                        }
                        
                },
                buscarEgreso(codigoBarra){
                    let me = this;
                      
                        let header1 = { Token: this.$store.state.token };
                        let configuracion1 = { headers: header1 };
                        let header = { Token: this.$store.state.token };
                        let configuracion = { headers: header };
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                        if(codigoFarmacia==undefined){
                            if(this.codigoInventario){
                                axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    me.codigoInventario +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   axios
                                            .get(
                                                "egreso/queryHistorial?valor=" +
                                                codigoBarra+"&codigoInventario="+me.codigoInventario
                                                ,
                                                configuracion
                                            )
                                            .then(function (Egreso) {
                                               
                                                if(Egreso.length!=0){
                                                    me.usuarioEgreso=Egreso.data.codigoUsuario.nombres
                                                    me.fechaModificaEgreso=me.formatearFecha(Egreso.data.createdAt)
                                                   me.numComprobanteEgreso=Egreso.data.numComprobante;
                                                   Egreso.data.detalles.forEach(x => {
                                                    
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadEgreso=`C=${x.cantidad}-F=${x.fracciones}`
                                                       }
                                                   });
                                                   
                                                }
                                            })
                                            .catch(function (error) {
                                                 me.valida=1
                                                me.errorArticulo.push("No hay historial de egresos para el articulo.") 
                                            });
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                      me.errorArticulo.push("No hay historial de egresos para el articulo.") 
                                      console.log(error);
                                });
                            }else{
                                    Swal.fire("Error","Seleccione una farmacia","error")
                            }
                              
                            
                        }else{
                             axios
                            .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                            .then(function (codigoInvenatio) {
                                //Buscar los productos que pertenecen al inventario...
                                    axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                   codigoInvenatio.data._id +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   axios
                                            .get(
                                                "egreso/queryHistorial?valor=" +
                                                codigoBarra+"&codigoInventario="+codigoInvenatio.data._id 
                                                ,
                                                configuracion
                                            )
                                            .then(function (Egreso) {
                                               
                                                if(Egreso.length!=0){
                                                    me.usuarioEgreso=Egreso.data.codigoUsuario.nombres
                                                    me.fechaModificaEgreso=me.formatearFecha(Egreso.data.createdAt)
                                                   me.numComprobanteEgreso=Egreso.data.numComprobante;
                                                   Egreso.data.detalles.forEach(x => {
                                                    
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadEgreso=`C=${x.cantidad}-F=${x.fracciones}`
                                                       }
                                                   });
                                                   
                                                }
                                            })
                                            .catch(function (error) {
                                                 me.valida=1
                                                me.errorArticulo.push("No hay historial de egresos para el articulo.") 
                                            });
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                      me.errorArticulo.push("No hay historial de egresos para el articulo.") 
                                      console.log(error);
                                });
                                   
                                })
                                .catch(function (error) {
                                     me.valida=1
                                    me.errorArticulo.push("No hay invetario") 
                                });
                        }
                       
                          
                },
                buscarIngreso(codigoBarra){
                        let me = this;
                     
                        let header1 = { Token: this.$store.state.token };
                        let configuracion1 = { headers: header1 };
                        let header = { Token: this.$store.state.token };
                        let configuracion = { headers: header };
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                        if(codigoFarmacia==undefined){
                            if (this.codigoInventario) {
                                     axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    this.codigoInventario +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   if(producto.length!=0){
                                        axios
                                            .get(
                                                "ingresos/queryHistorial?valor=" +
                                                producto.data._id 
                                                ,
                                                configuracion
                                            )
                                            .then(function (ingreso) {
                                                if(ingreso.length!=0){
                                                    me.usuarioIngreso=ingreso.data.codigoUsuario.nombres
                                                    me.fechaModificaIngreso=me.formatearFecha(ingreso.data.createdAt)
                                                   me.numComprobanteIngreso=ingreso.data.numComprobante;
                                                   ingreso.data.detalles.forEach(x => {
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadIngreso=`C=${x.cantidad}-F=${x.fraccionesN}`
                                                       }
                                                   });
                                                   
                                                }
                                            })
                                            .catch(function (error) {
                                                 me.valida=1
                                                me.errorArticulo.push("No hay historial de ingresos para el articulo.") 
                                            });
                                   }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                      me.errorArticulo.push("No hay historial de ingresos para el articulo.") 
                                });
                            } else {
                                  Swal.fire("Error","Seleccione una farmacia","error")
                            }
                           
                        }else{
                            axios
                            .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                            .then(function (codigoInvenatio) {
                                //Buscar los productos que pertenecen al inventario...
                            axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    codigoInvenatio.data._id +
                                    "&codigoBarras=" +
                                    codigoBarra,
                                    configuracion
                                )
                                .then(function (producto) {
                                   if(producto.length!=0){
                                        axios
                                            .get(
                                                "ingresos/queryHistorial?valor=" +
                                                producto.data._id 
                                                ,
                                                configuracion
                                            )
                                            .then(function (ingreso) {
                                                if(ingreso.length!=0){
                                                    me.usuarioIngreso=ingreso.data.codigoUsuario.nombres
                                                    me.fechaModificaIngreso=me.formatearFecha(ingreso.data.createdAt)
                                                   me.numComprobanteIngreso=ingreso.data.numComprobante;
                                                   ingreso.data.detalles.forEach(x => {
                                                       if(x.producto==producto.data.nombreComercial){
                                                           me.cantidadIngreso=`C=${x.cantidad}-F=${x.fraccionesN}`
                                                       }
                                                   });
                                                   
                                                }
                                            })
                                            .catch(function (error) {
                                                 me.valida=1
                                                me.errorArticulo.push("No hay historial de ingresos para el articulo.") 
                                            });
                                   }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                      me.errorArticulo.push("No hay historial de ingresos para el articulo.") 
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        }
                        
                },
                formatearFecha(value) {
                    if (value) {
                        return moment(String(value)).format('MM/DD/YYYY hh:mm')
                    }
                },
                buscarCodigo() {
                        let me = this;
                       
                        let header1 = { Token: this.$store.state.token };
                        let configuracion1 = { headers: header1 };
                        let header = { Token: this.$store.state.token };
                        let configuracion = { headers: header };
                        let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                        let codigoBarr = this.codigoBarras;
                        if(!isNaN(codigoBarr)){
                        if (codigoFarmacia == undefined) {
                            if(this.codigoInventario){
                                axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    this.codigoInventario +
                                    "&codigoBarras=" +
                                    codigoBarr,
                                    configuracion
                                )
                                .then(function (response) {
                                    if (response.status==200) {
                                    if(response.data.length!=0){
                                        if(response.data.codigoUsuario){
                                            me.nombreProducto(response.data.nombreComercial)
                                            me.usuario=response.data.codigoUsuario.nombres
                                             me.fechaModifica=me.formatearFecha(response.data.fechaModificacion)
                                             me.buscarIngreso(codigoBarr)
                                             me.buscarEgreso(codigoBarr)
                                             me.buscarVenta(codigoBarr)
                                        }else{
                                             me.valida=1
                                           me.errorArticulo.push("No hay historial de actualizaciones para el articulo.") 
                                        }
                                            
                                        }
                                    } else if(response.status==204){
                                         me.errorArticulo = response.data;
                                    }else{
                                         me.valida=1
                                             me.errorArticulo = "Ocurrio un error";
                                    }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                     me.errorArticulo.push("No hay historial de actualizaciones para el articulo.") 
                                });
                            }else{
                                  Swal.fire("Error","Seleccione una farmacia","error")
                            }
                              
                        } else {
                            //Buscar el inventario a traves del codigo farmacia...
                            axios
                            .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                            .then(function (codigoInvenatio) {
                                //Buscar los productos que pertenecen al inventario...
                            axios
                                .get(
                                    "productos/queryhistorial?valor=" +
                                    codigoInvenatio.data._id +
                                    "&codigoBarras=" +
                                    codigoBarr,
                                    configuracion
                                )
                                .then(function (response) {
                                    if (response.status==200) {
                                    if(response.data.length!=0){
                                        if(response.data.codigoUsuario){
                                            me.nombreProducto(response.data.nombreComercial)
                                            me.usuario=response.data.codigoUsuario.nombres
                                             me.fechaModifica=me.formatearFecha(response.data.fechaModificacion)
                                                  me.buscarIngreso(codigoBarr)
                                             me.buscarEgreso(codigoBarr)
                                             me.buscarVenta(codigoBarr)
                                        }else{
                                             me.valida=1
                                           me.errorArticulo.push("No hay historial de actualizaciones para el articulo.") 
                                        }
                                            
                                        }
                                    } else if(response.status==204){
                                         me.errorArticulo = response.data;
                                    }else{
                                         me.valida=1
                                             me.errorArticulo = "Ocurrio un error";
                                    }
                                   
                                    
                                })
                                .catch(function (error) {
                                     me.valida=1
                                     me.errorArticulo.push("No hay historial de actualizaciones para el articulo.") 
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        }  
                        }
                        
                },
                agregarDetalle(data) {
                    let me = this
                    me.codigoBarras = data.codigoBarras
                    me.nombreProducto(data.nombreComercial)
                    me.buscarVenta(data.codigoBarras)
                    me.buscarEgreso(data.codigoBarras)
                    me.buscarIngreso(data.codigoBarras)
                    me.buscarCodigo(data.codigoBarras)
                    me.limpiarErroarticulo()
                    me.close()
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
                            if(this.codigoInventario){
                                 if(!isNaN(text)){
                                 axios
                                        .get(
                                            "productos/busquedaAvanzadaHistorial?codigoInventario=" +
                                            this.codigoInventario+"&codigoBarras="+text,
                                            configuracion
                                        )
                                        .then(function(response) {
                                            
                                            if (response.status==200) {
                                                if(response.data.length!=0){
                                                        me.usuario=response.data.codigoUsuario.nombres
                                                        me.fechaModifica=me.formatearFecha(response.data.fechaModificacion)
                                                    }
                                                } else if(response.status==204){
                                                    me.errorArticulo = response.data;
                                                }else{
                                                        me.errorArticulo = "Ocurrio un error";
                                                }
                                            

                                        })
                                            .catch(function(error) {
                                            console.log(error);
                                            });
                                }else{
                                    me.articulos=[]
                                    if (text.indexOf("*") > -1) {
                                        var arreglo = text.split("*");

                                        axios
                                        .get(
                                            "productos/caracter?valor=" +
                                           this.codigoInventario +
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
                                            "productos/listHistorial?valor=" +
                                            this.codigoInventario +
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
                                }
                            }else{
                                Swal.fire("Error","Seleccione una farmacia","error") 
                            }
                           
                            
                            
                        
                        } else {
                           
                                if(!isNaN(text)){
                                    axios
                                        .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
                                        .then(function(codigoInvenatio) {
                                        //Buscar los productos que pertenecen al inventario...
                                        axios
                                        .get(
                                            "productos/busquedaAvanzadaHistorial?codigoInventario=" +
                                            codigoInvenatio.data._id+"&codigoBarras="+text,
                                            configuracion
                                        )
                                        .then(function(response) {
                                            
                                            if (response.status==200) {
                                                if(response.data.length!=0){
                                                        me.usuario=response.data.codigoUsuario.nombres
                                                        me.fechaModifica=me.formatearFecha(response.data.fechaModificacion)
                                                    }
                                                } else if(response.status==204){
                                                    me.errorArticulo = response.data;
                                                }else{
                                                        me.errorArticulo = "Ocurrio un error";
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
                                            "productos/listHistorial?valor=" +
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
                limpiarErroarticulo(){
                    this.errorArticulo=[]
                    this.valida=0
                }
         }
    }
</script>

<style scoped>

</style>