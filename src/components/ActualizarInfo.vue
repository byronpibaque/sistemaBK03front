<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Actualizar Informacion</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4 white">
        <v-layout row wrap> 
           <v-flex  xs12 sm12 md12 lg12 xl12 >
             <v-checkbox
          style="margin-top:15px"
          color="success"
          v-model="checkbox"
          label="Todas las farmacias"
          v-if="$store.state.usuario.codigoFarmacia == undefined"
        ></v-checkbox>
          </v-flex>  
           <v-flex  xs12 sm8 md6 lg6 xl6  v-if="checkbox==false && $store.state.usuario.codigoFarmacia == undefined">
           <v-autocomplete
             v-model="codigoFarmacia" :items="farmacias" label="Elije a que farmacia aplicar el descuento:"
          ></v-autocomplete>
         </v-flex>       
     
        </v-layout>
      </v-container>
      <v-container grid-list-sm  class="pa-4 white">
        <v-layout row wrap>  
           <v-flex xs12 sm8 md8 lg8 xl8>
              <v-text-field v-model="nombre" label="Nombre del producto"></v-text-field>
          </v-flex>  
           <v-flex xs12 sm8 md8 lg8 xl8>
              <v-text-field v-model="nombreComercial" label="Nombre Comercial"></v-text-field>
          </v-flex>
           <v-flex xs12 sm12 md12 lg12 x12>
             
          </v-flex>  
           <v-flex  xs12 sm2 md2 lg2 xl2 >
           <v-autocomplete
             v-model="codigoIva" :items="iva" label="Iva"
          ></v-autocomplete>
         </v-flex> 
         <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="codigoBarr" label="Codigo Barras"></v-text-field>
          </v-flex>
           <v-flex xs12 sm12 md12 lg12 x12>
             
          </v-flex> 
              <v-flex  xs12 sm2 md2 lg2 xl2 >
           <v-autocomplete
             v-model="codigoCategoria" :items="categorias" label="Categoria"
          ></v-autocomplete>
         </v-flex>  
             <v-flex  xs12 sm2 md2 lg2 xl2 >
           <v-autocomplete
             v-model="codigoPresentacion" :items="presentaciones" label="Presentacion"
          ></v-autocomplete>
         </v-flex>  
          <v-flex  xs12 sm2 md2 lg2 xl2 >
           <v-autocomplete
             v-model="codigoLaboratorio" :items="laboratorios" label="Laboratorio"
          ></v-autocomplete>
         </v-flex> 
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="refrescarBD()">
              <v-icon dark>refresh</v-icon>
            </v-btn>
          </v-flex> 
            <v-flex xs12 sm12 md12 lg12 x12>
             
          </v-flex> 
           <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="costo" label="PVM" prefix="$"></v-text-field>
          </v-flex>  
           <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="pvp" label="PVP" prefix="$"></v-text-field>
          </v-flex>  
           <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="punit" label="Precio Un." prefix="$"></v-text-field>
          </v-flex>  
         <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="descto" label="Valor de descuento:"  suffix="%"></v-text-field>
          </v-flex>      
          <v-flex xs12 sm8 md8 lg8 x8>
             
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
                  <td >{{ props.item.codigoBarras }}</td>
                  <td class="blue--text">{{ props.item.producto }}</td>
                  <td class="blue--text">{{ props.item.codigoInventario }}</td>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          </v-flex>
        
        </v-layout>
      </v-container>
      
        <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="success" v-if="verDetalle==0" @click.native="guardar()">Actualizar</v-btn>
        </v-flex>

        <!-- Ventana modal para actualizar buscar articulos -->
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
                     <v-btn color="blue darken-1" flat @click="agregartodos()">Agregar Todos</v-btn>
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
                          <td class="blue--text">{{ props.item.codigoBarras }}</td>
                          <td>{{ props.item.nombre }}</td>
                           <td>{{ props.item.nombreComercial }}</td>
                            <td class="green--text">{{ props.item.codigoLaboratorio.abreviatura }}</td>
                       <td class="green--text">{{ props.item.codigoInventario.descripcion }}</td>
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
        <!-- Fin de ventana modal-->

    </v-flex>
  </v-layout>
</template>
<script>

