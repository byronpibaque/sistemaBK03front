<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
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
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>

                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="nombres" label="Nombres"></v-text-field>
                  </v-flex>
                

                  <v-flex xs12 sm6 md6>
                       <v-select v-model="tipodocumento" :items="documetos" label="Tipo documento"></v-select>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="numDocumento" label="Numero documento"></v-text-field>
                  </v-flex>

                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                  </v-flex>

                   

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
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
      <v-data-table :headers="headers" :items="usuarios" :search="search" class="elevation-1">
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
         
        <td>{{ props.item.nombres }}</td>
       
          <td>{{ props.item.tipodocumento.descripcion }}</td>
          <td>{{ props.item.numDocumento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono }}</td>
          
          <td>
            <div v-if="props.item.estado">
              <span class="blue--text">Activo</span>
            </div>
            <div v-else>
              <span class="red--text">Inactivo</span>
            </div>
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
  data() {
    return {
      dialog: false,
      search: "",
      usuarios: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Nombre", value: "nombres", sortable: false },
        
        { text: "Tipo Documento", value: "tipodocumento", sortable: false },
        { text: "Numero Documento", value: "numDocumento", sortable: false },
        { text: "Direccion", value: "direccion", sortable: false },
        { text: "Telefono", value: "telefono", sortable: false },
        { text: "Estado", value: "estado", sortable: false }
      ],
      editedIndex: -1,
      _id: "",
      nombres: "",
      rol: "",
      roles: [],
      tipodocumento: "",
      documetos: [],
      numDocumento: "",
      direccion: "",
      telefono: "",
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
    this.listar();
    this.selectTipoDocumentos();
  },
  methods: {
    Eliminar(data){
       let me = this;
    
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
      if (codigoFarmacia == undefined) {
        axios
        .delete("usuario/remove?_id="+data._id, configuracion)
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
      } 
    },
    selectTipoDocumentos(){
                let me=this;
                let TipoDocuArray=[];
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};            
                axios.get('tipodocumento/list',configuracion).then(function (response){
                    TipoDocuArray=response.data;
                    TipoDocuArray.map(function(x){
                        me.documetos.push({text:x.descripcion, value:x._id});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("usuario/list", configuracion)
        .then(function(response) {
          me.usuarios = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.nombres = "";
      this.numDocumento = "";
      this.direccion = "";
      this.telefono = "";
     
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
     
       if (!this.tipodocumento) {
         this.validaMensaje.push(
          "Selecciona un tipo de documento."
        );  
      }
      if (this.nombres.length < 1 || this.nombres.length > 50) {
        this.validaMensaje.push(
          "El nombre debe tener entre 1-50 caracteres."
        );
      }
      if (this.numDocumento.length > 20) {
        this.validaMensaje.push(
          "La el numero de documento no debe tener más de 20 caracteres."
        );
      }
      if (this.direccion.length > 70) {
        this.validaMensaje.push(
          "La direccion no debe tener más de 70 caracteres."
        );
      }
      if (this.telefono.length > 10) {
        this.validaMensaje.push(
          "El telefono no debe tener más de 10 caracteres."
        );
      }
    


      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardar() {
      let me = this;
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Código para editar
        axios
          .put("usuario/update", {
            _id: this._id,
            
            'nombres': this.nombres,
            'tipodocumento':this.tipodocumento,
            'numDocumento':this.numDocumento,
            'direccion':this.direccion,
            'telefono':this.telefono,
           
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //Código para guardar
        axios
          .post("usuario/add", {
          
            'nombres': this.nombres,
            'tipodocumento':this.tipodocumento,
            'numDocumento':this.numDocumento,
            'direccion':this.direccion,
            'telefono':this.telefono,
    
            
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    editItem(item) {
            this._id = item._id;
        
            this.nombres = item.nombres;
            this.tipodocumento = item.tipodocumento._id;
            this.numDocumento = item.numDocumento;
            this.direccion = item.direccion;
                this.telefono = item.telefono;
            
      this.dialog = true;
      this.editedIndex = 1;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombres;
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
        .put("usuario/activate", { _id: this.adId })
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
        .put("usuario/deactivate", { _id: this.adId })
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
    }
  }
};
</script>
