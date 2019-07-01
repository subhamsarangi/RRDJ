# RRDJ - React Redux Django Lead Manager
## Create the environment

```
pipenv shell
pipenv django djangorestframework django-rest-knox
```

## Create a Django project, `leadmanager`, an app, `leads`, and a model, 'Lead'.
```
django-admin startproject leadmanager
cd leadmanager
python manage.py startapp leads
```
* Create the model with name, email, message, timestamp. Migrate.

```python
from django.db import models
class Lead(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    message = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

```

## Build a very basic API
* [DRF](https://www.django-rest-framework.org/) provides us with many things like `ModelSerializer`, `ModelViewSet`, `DefaultRouter`

#### leads/serializers.py
* Create a ModelSerializer class (with a meta class like ModelForm)

```python
from rest_framework.serializers import ModelSerializer
from .models import Lead
class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
```

#### leads/api.py
* Create a ModelViewSet class (queryset, permission_classes, serializer_class).

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
* Create a DefaultRouter

```python
from rest_framework.routers import DefaultRouter
from .api import LeadViewSet
router = DefaultRouter()
router.register('api/leads', LeadViewSet, 'leads')
```

#### leads/urls.py
* an urlpattern

```python
...
urlpatterns = router.urls
```

#### Download [POSTMAN](https://www.getpostman.com/) and check the API.
```
POST http://localhost:8000/api/leads/ {JSON DATA}
GET http://localhost:8000/api/leads
GET http://localhost:8000/api/leads/2
DELETE http://localhost:8000/api/leads/2/
```

## Configure [React](https://reactjs.org/)
#### Create a new app, `frontend`. Add it to the project settings.py file.
#### Create the following directories and files.
1. frontend/src/component (for our App.js,  index.js, components, reducers, actions, etc.)
2. frontend/static/frontend(for the compiled main.js)
3. frontend/templates/frontend(for index.html template)

#### Create a `git repository`, a `gitignore` file. (use [gitignore.io](www.gitignore.io))

#### Setup Node and React and [Webpack](https://webpack.js.org/).
1. Download [NodeJS](https://nodejs.org/)
2. `npm init -y`
3. `npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties`
4. `npm i react react-dom prop-types`
5. Create a `.babelrc` file  in root. Write the following in it,

```json
{
"presets":["babel/preset-env", "@babel/preset-react"],
"plugins":["transform-class-properties"]
}
```

6. Create a `webpack.config.js` file in the root. Write the following in it.

```javascript
module.exports = {
    module: {
        rules:[{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {loader:"babel-loader"}
        }]
    }
}
```

#### In our `package.json`, write some scripts.

```json
"script": {
    "dev":"webpack --mode development --watch ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js",
    "build":"webpack --mode production ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js"
}
```


#### Create /frontend/src/index.js

```javascript
import App from './components/App';
```

#### Create /frontend/src/components/App.js

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class App extends Component{
  render(){
    return <h1>Hey</h1>
  }
}
reactDom.render(<App />, document.getElementById('app'));
```

#### Create /frontend/templates/frontend/index.html

```html
<div id='app'></div>
{% load static %}
<script src="{%static 'frontend/main.js'%}"></script>
// link bootstrap jq css js files
```
#### Create a View in `frontend/views.py`, which renders the `index.html` template

```python
from django.shortcuts import render
def index(request):
    return render(request, 'frontend/index.html')
```
#### Create an URL pattern in `frontend/urls.py` to route the view. Make sure to add it to project URLconf.

```python
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index')
]
```

#### Now, running `npm run dev` generates the `main.js` file in `frontend/static/frontend`.

#### Create /frontend/src/components/layout/Header.js
* Install an extension in VSCode.- `ES7 React`.
* Now it is possible to do `'rce'+Tab` which creates a _Class Based Component_.
* `'rcf'+Tab` creates a _Functional Component_.
* Paste some `bootstrap navbar` in the `render` function
* Change all classes into className.

#### Import the Header component file in `App.js`

```javascript
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

#### Create these files in frontend/src/components/leads/
1. Dashboard.js
2. Form.js
3. Leads.js
* Write simple _class based components_ in Leads.js and Form.js. We'll change them later.

#### Create a _functional component_ in Dashboard.js

```javascript
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

#### Import the Dashboard component in App.js

```javascript
import React, { Fragment } from 'react';
// the return should look like this
<Fragment>
   <Header />
   <div className='container'>
       <Dashboard />
   </div>
</Fragment>
```

## Using [Redux](https://redux.js.org/)
* Install Redux and friends
`npm i redux react-redux redux-thunk redux-devtools-extension`

#### Create src/store.js.
1. This exports a `createStore` object of `redux`,
2. which takes in _rootReducer_, _initialState_ and _middlewares_.

```javascript
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

#### Create src/reducers/index.js.
1. This exports a `combineReducers` object of `redux`, 
2. which takes in the _reducers_.
```javascript
import { combineReducers } from "redux";
import leads from './leads'; //leads reducer
export default combineReducers({
	leads // leadReducer : leads
});
```

#### Change the `App.js` file to include a `Provider`, which takes in the `store` as a `prop`.
* This _provider_ comes from the `react-redux`.

```
import { Provider } from "react-redux";
import store from '../store';
<Provider store={store}>
   <Fragment>
   ...
</Provider>
```

#### Create src/actions/types.js.
* This exports a constant which holds a string.
// a place to hold all of our types.
```javascript
export const GET_LEADS = "GET_LEADS";
```

#### Create src/reducers/leads.js.
1. This is a reducer which is used to make the _combined reducer_
2. and in turn creates the _store_.
3. This function takes in the _state_ and an _action_.
4. The _action type_ is evaluated.
5. and it returns the _state_ and the _payload_.

```javascript
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

#### Install [Axios](https://github.com/axios/axios) to make HTTP requests.
* Use `npm install axios` to make the HTTP requests. We can also use fetchAPI or something else, too.

### GETTING THE LEADS
#### Create src/actions/leads.js.
* This is where we make all the http requests.
1. This exports an _action method_ called `getLeads`,
2. which _dispatches_ the method to the _leads reducer_.
3. The dispatch takes in an _action type_ and a _payload_.

```javascript
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

#### src/components/leads/Leads.js
* We add some `react-redux` stuff.
* The plan is: As the _component is mounted_, the action method is called and the _state comes down from the reducer_ into the component as a prop.
* To achieve this:
1. Get the _redux reducer state_.
2. Map it to _component props_
3. Add a _PropType_
4. _Wrap the component_ name by a `connect` method of react-redux.
5. Pass the map & the `getLeads` method into this `connect`
6. Call the getLeads _when the component mounts_.

```javascript
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
//map the reducer state to component prop (before the last line)
const mapStateToProps = state => ({
    leads: state.leads.leads // state.leadReducer.leads
});
// change the last line
export default connect(mapStateToProps, { getLeads })(Leads);
```

### DELETING A LEAD
#### src/actions/leads.js
* Create a new action that deletes a lead from the database and dispatches the id to the reducer
```javascript
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

#### src/reducers/leads.js.
* add a new case that removes the deleted lead from the UI
```javascript
 	case DELETE_LEAD:
            return {
                ...state,
                leads: state.leads.filter(lead => lead.id !== action.payload)
            };
```

### CREATING A LEAD
#### src/actions/leads.js
```javascript
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

#### src/reducers/lead.js
```javascript
case ADD_LEAD:
  return {
    ...state,
    leads:[...state.leads, action.payload]
  };
```

#### src/components/leads/Form.js
```javascript
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
