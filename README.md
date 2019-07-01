# RRDJ
## React Redux Django Lead Manager
### Create an environment
```
pipenv shell
pipenv django djangorestframework django-rest-knox
```

### Create a Django project, `leadmanager` and an app, `leads`.
* Make a model `Lead` with name, email, message, timestamp. migrate.

### Build a very basic API
* [DRF]('https://www.django-rest-framework.org/') provides us with many things like `ModelSerializer`, `ModelViewSet`, `DefaultRouter`

#### leads/serializers.py
* A ModelSerializer(with a meta class like ModelForm)
```python
from rest_framework.serializers import ModelSerializer
from .models import Lead
class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
```

#### leads/api.py
* A ModelViewSet(queryset, permission_classes, serializer_class).
```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from .models import Lead
from .serializers import LeadSerializer
class LeadViewSet(ModelViewSet):
    queryset = Lead.objects.all()
    permission_classes = [AllowAny]
    serializer_class = LeadSerializer
```

#### leads/urls.py
* A router(router.register(path, viewset, app))
```python
from rest_framework.routers import DefaultRouter
from .api import LeadViewSet
router = DefaultRouter()
router.register('api/leads', LeadViewSet, 'leads')
```

#### leads/urls.py
* an urlpattern
```python
urlpatterns = router.urls
```

#### Download [POSTMAN]('https://www.getpostman.com/') app and check the API
```
POST http://localhost:8000/api/appname/ {JSON DATA}
GET http://localhost:8000/api/appname
GET http://localhost:8000/api/appname/2
DELETE http://localhost:8000/api/appname/2/
```

### Configure React
#### Create a new app, `frontend` add to the project settings file.
#### Create the following directories and files.
1. frontend/src/component (for our App.js,  index.js, components, reducers, actions, etc.)
2. frontend/static/frontend(for the compiled main.js)
3. frontend/templates/frontend(for index.html template)

#### Create a `git repository`, a `gitignore` file. (use gitignore.io)

#### Setup node and react and webpack
1. Download [NodeJS](https://nodejs.org/)
2. `npm init -y`
3. `npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties`
4. `npm i react react-dom prop-types`
5. Create a `.babelrc` file  in root. Write the following in it,
```
{"presets":["babel/preset-env", "@babel/preset-react"],"plugins":["transform-class-properties"]}
```

6. Create a `webpack.config.js` file in the root. Write the following in it,
```
module.exports = {
    module: {
        rules:[{
            test: /\.js$/, exclude: /node_modules/,
            use:{loader:"babel-loader"}
        }]
    }
}
```

#### In our `package.json`, write some scripts.
```
"script": {
    "dev":"webpack --mode development --watch ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js",
    "build":"webpack --mode production ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js"
}
```


#### create /frontend/src/index.js
```
import App from './components/App';
```

#### create /frontend/src/components/App.js
```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class App extends Component{
  render(){
    return <h1>Hey</h1>
  }
}
reactDom.render(<App />, $('#app'));
```

#### create /frontend/templates/frontend/index.html
```
<div id='app'></div>
{% load static %}
<script src="{%static 'frontend/main.js'%}"></script>
// link bootstrap jq css js files
```
#### Create a view in `frontend/views.py` which renders the `index.html` template
```
from django.shortcuts import render
def index(request):
    return render(request, 'frontend/index.html')
```
#### Create an url in `frontend/urls.py` to route the view. Make sure to add it to project URLconf
```
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index')
]
```

#### Now running `npm run dev` creates/updates the `main.js` file in `frontend/static/frontend`

#### Create /frontend/src/components/layout/Header.js
* install an extension - `ES7 React` ...
* Now it is possible to do `'rce'+Tab` which creates a _Class Based Component_.
* `'rcf'+Tab` creates a _Functional Component_.
* Paste some `bootstrap navbar` in the `render` function
* Change all classes into className.

#### Import this Header component file into the `App.js`
```
import Header from './layout/Header.js'
// The `return` statement of `App` should contain `<Header />`
class App extends Component {
    render() {
        return (
             <Header />
        )
    }
}
```
* `npm run dev` again

#### Create these files in /frontend/src/components/leads/
1. Dashboard.js
2. Form.js
3. Leads.js
* Write simple _class based components_ in Leads.js and Form.js. We'll change them later.

#### Create a _functional component_ in Dashboard.js
```
import React, { Fragment } from 'react';
import Form from './Form';
import Leads from './Leads';
export default function Dashboard() {
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <Leads />
            <Form />
        </Fragment>
    )
}
```

#### Import this Dashboard component in App.js
```
import React, { Fragment } from 'react';
// the return should look like this
<Fragment>
   <Header />
   <div className='container'>
       <Dashboard />
   </div>
</Fragment>
```

### Using [Redux]('https://redux.js.org/')
#### Install Redux and friends
`npm i redux react-redux redux-thunk redux-devtools-extension`

#### Create a `store.js` in src. This exports a `createStore` object of `redux`, which takes in _rootReducer_, _initialState_ and _middlewares_ 
```
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
```

#### Create a directory `reducers` in src. create `index.js` inside. This exports a `combineReducers` object of `redux`, which takes in the _reducers_.
```
import { combineReducers } from "redux";
import leads from './leads'; //leads reducer
export default combineReducers({
	leads // leadReducer : leads
});
```

#### Change the `app.js` to include a `Provider` which takes in the `store` as a `prop`. This _provider_ comes from the `react-redux`.
```
import { Provider } from "react-redux";
import store from '../store';
<Provider store={store}>
   <Fragment>
   ...
</Provider>
```

#### In the src create _actions_. Then create a `types.js`. This exports a constant which holds a string.
// a place to hold all of our types.
```
export const GET_LEADS = "GET_LEADS";
```

#### In the reducers folder create `leads.js`. This is a reducer which is used to make the _combined reducer_ and in turn, creates the _store_. This function takes in the _state_ and an _action_. The _action type_ is evaluated and it returns the _state_ and the _payload_.
```
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
```
#### Install [Axios](https://github.com/axios/axios) to make HTTP requests. Use `npm install axios` to make the HTTP requests. We can also use fetchAPI or something else, too.

#### In the `actions` folder create `leads.js`. This is where we make all the http requests. This exports an _action method_ called `getLeads`, which _dispatches_ the method to the _leads reducer_. The dispatch takes in an _action type_ and a _payload_.
```
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
```
#### components/leads/Leads.js <we add some react-redux stuff.>
* When the _component is mounted_, the action method is called and the _state comes down from the reducer_ into the component as a prop.
* To do this:
1. get the redux reducer state
2. map it to component props
3. add a PropType
4. wrap the component name by a 'connect' method of react-redux
5. pass the map & the getLeads method into this 'connect'
6. call the getLeads when the component mounts.
```
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
```

### DELETING LEADS
#### actions/leads.js a new action that deletes a lead from the database and dispatches the id to the reducer
```
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
```
#### reducers/leads.js. add a new case that removes the deleted lead from the UI
```
 	case DELETE_LEAD:
            return {
                ...state,
                leads: state.leads.filter(lead => lead.id !== action.payload)
            };
```

### CREATING LEADS
#### actions/leads.js
```
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
```

#### reducers/lead.js
```
        case ADD_LEAD:
            return {
                ...state,
                leads:[...state.leads, action.payload]
            };
```

#### components/leads/Form.js
```
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
```
