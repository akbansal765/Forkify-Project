import { API_URL, RES_PER_PAGE, KEY, NUM_INGREDIENTS } from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";


export const state = {
    recipe: {},
    search: {
        query : '',
        results: [],
        page : 1,
        resultsPerPage : RES_PER_PAGE, 
    },
    bookmarks: []
};

const createRecipeObject = function(data){
    
   const {recipe} = data.data;
   return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key})  // here if recipe.key if falsy value then nothing will happen but if recipe.key exists then the second statement will be executed and key will become the new property
   }
}

export const loadRecipe = async function(id){
    try{
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

   if(state.bookmarks.some(bookmark => bookmark.id === id))
   state.recipe.bookmarked = true;
   else state.recipe.bookmarked = false;

//    console.log(state.recipe);
}catch(err){
    // temp error handling
    console.error(`${err} 😝😜😝😜`);
    throw err;
}
}

export const loadSearchResults = async function(query){
    try{

        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        })

        state.search.page = 1; // to se the page again to 1 after the new search at a new bar
        
    }catch(err){
        console.error(`${err} 😝😜😝😜`);
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;

    const start = (page -1) * state.search.resultsPerPage; // 0
    const end = page * state.search.resultsPerPage;  // 9
    
    return state.search.results.slice(start, end);

}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
        // newQuantity = oldQuantity * New Servings/old servings
    });

    state.recipe.servings = newServings;  // have to update the servings otherwise would be using the old servings after the updation
}

const persistBookmarks = function(){
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as a Bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = function(id){
    // Delete Bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as a not a Bookmark
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}



const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();
// console.log(state.bookmarks);

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}

// clearBookmarks();

export const uploadRecipe = async function(newRecipe){
    console.log(newRecipe);
    try{
            
            const dataAkash = newRecipe.filter(entry => entry[0].startsWith('ingredient'))
            console.log(dataAkash)

            const data1 = dataAkash.reduce((acc, cur, i, arr) => {
            const dataNew = arr.filter(ing => ing[0].startsWith(`ingredient-${i + 1}`) )
            acc.push(dataNew)
            return acc;
            }, []);

            const data2 = data1.slice(0, NUM_INGREDIENTS);
            // console.log(data2)

            const data3 = data2.map((ing, i) => {
                return ing.join().split(',')

            });
            // console.log(data3)

            const data4 = data3.map((ing, i) =>{
                const ingArr = ing.filter(entry => !entry.startsWith(`ingredient`))
                return ingArr;
            });
            // console.log(data4)

            const data5 = data4.filter((ing, i, arr) => ing.some(entry => (entry !== ''))) 
            console.log(data5);
            // const data5 = data4.filter(item => !data5.includes(item));
            // console.log(data5);

            const ingredients = data5.map(ing => {
                const [quantity, unit, description] = ing
                return {quantity : quantity ? +quantity : null , unit, description}
            })
            console.log(ingredients);


    newRecipe = Object.fromEntries(newRecipe)
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
        
    }

    console.log(recipe);

    const data= await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
} catch(err){
    throw err;
}
}

// export const checkIngredientFormat = function(dataAr, i){
    
//         const dataArr = dataAr.filter(entry => entry[0].startsWith('ingredient'))
//         console.log(dataArr)

//         const data = dataArr.map(ing => ing[1].split(','))
        
//         console.log(data)
//         console.log(i)
//         if(!data[i]) return;
//         // if(data[i - 1].includes('') ) return;
//         if(data[i].includes('') && data[i].length === 1) return;
//         if(data[i].length !== 3) {
//             console.log('wrong format');
//             alert(`Wrong Ingredient Format! Please separte the Ingredient-${i + 1} with two commas!`);
//         }    
// }