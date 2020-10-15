import React, {Component} from 'react';
//here we import in our loader spinner image
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';


const randomChoice = arr => {
  const randIndex = Math.floor(Math.random()* arr.length);
  return arr[randIndex];
};

// we pick out our props inside the header component
// we can pass down functions as props as well as things
// like numbers, strings, arrays or objects

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results, show the clear button, otherwise show the title */}
    { hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} alt="clear button" />
      </button>
    ) : (<h1 className="title">Jiffy</h1>)}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint"> 
  {/* here we check whether we have a loading state and we render out
  either our spinner or hintText based on that, using a ternary operator */}
  {loading ? 
  <img src={require('./images/loader.svg')} alt="loader" className="block mx-auto" /> :
    hintText
  }</div>
);

class App extends Component {
constructor(props) {
  super(props); 
  this.textInput = React.createRef();
  this.state = {
    loading: false,
    searchTerm: '',
    hintText: '',
    // gif: null,
    // we have an array of gifs
    gifs: []
  }
}

// we want a function that searches the giphy api using
// fetch and puts the search term into the query URL
// then we can do something with the results

// we can also write async methods into our components
// that let us use the async/await style of function
searchGiphy = async searchTerm => {

  this.setState ({
    //here we set our loading state to be true
    //and this will show the spinner at the bottom
    loading : true
  });
  // first we try our fetch
  try {
    // here we use the await key word to wait for our response to come back
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=JWfQkyED854JjZJOKiPMb6BZkrxpam10&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en`
      ); 
    
     // here we convert our raw response into jason data 
    // const {data} gets the .data part of our responses
     const {data} = await response.json();


    // here we check if the array of results is empty
    // if it is, we throw an error which will stop the
    // code here and handle it in the catch area

    if (!data.length) {
      throw `Nothing found for ${searchTerm}`
    }


      
    // here we grab a random result from our images
    const randomGif = randomChoice(data)


    this.setState((prevState, props) => ({
      ...prevState,
      // get the first result and put it in the state
      // gif: randomGif,
      // here we use spread to take the previous gifs and spread them out
      // and then, add our new random gif onto the end
      gifs: [...prevState.gifs, randomGif ],
      //we turn off our loading spinner again
      loading: false, 
      hintText: `Hit enter to see more ${searchTerm}`
    }))
    
    // if our fetch fails we catch it down here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText:error,
        loading:false
      }))
    }
  };

  //with create react app we can write our methods as arrow
  //functions, meaning we don't need the constructor and bind
  handleChange = event => {
    // const value = event.target.value
    const {value} = event.target;
    // by setting the searcht term in our state
    // and alos using that on the input as the value,
    // we have created what is called a controlled input
    this.setState((prevState, props) => ({
      //we take our old props and spread them out here
      ...prevState,
      //and then we overwrite the ones we want after
      searchTerm: value,
      // we set the hint text when we have more than two characters
      // in our input, otherwise we make it a empty string
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
    
   };
    
   handleKeyPress = event => {
   // when we have two or more characters in our search box
   // and we have also pressed enter, we then want to run a search
   // we can access a function called key
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      //here is where we run our search function
      //here we call our searchGiphy function using the search term
      this.searchGiphy(value);
    }
   };

   // here we reset our state by clearing every out and
   // making it default again (like in our original state)
   clearSearch = () => {
     this.setState((prevState, props) => 
     ({
       ...prevState,
       searchTerm:'',
       hintText: '',
       gifs: []
     }));
     // here we grab the input and then focus the cursor back into it
    this.textInput.current.focus();
   };

   render() {
     //const searchTerm = this.state.searchTerm
     const { searchTerm, gifs } = this.state
     //here we set a variable to see if we have any gifs
     const hasResults = gifs.length;
    return  <div className="page">
    <Header clearSearch={this.clearSearch} hasResults={hasResults} />

    <div className="search grid">
      {/* our stack of gif images */}
   
      {/* here we loop over our array of images from our state
      and we create multiple videos from it. We use map() to go 
      over each one and create multiple components from that */}
      {this.state.gifs.map (gif=> (
      //  we spread out all our properties onto our Gif component
       <Gif {...gif} />
      ))}

      <input className="input grid-item" placeholder="Type somethin"
      onChange={this.handleChange}
      onKeyPress={this.handleKeyPress}
      value={searchTerm}
      ref={this.textInput}
      />
    </div>
    {/* here we pass our userHint all of our state usnig a spread */}
    < UserHint {...this.state}/>
  </div>
  };
}


export default App;
