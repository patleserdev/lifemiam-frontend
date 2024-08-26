import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import Colors from "../utilities/color";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { setList } from "../reducers/lists";
import SwipableItem from "../components/SwipeableElement";

export default function ListScreen({ navigation, navigation: { goBack } }) {
  const dispatch = useDispatch();

  // récupérer les catégories ['fruits','légumes','produits laitiers','produits secs','Condiments','Boissons']
  // filtre le tableau datas.data et extraire les catégories et supprimer les doublons
  // parcourir le tableau des catégories
  // faire le map d'affichage
  const URL = "https://lifemiam-backend.vercel.app";
  // const URL = "http://192.168.0.53:3000";
  // const token = "wVL5sCx7YTgaO-fnxK5pX4mMG8JywAwQ"
  const route = useRoute();
  const [error, setError] = useState("");
  const userToken = useSelector((state) => state.user.value.token);
  const userList = useSelector((state) => state.lists.value);

  const [idList, setIdList] = useState(null);
  const isFocused = useIsFocused();
  const urlParams = route.params;
  const [courseList, setCourseList] = useState([]);

  let displayAll = [];

  useEffect(() => {
    // récupération de la liste de courses ou génération
    if (userToken && urlParams != undefined) {
      fetch(`${URL}/shop/getlist/${urlParams.menuId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("get list", data);
          if (data.result) {
            dispatch(
              setList({
                menuId: urlParams.menuId,
                ingredients: data.data.Ingredients,
              })
            );
            setCourseList({
              menuId: urlParams.menuId,
              ingredients: data.data.Ingredients,
            });
          } else {
            setIdList(data.id);
            setError(null);
            fetch(`${URL}/shop/generate/${urlParams.menuId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: userToken }),
            })
              .then((response) => response.json())
              .then((data) => {
                // console.log("output generate", data);
                if (data.result) {
                  dispatch(
                    setList({
                      menuId: urlParams.menuId,
                      ingredients: data.ingredients,
                    })
                  );

                  setCourseList({
                    menuId: urlParams.menuId,
                    ingredients: data.data.Ingredients,
                  });
                  setIdList(data.id);
                } else {
                  dispatch(
                    setList({
                      menuId: urlParams.menuId,
                      ingredients: null,
                    })
                  );

                  setCourseList({
                    menuId: urlParams.menuId,
                    ingredients: null,
                  });
                }
              });
          }
        });
    }

    if (courseList) {
      let temporary = userList.filter((e) => e.menuId === urlParams.menuId);
      setCourseList(temporary[0]);
    
    }
  }, [isFocused]);


  // à la sortie de la page je save en bdd
  useEffect(() => {
    if (!isFocused) {
      // console.log('sortie d\'ecran',courseList,'idlist',courseList.menuId)
      fetch(`${URL}/shop/updatelist/${courseList.menuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          ingredients: courseList.ingredients,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log("output update", data));
      displayAll = [];
    }
  }, [isFocused]);


  const handleToggleBuyed = (ingredientName, newBuyedValue) => {
    const updatedIngredients = courseList.ingredients.map((ingredient) =>
      ingredient.name === ingredientName
        ? { ...ingredient, isBuyed: newBuyedValue }
        : ingredient
    );

    setCourseList({
      ...courseList,
      ingredients: updatedIngredients,
    });

  };


  if (courseList.ingredients) {
    const categories = [];

    courseList.ingredients.filter((e) =>
      !categories.find((cat) => cat === e.category)
        ? categories.push(e.category)
        : null
    );

    categories.sort();

    for (let category of categories) {
      let displayList = courseList.ingredients.map((ing, i) =>
        ing.category == category ? (
          <SwipableItem
            menuId={urlParams.menuId}
            key={i}
            idlist={idList}
            name={ing.name}
            quantity={ing.quantity}
            unit={ing.unit}
            buyed={ing.isBuyed}
            onToggleBuyed={handleToggleBuyed}
          />
        ) : null
      );

      let boxCategory = (
        <View key={category} style={styles.boxCategory}>
          <View key={category} style={styles.categorieTitle}>
            <Text style={styles.categorieTitleText}>{category}</Text>
          </View>
          {displayList}
        </View>
      );

      displayAll = [...displayAll, boxCategory];
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.titleCont}>
        <TouchableOpacity onPress={() => goBack()} activeOpacity={0.6}>
          <FontAwesome name={"arrow-left"} style={styles.iconBack} size={30} />
        </TouchableOpacity>

        <Text style={styles.H1}>Liste de courses</Text>
      </View>

      {error && (
        <View>
          <Text>{error}</Text>

          {!userToken && (
            <TouchableOpacity
              style={styles.buttondisconnected}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.buttondisconnectedText}>Me connecter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView style={styles.list}>{displayAll && displayAll}</ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  titleCont: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 10,
    width: "95%",
    marginBottom: 20,
  },
  H1: {
    marginLeft: 30,
    fontSize: 30,
    color: "#365E32",
    fontWeight: "700",
  },

  list: {
    height: "90%",
    width: "90%",
    alignSelf: "center",
  },
  boxCategory: {
    marginBottom: 20,
  },
  categorieTitle: {
    marginBottom: 5,
  },
  categorieTitleText: {
    fontSize: 30,
    color: Colors.DARK_GREEN,
  },
  ingElement: {
    borderWidth: 1,
    width: "100%",
    height: 80,
    color: "red",
  },
  ingElementText: {},
  iconBack: {
    backgroundColor: Colors.DARK_GREEN,
    color: Colors.YELLOW,
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
    paddingHorizontal: 12,
  },
  iconSort: {
    color: Colors.DARK_GREEN,

    padding: 10,

    paddingHorizontal: 12,
  },
  buttondisconnected: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: "60%",
    marginVertical: 20,
    alignSelf: "center",
  },

  buttondisconnectedText: {
    color: Colors.DARK_GREEN,
  },
});
