import View from './View';
import {NUM_INGREDIENTS} from '../config'

// Have to import this file to controller, otherise controller will never execute this file and this new AddRecipeView object will never be created and the event listener in addhandlershowwindow will never be added

class AddRecipeView extends View {

    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was sucessfully uploaded!';

    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    ingColoumn = Array.from(document.querySelectorAll('.ingredients'))

    onlyIngredients = document.querySelector('.only-ingredients');
    addIngBtn = document.querySelector('.add_new_ingredient');

    numOfIng = NUM_INGREDIENTS;

    

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        
        this.addHandlerAddNewIngredient();

        
        
        
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');  
        this._window.classList.toggle('hidden');  // we created this extra method cause we cant put these two statements in the below method cause there this keyword will point to the element that is attached to event listerner
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){  // here uploading the data will be another API call, so have to create a control function in controller using publisher subsriber patter
        e.preventDefault();
        const dataArr = [... new FormData(this)];        
        // console.log(dataArr);
        // const data = Object.fromEntries(dataArr)
        // console.log(data)
        handler(dataArr);
        })
    }

    // addHandlerIngredientFormat(handler){
    //     this.ingColoumn.forEach((ing, i) => ing.addEventListener('mouseleave', function(){
       
    //     // getting the value
    //     const upload = document.querySelector('.upload');
    //     const dataArr = [... new FormData(upload)]
    //     handler(dataArr, i);
    //     }))

    // }

    addHandlerAddNewIngredient(){
        this.addIngBtn.addEventListener('click', function(){
        this.numOfIng++;
        
        const markup = `
                <label>Ingredient ${this.numOfIng}</label>
                    <div class="ingredient_box">
                    <input
                        class="ing_box"
                        type="text"
                        name="ingredient-${this.numOfIng}"
                        placeholder="Quantity"
                    />
                    <input
                        class="ing_box"
                        type="text"
                        name="ingredient-${this.numOfIng}"
                        placeholder="Unit"
                    />
                    <input
                        class="ing_box"
                        type="text"
                        name="ingredient-${this.numOfIng}"
                        placeholder="Description"
                    />
                    </div>
                `
        
        this.onlyIngredients.insertAdjacentHTML('beforeend', markup);
        }.bind(this))
    }
 
}
export default new AddRecipeView();