import moment from "moment"
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      codigoBarr:"",
      iva:[{text:'SI',value:1},{text:'NO',value:0}],
      codigoIva:0,
      nombre:"",
      nombreComercial:"",
      codigoCategoria:"",
      codigoPresentacion:"",
      codigoLaboratorio:"",
      laboratorios:[],
      presentaciones:[],
      categorias:[],
      costo:0,
      pvp:0,
      punit:0,
      descto:0,
      checkbox:true,
      codigoFarmacia:"",
      
      search: "",
      ingresos: [],
      dialog:0,
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
      
     
      codigo: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Codigo Barras", value: "codigoBarras", sortable: false },
        { text: "Producto", value: "producto", sortable: false },
        {text:"Farmacia",value:"codigoInventario"},
      ],
      detalles: [],
     
      errorArticulo: null,
     
      articulos: [],
      texto: "",
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: true },
        { text: "Laboratorio", value: "codigoLaboratorio.abreviatura", sortable: true },
        {text:"Farmacia",value:"codigoInventario.descripcion"},
        { text: "Estado", value: "estado", sortable: false }
      ],
      verDetalle: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      codigoBarras: ""
    };
  },  
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.listarPresentaciones()
    this.listarLaboratorios()
    this.listarCategorias()
},
  methods: {
    refrescarBD () { 
      this.listarPresentaciones() 
      this.listarLaboratorios()
      this.listarCategorias()
    },
    agregartodos () { 
      let me = this
      if(this.articulos.length!=0){
        
        this.nombre=this.articulos[0].nombre
        this.nombreComercial=this.articulos[0].nombreComercial
        this.codigoCategoria=this.articulos[0].codigoCategoria._id
        this.codigoLaboratorio=this.articulos[0].codigoLaboratorio._id
        this.codigoPresentacion=this.articulos[0].codigoPresentacion._id
        this.costo=this.articulos[0].costoNeto
        this.pvp=this.articulos[0].pvp
        this.punit=this.articulos[0].precioUni
        this.descto=this.articulos[0].descuento
        this.codigoIva=this.articulos[0].iva
        this.codigoBarr=this.articulos[0].codigoBarras
        //Vaciar elementos anteriores
        me.detalles = [];

        this.articulos.forEach(data => {        
           me.detalles.push({
            _id: data._id,
            codigoBarras:data.codigoBarras,
            producto: data.nombreComercial,
            codigoInventario:data.codigoInventario.descripcion,
            idIn:data.codigoInventario._id             
          });
        });
        this.dialog=0
      }else{
        Swal.fire("Error","Debe hacer una busqueda","error");
      }
    },
    listarPresentaciones(){
      let me = this;
      let PresentacionesArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("presentacion/list", configuracion)
        .then(function(response) {
          PresentacionesArray = response.data;
          PresentacionesArray.map(function(x) {
            me.presentaciones.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    listarLaboratorios(){
      let me = this;
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
    listarCategorias(){
      let me = this;
      let ArrayCat = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("categoria/list", configuracion)
        .then(function(response) {
          ArrayCat = response.data;
          ArrayCat.map(function(x) {
            me.categorias.push({ text: x.nombre, value: x._id });
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
        .get("productos/query?codigoBarras=" + this.codigoBarras, configuracion)
        .then(function(response) {
         
          me.agregarDetalle(response.data);
        })
        .catch(function(error) {
          me.errorArticulo = "No existe el artículo.";
        });
      } else {
       //Buscar el inventario a traves del codigo farmacia...
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion1) //#1
          .then(function(codigoInvenatio) {
           
            //Buscar los productos que pertenecen al inventario...
            axios
        .get("productos/queryB?valor="+codigoInvenatio.data._id+"&codigoBarras="+codigoBarr, configuracion)
        .then(function(response) {
          me.agregarDetalle(response.data);
        })
        .catch(function(error) {
          me.errorArticulo = "No existe el artículo.";
        });

          })
          .catch(function(error) {
            console.log(error);
          });
      
      }
    },
    agregarDetalle(data) {
      
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
         
        this.detalles.push({
          _id: data._id,
          codigoBarras:data.codigoBarras,
          producto: data.nombreComercial,
          codigoInventario:data.codigoInventario.descripcion,
          idIn:data.codigoInventario._id
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
        .then(function(response) {
          me.articulos = response.data;
        })
        .catch(function(error) {
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
          if(!isNaN(text)){
            me.articulos=[]
            //agregar busqueda por codigo de barras...
            axios.get("productos/busquedaAvanzadaT?codigoBarras="+ text , configuracion)
              .then(function(response) {
                if(response.data.length>0){
                  const resultado = response.data.filter(pr => pr.codigoInventario.estado == 1)
                  me.articulos = resultado;
                }else{
                  Swal.fire("Informacion","No hay resultados","info")
                }})
                .catch(function(error) {
                  console.log(error);
                });
          }else{
            me.articulos=[]
            axios.get("productos/listtotal?valor=" + this.texto, configuracion)
            .then(function (response) {
                if(response.data.length>0){
                  const resultado = response.data.filter(pr => pr.codigoInventario.estado == 1)
                  me.articulos = resultado;
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
                      
                        me.articulos = response.data;

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
                    me.articulos = response.data;
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
                    me.articulos = response.data;
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
    mostrarModalArticulos() {
      this.dialog = 1;
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

      this.nombre=""
      this.nombreComercial=""
      this.costo=0
      this.pvp=0
      this.punit=0
      this.descto=0
      this.codigoCategoria=""
      this.codigoLaboratorio=""
      this.codigoPresentacion=""

      this.detalles=[]
      this.validaMensaje = [];
      this.verDetalle = 0;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      
      
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
    guardar() {
      
      let me =this;


      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      if(codigoFarmacia==undefined){
            me.detalles.forEach(element => {
            axios
                .put("productos/actualizarInf", {
                  codigoInventario:element.idIn,
                  productos:element._id,
                  nombre:me.nombre,
                  nombreComercial:me.nombreComercial,
                  costo:me.costo,
                  pvp:me.pvp,
                  punit:me.punit,
                  descuento:me.descto,
                  codigoCategoria:me.codigoCategoria,
                  codigoLaboratorio:me.codigoLaboratorio,
                  codigoPresentacion:me.codigoPresentacion,
                  codigoIva:me.codigoIva,
                  codigoBarras:me.codigoBarr
                })
                .then(function(response) {
                  if(response.status==200){
                    Swal.fire("Notificación", "Descuentos actualizados por laboratorios.", "success");
                    me.limpiar()
                  }else{
                    Swal.fire("Aviso", "No se pudo actualizar los descuentos.", "error");
                  }
                  
                  
                })
                .catch(function(error) {
                  console.log(error);
                });
          });
      }
    
      
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
      axios
        .put("ingresos/activate", { _id: this.adId }, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("ingresos/deactivate", { _id: this.adId }, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.texto=""
      this.articulos=[]
    }
  }
};
</script>
