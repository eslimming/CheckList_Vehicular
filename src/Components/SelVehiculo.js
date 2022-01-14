import React from "react";
/*import axios from "axios";*/

import { BrowserView } from "react-device-detect";
import { Footer, Header, Notification, Button, List, Table, Select, Icon } from "@scuf/common";
import Formulario from "./Formulario";
import MyIFrame from "./MyIFrame";
import 'react-toastify/dist/ReactToastify.css';
import '../toast-notification-wrap.css'


const ReactToastify = require('react-toastify');

//const config = require("../config.json");
//const Pagina = config.Pagina;

//const headers = { 'Authorization': 'dalealbo' }


const ToastNotification = ({ closeToast, Texto }) => (
    <Notification
        className="toast-notification"
        severity="critical"
        onCloseClick={closeToast}
        hasIcon={true}
        title={Texto}
        detailsText="Intentelo nuevamente"
        onDetailsClick={() => { }} //{() => alert('Debie ingresar todos los datos para continuar')}
    />

)


export default class SelVehiculo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selector: [],
            estadoVehiculo: "",
            idVehiculo: 0,
            Patente: "",
            idPlanta: 0,
            habilitarBoton: false,
            comenzar: 0,
            hidden: "hidden"
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onReporteClick = this.onReporteClick.bind(this);
    }




    componentWillMount() {

        const vehiculos = this.props.vehiculos[0].vehiculos
        var listavehiculos = []
        vehiculos.map((item) =>
            listavehiculos.push({ 'value': item.idPlanta + '$' + item.idVehiculo + '$' + item.patente, 'text': item.patente + ' (' + item.planta + ')' })
        )

        this.setState({
            vehiculos: vehiculos,
            selector: listavehiculos
        })

    }


    handleOnChange = (value) => {

        var vehiculoSeleccionadoEstado
        var idVehiculo

        this.state.vehiculos.filter(vehiculo => vehiculo.idPlanta === value.split("$")[0] & vehiculo.idVehiculo === value.split("$")[1]).map(filteredVehicle => {
            vehiculoSeleccionadoEstado = filteredVehicle.estado
            idVehiculo = filteredVehicle.idVehiculo
            return null
        }
        )


        this.setState({
            idPlanta: Number(value.split('$')[0]),
            Patente: value.split('$')[2],
            idVehiculo: Number(idVehiculo),
            estadoVehiculo: vehiculoSeleccionadoEstado
        })

    }

    onButtonClick() {
        this.setState({ comenzar: 1 })
    }

    onReporteClick() {
        this.setState({ comenzar: 2 })
    }

    render() {

        if (this.state.comenzar === 1) {
            return (
                <Formulario idUsuario={this.props.idUsuario} token={this.props.token} idVehiculo={this.state.idVehiculo} Patente={this.state.Patente} idPlanta={this.state.idPlanta} />
            )
        }
        else if (this.state.comenzar === 2) {
            return (
                <MyIFrame />
            )
        }
        else
            return (
                <React.Fragment>

                    {/*{"Planta " + JSON.stringify(this.state.idPlanta)}*/}
                    {/*<br />*/}
                    {/*{"vehiculo " + JSON.stringify(this.state.idVehiculo)}*/}
                    <Header title="CheckList">
                    </Header>
                    <Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell textAlign="center">
                                    <Select fluid={true} placeholder="Seleccione el Vehiculo" options={this.state.selector} onChange={(value) => this.handleOnChange(value)} />

                                    <div style={{ paddingTop: 10 }}>
                                        <Button className="fullancho" disabled={this.state.estadoVehiculo === "OK" ? false : true} fluid={true} content="Comenzar" onClick={this.onButtonClick} />
                                    </div>

                                    <BrowserView>
                                        <div style={{ paddingTop: 10 }}>
                                            <td onClick={this.onReporteClick}><Icon name={"document-report"} root="common" /></td>
                                        </div>
                                    </BrowserView>

                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="left">
                                    <div>
                                        {this.state.vehiculos.filter(vehiculo => Number(vehiculo.idPlanta) === this.state.idPlanta & Number(vehiculo.idVehiculo) === this.state.idVehiculo).map(filteredVehicle => (
                                            <React.Fragment>
                                                {filteredVehicle.estado === "OK" ? "Vehiculo Habilitado" : filteredVehicle.estado}&nbsp;&nbsp;&nbsp;{<Icon name={filteredVehicle.estado === "OK" ? "badge-check" : "badge-stop"} root="common" />}
                                                <br />
                                                <List bulleted={true}>

                                                    <List.Content>Permiso Circulación: {filteredVehicle.permiso_Circulacion}</List.Content>
                                                    <List.Content>Seguro Obligatorio: {filteredVehicle.seguro_Obligatorio}</List.Content>
                                                    <List.Content>Revision Técnica: {filteredVehicle.revision_Tecnica}</List.Content>
                                                    <List.Content>Responsable: {filteredVehicle.responsable}</List.Content>
                                                    <List.Content>Ultima Revision: {filteredVehicle.lastchecklist}</List.Content>
                                                </List>
                                            </React.Fragment>
                                        ))}


                                        {/*<React.Fragment>*/}
                                        {/*    {this.state.vehiculoSeleccionado[0].estado === "OK" ? "Vehiculo Habilitado" : this.state.vehiculoSeleccionado[0].estado}&nbsp;&nbsp;&nbsp;{<Icon name={this.state.vehiculoSeleccionado[0].estado === "OK" ? "badge-check" : "badge-stop"} root="common" />}*/}
                                        {/*    <br />*/}
                                        {/*    <List bulleted={true}>*/}

                                        {/*        <List.Content>Permiso Circulación: {this.state.vehiculoSeleccionado[0].permiso_Circulacion}</List.Content>*/}
                                        {/*        <List.Content>Seguro Obligatorio: {this.state.vehiculoSeleccionado[0].seguro_Obligatorio}</List.Content>*/}
                                        {/*        <List.Content>Revision Técnica: {this.state.vehiculoSeleccionado[0].revision_Tecnica}</List.Content>*/}
                                        {/*        <List.Content>Responsable: {this.state.vehiculoSeleccionado[0].responsable}</List.Content>*/}
                                        {/*    </List>*/}
                                        {/*</React.Fragment>*/}

                                    </div>

                                    {/*<List className={this.state.hidden}>*/}
                                    {/*    <List.Content>Rocket Raccoon</List.Content>*/}
                                    {/*    <List.Content>Groot</List.Content>*/}
                                    {/*</List>*/}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>


                    {/*{*/}
                    {/*    (() => {*/}
                    {/*        switch (this.state.idUsuario) {*/}
                    {/*            case -1:*/}
                    {/*                ReactToastify.toast(<ToastNotification Texto={"Usuario Invalido"} closeToast={true} />);*/}
                    {/*                this.setState({ idUsuario: 0 })*/}
                    {/*                break;*/}
                    {/*            case -2:*/}
                    {/*                ReactToastify.toast(<ToastNotification Texto={"Error API"} closeToast={true} />);*/}
                    {/*                this.setState({ idUsuario: 0 })*/}
                    {/*                break;*/}
                    {/*            default:*/}
                    {/*                return null;*/}
                    {/*        }*/}
                    {/*    })()*/}
                    {/*}*/}


                    <div>
                        <ReactToastify.ToastContainer
                            hideProgressBar={false}
                            closeOnClick={false}
                            closeButton={false}
                            newestOnTop={true}
                            position="bottom-right"
                            autoClose={2500}
                            toastClassName="toast-notification-wrap"
                        />
                    </div>


                    <Footer copyrightText={"© " + new Date().getFullYear() + " Honeywell Chile"}>
                        <Footer.Item href="#">Terms & Conditions</Footer.Item>
                        <Footer.Item href="#">Privacy Policy</Footer.Item>
                    </Footer>
                </React.Fragment >

            );
    }

    notify() {
        ReactToastify.toast(<ToastNotification closeToast={true} />)
    }

}
