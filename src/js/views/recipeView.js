import icons from 'url:../../img/icons.svg';
// import { Fraction } from 'fractional';
import View from './View';
import fracty from 'fracty';

import {state} from '../model';

class RecipeView extends View{
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We could not find that recipe, Please try another one!';
    _message = '';  // success message
    ings = [];
    dataObject;
  
    listBtn = document.querySelector('.add-list-btn');
    listMessage = document.querySelector('.ing_message');
    shoppingListContainer = document.querySelector('.shopping__list');

    constructor(){
      super();
      this.getIngredientsLocalStorage(); // Fetch ingredients from localStorage
      this.dataObject ? this.renderShoppingListIngredients() : ''; // Render ingredients if available

    }

    addHandlerRender(handler){
      const array = ['hashchange', 'load'];
      array.forEach(ev => window.addEventListener(ev, handler));
    }

    addHandlerUpdateServings(handler){
      this._parentElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--update-servings');
        if(!btn) return;        
        // const updateTo = btn.dataset.updateTo;
        const {updateTo} = btn.dataset;
        if(+updateTo > 0) handler(+updateTo);
   })
    }

    addHandlerAddBookmark(handler){
      this._parentElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--bookmark');
        if(!btn) return;
        handler();
      })
    }

    addShoppingList(handler){
      const addButton = this._parentElement.querySelector('.add-list-btn');
    
      if (!addButton) return;
    
      addButton.addEventListener('click', () => {
    
        const ingredients = state.recipe.ingredients;
        // console.log(ingredients);
        // console.log(state)

      
        ingredients.forEach(ing => {

          const ingId = Math.trunc(Math.random() * 40);
          ing.ingId = ingId;

          const markup = `
            <li class="preview ingredient__name akash">
              <a class="preview__link" href="#">
                <div class="preview__data ingredient__name">
                  <h1 class="preview__name ingredient__name">
                    ${ing.quantity ? ing.quantity : ''} ${ing.unit} ${ing.description}
                  </h1>
                  <button id="${ing.ingId}" class="del_ing">del</button>
                </div>
              </a>
            </li>
          `;
          this.shoppingListContainer.insertAdjacentHTML('beforeend', markup);
          this.ings.push(ing)
        });

        this.setIngredientsLocalStorage();
        this.getIngredientsLocalStorage();
        this.deleteIngredientShoppingList(); 
      });
    }

    setIngredientsLocalStorage(){
      // console.log(this.ings)
      localStorage.setItem("ingredients", JSON.stringify(this.ings));
    }

    getIngredientsLocalStorage(){
      const data = localStorage.getItem("ingredients");
      this.dataObject = JSON.parse(data);

      // this.dataObject.forEach(el => this.ings.push(el));

      // console.log(this.dataObject);
      // console.log(this.ings);
    }
    
    renderShoppingListIngredients(){
      this.dataObject.forEach(ing => {
        const markup = `
          <li class="preview ingredient__name akash">
            <a class="preview__link" href="#">
              <div class="preview__data ingredient__name">
                <h1 class="preview__name ingredient__name">
                  ${ing.quantity ? ing.quantity : ''} ${ing.unit} ${ing.description}
                </h1>
                <button id="${ing.ingId}" class="del_ing">del</button>
              </div>
            </a>
          </li>
        `;
        this.shoppingListContainer.insertAdjacentHTML('beforeend', markup);
        // this.ings.push(ing)
      });
      this.deleteIngredientShoppingList()
    }

    deleteIngredientShoppingList(){
      const delIngBtn = document.querySelectorAll('.del_ing');
      // console.log(delIngBtn);

      delIngBtn.forEach(btn => {
     
        // const index = this.dataObject.findIndex(el => el.ingId === +btn.getAttribute("id"))
        const nearIng = btn.closest('.akash')

        btn.addEventListener('click', function(){

          const [elementToBeDeleted] = this.dataObject.filter(el => el.ingId === +btn.getAttribute("id"));
          console.log(elementToBeDeleted);
          console.log(elementToBeDeleted.ingId);

          const index = this.dataObject.indexOf(elementToBeDeleted);
          console.log(index);

          if(index !== -1) {

            this.dataObject.splice(index, 1);
            nearIng.remove();
            console.log(this.dataObject);
            
          }

          localStorage.setItem("ingredients", JSON.stringify(this.dataObject));
        
        }.bind(this));

      })


      // removing the ingredient from list only from DOM

      // delIngBtn.forEach(btn => {
      //   const nearIng = btn.closest('.akash');
      //   // console.log(nearIng)
        
      //   btn.addEventListener('click', function(){
      //     console.log(nearIng);
      //     nearIng.remove();
          
      //   });
      // })
    }

   _generateMarkup(){
    return `
    <figure class="recipe__fig">
           <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
           <h1 class="recipe__title">
             <span>${this._data.title}</span>
           </h1>
         </figure>
 
         <div class="recipe__details">
           <div class="recipe__info">
             <svg class="recipe__info-icon">
               <use href="${icons}#icon-clock"></use>
             </svg>
             <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
             <span class="recipe__info-text">minutes</span>
           </div>
           <div class="recipe__info">
             <svg class="recipe__info-icon">
               <use href="${icons}#icon-users"></use>
             </svg>
             <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
             <span class="recipe__info-text">servings</span>
 
             <div class="recipe__info-buttons">
               <button class="btn--tiny btn--update-servings" data-update-to = "${this._data.servings - 1}">
                 <svg>
                   <use href="${icons}#icon-minus-circle"></use>
                 </svg>
               </button>
               <button class="btn--tiny btn--update-servings" data-update-to = "${this._data.servings + 1}">
                 <svg>
                   <use href="${icons}#icon-plus-circle"></use>
                 </svg>
               </button>
             </div>
           </div>

           <div class="shopping-list-ingredients">
             <button class="add-list-btn">Add to List</button>
           </div>

           <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
           </div>
           <button class="btn--round btn--bookmark">
             <svg class="">
               <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : '' }"></use>
             </svg>
           </button>
         </div>
 
         <div class="recipe__ingredients">
           <h2 class="heading--2">Recipe ingredients</h2>
           <ul class="recipe__ingredient-list">
           ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
         </div>
 
         <div class="recipe__directions">
           <h2 class="heading--2">How to cook it</h2>
           <p class="recipe__directions-text">
             This recipe was carefully designed and tested by
             <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
             directions at their website.
           </p>
           <a
             class="btn--small recipe__btn"
             href="${this._data.sourceUrl}"
             target="_blank"
           >
             <span>Directions</span>
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-right"></use>
             </svg>
           </a>
         </div>
         `
   }

  //  ${ing.quantity ? new Fraction(ing.quantity).toString() : ''}  we removed the fraction cause netlify was not acception the fraction and used fracty instead

      _generateMarkupIngredient(ing){
    return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity) : ''}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
        `     
      }
   }

export default new RecipeView()