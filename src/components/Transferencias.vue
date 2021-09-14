<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Transferencias</v-toolbar-title>
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
      
      </v-toolbar>
        <v-flex xs12 sm12 md12 ld12 xl12>
                <v-autocomplete
                  v-model="codigoFar"
                  :items="farmacia"
                  v-if="$store.state.usuario.codigoFarmacia == undefined"
                  @change="listar()"
                  label="Farmacia"
                ></v-autocomplete>
              </v-flex>
      <v-data-table :headers="headers" :items="accesos" :search="search" class="elevation-1">
         <template v-slot:items="props">
                                  <td class="justify-center layout px-0">
                                   <v-icon small  @click="verTransferencia(props.item)" class="mr-2">tab</v-icon>
                                    <v-icon small  @click="eliminar(props.item)" class="mr-2">delete</v-icon>
                                    <template v-if="props.item.estado">
                                      <v-icon small @click="activarDesactivarMostrarT(2,props.item)">block</v-icon>
                                    </template>
                                    <template v-else>
                                      <v-icon small @click="activarDesactivarMostrarT(1,props.item)">check</v-icon>
                                    </template>
                                  </td>
                                  <td>
                                    <div class="blue--text"> {{ props.item.codigoFarmaciaE.descripcion }}</div>
                                   
                                  </td>
                                   <td>
                                    <div class="blue--text"> {{ props.item.codigoFarmaciaR.descripcion }}</div>
                                   </td>
                                  <td class="green--text">{{ props.item.numComprobante }}</td>
                                  <td>{{ props.item.codigoUsuario.nombres }}</td>
                                  <td class="pink--text">{{ props.item.codigoPersona.nombres }}</td>
                                  
                                  <td>{{formatearFecha(props.item.createdAt)}}</td>
                                
                                 <td>
                                    <div v-if="props.item.estado">
                                      <span class="green--text">Entregado</span>
                                    </div>
                                    <div v-else>
                                      <span class="red--text">Por entregar</span>
                                    </div>
                                  </td>
                                </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">RECARGAR</v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="transferenciaView" max-width="1000px">
              <v-card>
                <v-card-title>
                   <span class="headline">Transferencias de punto a punto</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md >
                    <v-layout wrap>           
                         <v-flex xs12 sm12 md12 lg12 xl12 >
                              <v-card>
                             <v-card-text>
                                <v-container grid-list-md>
                                  <v-layout wrap>
                                  <v-flex xs12 sm12 md12 lg12 xl12>
                                        <span class="headline blue--text">Numero de comprobante:</span><span class="headline red--text">{{numComT}}</span>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <span class="headline blue--text">Farmacia Emite:</span><span class="headline">{{FarmaciaEmiT}}</span>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                       <span class="headline blue--text">Farmacia Recibe:</span><span class="headline">{{FarmaciaRecT}}</span>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                       <span class="headline blue--text">Usuario:</span><span class="headline">{{UsuarioT}}</span>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                       <span class="headline blue--text">Cliente:</span><span class="headline">{{Cliente}}</span>
                                    </v-flex>
                                     <v-flex xs12 sm12 md12 lg12 xl12>
                                       <span class="headline blue--text">Fecha:</span><span class="headline">{{Fecha}}</span>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-data-table
                                          :headers="CabezadetalleTransfer"
                                            :items="detalleTransfer"
                                           class="elevation-1"
                                          >
                                            <template v-slot:items="props">
                                            <td class="text-xs-center blue--text">{{ props.item.producto }}</td>
                                            <td class="text-xs-center colortext" bgcolor="#4682dd">
                                              <v-text-field id="cantidad" v-model="props.item.cantidad"  ></v-text-field>
                                            </td>
                                            <td class="text-xs-center colortext" bgcolor="#15A5EB"  v-if="props.item.fraccionCaja!=1">
                                              <v-text-field v-model="props.item.fracciones" ></v-text-field>
                                            </td>
                                            <td class="text-xs-center colortext" bgcolor="#15A5EB"  v-else>
                                              <span class="white--text">SOLO CAJAS</span>
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
                                            <template v-slot:no-data>
                                              <v-btn color="primary" @click="listarTransferencias()"><v-icon  class="mr-2">refresh</v-icon></v-btn>
                                            </template>
                                          </v-data-table> 
                                    </v-flex>
                                    
                                  </v-layout>
                                </v-container>
                            </v-card-text>
                              <v-card-actions>
                                <v-btn color="primary" @click="ocultarTransferencia()">Cancelar</v-btn>
                              </v-card-actions>
                            </v-card>
                        </v-flex>  
                    </v-layout>
                  </v-container>
               </v-card-text>
                
              </v-card>
      </v-dialog>
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
        {
          text: "Farmacia E",
          value: "descripcion",
          sortable: false,
        },
          {
          text: "Farmacia R",
          value: "descripcion",
          sortable: false,
        },
        { text: "Num Comprobante", value: "numComprobante", sortable: false },
        { text: "Usuario", value: "nombres", sortable: false },
        { text: "Cliente", value: "nombres", sortable: false },
      
        { text: "Fecha", value: "createdAt", sortable: true },
       
        { text: "Estado", value: "estado", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      user:'',
      usuarios:[],
      rol: "",
      roles: [],
      farma:'',
      farmacia:[],
      codigoFar:"",
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
    if(this.$store.state.usuario.codigoFarmacia!=undefined){
       this.listar();
    }
   
    // this.selectUsuarios();
    // this.selectrRoles();
    this.selectrFarmacia();
    
  },
  methods: {
      listarTransferencias(){
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
        axios
          .get(
            "transferencias/list?codigoFarmaciaR=" + codigoFarmacia,
            configuracion
          )
          .then(function (response) {
            
            me.transfer = response.data;
       

          })
          .catch(function (error) {
            console.log(error);
          });
      
    },
      formatearFecha(value) {
        if (value) {
            return moment(String(value)).format("MM/DD/YYYY hh:mm");
        }
            },
      eliminar(data){
          let me = this;
          let header = { Token: this.$store.state.token };
          let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
          let configuracion = { headers: header };
          if (codigoFarmacia == undefined) {
            axios
            .delete("transferencias/remove?_id="+data._id, configuracion)
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
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let cd = this.codigoFar
      let configuracion = { headers: header };
      if(codigoFarmacia==undefined){
        axios
          .get(
            "transferencias/listE?codigoFarmaciaE=" + cd,
            configuracion
          )
          .then(function (response) {
          
            me.accesos = response.data;
       

          })
          .catch(function (error) {
            console.log(error);
          });
      }else{
        axios
          .get(
            "transferencias/listE?codigoFarmaciaE=" + codigoFarmacia,
            configuracion
          )
          .then(function (response) {
            
            me.accesos = response.data;
       

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
      'password':this.password
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
      'password':this.password

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
      this.farma = item.codigoFarmacia._id
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
      },
         mostarmodalTransferencias(){
      this.modalTransferencias=1
    },
    ocultarmodalTransferencias(){
      this.modalTransferencias=0
    },
        activarT() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("transferencias/activate", { _id: this.adIdT }, configuracion)
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
        .put("transferencias/deactivate", { _id: this.adIdT }, configuracion)
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
    }, activarDesactivarCerrarT() {
      this.adModalT = 0;
    },  activarDesactivarMostrarT(accion, item) {
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
    }, verTransferencia(item){
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
  },
  
};
</script>
