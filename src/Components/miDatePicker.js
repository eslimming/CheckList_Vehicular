import React from "react";
import { DatePicker } from '@scuf/common';
import { LocalizationConfig } from '@scuf/localization';


export default class DTPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
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

    componentDidMount() {
        document.activeElement.blur();
    }


    render() {
        var idGrupo = this.props.idGrupo
        return (

            <div id="blur">
                <LocalizationConfig languageCode={'es-CL'}>
                    {this.props.items.map((item) => (
                        <DatePicker
                            className="abajo"
                            key={item.id}
                            type="date"
                            helperText={item.label}
                            closeOnDocumentClick={true}
                            fluid={true}
                            reserveSpace={true}
                            displayFormat={"DD-MM-YYYY"}
                            value={this.state.value}
                            onChange={(value) => this.handleOnChange({ key: idGrupo, id: item.id, val: value })}
                            readOnly={false}
                            disabled={false}
                            showYearSelector={true}
                        />

                    ))}
                </LocalizationConfig>
            </div>
        );
    }
}
