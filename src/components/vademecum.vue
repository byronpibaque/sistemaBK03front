<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Vademécum</v-toolbar-title>
            <v-spacer></v-spacer>
          <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-if="verNuevo==0 " @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
              <v-dialog v-model="verNuevo" max-width="800px">
              <v-card>
                <v-card-title> <span class="blue--text headline">Crear nuevo registro:</span></v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-autocomplete :items="farmacias" v-on:change="obtenerProductos()" v-model="codigoFarmacia" label="Farmacia"></v-autocomplete>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <v-autocomplete :items="productos" v-on:change="obtenerProductosNombre()" v-model="codigoProducto" label="Articulos"></v-autocomplete>
                          </v-flex>
                          <v-flex  xs12 sm12 md12 lg12 xl12> 
                             <v-text-field  v-model="nombreProducto" readonly label="Principio Activo"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-textarea 
                            append-outer-icon="mdi-comment"
                            class="mx-2"
                            rows="2"
                            label="Indicaciones" 
                            v-model="indicacion"
                              ></v-textarea>
                          </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-textarea 
                            append-outer-icon="mdi-comment"
                            class="mx-2"
                            rows="2"
                            label="Dosificaciones" 
                            v-model="dosificacion"
                              ></v-textarea>
                          </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-textarea 
                            append-outer-icon="mdi-comment"
                            class="mx-2"
                            rows="2"
                            label="Contraindicaciones" 
                            v-model="contraindicacion"
                              ></v-textarea>
                          </v-flex>
                            <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-textarea 
                            append-outer-icon="mdi-comment"
                            class="mx-2"
                            rows="2"
                            label="Efectos secundarios" 
                            v-model="efecto"
                              ></v-textarea>
                          </v-flex>
                        </v-layout>
                    </v-container>
                  </v-card-text>
                <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click="ocultarNuevo()">Cancelar</v-btn>
                      <v-btn color="green darken-1" flat @click="guardar()">Guardar</v-btn>
                </v-card-actions>
              </v-card>
              </v-dialog>
               <v-dialog v-model="adModal" max-width="290">
                  <v-card>
                    <v-card-title class="headline" v-if="adAccion==1">Activar Item</v-card-title>
                    <v-card-title class="headline" v-if="adAccion==2">Desactivar Item</v-card-title>
                    <v-card-text>
                      Estás a punto de
                      <span v-if="adAccion==1">activar</span>
                      <span v-if="adAccion==2">desactivar</span>
                      el item {{adNombre}}
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">Cancelar</v-btn>
                      <v-btn
                        v-if="adAccion==1"
                        @click="activar()"
                        color="orange darken-4"
                        flat="flat"
                      >Activar</v-btn>
                      <v-btn
                        v-if="adAccion==2"
                        @click="desactivar()"
                        color="orange darken-4"
                        flat="flat"
                      >Desactivar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
      </v-toolbar>

       <v-data-table :headers="headers" :items="vademecum" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
             <v-icon small class="mr-2" @click="Eliminar(props.item)">delete_sweep</v-icon>
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template>
          </td>
          <td class="blue--text">
            {{props.item.codigoProducto.nombreComercial}}
          </td>
          <td>
            {{props.item.indicacion}}
          </td>
          <td>
            {{props.item.contraindicacion}}
          </td>
          <td>
            {{props.item.dosificacion}}
          </td>
          <td>
            {{props.item.efectosSecundarios}}
          </td>
        
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">RECARGAR</v-btn>
        </template>
      </v-data-table>
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
  data(){
   return{
     nombreProducto:'',
     headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Productos", value: "codigoProducto", sortable: true },
        { text: "Indicaciones", value: "indicacion", sortable: false },
        { text: "Contraindicaciones", value: "contraindicacion", sortable: false },
        { text: "Dosis", value: "dosificacion", sortable: false },
        { text: "Efectos secundarios", value: "efectosSecundarios", sortable: false },
       
      ],
     vademecum:[],
     search:'',
     efecto:'',
     contraindicacion:'',
     indicacion:'',
     dosificacion:'',
     codigoProducto:'',
     productos:[],
     codigoFarmacia:'',
     farmacias:[],
     verNuevo: 0,
     adModal:0,
     adNombre:'',
     adId:'',
     adAccion:0,
     valida: 0,
     validaMensaje: [],
     editedIndex: -1,
     _id: "",
     dialog: false,
   }
  },
  created() {
    this.obtenerInventario()
    
    this.listar()
  },
  methods: {
    Eliminar(data){
        let me = this;
          let header = { Token: this.$store.state.token };
          let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
          let configuracion = { headers: header };
        
            axios
            .delete("vademecum/remove?_id="+data._id, configuracion)
            .then(function (response) {
              if(response.status===200){
                Swal.fire('Notificación','Procedimiento exitoso!','success')
              me.listar();
              }else{
                Swal.fire('Notificación','Hubo algun problema!','error')
              }
              
            })
            .catch(function (error) {
              console.log(error);
            });
          
      },
    guardar(){
       let me=this;
        // if (this.validar()){
        //     return;
        // }
        if (this.editedIndex >-1){
            //Código para editar
            axios.put('vademecum/update',{
              '_id':this._id,
              'codigoProducto':this.codigoProducto,
              'indicacion':this.indicacion,
              'contraindicacion':this.contraindicacion,
              'dosificacion':this.dosificacion,
              'efectosSecundarios':this.efecto
              })
            .then(function(response){
                me.limpiar();
                me.ocultarNuevo();
                me.listar();
            })
            .catch(function(error){
                console.log(error);
            });
        }else{
            //Código para guardar
            axios.post('vademecum/add',{
              'codigoProducto':this.codigoProducto,
              'indicacion':this.indicacion,
              'contraindicacion':this.contraindicacion,
              'dosificacion':this.dosificacion,
              'efectosSecundarios':this.efecto
              })
            .then(function(response){
                me.limpiar();
                me.ocultarNuevo();
                me.listar();
            })
            .catch(function(error){
                console.log(error);
            });
        }
    },
    listar(){
       let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("vademecum/list", configuracion)
        .then(function(response) {
          me.vademecum = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar(){
      this.nombreProducto=''
      this.indicacion='',
      this.contraindicacion='',
      this.dosificacion='',
      this.efecto='',
      this.codigoProducto=''
    },
    obtenerProductosNombre(){
      let me = this;
     
      me.nombreProducto="" 
      let respuestaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
          .get("productos/queryA?_id="+me.codigoProducto, configuracion)
          .then(function(response) {
            console.log(response.data)
            me.nombreProducto = response.data.nombre
          })
          .catch(function(error) {
          console.log(error);
          });
    },
    obtenerProductos(){
      let me = this;
      me.productos=[]
      me.codigoProducto="" 
      let respuestaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
          .get("productos/listB?valor="+me.codigoFarmacia, configuracion)
          .then(function(response) {
          respuestaArray = response.data;
          respuestaArray.map(function(x) {
              me.productos.push({ text: x.nombreComercial, value: x._id });
          });
          })
          .catch(function(error) {
          console.log(error);
          });
    },
    obtenerInventario() {
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
              me.farmacias.push({ text: x.descripcion, value: x._id });
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        let me = this;
        let ArrayT = [];
        let header = { Token: this.$store.state.token };
        let configuracion = { headers: header };
        axios
          .get("inventario/query?_id=" + codigoFarmacia, configuracion)
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
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.codigoProducto.nombre;
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
      axios
        .put("vademecum/activate", { _id: this.adId })
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
      axios
        .put("vademecum/deactivate", { _id: this.adId })
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
    },
    editItem(item) {
      this._id = item._id;
      this.codigoProducto = item.codigoProducto;
      this.dosificacion = item.dosificacion
      this.indicacion = item.indicacion;
      this.efecto = item.efectosSecundarios;
      this.contraindicacion = item.contraindicacion;
      this.verNuevo = 1;
      this.editedIndex = 1;
    },
  }
}
</script>