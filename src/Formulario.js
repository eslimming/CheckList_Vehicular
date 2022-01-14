import React from "react";
import axios from "axios";
import "@scuf/common/honeywell/theme.css";
/*import "@scuf/common/honeywell-dark/theme.css";*/
import { Footer, Header, Button, Notification, Card, Loader } from "@scuf/common";
import General from "./Components/General";
import 'react-toastify/dist/ReactToastify.css';
import './toast-notification-wrap.css'

const ReactToastify = require('react-toastify');

const config = require("../src/config.json");
const Pagina = config.Pagina;

const ToastNotification = ({ closeToast, Texto }) => (
    <Notification
        className="toast-notification"
        severity="critical"
        onCloseClick={closeToast}
        hasIcon={true}
        title={Texto}
        detailsText="Todos los datos son obligatorios"
        onDetailsClick={() => { }} //{() => alert('Debie ingresar todos los datos para continuar')}
    />
)


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            activePage: 0,
            datos: [], //require("./Components/datos.json"),
            datos2: [],
            items: [],
            items2: []
        };
        this.click_Next = this.click_Next.bind(this);
        this.click_Prev = this.click_Prev.bind(this);
    }



    componentWillMount() {
        const headers = { 'Authorization': 'dalealbo' }
        try {
            axios.get(`${Pagina}/APICore/SQL?id=1`, { headers: headers })
                .then((res) => {
                    const items = res.data;
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
        const headers = { 'Authorization': 'dalealbo' }
        try {
            setInterval(async () => {
                if (this.state.isLoading)
                    axios.get(`${Pagina}/APICore/SQL?id=1`, { headers: headers })
                        .then((res) => {
                            const items = res.data;
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
        const page = this.state.datos[this.state.activePage].id
        const pageSize = this.state.datos[this.state.activePage].datos.length
        var ndatos = 0
        this.state.items.map((item) => parseInt(item.key.split("-")[0]) === page ? ndatos = ndatos + 1 : null)

        if (ndatos < pageSize) {
            var mensaje
            (pageSize - ndatos) === 1 ? mensaje = "Falta un dato" : mensaje = ("Faltan " + (pageSize - ndatos) + " datos")
            ReactToastify.toast(<ToastNotification Texto={mensaje} closeToast={true} />)
        }
        else {
            if (this.state.activePage < this.state.datos.length - 1) {
                this.setState({ activePage: this.state.activePage + 1 });
            } else {
                this.setState({ activePage: 0 });
            }

            window.scrollTo(1, 1);
        }
    }

    click_Prev() {
        const page = this.state.datos[this.state.activePage].id
        const pageSize = this.state.datos[this.state.activePage].datos.length
        var ndatos = 0
        this.state.items.map((item) => parseInt(item.key.split("-")[0]) === page ? ndatos = ndatos + 1 : null)

        if (ndatos < pageSize) {
            var mensaje
            (pageSize - ndatos) === 1 ? mensaje = "Falta un dato" : mensaje = ("Faltan " + (pageSize - ndatos) + " datos")
            ReactToastify.toast(<ToastNotification Texto={mensaje} closeToast={true} />)
        }
        else {
            if (this.state.activePage > 0) {
                this.setState({ activePage: this.state.activePage - 1 });
            } else {
                this.setState({ activePage: this.state.datos.length - 1 });
            }
            window.scrollTo(1, 1);
        }
    }


    handleGeneralDato = (item) => {
        //nitems: De los items filtro el key modificado (se elimina) y se concatena el nuevo item
        const nitems = (this.state.items.filter((c) => c.key !== item.key)).concat(item)

        //nitems2: Mismo nitems, pero sin la columna key (para el envío a la BD)
        var nitems2 = [];
        nitems.map((nitem) => nitems2 = nitems2.concat([{ id: nitem.id, val: nitem.val }]))

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


        this.setState({
            items: nitems,
            items2: nitems2
        })

    }



    render() {

        if (this.state.isLoading) {
            return (
                <section className="page-example-wrap new-test">
                    <Header title="CheckList">
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
                </section>
            )
        }
        else
            return (
                <section className="page-example-wrap new-test">
                    <Header title="CheckList">
                        {/*<Header.Item href="#">*/}
                        {/*    <Icon size="large" root="building" name="user" />*/}
                        {/*</Header.Item>*/}
                    </Header>

                    {/*{JSON.stringify(this.state.items)}<br />
                    {JSON.stringify(this.state.datos)}*/}


                    <General
                        id={this.state.datos[this.state.activePage].id}
                        titulo={this.state.datos[this.state.activePage].titulo}
                        items={this.state.datos[this.state.activePage].datos}
                        onhandleGeneralDato={this.handleGeneralDato}
                    />

                    <table>
                        <tr>
                            <td style={{ width: '100%' }}>
                                <Button type="primary"
                                    icon="caret-left"
                                    size="small"
                                    content=""
                                    iconPosition="left" onClick={this.click_Prev} disabled={this.state.isLoading}>
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
                </section>
            );
    }

    notify() {
        ReactToastify.toast(<ToastNotification closeToast={true} />)
    }

}
