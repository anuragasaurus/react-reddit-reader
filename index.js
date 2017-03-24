import React, {Component} from "react";
import {render} from "react-dom";
import {createStore, applyMiddleware} from "redux";
import {Provider, connect} from "react-redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import {StyleSheet, css} from "aphrodite";


const styles = StyleSheet.create({

  wrapper:{
    boxSizing: "border-box",
    color: "#666",
    width: "100%",
    height: "100%"
  },

  headingWrapper:{
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "30px",
    color: "#444",
    padding: "30px"
  },

  formWrapper:{
    width: "100%",
    textAlign: "center"
  },

  formInput:{
    width: "400px",
    padding: "10px",
    border: "1px solid #fff",
    borderBottom: "1px solid #999",
    margin: "10px 0",
    transition: "all 0.5s",

    ':focus':{
      outline: "none",
      borderBottom: "1px solid #666"
    }
  },

  formButton:{
    display: "block",
    padding: "5px 10px",
    backgroundColor: "#f6f6f9",
    color: "#444",
    borderRadius: "0px",
    border: "2px solid #888",
    textAlign: "center",
    margin: "auto",
    transition: "all 0.5s",

    ':focus':{
      outline: "none"
    },

    ':hover':{
      backgroundColor: "#fff"
    }
  },

  link:{
    textDecoration: "none",
    color: "#1273AD"
  }
})



const Heading = function(props){

  return(

    <div className = {css(styles.headingWrapper)}>
      <span>{props.heading}</span>
    </div>

  );

}

@connect((state)=>{
  return state;
}, {searchReddit})
class SearchReddit extends Component{

  constructor(props){

    super(props);
    this.state = {
      searchReddit: "aww"
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

  }
  
  handleChange(e){

      this.setState({
        searchReddit: e.target.value
      });

      
  }

  handleSubmit(e){

    e.preventDefault();
    this.props.searchReddit(this.state.searchReddit);

  }
  
  handleDropdownChange(e){

    console.log(e.target.value);
    if(e.target.value === "msg"){

    } else{
      this.setState({
        searchReddit: e.target.value
      });

      this.props.searchReddit(e.target.value);      
    }

  }

  render(){

    return(
      <div className = {css(styles.formWrapper)}>
        <form onSubmit = {this.handleSubmit}>
          <input className = {css(styles.formInput)} type="text" value={this.state.searchReddit} onChange = {this.handleChange} />
          <button className = {css(styles.formButton)} type="submit">Reddit</button>
          <small style={{display: "block", margin: "20px 0 10px 0"}}>Or choose a popular reddit from here</small>
          <select style={{margin: "5px"}} onChange={this.handleDropdownChange}>
            <option value="msg">choose a reddit from here</option>
            <option value="aww">aww</option>
            <option value="gaming">gaming</option>
            <option value="javascript">javascript</option>
            <option value="webdev">webdev</option>
          </select>
        </form>
      </div>
    )
  }

}


@connect((state)=>{
  return state;
}, null)
class Results extends Component{

  render(){

    return(
      <div style={{margin: "2% 10%"}}>
        {!this.props.hasSearched && !this.props.isSearching && <div style={{textAlign: "center", marginTop: "50px", fontSize: "25px"}}><span>Type a subreddit to search for!!!</span></div>}
        {this.props.isSearching && <div style={{textAlign: "center", marginTop: "50px", fontSize: "15px"}}><span>Searching...</span></div>}
        {this.props.hasSearched && this.props.results.length === 0 ? <div>There are no results for this subreddit.</div> : this.props.results.map((result, i)=>{
          return(
            <div key = {i} style={{margin: "5px", padding: "5px", display: "flex"}}>
              <div style={{backgroundImage: "url("+result.data.thumbnail+")", width: "100px", height: "100px"}}>
              </div>
              <div style={{padding: "10px"}}>
                <h4><a className={css(styles.link)} href={""+result.data.url} target="__blank">{result.data.title}</a></h4>
                 by <span>{result.data.author}</span>
              </div>
            </div>
        )})}
      </div>
    )

  }

}


class RedditApp extends Component{

  render(){

    return(
      <div className = {css(styles.wrapper)}>
        <Heading heading = {"React Reddit Reader"} />
        <SearchReddit />
        <Results />
      </div>
    );

  }

}


function searchReddit(redditName){
  return (dispatch)=>{
    dispatch({
      type: "searching"
    });
    fetch("https://www.reddit.com/r/" + redditName + ".json").then(response=>response.json()).then(json=>{
      console.log(json);
      dispatch({
        type: "results",
        results: json.data.children
      });
    }).catch(error=>{
      console.log(error);
      dispatch({
        type: "results",
        results: []
      });
    });
    
  }
}

const INITIAL_STATE = {
  results: [],
  hasSearched: false,
  isSearching: false
};

function reducer(state = INITIAL_STATE, action){
  switch(action.type){
    case "results":
      return {
        ...state,
        results: action.results,
        hasSearched: true,
        isSearching: false
      }
    case "searching":
      return {
        ...state,
        isSearching: true
      }
    default:
      return state;
  }
}


function configureStore(){
  const store = createStore(reducer, applyMiddleware(createLogger(), thunk));
  return store;
}

const store = configureStore();


render(
  <Provider store = {store}>
    <RedditApp />
  </Provider>,
  document.getElementById("app")
);

