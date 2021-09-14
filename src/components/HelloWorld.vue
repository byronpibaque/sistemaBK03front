<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex class="font-weight-bold blue--text" style="font-size:20px">
        <span>Usuario: {{NombreUsuario}}</span>
      </v-flex>
       <v-flex class="font-weight-bold green--text" style="font-size:20px">
        <span>Farmacia: {{Farmacia}}</span>
      </v-flex>
      <v-flex xs12>
        <v-img :src="require('../assets/tuahogo.png')" class="my-3" contain height="200"></v-img>
      </v-flex>
      
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">Bienvenido a BK03</h1>
        <p class="subheading font-weight-regular">
          Sistema de Punto de venta, de uso exclusivo
          <br />de la linea de Farmacias TU AHORRO.
          <a href target="_blank"></a>
        </p>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">Proximamente..</h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    ecosystem: [
      {
        text: "vuetify-loader",
        href: "https://github.com/vuetifyjs/vuetify-loader"
      },
      {
        text: "github",
        href: "https://github.com/vuetifyjs/vuetify"
      },
      {
        text: "awesome-vuetify",
        href: "https://github.com/vuetifyjs/awesome-vuetify"
      }
    ],
    importantLinks: [
      {
        text: "Documentation",
        href: "https://vuetifyjs.com"
      },
      {
        text: "Chat",
        href: "https://community.vuetifyjs.com"
      },
      {
        text: "Made with Vuetify",
        href: "https://madewithvuetifyjs.com"
      },
      {
        text: "Twitter",
        href: "https://twitter.com/vuetifyjs"
      },
      {
        text: "Articles",
        href: "https://medium.com/vuetify"
      }
    ],
    whatsNext: [
      {
        text: "Explore components",
        href: "https://vuetifyjs.com/components/api-explorer"
      },
      {
        text: "Select a layout",
        href: "https://vuetifyjs.com/layout/pre-defined"
      },
      {
        text: "Frequently Asked Questions",
        href: "https://vuetifyjs.com/getting-started/frequently-asked-questions"
      }
    ],
    usuarios: [],
    NombreUsuario: "",
    farmacias: [],
    Farmacia: ""
  }),
  created() {
    this.ObtenerUs();
    this.ObtenerFa();
  },
  methods: {
    ObtenerUs() {
      let me = this;
      let ArrayT = [];

      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario.codigoUsuario;

      axios
        .get("usuario/query?_id=" + codigoUsuario, configuracion)
        .then(function(response) {
          me.usuarios = response.data;
          me.NombreUsuario = me.usuarios.nombres;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    ObtenerFa() {
      let me = this;
      let ArrayT = [];

      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      if (codigoFarmacia == undefined) {
        me.Farmacia = "ADMINISTRADOR";
      } else {
        axios
          .get("farmacia/query?_id=" + codigoFarmacia, configuracion)
          .then(function(response) {
            me.farmacias = response.data;
            me.Farmacia = me.farmacias.descripcion;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style>
</style>
