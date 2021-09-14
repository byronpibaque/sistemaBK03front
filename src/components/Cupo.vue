<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Cupo</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
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
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                     <v-autocomplete :items="personas" v-model="codigoPersona" label="Cliente"></v-autocomplete>
                                 </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="topemax" label="Cupo max. $" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="topemin" label="Cupo min. $" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
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
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de <span v-if="adAccion==1">activar </span>
                            <span v-if="adAccion==2">desactivar </span> el item {{adNombre}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" @click="activar()" color="orange darken-4" flat="flat">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" @click="desactivar()" color="orange darken-4" flat="flat">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="categorias"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                    >
                    edit
                    </v-icon>
                    <v-icon
                    small
                    class="mr-2"
                    @click="Eliminar(props.item)"
                    >
                        delete
                    </v-icon>
                    <template v-if="props.item.estado">
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(2,props.item)"
                        >
                        block
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(1,props.item)"
                        >
                        check
                        </v-icon>
                    </template>
                </td>
                <td v-if="props.item.codigoPersona">{{ props.item.codigoPersona.nombres }}</td>
                <td v-else>undefined</td>
                <td>{{ props.item.descripcion }}</td>
                <td>{{ props.item.topemax }}</td>
                <td>{{ props.item.topemin.toFixed(2) }}</td>
                <td>
                    <div v-if="props.item.estado">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </td>   
                <td>{{ formatearFecha(props.item.createdAt)}}</td>             
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import moment from "moment";
    import axios from 'axios'
    import Swal from 'sweetalert2'
    export default {
        data(){
            return{
                topemax:'',
                topemin:0,
                descripcion:'',
                codigoPersona: "",
                personas: [],
                dialog: false,
                search:'',
                categorias:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Cliente', value: 'codigoPersona.nombres', sortable: true },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Max. cupo', value: 'topemax', sortable: false },
                    { text: 'Cupo', value: 'topemin', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false },
                    { text: 'Fecha', value: 'createdAt', sortable: true },
                ],
                editedIndex: -1,
                _id:'',
                nombre:'',
                bandera:false,
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:''
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar()
            this.selectPersona()
        },
        methods: {
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
            listar(){
                let me=this;
                let header={"Token":this.$store.state.token};
                let configuracion = {headers:header};
                axios.get('cupo/list',configuracion).then(function (response){
                    me.categorias=response.data;
                }).catch(function(error){
                    console.log(error);
                });

            },
            limpiar(){
                this._id='';
                this.topemax='';
                this.topemin='';
                this.descripcion='';
                this.codigoPersona=''
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                let validaRegistro ='';              
                if(this.topemax<=this.topemin){
                      this.validaMensaje.push("El tope maximo no puede ser menor al tope minimo.");  
                }
                 if (!this.codigoPersona) {
                        this.validaMensaje.push("Seleccione un cliente.");
                    }
                     if (!this.descripcion) {
                        this.validaMensaje.push("Debe ingresar una descripcion..");
                    }
                if(this.descripcion.length>255){
                    this.validaMensaje.push('La descripción de la categoría no debe tener más de 255 caracteres.');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            }, 
            guardar(){
                let me=this;
                let header={"Token":this.$store.state.token};
                let configuracion = {headers:header};
                axios.get('cupo/existe?codigoPersona='+this.codigoPersona,configuracion)
                .then(function (response){
                 
                   if(response.status==200){
                     me.bandera=true
                    }else{
                        me.bandera=false
                    }

              
               
                if (me.validar()){
                    return;
                }
                
                  if (me.editedIndex > -1) {
                     //Código para editar
                      axios.put('cupo/update',
                        { 
                        '_id':me._id,
                        'descripcion':me.descripcion,
                        'topemax':me.topemax,
                        'topemin':me.topemin, 
                        'codigoPersona':me.codigoPersona
                        })
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                     }
                    else{
                if(me.bandera==true){
                   Swal.fire('Notificación','Ya hay un cupo para el cliente seleccionado..','error')  
                 }else{
                    //Código para guardar
                    axios.post('cupo/add',
                    {
                        'descripcion':me.descripcion,
                        'topemax':me.topemax,
                        'topemin':me.topemin,
                        'codigoUsuario':me.$store.state.usuario.codigoUsuario,
                        'codigoPersona':me.codigoPersona
                        })
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                     }
                } 
                
                }).catch(function(error){
                    console.log(error);
                });  
               

               
            },
            editItem (item) {
                this._id=item._id;
                this.descripcion=item.descripcion;
                this.topemax=item.topemax;
                this.topemin=item.topemin
                if(item.codigoPersona){
                    this.codigoPersona=item.codigoPersona._id;
                }
              
                this.dialog = true;
                this.editedIndex=1;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
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
                axios.put('cupo/activate',{'_id':this.adId})
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
                axios.put('cupo/deactivate',{'_id':this.adId})
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
                this.limpiar()
                this.dialog = false;
            },
            formatearFecha(value) {
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY hh:mm')
                }
                },
                  Eliminar(data) {
                    let me = this;
                    let header = { Token: this.$store.state.token };
                    let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
                    let configuracion = { headers: header };
                    
                        axios
                        .delete("cupo/remove?_id=" + data._id, configuracion)
                        .then(function(response) {
                            if (response.status === 200) {
                            Swal.fire("Notificación", "Procedimiento exitoso!", "success");
                            me.listar();
                        
                            
                            } else {
                            Swal.fire("Notificación", "Hubo algun problema!", "error");
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                    
                    },
            },
        
    }
</script>
