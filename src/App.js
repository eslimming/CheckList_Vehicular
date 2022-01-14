import React, { lazy, Suspense } from "react";
import axios from "axios";

//import "@scuf/common/honeywell/theme.css";
//import "@scuf/common/honeywell-dark/theme.css";

import { Header, Notification, Button, Input, Icon, Table, Checkbox, Statistic, Grid } from "@scuf/common";
import SelVehiculo from "./Components/SelVehiculo";
import 'react-toastify/dist/ReactToastify.css';
import './toast-notification-wrap.css'

const ReactToastify = require('react-toastify');

const config = require("./config.json");
const API = config.api_login
const apiKey = config.authorization;
const headers = { 'authorization': apiKey }


function Tema() {

    var Theme
    if (localStorage.getItem('checklistTheme') === 'true')
        Theme = lazy(() => import("./Components/Theme_Light"))
    else
        Theme = lazy(() => import("./Components/Theme_Dark"))


    return <Suspense fallback={null}>
        <Theme />
    </Suspense>


}


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




export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tema: localStorage.getItem('checklistTheme'),
            hidden: "hidden",
            RUT: "",
            vehiculos: [],
            idUsuario: 0,
            token: "",
            isLoading: false,
            JsonString: []
        };
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick() {

        this.setState({ isLoading: true });
        if (this.state.RUT.length < 7)
            this.setState({ idUsuario: -1, isLoading: false })
        else
            try {

                axios.post(`${API}`,
                    {
                        "RUT": this.state.RUT,
                        "idPais": 1,
                    },
                    { headers: headers })
                    .then((res) => {
                        const items = JSON.parse(res.data[0].JsonString)
                        this.setState({
                            idUsuario: Number(items[0].idUsuario),
                            token: items[0].token,
                            vehiculos: items,
                            isLoading: false
                        });
                    });



            } catch (e) {
                this.setState({
                    idUsuario: -2,
                    isLoading: false,
                    JsonString: e
                })
            }

    }


    handleOnChangeTheme = (checked) => {
        localStorage.setItem('checklistTheme', checked.toString())
        window.location.reload();
    }



    componentDidMount() {
        setTimeout(function () {
            this.setState({ hidden: "" });
        }.bind(this), 75)
    }



    render() {

        if (this.state.idUsuario > 0) {
            return (
                <SelVehiculo idUsuario={this.state.idUsuario} token={this.state.token} vehiculos={this.state.vehiculos} />
            )
        }
        else
            return (
                <div className={this.state.hidden}>
                    {/*{JSON.stringify(this.state.idUsuario)}*/}

                    <Tema onLoaded={this.handleLoaded} />
                    <Header title="CheckList">
                        {/*<Header.Item href="#">*/}
                        {/*    <Checkbox label={this.state.tema === 'true' ? 'Claro' : 'Oscuro'} toggle={true} checked={this.state.tema === 'true' ? true : false}*/}
                        {/*        onChange={(checked) => this.handleOnChangeTheme(checked)} />*/}
                        {/*</Header.Item>*/}
                    </Header>


                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4} sWidth={12}>
                                <Statistic value="" fluid={true} />
                            </Grid.Column>
                            <Grid.Column width={4} sWidth={12}>
                                <Statistic value="CheckList Vehicular" fluid={true} />
                            </Grid.Column>
                            <Grid.Column width={4} sWidth={12}>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>


                    <Table className="bottom">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell textAlign="center">
                                    <Input fluid={true} disabled={this.state.isLoading} placeholder="RUT" value={this.state.RUT} onChange={(value) => this.setState({ RUT: value })} />
                                    <div style={{ paddingTop: 10 }}>
                                        <Button className="fullancho" disabled={this.state.isLoading} loading={this.state.isLoading} fluid={true} icon={<Icon name="user" root="common" />} content="Ingresar" onClick={this.onButtonClick} />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Checkbox label={this.state.tema === 'true' ? 'Light' : 'Dark'} toggle={true} checked={this.state.tema === 'true' ? true : false}
                                        onChange={(checked) => this.handleOnChangeTheme(checked)} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>


                    {
                        (() => {
                            switch (this.state.idUsuario) {
                                case -1:
                                    ReactToastify.toast(<ToastNotification Texto={"Usuario Invalido"} closeToast={true} />);
                                    this.setState({ idUsuario: 0 })
                                    break;
                                case -2:
                                    ReactToastify.toast(<ToastNotification Texto={"Error API"} closeToast={true} />);
                                    this.setState({ idUsuario: 0 })
                                    break;
                                default:
                                    return null;
                            }
                        })()
                    }


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


                    {/*<Footer className="bottom" copyrightText={"© " + new Date().getFullYear() + " Honeywell Chile"}>*/}
                    {/*    <Footer.Item href="#">Terms & Conditions</Footer.Item>*/}
                    {/*    <Footer.Item href="#">Privacy Policy</Footer.Item>*/}
                    {/*</Footer>*/}
                </div >

            );
    }

    notify() {
        ReactToastify.toast(<ToastNotification closeToast={true} />)
    }

}
