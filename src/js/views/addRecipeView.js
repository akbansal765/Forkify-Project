import View from './View';

// Have to import this file to controller, otherise controller will never execute this file and this new AddRecipeView object will never be created and the event listener in addhandlershowwindow will never be added

class AddRecipeView extends View {

    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was sucessfully uploaded!';

    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    ingColoumn = Array.from(document.querySelectorAll('.ingredients'))

    

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        
        // this.addHandlerIngredientFormat();
        
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
        const data = dataArr.filter(entry => entry[0].startsWith('ingredient'))
        console.log(data)
    
        const data1 = data.reduce((acc, cur, i, arr) => {
          
            const data2 = arr.filter(ing => ing[0].startsWith(`ingredient-${i + 1}`) )
            acc.push(data2)

             return acc;
        }, [])

        const data2 = data1.slice(0,6)
        console.log(data2)

        const data3 = data2.map((ing, i) => {
            return ing.join().split(',')

        })

        console.log(data3)

        const data4 = data3.map((ing, i) =>{
            const ingArr = ing.filter(entry => !entry.startsWith(`ingredient`))
            return ingArr;
        }  )

       console.log(data4)

       const data5 = data4.filter((ing, i, arr) => ing.some(entry => (entry !== '')))
        
       console.log(data5);

    //    const finalData = data4.filter(item => !data5.includes(item));
    //    console.log(finalData);

        handler(data);
        
        })
    }

    addHandlerIngredientFormat(handler){
        this.ingColoumn.forEach((ing, i) => ing.addEventListener('mouseleave', function(){
       
        // getting the value
        const upload = document.querySelector('.upload');
        const dataArr = [... new FormData(upload)]
        handler(dataArr, i);
        }))

    }
 
}
export default new AddRecipeView();


//////////////////////////////////////////////////////////////////////////////

// const array = ['ingredient-1', '0.5', 'ingredient-1', 'kg', 'ingredient-1', 'Rice'];

// const array2 = array.filter(ing => !ing.startsWith(`ingredient`));
// console.log(array2);