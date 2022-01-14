import React from "react";
import { TextArea, Badge } from '@scuf/common';

export default class TextoArea extends React.Component {
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

    render() {

        var idGrupo = this.props.idGrupo
        return (

            <React.Fragment>

                {this.props.items.map((item) => (
                    <React.Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Badge color={this.state.value === "" ? "red" : "green"} empty={true} />
                        { item.label}
                        <TextArea
                            key={item.id}
                            fluid={true}
                            value={this.state.value}
                            onChange={(value) => this.handleOnChange({ key: idGrupo, id: item.id, val: value })}

                        />
                    </React.Fragment>
                ))}


                {/*<React.Fragment>*/}

                {/*    <LocalizationConfig languageCode={this.state.lng}>*/}
                {/*        <FileDrop*/}
                {/*            label="Fotos del Vehiculo"*/}
                {/*            buttonText="Subir Foto"*/}
                {/*            resetButtonText="Eliminar Fotos"*/}
                {/*            acceptedTypes={['image/*']}*/}
                {/*            placeholder="Arrastrar Foto (maximo: 5MB)"*/}
                {/*            maxSize="1000"*/}
                {/*            error={this.state.fileError}*/}
                {/*            onAccepted={(files) => this.setState({ acceptedFiles: [...acceptedFiles, ...files] })}*/}
                {/*            onRejected={(files) => this.setState({ rejectedFiles: [...rejectedFiles, ...files], fileError: "uno o mas archivos fueron rechazados" })}*/}
                {/*            onReset={() => this.setState({ rejectedFiles: [], acceptedFiles: [], fileError: "" })}*/}
                {/*        />*/}
                {/*        <h5>Fotos Aceptadas:</h5>*/}
                {/*        {acceptedFiles && acceptedFiles.map(file => <p>{file.name} - {file.size} bytes</p>)}*/}
                {/*        <h4>Fotos Rechazadass:</h4>*/}
                {/*        {rejectedFiles && rejectedFiles.map(file => <p>{file.name} - {file.size} bytes</p>)}*/}
                {/*    </LocalizationConfig>*/}
                {/*</React.Fragment>*/}

            </React.Fragment>
        );
    }
}
