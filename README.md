# RRDJ
## React Redux Django Lead Manager
### create the environment
```pipenv shell
pipenv django djangorestframework django-rest-knox
```

## create django project[leadmanager] and app[leads].
## create a model[Lead] with name, email, message, timestamp. migrate.
### DRF provides us with many things like ModelSerializer. ModelViewSet, DefaultRouter

//a ModelSerializer(with a meta class like ModelForm)
# leads/serializers.py
from rest_framework.serializers import ModelSerializer
from .models import Lead
class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

//a ModelViewSet(queryset, permission_classes, serializer_class).
# leads/api.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from .models import Lead
from .serializers import LeadSerializer
class LeadViewSet(ModelViewSet):
    queryset = Lead.objects.all()
    permission_classes = [AllowAny]
    serializer_class = LeadSerializer


//a router(router.register(path, viewset, app))
# leads/urls.py
from rest_framework.routers import DefaultRouter
from .api import LeadViewSet
router = DefaultRouter()
router.register('api/leads', LeadViewSet, 'leads')

//an urlpattern
# leads/urls.py
urlpatterns = router.urls

download postman app and check the API
POST http://localhost:8000/api/appname/ {JSON DATA}
GET http://localhost:8000/api/appname
GET http://localhost:8000/api/appname/2
DELETE http://localhost:8000/api/appname/2/

create a new app add to the proj settings
create the following
newapp/src/component (for react redux components and stuff. index.js)
newapp/static/newapp (compiled main.js)
newapp/templates/newapp (indexhtml)

create a git repo. gitignore file. (use gitignore.io)

setup node and react and webpack
download node
npm init -y
npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties
npm i react react-dom prop-types

create .babelrc in root
{"presets":["babel/preset-env", "@babel/preset-react"],"plugins":["transform-class-properties"]}

create webpack.config.js in root
module.exports = {module: {rules:[{test: /\.js$/, exclude: /node_modules/, use:{loader:"babel-loader"}}]}}

in package.json make some scripts
"script": {"dev":"webpack --mode development --watch ./projname/newapp/src/index.js --output ./projname/newapp/static/newapp/main.js", "build":"webpack --mode production ./projname/newapp/src/index.js --output ./projname/newapp/static/newapp/main.js"}


create /newapp/src/index.js
import App from './components/App';

create /newapp/src/components/App.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class App extends Component{render(){return <h1>Hey</h1>}}
reactDom.render(<App />, $('#app'));

create /newapp/templates/newapp/index.html
<div id='app'></div>
{% load static %}
<script src="{%static 'newapp/main.js'%}"></script>
link bootstrap jq css js files

create view in newapp which renders the index.html
create url in newapp to route the view. make sure to add it to proj url

npm run dev
it creates/updates a main.js file in newapp/static/newapp

create /newapp/src/components/layout/Header.js
install an extension - ES7 React ...
'rce'+Tab creates a snippet
paste some bootstrap navbar in the return function
change all classes into className.

import this file into the App.js
import Header from './layout/Header.js'
the return function of App should contain <Header />
npm run dev again

create /newapp/src/components/leads/Dashboard.js
create /newapp/src/components/leads/Form.js
create /newapp/src/components/leads/Leads.js
add simple class based components in Leads and Form. We'll change later.

'rcf'+Tab creates a functional component in Dashboard
import React, { Fragment } from 'react';
import Form from './Form';
import Leads from './Leads';
put the following in return:
<Fragment>
 <Form />
 <Leads />
</Fragment>

import this Dashboard in App.js
import Fragment in the App.js
the return should look like this
<Fragment>
 <Header />
 <div className='container'>
  <Dashboard />
 </div>
</Fragment>



install redux and friends
npm i redux react-redux redux-thunk redux-devtools-extension

create store.js in src. This exports a createStore object of redux, which takes in rootreducers, initial state and middlewarers
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
const initialState = {}
const middleware = [thunk];
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);
export default store;

