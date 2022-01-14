import React from "react";
import { FileDrop, Badge } from '@scuf/common';
import axios from "axios";


const config = require("../config.json");
const APIFotos = config.api_fotos
const apiKey = config.authorization;
const headers = { 'authorization': apiKey }
export default class SubirArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileError: "",
            value: "",
            acceptedFiles: [],
            rejectedFiles: []
        };
    }

    handleOnChange = (dato) => {
        this.setState({ value: dato.val });
        this.props.onDato(dato);
    }

    handleValue(a, b) {
        return a === b
    }


    componentWillMount() {
        var nvalue = ""
        this.props.items.map((item) =>
            nvalue = item.value
        )
        this.setState({ value: nvalue });
    }

    async Subir(API, formData, headers) {
        await axios.post(`${API}`, formData, { headers: headers });
    }


    render() {

        const { acceptedFiles, rejectedFiles } = this.state;
        var idGrupo = this.props.idGrupo
        return (

            <React.Fragment>
                {this.props.items.map((item) => (

                    <React.Fragment>
                        <FileDrop
                            key={item.id}
                            label={
                                <React.Fragment>
                                    <h5>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Badge color={this.state.value === "" ? "red" : "green"} empty={true} />
                                        {item.label}
                                    </h5>
                                </React.Fragment>
                            }
                            buttonText="Tomar Foto"
                            resetButtonText="Enviar Fotos"
                            acceptedTypes={['image/*']}
                            placeholder="Arrastrar Archivo (maximo: 5MB)"
                            maxSize="5000000"
                            error={this.state.fileError}
                            onAccepted={(files) => {
                                this.setState({ acceptedFiles: [...acceptedFiles, ...files] })
                            }
                            }

                            onRejected={(files) => {
                                this.setState({ rejectedFiles: [...rejectedFiles, ...files], fileError: "uno o mas archivos fueron rechazados" })
                                /*this.handleOnChange({ key: idGrupo, id: item.id, val: "x" })*/
                            }
                            }
                            onReset={() => {
                                this.handleOnChange({ key: idGrupo, id: item.id, val: "ok" })
                                this.setState({ rejectedFiles: [], acceptedFiles: [], fileError: "" })
                                this.state.acceptedFiles.map((file, index) => {
                                    const formData = new FormData();
                                    //formData.append("formFile", file);
                                    //formData.append("fileName", index + 1 + "_" + (1000000 * Math.random()).toFixed(0) + "_" + file.name);
                                    //formData.append("FolderName", this.props.token);
                                    formData.append("archivo", file);
                                    formData.append("nombreArchivo", index + 1 + "_" + (1000000 * Math.random()).toFixed(0) + "_" + file.name);
                                    formData.append("path", "upload/checklist/" + this.props.token);
                                    try {
                                        //const res = axios.post(`${APIFotos}`, formData, { headers: headers });
                                        //console.log(res);
                                        this.Subir(APIFotos, formData, headers)
                                        return null
                                    } catch (ex) {
                                        console.log(ex);
                                        return null
                                    }
                                }
                                )

                            }
                            }

                        />
                        <h6>Fotos Aceptadas:</h6>
                        {acceptedFiles && acceptedFiles.map(file => <p>{file.name} - {file.size} bytes</p>)}
                        <h6>Fotos Rechazadas:</h6>
                        {rejectedFiles && rejectedFiles.map(file => <p>{file.name} - {file.size} bytes</p>)}
                    </React.Fragment>


                ))}




            </React.Fragment>
        );
    }
}
