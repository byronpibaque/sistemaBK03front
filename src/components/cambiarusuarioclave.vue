<template>
<v-layout align-start>
    <v-flex>
            <v-toolbar flat color="white" >
        <v-toolbar-title>Cambiar usuario/clave</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        
    
      
     
        </v-toolbar>
     
        <v-container grid-list-sm class="pa-4 white" >
        <v-layout row wrap> 
        <table class="default">
            <tr>
            <td colspan="2">
                  <v-radio-group
        v-model="valor"
        row
      >
        <v-radio
          label="Actualizar usuario"
          value="1"
        ></v-radio>
        <v-radio
          label="Actualizar correo"
          value="2"
        ></v-radio>
         <v-radio
          label="Actualizar clave"
          value="3"
        ></v-radio>
      </v-radio-group>
             
            <v-text-field v-if="valor==1"
                    v-model="nuevoUsuario"
                    label="Usuario"
                    outlined
                ></v-text-field>
                </td>
                
            </tr>
            <tr>
                <td colspan="2">
                    
                    <v-text-field v-if="valor==2"
                    v-model="nuevoCorreo"
                    label="Correo"
                    outlined
                ></v-text-field> </td>
                
            </tr>
            <tr>
           
            </tr>
            <tr>
                
                 <td>          
                <v-text-field v-if="valor==3"
                    v-model="nuevaClave"
                    label="Clave"
                    outlined
                ></v-text-field>
                </td>

                 <td> <v-text-field v-if="valor==3"
                    v-model="CnuevaClave"
                    label="Confirmar Clave"
                    outlined
                ></v-text-field> </td>
            </tr>
            <tr>
             
                 <td colspan="2">
                        
                      <v-btn
                        tile
                        color="success"
                         @click="Actualizar(nuevoUsuario,nuevoCorreo,nuevaClave,valor)"
                        >
                        Actualizar
                        </v-btn>
                      </td>
            </tr>
            </table>
        
                        <v-flex xs12 sm12 md12 v-show="valida">
                            <div class="red--text" v-for="v in errorValidacion" :key="v" v-text="v"></div>
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
                valor:null,
                chckusuario:false,
                chckclave:false,
                chckcorreo:false,
                nuevoCorreo:"",
                nuevoUsuario:"",
                nuevaClave:"",
                CnuevaClave:"",
                errorValidacion:[],
                valida:0
            }            
        },
         computed: {
             
         
        },
        created() {
            
           
        },
        watch: {
           
        },
         methods: { 
           
            validarContenido(){
                this.valida=0
                this.errorValidacion=[]
              
                if(this.nuevoUsuario.length==0 && this.valor==1){
                    this.errorValidacion.push("Debe ingresar el nombre de usuario")
                }
                if(this.nuevoCorreo.length==0 && this.valor==2){
                    this.errorValidacion.push("Debe ingresar el correo")
                }
                if(this.nuevaClave.length==0 && this.valor==3){
                    this.errorValidacion.push("Debe ingresar la clave")
                }
                if(this.CnuevaClave.length==0 && this.valor==3){
                    this.errorValidacion.push("Debe ingresar la confirmacion de la clave")
                }
                if(this.nuevaClave==this.CnuevaClave){
                   
                }else{
                    this.errorValidacion.push("Las claves no son iguales.");
                }
                if(this.errorValidacion.length){
                    this.valida=1;
                }
                return this.valida;
            },
            limpiar(){
                
                this.nuevoCorreo=""
                this.nuevoUsuario=""
                this.nuevaClave=""
                this.CnuevaClave=""
                this.errorValidacion=[]
                this.valida=0
            },
            Actualizar(nuevoUsuario,nuevoCorreo,nuevaClave,valor){

                let me = this
                let _id =  me.$store.state.usuario.codigoUsuario
                if (me.validarContenido()) {
                    return;
                }
                if(valor==1){
                     axios
                    .put("login/updateD", {
                        '_id': _id,
                        'tipoModificacion':1,
                        'usuario':nuevoUsuario
                    })
                    .then(function(response) {
                            if(response.status==200){
                                Swal.fire("Noticias","Se actualizo correctamente el usuario.","success")
                                me.limpiar()
                            }else{
                                 Swal.fire("Aviso","No se actualizo correctamente el usuario.","warning")
                            }
                        })
                    .catch(function(error) {
                        me.errorValidacion.push("Ocurrio un "+error)
                        me.valida=1
                    });
                }else if(valor==2){
                     axios
                    .put("login/updateD", {
                        '_id': _id,
                        'tipoModificacion':2,
                        'correo':nuevoCorreo
                    })
                    .then(function(response) {
                            if(response.status==200){
                                Swal.fire("Noticias","Se actualizo correctamente el correo.","success")
                                me.limpiar()
                            }else{
                                 Swal.fire("Aviso","No se actualizo correctamente el correo.","warning")
                            }
                        })
                    .catch(function(error) {
                        me.errorValidacion.push("Ocurrio un "+error)
                        me.valida=1
                    });
                }else if(valor==3){
                     axios
                    .put("login/updateD", {
                        '_id': _id,
                        'tipoModificacion':3,
                        'password':nuevaClave
                    })
                    .then(function(response) {
                            if(response.status==200){
                                Swal.fire("Noticias","Se actualizo correctamente la clave.","success")
                                me.limpiar()
                            }else{
                                 Swal.fire("Aviso","No se actualizo correctamente la clave.","warning")
                            }
                        })
                    .catch(function(error) {
                        me.errorValidacion.push("Ocurrio un "+error)
                        me.valida=1
                    });
                }


               


            }
         }
    }
</script>

<style scoped>

</style>