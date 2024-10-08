import View from './View';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    
    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--inline');
        if(!btn) return;
        
        const goToPage = +btn.dataset.goto;
        handler(goToPage)
        })
    }
 
    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages);
        const curPage = this._data.page;

       
        // Page 1, there are other pages
        if(curPage === 1 && numPages > 1) {
            return [this._generateMarkupButtonNext(), this._numOfPagesMarkup(numPages)];
        }

        
        // last page
        if(curPage === numPages && numPages > 1) {
            return this._generateMarkupButtonPrev();
        }
        
        // other pages
        if(curPage < numPages){
            return [this._generateMarkupButtonPrev() ,this._generateMarkupButtonNext()];
        }
        
        // Page 1, there are no other pages
        return '';

        
    }   

    _generateMarkupButtonPrev(curPage = this._data.page){
     return `
            <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage -1}</span>
            </button>
          `
    }
    _generateMarkupButtonNext(){
     return `     
            <button data-goto = "${this._data.page + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
     `
    }
    _numOfPagesMarkup(pages){
     return `
            <div class="num_pages">
                <span>Total Pages - ${pages}</span>
            </div>
         `
    }
    

}
export default new PaginationView();