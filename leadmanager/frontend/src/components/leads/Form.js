import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { addLead } from '../../actions/leads';

export class Form extends Component {
    state = {
        name: "",
        email: "",
        message: "",
    };
    static propTypes = {
        addLead: PropTypes.func.isRequired
    };
    onChange = e => this.setState({
        [e.target.name] : e.target.value
    });
    onSubmit = e => {
        e.preventDefault();
        const { name, email, message } = this.state;
        const lead = { name, email, message };
        this.props.addLead(lead);
    };
    render() {
        const {name, email, message} = this.state;
        return (
            <form class="form-inline" onSubmit={this.onSubmit}>
                <table className="table table-bordered">
                    <tbody><tr>
                        <td>New</td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                onChange={this.onChange}
                                value={name}
                                placeholder='Name'
                                required
                            />
                        </td>
                        <td>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                onChange={this.onChange}
                                value={email}
                                placeholder='Email'
                                required
                            />
                        </td>
                        <td>
                            <textarea
                                type="text"
                                className="form-control"
                                name="message"
                                onChange={this.onChange}
                                value={message}
                                placeholder='message'
                                required
                            />
                        </td>
                        <td>
                            <button className="btn btn-success" type='submit'>
                                Add Lead
                            </button>
                        </td>
                    </tr></tbody>
                </table>
            </form>
        )
    }
}

export default connect(null, { addLead })(Form);
