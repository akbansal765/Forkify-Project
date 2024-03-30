import icons from 'url:../../img/icons.svg';


export default class View { 
    _data;


   render(data, render = true){
    if(!data || (Array.isArray(data)) && data.length === 0) return this.renderError();  // to check if data not exists, and it is an emptly array then render the error

    this._data = data;
    const markup = this._generateMarkup();

   if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
   }

    update(data){
      // if(!data || (Array.isArray(data)) && data.length === 0) return this.renderError(); we removed this check from update method cause bcoz of this we were getting no recipies founds error cause of empty array

      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];
        // console.log(curEl, newEl.isEqualNode(curEl));

        // Updates Changed TEXT
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
          // console.log(' 😎 ', newEl.firstChild.nodeValue.trim());
          curEl.textContent = newEl.textContent;
        }

        // Updates Changed ATTRIBUTES
        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
        }
      })
    }

   _clear(){
    this._parentElement.innerHTML= '';
   }

   renderSpinner(){
    const markup = `
    <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `
    // this._parentElement.innerHTML = '';  // we added this to remove intial message that appears, confirm this by first removing this line of code
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

   renderError(message = this._errorMessage){
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin', markup);
     }
   renderMessage(message = this._message){  // success message method
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin', markup);
     }
}