<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>AsignarIp</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
      </v-toolbar>

      <v-container grid-list-sm class="pa-4 white">
        <v-layout row wrap>
              <v-flex xs12 sm6 md6 lg6 xl6>
            <v-autocomplete :items="farmacias" v-model="codigoFarmacia"   label="Seleccione una farmacia"></v-autocomplete>
          </v-flex>
       
          <v-flex xs4 sm4 md4 lg4 xl4>
            <v-text-field
              v-model="asignarIp"
              label="Nueva Ip"
              outlined
            ></v-text-field>
          </v-flex>
        <v-flex xs4 sm4 md4 lg4 xl4>
        <v-btn  dark color="teal" @click="guardarIP()">
            ASIGNAR
            <v-icon dark>save</v-icon>
        </v-btn>

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
  data() {
    return {
      asignarIp: "",
      ipobt: "",
      farmacias:[],
      codigoFarmacia:""
    };
  },
  computed: {},
  created() {
      this.consultarFarmacias()
  },
  watch: {},
  methods: {
    consultarFarmacias() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let configuracion = { headers: header };
      if (codigoFarmacia == undefined) {
        axios
          .get("farmacia/list", configuracion)
          .then(function (response) {
            ArrayT = response.data;
            ArrayT.map(function (x) {
              me.farmacias.push({ text: x.descripcion, value: x._id });
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        axios
          .get("farmacia/query?_id=" + codigoFarmacia, configuracion)
          .then(function (response) {
            me.farmacias.push({
              text: response.data.descripcion,
              value: response.data._id,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    guardarIP () { 
         axios
          .put("farmacia/updateIP", {
            '_id': this.codigoFarmacia,
            'ippublica': this.asignarIp,
          })
          .then(function(response) {
              if(response.status==500){
                  Swal.fire("Error","Oruccio un error"+response.message);
              }else{
                  Swal.fire("Noticias!","Se actualizo la IP correctamente","success")
              }
          })
          .catch(function(error) {
            console.log(error);
          });
    },
    testCorreo(){
      axios.post("http://localhost:25000/api/ventas/enviarCorreo").then(function(response) {
        console.log(response);
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
    
};
</script>

<style scoped></style>
