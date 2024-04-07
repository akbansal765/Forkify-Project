import * as model from './model.js';
import {MODEL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot){
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function(){
  try{

    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected searh results
    resultsView.update(model.getSearchResultsPage());

    // updaing bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);  // loadRecipe is a async function and it will return a promise   

  // Rendering Recipe

  recipeView.render(model.state.recipe);  // this data will be transfered to render method in recipewView file to use the data
  
  

  }catch(err){
    recipeView.renderError();
    console.error(err);
  }
}

// controlRecipes();
// const array = ['hashchange', 'load'];

// array.forEach(ev => window.addEventListener(ev, controlRecipes));
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const controlSearchResults = async function(){
  try{

       resultsView.renderSpinner();
      // Get search query
       const query = searchView.getQuery();
       if(!query) return;

      // Load Search results
       await model.loadSearchResults(query);

       // Render results
      //  resultsView.render(model.state.search.results);
       resultsView.render(model.getSearchResultsPage());

      // Render initial pagination buttons
      paginationView.render(model.state.search);


     
      
  }catch(err){
    console.log(err)
  }
};

const controlPagination = function(goToPage){
       // Render NEW results

      resultsView.render(model.getSearchResultsPage(goToPage));

      // Render NEW initial pagination buttons
      paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // update the recipe servings( in a state)
  model.updateServings(newServings)

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // Add/Remove bookmark
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
 
  
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
try{
  // Show Loading Spinner
  addRecipeView.renderSpinner();

  // upload the new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  // Render Recipe
  recipeView.render(model.state.recipe);

  // Success Message 
  addRecipeView.renderMessage()

  // Render Bookmarks view
  bookmarksView.render(model.state.bookmarks);  // here we have not used update cause here we wanna add a new element and when we need to add a new element render method will be used

  // Change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);


  // Close form window
  setTimeout(function(){
    addRecipeView.toggleWindow()
  }, MODEL_CLOSE_SEC * 1000)

}catch(err){
  console.log('😋',err);
  addRecipeView.renderError(err.message);
}
}

const controlAddShoppingList = function(){
  recipeView.addShoppingList()

}

controlAddShoppingList();

// const controlIngredientFormat = function(data, i){
//     model.checkIngredientFormat(data, i);
// }

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
  // addRecipeView.addHandlerIngredientFormat(controlIngredientFormat)

  //controlServings()   here we cannot call this function cause it will give an error cause no recipe has fetched from API this time
}
init();

