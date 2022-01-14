import React from "react";
import { Table } from '@scuf/common';
import RadioGroup from "./miRadioGroup";
import TextoArea from "./miTextArea"
import InputNumber from "./miInputNumber"
import DTPicker from "./miDatePicker"
import SubirArchivo from "./miFileUpload"



function Dibuja(props) {

    const dibujar = props.items;
    if (dibujar.type === 'checkboxes') {
        return <React.Fragment>
            <Table.Row>
                <Table.Cell>{dibujar.label}</Table.Cell>
                <Table.Cell textAlign="right"><RadioGroup key={props.idGrupo} idGrupo={props.idGrupo} items={dibujar.items} onDato={props.onDato} /> </Table.Cell>
            </Table.Row>
        </React.Fragment>
    }
    else if (dibujar.type === 'textareas') {
        return <React.Fragment>
            <Table.Row>
                <Table.Cell> <TextoArea key={props.idGrupo} idGrupo={props.idGrupo} items={dibujar.items} onDato={props.onDato} /> </Table.Cell>
            </Table.Row>
        </React.Fragment>
    }
    else if (dibujar.type === 'numberareas') {
        return <React.Fragment>
            <Table.Row>
                <Table.Cell> <InputNumber key={props.idGrupo} idGrupo={props.idGrupo} items={dibujar.items} onDato={props.onDato} onRemoveDato={props.onRemoveDato} /> </Table.Cell>
            </Table.Row>
        </React.Fragment>
    }
    else if (dibujar.type === 'datepickers') {
        return <React.Fragment>
            <Table.Row>
                <Table.Cell>{dibujar.label}</Table.Cell>
                <Table.Cell textAlign="right"> <DTPicker key={props.idGrupo} idGrupo={props.idGrupo} items={dibujar.items} onDato={props.onDato} /> </Table.Cell>
            </Table.Row>
        </React.Fragment>
    } else if (dibujar.type === 'fileuploads') {
        return <React.Fragment>
            <Table.Row>
                {/*<Table.Cell>{dibujar.label}</Table.Cell>*/}
                <Table.Cell textAlign="left"> <SubirArchivo key={props.idGrupo} token={props.token} idGrupo={props.idGrupo} items={dibujar.items} onDato={props.onDato} /> </Table.Cell>
            </Table.Row>
        </React.Fragment>
    }
    else return <React.Fragment />


}


export default class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeName: ""
        };
    }



    handleDato = (dato) => {
        this.props.onhandleGeneralDato(dato);
    };

    handleRemoveDato = (dato) => {
        this.props.onhandleGeneralRemoveDato(dato);
    };

    render() {
        const Pagina = this.props.id
        return (
            <React.Fragment>

                <Table key={Pagina}>
                    <Table.Header>
                        <Table.HeaderCell content={this.props.titulo} textAlign="left" />
                    </Table.Header>
                    <Table.Body>
                        {

                            this.props.items.map((item) => (
                                <React.Fragment>
                                    <Dibuja key={item.id} token={this.props.token} idGrupo={Pagina + "-" + item.id} items={item} onDato={this.handleDato} onRemoveDato={this.handleRemoveDato} />
                                </React.Fragment>
                            ))}

                    </Table.Body>
                    <Table.Footer>
                        <Table.Row align="center">
                            <Table.HeaderCell colSpan={2}>

                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>

            </React.Fragment>
        );
    }
}