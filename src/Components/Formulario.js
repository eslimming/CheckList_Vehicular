import React from "react";
import axios from "axios";
import { Footer, Header, Button, Notification, Card, Loader, Modal, Badge } from "@scuf/common";
import Grupos from "./Grupos";
import 'react-toastify/dist/ReactToastify.css';
import '../toast-notification-wrap.css'

const ReactToastify = require('react-toastify');

const config = require("../config.json");
const APIFormulario = config.api_formulario
const APIResultado = config.api_resultado
const apiKey = config.authorization;
const headers = { 'authorization': apiKey }


const ToastNotification = ({ closeToast, Texto, Detalle }) => (
    <Notification
        className="toast-notification"
        severity="critical"
        onCloseClick={closeToast}
        hasIcon={true}
        title={Texto}
        //detailsText="Todos los datos son obligatorios"
        detailsText={Detalle}
        onDetailsClick={() => { }} //{() => alert('Debie ingresar todos los datos para continuar')}
    />
)


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hidden: "hidden",
            activePage: 0,
            datos: [], //require("./Components/datos.json"),
            items: [],
            respuestas: [],
            apiBody: "",
            modal: false,
            modalFin: false,
            Preguntas_Todas: [],
            Preguntas_Respondidas: [],
            Preguntas_Faltantes: [],
            Situacion_Final: "",
            Color_Situacion_Final: "",
            MensajeAPI: ""
        };
        this.click_Next = this.click_Next.bind(this);
        this.click_Prev = this.click_Prev.bind(this);
        this.click_Send = this.click_Send.bind(this);
        this.click_ModalSi = this.click_ModalSi.bind(this);
        this.click_ModalNo = this.click_ModalNo.bind(this);
    }



    componentWillMount() {
        try {

            axios.post(`${APIFormulario}`,
                {
                    "idPlanta": this.props.idPlanta
                },
                { headers: headers })
                .then((res) => {
                    const items = JSON.parse(res.data[0].JsonString)
                    this.setState({
                        datos: items,
                        isLoading: false
                    });
                });

        } catch (e) {
            console.log(e);
        }

    }

    componentDidMount() {
        try {
            setInterval(async () => {
                if (this.state.isLoading)
                    axios.post(`${APIFormulario}`,
                        {
                            "idPlanta": this.props.idPlanta
                        },
                        { headers: headers })
                        .then((res) => {
                            const items = JSON.parse(res.data[0].JsonString)
                            this.setState({
                                datos: items,
                                isLoading: false
                            });
                        });

            }, 5000);
        } catch (e) {
            console.log(e);
        }
    }


    click_Next() {

        var Preguntas_Todas = []
        this.state.datos[this.state.activePage].datos.map((item) => Preguntas_Todas.push(item.label))

        let Preguntas_Faltantes = Preguntas_Todas.filter(Pregunta => !this.state.Preguntas_Respondidas.includes(Pregunta))

        this.setState({
            Preguntas_Todas: Preguntas_Todas,
            Preguntas_Faltantes: Preguntas_Faltantes

        });

        const page = Number(this.state.datos[this.state.activePage].id)
        const pageSize = this.state.datos[this.state.activePage].datos.length
        var ndatos = 0
        this.state.items.map((item) => parseInt(item.key.split("-")[0]) === page ? ndatos = ndatos + 1 : null)


        if (ndatos < pageSize) {
            var mensaje
            (pageSize - ndatos) === 1 ? mensaje = "Falta un dato" : mensaje = ("Faltan " + (pageSize - ndatos) + " datos")
            ReactToastify.toast(<ToastNotification Detalle={JSON.stringify(Preguntas_Faltantes).replace('[', '').replace(']', '')} Texto={mensaje} closeToast={true} />)
        }
        else {

            if (this.state.activePage >= this.state.datos.length - 2) {
                this.setState({ hidden: "" });
            }

            if (this.state.activePage < this.state.datos.length - 1) {
                this.setState({ activePage: this.state.activePage + 1 });
                window.scrollTo(1, 1);
            }
            //else {
            //    this.setState({ activePage: 0, hidden: "" });
            //}


        }
    }

    click_Prev() {
        const page = Number(this.state.datos[this.state.activePage].id)
        //const pageSize = this.state.datos[this.state.activePage].datos.length
        var ndatos = 0
        this.state.items.map((item) => parseInt(item.key.split("-")[0]) === page ? ndatos = ndatos + 1 : null)

        //if (ndatos < pageSize) {
        //    var mensaje
        //    (pageSize - ndatos) === 1 ? mensaje = "Falta un dato" : mensaje = ("Faltan " + (pageSize - ndatos) + " datos")
        //    ReactToastify.toast(<ToastNotification Texto={mensaje} closeToast={true} />)
        //}
        //else {
        //    if (this.state.activePage > 0) {
        //        this.setState({ activePage: this.state.activePage - 1 });
        //    } else {
        //        this.setState({ activePage: this.state.datos.length - 1 });
        //    }
        //    window.scrollTo(1, 1);
        //}

        if (this.state.activePage > 0) {
            this.setState({ activePage: this.state.activePage - 1 });
            window.scrollTo(1, 1);
        }


    }


    click_Send() {
        this.setState({ modal: true })
    }

    click_ModalSi() {
        try {
            this.setState({ isLoading: true, modal: false });

            var addResultados = ""
            this.state.respuestas.map((item) =>
                /*addResultados += `EXECUTE dbo.add_Resultado '${this.props.token}',1,${this.props.idPlanta},${this.props.idUsuario},${this.props.idVehiculo},${item.idPregunta},'${item.Respuesta}';`*/
                addResultados += `('${this.props.token}',1,${this.props.idPlanta},${this.props.idUsuario},${this.props.idVehiculo},${item.idPregunta},'${item.Respuesta}'),`
            )

            /*addResultados += `exec[dbo].[sp_SendMail] '${this.props.token}';`*/


            var Situacion_Final = "Vehiculo Operativo\nConductor: Autorizado"
            var Color_Situacion_Final = "green\ngreen"
            if (addResultados.includes("'M'")) {
                Situacion_Final = "Fuera de Servicio. Programar Mantención Correctiva\nConductor: Autorizado"
                Color_Situacion_Final = "red\ngreen"
            } else if (addResultados.includes("'R'")) {
                Situacion_Final = "Programar Mantención Preventiva\nConductor: Autorizado"
                Color_Situacion_Final = "yellow\ngreen"
            }



            axios.post(`${APIResultado}`,
                {
                    "Query": addResultados
                },
                { headers: headers })
                .then((res) => {
                    const items = res.data;

                    if (items[0].Mensaje.includes("RV")) {
                        Situacion_Final = "Fuera de Servicio. Programar Mantención Correctiva\nConductor: Autorizado"
                        Color_Situacion_Final = "red\ngreen"
                    } else if (items[0].Mensaje.includes("AV")) {
                        Situacion_Final = "Programar Mantención Preventiva\nConductor: Autorizado"
                        Color_Situacion_Final = "yellow\ngreen"
                    } else if (items[0].Mensaje.includes("VV")) {
                        Situacion_Final = "Vehiculo Operativo\nConductor: Autorizado"
                        Color_Situacion_Final = "green\ngreen"
                    } else if (items[0].Mensaje.includes("RR")) {
                        Situacion_Final = "Fuera de Servicio. Programar Mantención Correctiva\nConductor: No Autorizado"
                        Color_Situacion_Final = "red\nred"
                    } else if (items[0].Mensaje.includes("AR")) {
                        Situacion_Final = "Programar Mantención Preventiva\nConductor: No Autorizado"
                        Color_Situacion_Final = "yellow\nred"
                    } else if (items[0].Mensaje.includes("VR")) {
                        Situacion_Final = "Vehiculo Operativo\nConductor: No Autorizado"
                        Color_Situacion_Final = "green\nred"
                    }

                    this.setState({
                        isLoading: false,
                        modalFin: true,
                        Situacion_Final: Situacion_Final,
                        Color_Situacion_Final: Color_Situacion_Final,
                        MensajeAPI: items[0].Mensaje
                    });
                });


        } catch (e) {
            console.log(e);
            this.setState({
                isLoading: false
            });
        }
    }

    click_ModalNo() {
        this.setState({ modal: false });
    }


    click_ModalFin() {
        window.location.reload(false);
    }




    handleGeneralRemoveDato = (item) => {
        //nitems: De los items filtro el key modificado (se elimina) y NO se concatena el nuevo item
        const nitems = this.state.items.filter((c) => c.key !== item.key)


        //nitems2: Mismo nitems, pero sin la columna key (para el envío a la BD)
        var nitems2 = [];
        nitems.map((nitem) => nitems2 = nitems2.concat([{ idPregunta: nitem.key.split("-")[1], Respuesta: nitem.val }]))

        //KeyPageFile: Para obtener el id de la página (0) y el id de la fila (1)
        const keyPageFile = item.key.split("-")

        //ndatos: De todos los datos originales que vienen de la BD, filtro solo la hoja asociada al item modificado
        var ndatos = this.state.datos.filter((c) => c.id === parseInt(keyPageFile[0]))

        //ndatos2: De la hoja (ndatos) saco solamente el arreglo de datos (las filas)
        var ndatos2 = []
        ndatos.map((ndato) =>
            ndatos2 = ndatos2.concat(ndato.datos)
        )

        //ndatos3: De todas las filas (ndatos2), saco solo la correspondiente al item modificado
        var ndatos3 = ndatos2.filter((c) => c.id === parseInt(keyPageFile[1]))


        //Con el filtro quita esta pregunt del array de preguntas espondidas
        let Preguntas_Respondidas = this.state.Preguntas_Respondidas.filter(item => item !== ndatos3[0].label)
        this.setState({
            Preguntas_Respondidas: Preguntas_Respondidas
        });



        //ndatos4: De la fila (ndatos3) saco sus elementos. Si es un checkbox, recorro el radiogroup y le asigno el checked=1 al elemento correspondiente
        var ndatos4 = []
        ndatos3.map((ndato) => {
            if (ndato.type === 'checkboxes') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.label === item.val ? ndato.value = 1 : ndato.value = 0)
                //ndatos3.checkboxes = ndatos4

            } else if (ndato.type === 'textareas') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'numberareas') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'datepickers') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'fileuploads') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            }
            return null
        })


        this.setState({
            items: nitems,
            respuestas: nitems2
        })

    }




    handleGeneralDato = (item) => {
        //nitems: De los items filtro el key modificado (se elimina) y se concatena el nuevo item
        const nitems = (this.state.items.filter((c) => c.key !== item.key)).concat(item)

        //nitems2: Mismo nitems, pero sin la columna key (para el envío a la BD)
        var nitems2 = [];
        nitems.map((nitem) => nitems2 = nitems2.concat([{ idPregunta: nitem.key.split("-")[1], Respuesta: nitem.val }]))

        //KeyPageFile: Para obtener el id de la página (0) y el id de la fila (1)
        const keyPageFile = item.key.split("-")

        //ndatos: De todos los datos originales que vienen de la BD, filtro solo la hoja asociada al item modificado
        var ndatos = this.state.datos.filter((c) => c.id === parseInt(keyPageFile[0]))

        //ndatos2: De la hoja (ndatos) saco solamente el arreglo de datos (las filas)
        var ndatos2 = []
        ndatos.map((ndato) =>
            ndatos2 = ndatos2.concat(ndato.datos)
        )

        //ndatos3: De todas las filas (ndatos2), saco solo la correspondiente al item modificado
        var ndatos3 = ndatos2.filter((c) => c.id === parseInt(keyPageFile[1]))
        var Preguntas_Respondidas = this.state.Preguntas_Respondidas


        //lleno el array con las preguntas respondidas para luego mostrar las faltantes
        if (Preguntas_Respondidas.indexOf(ndatos3[0].label) === -1) {
            Preguntas_Respondidas.push(ndatos3[0].label)

            this.setState({
                Preguntas_Respondidas: Preguntas_Respondidas
            });
        }




        //ndatos4: De la fila (ndatos3) saco sus elementos. Si es un checkbox, recorro el radiogroup y le asigno el checked=1 al elemento correspondiente
        var ndatos4 = []
        ndatos3.map((ndato) => {
            if (ndato.type === 'checkboxes') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.label === item.val ? ndato.value = 1 : ndato.value = 0)
                //ndatos3.checkboxes = ndatos4

            } else if (ndato.type === 'textareas') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'numberareas') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'datepickers') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            } else if (ndato.type === 'fileuploads') {
                ndatos4 = ndatos4.concat(ndato.items)
                ndatos4.map((ndato) => ndato.value = item.val)
            }
            return null
        })


        //Ahora ndatos4 corresponde a la fila en el formato "datos", por lo que hay que reemplazarla en el array de datos
        //ndatos2.datos = ndatos3

        //const apiBody = {
        //    "hashCode": this.props.token,
        //    "idFormulario": 1,
        //    "idPlanta": this.props.idPlanta,
        //    "idUsuario": this.props.idUsuario,
        //    "idVehiculo": this.props.idVehiculo,
        //    "resultados": nitems2
        //}


        this.setState({
            items: nitems,
            respuestas: nitems2
        })

    }



    render() {

        if (this.state.isLoading) {
            return (
                <React.Fragment>
                    <Header menu={true} title={this.props.Patente}>
                    </Header>
                    <Card>
                        <Card.Header />
                        <Card.Content>
                            <Loader minHeight={400}>
                                <div className="placeholder" />
                            </Loader>
                        </Card.Content>
                    </Card>
                    <Footer copyrightText={"© " + new Date().getFullYear() + " Honeywell Chile"}>
                        <Footer.Item href="#">Terms & Conditions</Footer.Item>
                        <Footer.Item href="#">Privacy Policy</Footer.Item>
                    </Footer>
                </React.Fragment>
            )
        }
        else
            return (


                <React.Fragment>
                    <Header menu={true} title={this.props.Patente}>
                    </Header>

                    {/*{JSON.stringify(this.state.MensajeAPI)}<br />*/}
                    {/*{JSON.stringify(this.state.Preguntas_Respondidas)}<br />*/}
                    {/*{JSON.stringify(this.state.Preguntas_Faltantes)}*/}

                    <Grupos
                        key={1}
                        token={this.props.token}
                        id={this.state.datos[this.state.activePage].id}
                        titulo={this.state.datos[this.state.activePage].titulo}
                        items={this.state.datos[this.state.activePage].datos}
                        onhandleGeneralDato={this.handleGeneralDato}
                        onhandleGeneralRemoveDato={this.handleGeneralRemoveDato}
                    />

                    {this.renderModal()}
                    {this.renderModalFin()}

                    <table style={{ width: '100%' }}>
                        <tr >
                            <td>
                                <Button type="primary"
                                    icon="caret-left"
                                    size="small"
                                    content=""
                                    iconPosition="left" onClick={this.click_Prev} disabled={this.state.isLoading}>
                                </Button>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Button className={this.state.hidden} type="primary"
                                    loading={this.state.isLoading}
                                    size="small"
                                    content="Terminar"
                                    iconPosition="right" onClick={this.click_Send} disabled={this.state.isLoading}>
                                </Button>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                                <Button type="primary"
                                    icon="caret-right"
                                    size="small"
                                    content=""
                                    iconPosition="right" onClick={this.click_Next} disabled={this.state.isLoading}>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                        </tr>
                    </table>

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
                </React.Fragment>

            );

    }


    renderModal() {
        return (
            <Modal closeIcon={true} size="mini" onClose={() => this.setState({ modal: false })} open={this.state.modal} closeOnDimmerClick={false}>
                <Modal.Header>
                    ¿Está Seguro?
                </Modal.Header>
                <Modal.Content>
                </Modal.Content>
                <Modal.Footer>
                    <Button type="secondary" size="small" content="No" onClick={this.click_ModalNo} disabled={this.state.isLoading} />
                    <Button type="primary" size="small" content="Si" onClick={this.click_ModalSi} disabled={this.state.isLoading} />
                </Modal.Footer>
            </Modal>
        );
    }

    renderModalFin() {
        return (
            <Modal size="mini" onClose={() => this.setState({ modalFin: false })} open={this.state.modalFin} closeOnDimmerClick={false}>
                <Modal.Header>
                    Formulario Enviado
                </Modal.Header>
                <Modal.Content>
                    Situacion Final:<br />{<Badge color={this.state.Color_Situacion_Final.split('\n')[0]}>{this.state.Situacion_Final.split('\n')[0]} </Badge>}<br />{<Badge color={this.state.Color_Situacion_Final.split('\n')[1]}>{this.state.Situacion_Final.split('\n')[1]} </Badge>}
                </Modal.Content>
                <Modal.Footer>
                    <Button type="secondary" size="small" content="Cerrar" onClick={this.click_ModalFin} />
                </Modal.Footer>
            </Modal>
        );
    }


    notify() {
        ReactToastify.toast(<ToastNotification closeToast={true} />)
    }

}
