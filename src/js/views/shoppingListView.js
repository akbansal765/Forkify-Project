import icons from 'url:../../img/icons.svg';
import View from './View';

import {state} from '../model';

class ShoppingListView extends View{
    _parentElement = document.querySelector('.recipe');
  
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

    addShoppingList(handler){
      const addButton = this._parentElement.querySelector('.add-list-btn');
    
      if (!addButton) return;
    
      addButton.addEventListener('click', () => {
    
        const ingredients = state.recipe.ingredients;
      
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
      localStorage.setItem("ingredients", JSON.stringify(this.ings));
    }

    getIngredientsLocalStorage(){
      const data = localStorage.getItem("ingredients");
      this.dataObject = JSON.parse(data);
      
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
    }
    
   }

export default new ShoppingListView();