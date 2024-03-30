import View from './View';

// Have to import this file to controller, otherise controller will never execute this file and this new AddRecipeView object will never be created and the event listener in addhandlershowwindow will never be added

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was sucessfully uploaded!';

    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
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
        const data = Object.fromEntries(dataArr);
        handler(data);
            
        })
    }
    
}
export default new AddRecipeView();