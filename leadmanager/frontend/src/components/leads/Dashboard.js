import React, { Fragment } from 'react'
import Form from './Form';
import Leads from './Leads'

export default function Dashboard() {
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <Leads />
            <Form />
        </Fragment>
    )
}
