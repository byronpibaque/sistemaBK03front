<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Farmacia</v-toolbar-title>
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
                    <v-text-field v-model="farma" label="Farmacia"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-select v-model="farmacias" :items="nfarmacia" label="Farmacias"></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                       <v-select v-model="codigoPropietario" :items="propietarios" label="Propietario"></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                       <v-select v-model="supervisor" :items="supervisores" label="Supervisor"></v-select>
                  </v-flex>
                    <v-flex xs12 sm6 md6>
                       <v-select v-model="lider" :items="lideres" label="Lideres"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                       <v-select v-model="usuario" :items="usuarios" label="Usuarios"></v-select>
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
                    <v-text-field v-model="parroquia" label="Parroquia"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="ubicacion" label="Direccion"></v-text-field>
                  </v-flex>
                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="num_establecimiento" label="Num establecimiento"></v-text-field>
                  </v-flex>
                    <v-flex xs12 sm6 md6>
                    <v-text-field v-model="correoFar" label="Email"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm13 md3>
                    <v-text-field v-model="HAPT" label="HAPT"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm13 md3>
                    <v-text-field v-model="HCPT" label="HCPT"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm13 md3>
                    <v-text-field v-model="HAST" label="HAST"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm13 md3>
                    <v-text-field v-model="HCST" label="HCST"></v-text-field>
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
      <v-data-table :headers="headers" :items="farmacia" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template>
          </td>
          <td>{{ props.item.codigoFarmacias.descripcion }}</td>
          <td>{{ props.item.correo }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>{{ props.item.num_establecimiento }}</td>
          <td>{{ props.item.region }}</td>
          <td>{{ props.item.provincia }}</td>
          <td>{{ props.item.ciudad }}</td>
           <td>{{ props.item.parroquia }}</td>
          <td>{{ props.item.ubicacion }}</td>
          <td>{{ props.item.codigoLider ? props.item.codigoLider.nombres : 'nodata' }}</td>
          <td>{{ props.item.codigoUsuario ? props.item.codigoUsuario.nombres : 'nodata' }}</td>
          <td>{{ props.item.codigoSupervisor ? props.item.codigoSupervisor.nombres : 'nodata' }}</td>
          <td v-if="props.item.codigoPropietario">{{ props.item.codigoPropietario.nombres ? props.item.codigoPropietario.nombres : 'nodata' }}</td>
          <td>{{ props.item.horarioAPT }}</td>
           <td>{{ props.item.horarioCPT }}</td>
           <td>{{ props.item.horarioAST }}</td>
           <td>{{ props.item.horarioCST }}</td>
                   <td v-if="props.item.ippublica">{{ props.item.ippublica }}</td>
                   <td v-else>NO ASIGNADA</td>
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
import axios from "axios";
export default {
  data() {
    return {
      HAPT:"",
      HCPT:"",
      HAST:"",
      HCST:"",
      parroquia:"",
      ciudades:[],
      codigoCiudad:"",
      regiones:[],
      codigoRegion:"",
      provincias:[],
      codigoProvincia:"",
      dialog: false,
      search: "",
      farma:'',
      farmacia: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Farmacias", value: "codigoFarmacias", sortable: false },
        { text: "Email", value: "correo", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
        { text: "Numero de establecimento", value: "num_establecimiento", sortable: false },
        { text: "Region", value: "region", sortable: false },
        { text: "Provincia", value: "provincia", sortable: false },
        { text: "Ciudad", value: "ciudad", sortable: false },
        { text: "Parroquia", value: "parroquia", sortable: false },
        { text: "Direccion", value: "ubicacion", sortable: false },
        { text: "Lider", value: "codigoLider", sortable: true },
        { text: "Usuario", value: "codigoUsuario", sortable: false },
        { text: "Supervisor", value: "codigoSupervisor", sortable: false },
        { text: "Propietario", value: "codigoPropietario", sortable: false },
        { text: "HAPT", value: "HAPT", sortable: false },
        { text: "HCPT", value: "HCPT", sortable: false },
        { text: "HAST", value: "HAST", sortable: false },
        { text: "HCST", value: "HCST", sortable: false },
        { text: "IP", value: "ippublica", sortable: false },
        { text: "Estado", value: "estado", sortable: false }
      ],
      editedIndex: -1,
      _id: "",
      farmacias: "",
      nfarmacia:[],
      correoFar:"",
      
      num_establecimiento: "",
     
      ubicacion: "",
      lider: "",
      lideres:[],
      usuario: "",
      usuarios:[],
      supervisor: "",
      supervisores:[],
     
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      codigoPropietario:"",
      propietarios:[]
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
     this.selectrFarmacias();
     this.selectLider();
       this.selectUsuario();
         this.selectSupervisor();
         this.selectPropietario()
         this.listarProvincias()
         this.listarRegiones()
         this.listarCiudades()
  },
  methods: {
     listarRegiones(){
        let me=this;
          let arrai=[];
          let header={"Token" : this.$store.state.token};
          let configuracion= {headers : header};            
          axios.get('ubicacion/list',configuracion).then(function (response){
            
              arrai=response.data;
              arrai.map(function(x){
                  me.regiones.push({text:x.nombreRegion});
              });
          }).catch(function(error){
              console.log(error);
          });
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
    selectrFarmacias(){
              let me=this;
              let FarmaciasArray=[];
              let header={"Token" : this.$store.state.token};
              let configuracion= {headers : header};            
              axios.get('farmacias/list',configuracion).then(function (response){
                  FarmaciasArray=response.data;
                  FarmaciasArray.map(function(x){
                      me.nfarmacia.push({text:x.descripcion, value:x._id});
                  });
              }).catch(function(error){
                  console.log(error);
              });
          },
    selectPropietario(){
      let me=this;
      let LiderArray=[];
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};            
      axios.get('persona/listPropietarios',configuracion).then(function (response){
          LiderArray=response.data;
          LiderArray.map(function(x){
              me.propietarios.push({text:x.nombres, value:x._id});
          });
      }).catch(function(error){
          console.log(error);
      });
  },
   selectLider(){
      let me=this;
      let LiderArray=[];
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};            
      axios.get('usuario/list',configuracion).then(function (response){
          LiderArray=response.data;
          LiderArray.map(function(x){
              me.lideres.push({text:x.nombres, value:x._id});
          });
      }).catch(function(error){
          console.log(error);
      });
  },
    selectUsuario(){
      let me=this;
      let UsuarioArray=[];
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};            
      axios.get('usuario/list',configuracion).then(function (response){
          UsuarioArray=response.data;
          UsuarioArray.map(function(x){
              me.usuarios.push({text:x.nombres, value:x._id});
          });
      }).catch(function(error){
          console.log(error);
      });
  },
    selectSupervisor(){
      let me=this;
      let SupervisorArray=[];
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};            
      axios.get('usuario/list',configuracion).then(function (response){
          SupervisorArray=response.data;
          SupervisorArray.map(function(x){
              me.supervisores.push({text:x.nombres, value:x._id});
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
        .get("farmacia/list", configuracion)
        .then(function(response) {
         
          me.farmacia = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.correoFar=""
      this.farmacias = "";
      this.farma = "";
      this.num_establecimiento = "";
      this.ubicacion = "";
      this.lider = "";
      this.usuario = "";
      this.supervisor = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.farmacias) {
         this.validaMensaje.push(
          "Selecciona una farmacia."
        );  
      }
       if (!this.lider) {
         this.validaMensaje.push(
          "Selecciona un lider."
        );  
      }
      if (!this.supervisor) {
         this.validaMensaje.push(
          "Selecciona un supervisor."
        );  
      }
      if (!this.usuario) {
         this.validaMensaje.push(
          "Selecciona un usuario."
        );  
      }
      if (this.farma.length < 1 || this.farma.length > 50) {
        this.validaMensaje.push(
          "El nombre de la farmacia debe tener entre 1-50 caracteres."
        );
      }
      if (this.num_establecimiento.length > 20) {
        this.validaMensaje.push(
          "La el numero de documento no debe tener más de 20 caracteres."
        );
      }
      if (this.ubicacion.length > 70) {
        this.validaMensaje.push(
          "La direccion no debe tener más de 70 caracteres."
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
          .put("farmacia/update", {
            _id: this._id,
            'codigoFarmacias': this.farmacias,
            'correo':this.correoFar,
            'descripcion': this.farma,
            'num_establecimiento':this.num_establecimiento,
            'ubicacion':this.ubicacion,
            'codigoLider':this.lider,
            'codigoUsuario':this.usuario,
            'codigoSupervisor':this.supervisor,
            'codigoPropietario':this.codigoPropietario,
            'provincia':this.codigoProvincia,
            'ciudad':this.codigoCiudad,
            'region':this.codigoRegion,
            'parroquia':this.parroquia,
            'horarioAPT':this.HAPT,
            'horarioCPT':this.HCPT,
            'horarioAST':this.HAST,
            'horarioCST':this.HCST,
            
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
          .post("farmacia/add", {
            'codigoFarmacias': this.farmacias,
            'correo':this.correoFar,
            'descripcion': this.farma,
            'num_establecimiento':this.num_establecimiento,
            'ubicacion':this.ubicacion,
            'codigoLider':this.lider,
            'codigoUsuario':this.usuario,
            'codigoSupervisor':this.supervisor,
            'codigoPropietario':this.codigoPropietario,
            'provincia':this.codigoProvincia,
            'ciudad':this.codigoCiudad,
            'region':this.codigoRegion,
            'parroquia':this.parroquia,
            'horarioAPT':this.HAPT,
            'horarioCPT':this.HCPT,
            'horarioAST':this.HAST,
            'horarioCST':this.HCST,
            
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
      this.listarProvincias(item.region);
      this.listarCiudades(item.provincia);
      this.codigoCiudad = item.ciudad || 'nodata';
      this.codigoProvincia = item.provincia || 'nodata';
      this._id = item._id || 'nodata';
      this.farma = item.descripcion || 'nodata';
      this.num_establecimiento = item.num_establecimiento || 'nodata';
      this.ubicacion = item.ubicacion || 'nodata';
      this.correoFar = item.correo || 'nodata';
      this.farmacias = item.codigoFarmacias ? item.codigoFarmacias._id : 'nodata';
      this.lider = item.codigoLider ? item.codigoLider._id : 'nodata';
      this.usuario = item.codigoUsuario ? item.codigoUsuario._id : 'nodata';
      this.supervisor = item.codigoSupervisor ? item.codigoSupervisor._id : 'nodata';
      this.codigoPropietario = item.codigoPropietario ? item.codigoPropietario._id : 'nodata';
      this.codigoRegion = item.region || 'nodata';
      this.codigoProvincia = item.provincia || 'nodata';
      this.codigoCiudad = item.ciudad || 'nodata';
      this.parroquia = item.parroquia || 'nodata';
      this.dialog = true;
      this.editedIndex = 1;
      this.HAPT = item.horarioAPT || 'nodata';
      this.HCPT = item.horarioCPT || 'nodata';
      this.HAST = item.horarioAST || 'nodata';
      this.HCST = item.horarioCST || 'nodata';
    }
    ,
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.descripcion;
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
        .put("farmacia/activate", { _id: this.adId })
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
        .put("farmacia/deactivate", { _id: this.adId })
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
