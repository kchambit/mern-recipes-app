import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/recipes`
        );
        setRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://mern-recipes-app.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (error) {
        console.log(error);
      }
    };

    getRecipes();
    getSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "https://mern-recipes-app.onrender.com/recipes",
        {
          recipeID,
          userID,
        }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
