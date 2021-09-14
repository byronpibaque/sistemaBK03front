<template>
  <div id="principal">
    <v-layout justify-center>
      <div id="card">
        <v-flex xs8 sm8 md6 lg5 xl5>
          <v-card>
            <v-toolbar dark color="blue darken-3">
              <v-toolbar-title> INICIO DE SESIÓN </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                autofocus
                color="accent"
                v-model="email"
                label="Ingrese su correo"
                required
              >
              </v-text-field>
              <v-flex xs6 sm6 md6 lg6 xl6>
                <v-text-field
                  type="password"
                  color="accent"
                  v-model="password"
                  label="Ingrese su contraseña"
                  v-on:keyup.enter="ingresar"
                  required
                >
                </v-text-field>
              </v-flex>

              <v-flex class="red--text" v-if="errorM">
                {{ errorM }}
              </v-flex>
            </v-card-text>
            <v-card-actions class="px-3 pb-3">
              <v-flex text-xs-right>
                <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-flex>
      </div>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import os from "os";
import Swal from "sweetalert2";
export default {
  created() {
   // this.ip();
    // this.obtener()
  },
  computed: {},
  data() {
    return {
      email: "",
      password: "",
      errorM: null,
      ipobt: "",
      ipalmacenada: "",
      val: [],
    };
  },
  methods: {
    async comprobacion(ipobtenida, ippublica) {
      if (ipobtenida == ippublica) {
        return true;
      } else {
        return false;
      }
    },

    async iplocal(){
     const response = await axios.get("http://localhost:25000/api/configuracion/obtenerip")
    
     return response.data
      //return "192.168.0.103"
    },
    async obtenerIP(_id) {
      let me = this;

      const response = await axios.get("farmacia/query?_id=" + _id);

      return response.data.ippublica;
    },
    isMobile(){
      if( (navigator.userAgent.match(/Android/i)) ||
            (navigator.userAgent.match(/webOS/i)) ||
            (navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i)) ||
            (navigator.userAgent.match(/BlackBerry/i))){

              return true
      }else{

        return false
      }

    },
    ingresar() {
      let me = this;
      //let ipob = this.ipobt;
       
        const iplocally = me.iplocal()
        iplocally.then((resp) => {
          me.ipobt=resp
        })
       
      axios
        .post("login/login", { email: this.email, password: this.password })
        .then((respuesta) => {
        
          if (respuesta.data.user.codigoFarmacia == undefined) {
            this.$store.dispatch(
                    "guardarToken",
                    respuesta.data.tokenReturn
                  );
                  this.$router.push({ name: "home" });
          } else {
            if(this.isMobile()){
               this.$store.dispatch(
                    "guardarToken",
                    respuesta.data.tokenReturn
                  );
                  this.$router.push({ name: "home" });
            }else{
              const pro = me.obtenerIP(respuesta.data.user.codigoFarmacia);
            pro.then((result) => {
           
              const verdad = this.comprobacion(me.ipobt, result);
              verdad.then((rea) => {
                console.log(rea);
                if (rea) {

                  this.$store.dispatch(
                    "guardarToken",
                    respuesta.data.tokenReturn
                  );
                  this.$router.push({ name: "home" });
                } else {
                  Swal.fire(
                    "ERROR!",
                    "El usuario no corresponde a este punto de venta.",
                    "error"
                  );
                }
              });
            });
            }
            
          }
        })
        .catch((err)=>{
          if(err.response.status==500){
            this.errorM=err.response.data.message
          }else{
            this.errorM="Ocurrio un error en el servidor";
          }
         
        })
    },
  },
};
</script>

<style>
#principal {
  /* background-image: url('../assets/moon.jpg');   */
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#card {
  width: 70%;
  height: 100%;
  margin-left: 0%;
}
</style>