create dir reducers in src. create index.js inside. This exports a combineReducers object of redux, which takes in the reducers.
import { combineReducers } from "redux";
import leads from './leads'; //leads reducer
export default combineReducers({
	leads // leadReducer : leads
});

change the app.js to include a Provider which takes in the store as a prop. This provider comes from react-redux.
import { Provider } from "react-redux";
import store from '../store';
<Provider store={store}>
   <Fragment>
   ...
</Provider>

in src create actions. then create types.js. This exports a constant which holds a string.
// a place to hold all of our types.
export const GET_LEADS = "GET_LEADS";

in the reducers folder create leads.js. This is a reducer which is used to make the combined reducer and in turn creates the store. This function takes in the state and an action. the action type is evaluated and it returns the state and the payload
import { GET_LEADS } from "../actions/types.js";
const initialState = {
    leads: []
}
export default function(state = initialState, action) {
    switch (action.type){
        case GET_LEADS:
            return {
                ...state,
                leads: action.payload
            };
        default:
            return state;
    }
}

>>> npm install axios to make the http requests. we can also use fetchAPI or something else, too.

In the actions folder create leads.js. This is where we make all the http requests. This exports an action method called getLeads, which dispatches the method to the leads reducer. The dispatch takes in an action type and a payload.
import axios from 'axios';
import { GET_LEADS } from './types';
// GET LEADS
export const getLeads = () => dispatch => {
    axios.get('/api/leads/')
        .then(res => {
            dispatch({
                type: GET_LEADS,
                payload: res.data
            });
        })
	.catch(err => console.log(err));
};

components/leads/Leads.js <we add some react-redux stuff.>
When the component is mounted, the action method is called and the state comes down from the reducer into the component as a prop.
To do this: 1> get the redux reducer state 2> map it to component props 3> add a PropType 4> wrap the component name by a 'connect' method of react-redux 5> pass the map & the getLeads method into this 'connect' 6> call the getLeads when the component mounts.

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getLeads } from '../../actions/leads';
//create a proptype (before render)
static PropTypes = {
    leads: PropTypes.array.isRequired
    getLeads: PropTypes.func.isRequired,
}
// call getLeads (before render)
componentDidMount() {
    this.props.getLeads();
}
//map the reducer state to component prop (before the last line)
const mapStateToProps = state => ({
    leads: state.leads.leads // state.leadReducer.leads
});
// change the last line
export default connect(mapStateToProps, { getLeads })(Leads);

// {this.props.leads.map(lead => (<tr key={lead.id}><td>{lead.name}</td></tr>))}
// change the render function
render() {
        return (
            <Fragment>
                <h2>Leads</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.message}</td>
                                <td><button className="btn btn-danger btn-sm">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Fragment>
        )
    }


// DELETING LEADS
//actions/leads.js a new action that deletes a lead from the database and dispatches the id to the reducer
export const deleteLead = (id) => dispatch => {
    axios
        .delete(`/api/leads/${id}/`)
        .then(res => {
            dispatch({
                type: DELETE_LEAD,
                payload: id
            });
        })
        .catch(err => console.log(err));
};

//reducers/leads.js add a new case that removes the deleted lead from the UI
 	case DELETE_LEAD:
            return {
                ...state,
                leads: state.leads.filter(lead => lead.id !== action.payload)
            };

//CREATING LEADS
actions/leads.js
export const addLead = lead => dispatch => {
    axios
        .post('/api/leads/', lead)
        .then(res => {
            dispatch({
                type: ADD_LEAD,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
};

reducers/lead.js
        case ADD_LEAD:
            return {
                ...state,
                leads:[...state.leads, action.payload]
            };

components/leads/Form.js
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { addLead } from '../../actions/leads';

//last line. simply call the action.
export default connect(null, { addLead })(Form);

//add it as a proptype after state object declaration
static propTypes = {
    addLead: PropTypes.func.isRequired
};

//call the function in onSubmit
const { name, email, message } = this.state;
const lead = { name, email, message };
this.props.addLead(lead);
