import React, { Component } from "react";
import { Footer, Header, Loader } from "@scuf/common";

class MyIFrame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: ""
        };
    }


    componentDidMount() {
        setTimeout(function () {
            this.setState({ hidden: "hidden" });
        }.bind(this), 2500)
    }

    render() {

        return (
            <React.Fragment>
                <Header menu={true} title={"Reporte"}>
                </Header>
                <div className={this.state.hidden}>
                    <Loader minHeight={400}>
                    </Loader>
                </div>
                <iframe
                    width="100%"
                    height="1100px"
                    src="https://checklist.kairosmining.com/SSRS/SSRS.aspx"
                    frameborder="200"
                    title="SSRS"
                ></iframe>
                <Footer copyrightText={new Date().getFullYear() + " Honeywell Chile"}>
                    <Footer.Item href="#">Terms & Conditions</Footer.Item>
                    <Footer.Item href="#">Privacy Policy</Footer.Item>
                </Footer>
            </React.Fragment>
        );
    }
}

export default MyIFrame;
