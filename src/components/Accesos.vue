
<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Accesos</v-toolbar-title>
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
                     <v-select v-model="user" :items="usuarios" label="Usuario"></v-select>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-select v-model="rol" :items="roles" label="Rol"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="farma" :items="farmacia" label="Farmacia"></v-select>
                  </v-flex>
          
                   

                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="email" label="Email"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="usuario" label="Usuario"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="password" type="password" label="Clave"></v-text-field>
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
      <v-data-table :headers="headers" :items="accesos" :search="search" class="elevation-1">
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

          <td v-if="props.item.codigoUsuario">{{ props.item.codigoUsuario.nombres }}</td>
          <td v-else>No data.</td>
           <td>{{ props.item.email }}</td>
            <td v-if="props.item.codigoFarmacia">{{props.item.codigoFarmacia.descripcion}}</td>
            <td v-else>INDEFINIDA</td>
            <td>{{props.item.rol.descripcion}}</td>
         
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
      accesos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Nombres", value: "codigoUsuario.nombres", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Rol", value: "rol", sortable: false },
        {text:"Farmacia",value:"codigoFarmacia",sortable:false},
        { text: "Estado", value: "estado", sortable: false }
      ],
      editedIndex: -1,
      _id: "",
      user:'',
      usuarios:[],
      rol: "",
      roles: [],
      farma:'',
      farmacia:[],
      email: "",
      password: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      usuario:""
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
    this.selectUsuarios();
    this.selectrRoles();
    this.selectrFarmacia();
    
  },
  methods: {
      Eliminar(data){
          let me = this;
          let header = { Token: this.$store.state.token };
          let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
          let configuracion = { headers: header };
          if (codigoFarmacia == undefined) {
            axios
            .delete("login/remove?_id="+data._id, configuracion)
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
      selectrRoles(){
        let me=this;
        let RolesArray=[];
        let header={"Token" : this.$store.state.token};
        let configuracion= {headers : header};            
        axios.get('rol/list',configuracion).then(function (response){
            RolesArray=response.data;
            RolesArray.map(function(x){
                me.roles.push({text:x.descripcion, value:x._id});
            });
        }).catch(function(error){
            console.log(error);
        });
      },
      selectrFarmacia(){
        let me=this;
        let RolesArray=[];
        let header={"Token" : this.$store.state.token};
        let configuracion= {headers : header};            
        axios.get('farmacia/list',configuracion).then(function (response){
            RolesArray=response.data;
            RolesArray.map(function(x){
                me.farmacia.push({text:x.descripcion, value:x._id});
            });
        }).catch(function(error){
            console.log(error);
        });
      },
      selectUsuarios(){
        let me=this;
        let TipoDocuArray=[];
        let header={"Token" : this.$store.state.token};
        let configuracion= {headers : header};            
        axios.get('usuario/list',configuracion).then(function (response){
            TipoDocuArray=response.data;
            TipoDocuArray.map(function(x){
                me.usuarios.push({text:x.nombres, value:x._id});
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
      .get("login/list", configuracion)
      .then(function(response) {
      
      me.accesos = response.data;
      })
      .catch(function(error) {
      console.log(error);
      });
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
      validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.rol) {
      this.validaMensaje.push(
      "Selecciona un rol."
      );  
      }

      if (this.email.length < 1 || this.email.length > 50) {
      this.validaMensaje.push(
      "El email debe tener entre 1-50 caracteres."
      );
      }
      if (this.password.length < 1 || this.password.length > 64) {
      this.validaMensaje.push(
      "El password debe tener entre 1-64 caracteres."
      );
      }


      if (this.validaMensaje.length) {
      this.valida = 1;
      }
      return this.valida;
      },
      guardar() {
      let me = this;
      let correo = this.email
      let asunto = "INICIO DE SESIÓN - BK03"
      let mensaje = "Hola, reciba un cordial saludo de parte de la empresa TU AHORRO,\nEl motivo de este mensaje es para informarle que se ha creado un usuario para inicio de sesión en BK03 sistema de punto de ventas. \n\n\nUSUARIO: "+me.email+"\nCLAVE: "+me.password
       
      if (this.validar()) {
      return;
      }
      if (this.editedIndex > -1) {
       
      //Código para editar
      axios
      .put("login/update", {
      '_id': this._id,
      'rol': this.rol,
      'codigoUsuario': this.user,
      'codigoFarmacia':this.farma,
      'email':this.email,
      'password':this.password,
      'usuario':this.usuario
      })
      .then(function(response) {
        console.log(response.data);
         
          
        
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
      .post("login/add", {
      'rol': this.rol,
      'codigoUsuario': this.user,
      'codigoFarmacia':this.farma,
      'email':this.email,
      'password':this.password,
      'usuario':this.usuario

      })
      .then(function(response) {
           axios
          .post("email/correo", {
               'email':correo,'mensaje':mensaje,'asunto':asunto     
          })
          .then(function(response) {
           
            })
          .catch(function(error) {
            console.log(error);
          });
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

      this.user = item.codigoUsuario._id;
      this.rol = item.rol._id;
      if (item.codigoFarmacia) {
        this.farma = item.codigoFarmacia._id
      } else {
        this.farma=undefined
      }
      this.usuario=item.usuario
      this.email = item.email;
      this.password = item.password;
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
      .put("login/activate", { _id: this.adId })
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
      .put("login/deactivate", { _id: this.adId })
      .then(function(response) {
            // let correo = this.email
      let asunto = "INICIO DE SESIÓN - BK03"
      let correo = response.data.email
      let mensaje = "Su usuario "+response.data.email+" ha sido desactivado, para mayor informacion por favor comuniquese con los administradores."
         axios
          .post("email/correo", {
               'email':correo,'mensaje':mensaje,'asunto':asunto     
          })
          .then(function(response) {
           
            })
          .catch(function(error) {
            console.log(error);
          });
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
  },
  
};
</script>
