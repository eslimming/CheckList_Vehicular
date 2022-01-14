import React from "react";
import { Radio, Badge } from '@scuf/common';

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };

        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
        this.focusTextInput = () => {
            if (this.textInput) this.textInput.focus();
        };

    }

    handleOnChange = (dato) => {
        this.setState({ value: dato.val });
        this.props.onDato(dato);
        this.textInput.focus();
        /*window.scrollTo(1, 100);*/
    }

    handleChecked(a, b) {
        return a === b
    }


    componentWillMount() {
        var nvalue = ""
        this.props.items.map((item) =>
            nvalue = item.value ? item.label : nvalue
        )
        this.setState({ value: nvalue });
    }

    render() {
        var idGrupo = this.props.idGrupo
        return (
            <React.Fragment>
                <button className="oculto" ref={this.setTextInputRef} />
                <Badge color={this.state.value === "" ? "red" : "green"} empty={true} />
                {this.props.items.map((item) => (
                    <React.Fragment>
                        <Radio key={item.id}
                            label={item.label}
                            disabled={false}
                            name="RadioGroup"
                            checked={this.handleChecked(this.state.value, item.label)}
                            onChange={() => this.handleOnChange({ key: idGrupo, id: item.id, val: item.label })}
                        />
                    </React.Fragment>
                ))}

            </React.Fragment>
        );
    }
}
