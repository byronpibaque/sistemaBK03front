<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Reporte de rentabilidad</v-toolbar-title>
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
      </v-toolbar>

      <v-container grid-list-xl class="pa-4 white">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-checkbox
              style="margin-top: 15px"
              color="success"
              v-model="checkbox"
              label="Buscar en todas las farmacias"
              v-if="$store.state.usuario.codigoFarmacia == undefined"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3 xl3 v-if="checkbox == false">
            <v-autocomplete
              :items="farmacias"
              v-model="codigoFarmacia"
              label="Farmacia:"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm2 md2>
            <v-dialog
              ref="dialog1"
              v-model="modal1"
              :return-value.sync="finicio"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="finicio"
                  label="Fecha de inicio"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="finicio" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal1 = false"
                  >Cancelar</v-btn
                >
                <v-btn text color="success" @click="$refs.dialog1.save(finicio)"
                  >Aceptar</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm2 md2>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="ffin"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="ffin"
                  label="Fecha de fin"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="ffin" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false"
                  >Cancelar</v-btn
                >
                <v-btn text color="success" @click="$refs.dialog.save(ffin)"
                  >Aceptar</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-btn
              @click="generar(codigoFarmacia, finicio, ffin)"
              class="primary"
            >
              GENERAR
              <v-icon>autorenew</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12></v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <span class="blue--text">TOTAL VENTAS:</span>${{ totalVentas }}
            </v-flex>
            <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="gastos" label="Gastos Totales"></v-text-field>
            </v-flex>
            <v-flex xs12 sm1 md1 lg1 xl1>
              <v-text-field v-model="pagos" label="Pagos Totales"></v-text-field>
             
            </v-flex>
        
            <v-flex xs12 sm2 md2 lg2 xl2>
              <span class="green--text">COSTO NETO:</span>${{ totalNeto }}
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2> <span class="blue--text">TOTAL COSTOS:</span>${{
                parseFloat(gastos)+parseFloat(pagos)+parseFloat(totalNeto)
              }} 
              </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <span class="blue--text">RENTABILIDAD:</span>${{
                  (parseFloat(totalVentas)-(parseFloat(gastos)+parseFloat(pagos)+parseFloat(totalNeto)))/parseFloat(totalVentas)*100
              }}
            </v-flex>
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
      checkbox: false,
      finicio: "",
      ffin: "",
      modal: false,
      modal1: false,
      search: "",
      farmacias: [],
      codigoFarmacia: "",
      totalVentas: 0,
      totalNeto: 0,
      gastos: 0,
      pagos: 0,
    };
  },
  created() {
    this.obtenerFarmacias();
  },
  methods: {
    generar(coF, fI, fF) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoFarmacia = this.$store.state.usuario.codigoFarmacia;
      let codigoUser = this.$store.state.usuario.codigoUsuario;
      let fechaInicial = fI;
      let fechaConverI = new Date(fechaInicial + " 00:00:01");
      let fechaFinal = fF;
      let fechaConverF = new Date(fechaFinal + " 23:59:59");
      let configuracion = { headers: header };

      if (codigoFarmacia == undefined) {
        if (me.checkbox == false) {
          axios
            .get(
              "ventas/reporteVDT?codigoFarmacia=" +
                coF +
                "&fechaInicio=" +
                fechaConverI.toISOString() +
                "&fechaFin=" +
                fechaConverF.toISOString(),
              configuracion
            )
            .then(function (response) {
              let total = 0;
              let total2 = 0;
          
              response.data.forEach((element) => {
                let costoUnitario =element._id.idProducto.costoNeto/element._id.idProducto.fraccionCaja||0
                if (parseInt(element._id.iva)) {
                  total +=
                    ((parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.pvp)) -
                    (parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.pvp) *
                      parseInt(element._id.descuento)) /
                      100) +
                    parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.pvp) *
                      0.12;
                  total +=
                    parseInt(element._id.fracciones) *
                      parseFloat(element._id.idProducto.precioUni) -
                    (parseInt(element._id.fracciones) *
                      parseFloat(element._id.idProducto.precioUni) *
                      parseInt(element._id.descuento)) /
                      100 +
                    parseInt(element._id.fracciones) *
                      parseFloat(element._id.idProducto.precioUni) *
                      0.12;
                } else {
                  total +=
                    parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.pvp) -
                    (parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.pvp) *
                      parseInt(element._id.descuento)) /
                      100;
                  total +=
                    parseInt(element._id.fracciones) *
                      parseFloat(element._id.idProducto.precioUni) -
                    (parseInt(element._id.fracciones) *
                      parseFloat(element._id.idProducto.precioUni) *
                      parseInt(element._id.descuento)) /
                      100;
                }
                //COSTO NETO
                if (parseInt(element._id.iva)) {
                  total2 +=
                    parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.costoNeto) -
                    (parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.costoNeto) *
                      parseInt(element._id.descuento)) /
                      100 +
                    parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.costoNeto) *
                      0.12;

                  total2 +=
                    parseInt(element._id.fracciones) *
                      parseFloat(costoUnitario) -
                    (parseInt(element._id.fracciones) *
                      parseFloat(costoUnitario) *
                      parseInt(element._id.descuento)) /
                      100 +
                    parseInt(element._id.fracciones) *
                      parseFloat(costoUnitario) *
                      0.12;
                }
                else {
                  total2 +=
                    parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.costoNeto) -
                    (parseInt(element._id.cantidad) *
                      parseFloat(element._id.idProducto.costoNeto) *
                      parseInt(element._id.descuento)) /
                      100;
                  total2 +=
                    parseInt(element._id.fracciones) *
                      parseFloat(costoUnitario) -
                    (parseInt(element._id.fracciones) *
                      parseFloat(costoUnitario) *
                      parseInt(element._id.descuento)) /
                      100;
                }
              });
              me.totalVentas = total.toFixed(2);
              me.totalNeto = total2.toFixed(2);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
        }
      }
    },
    obtenerFarmacias() {
      let me = this;
      let dataArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("farmacia/list", configuracion)
        .then(function (response) {
          dataArray = response.data;
          dataArray.map(function (x) {
            me.farmacias.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>