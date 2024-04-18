import { TIMEOUT_SEC , API_KEY} from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined){
  try{
  const fetchPro = uploadData ? fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData)
  }) : fetch(url);

  const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  const data = await res.json();

  if(!res.ok) throw new Error(`${data.message} (${res.status})`)
  return data;
  }catch(err){
    throw err  
  };
};
/*
export const getJSON = async function(url){
    try{

    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data;  // this async function returns this data variable, hence it will be the resolved value of the function
    }catch(err){
      throw err  // by using the the promise returned will actually get reject incase of error occured and error will be handled in model.js file
}
} 
export const sendJSON = async function(url, uploadData){
    try{
    
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data;
    }catch(err){
      throw err  
}
};
*/

import recipeView from "./views/recipeView";

export const spoonacularPost = async function(ingredients){
  try{

    
    const caloriesArray = await Promise.all(ingredients.map(async ingObj => {
      
      const qt = ingObj.quantity;
      const unit = ingObj.unit;
      const disc = ingObj.description;
      
      const ingName = [qt, unit, disc].join(' ').replace('  ', ' ');
      
      const fetchPro = fetch(`https://api.spoonacular.com/recipes/parseIngredients?ingredientList=${ingName}&includeNutrition=true&apiKey=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const res = await fetchPro;
      const [data] = await res.json();
      if(!res.ok) throw new Error(`${data.message} (${res.status})`)
      // console.log(data)
      const nutrientsArr = data.nutrition.nutrients;
      const caloriesObj = nutrientsArr.find(el => el.name === 'Calories').amount;
      return caloriesObj;
      
    }));
    
    
    const caloriesSum = caloriesArray.reduce((acc, cur) => {
      acc = acc + cur;
      return Number.parseInt(acc);
    }, 0)
    
    return caloriesSum;
  }catch(err){
    recipeView.renderErrorCalorieSum();
    console.error(err.message)
  }
  }