import {
  View,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import Colors from "../utilities/color";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ModalScreen({ navigation, navigation: { goBack } }) {
  const URL = "https://lifemiam-backend.vercel.app";
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.value.token);
  const isFocused = useIsFocused();
  const route = useRoute();
  const urlParams = route.params;

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (userToken && urlParams != undefined) {
      console.log(userToken, urlParams.menuId);
      fetch(`${URL}/menus/${urlParams.menuId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRecipes(data.menu.menu_recipes);
          //   console.log(data.menu.menu_recipes);
        });
    } else {
      setError("Aucunes données, êtes-vous connecté ?");
    }
  }, [isFocused]);

  const recipesDisplay = recipes.map((data, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.recipeCont}
        onPress={() => {
          console.log("pressed", data.serving);
          navigation.goBack();
          navigation.navigate("Recipe", {
            RecetteID: data.recipe._id,
            readingMode: true,
            menuServing: data.serving,
          });
        }}
      >
        <Image source={{ uri: data.recipe.image }} style={styles.recipeImage} />
        <Text style={styles.menuTxt}>{`${data.recipe.name}`}</Text>
        <TouchableOpacity>
          <FontAwesome
            name={"info-circle"}
            style={styles.menuListInfo}
            size={25}
            color={"#E7D37F"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome
            name={"angle-left"}
            style={styles.backIcon}
            size={25}
            color={"white"}
          />
          <Text style={styles.backText}>Menus</Text>
        </TouchableOpacity>
        <Text style={[{ fontSize: 20 }, styles.h1]}>Choisir la recette</Text>
      </View>
      <Text style={styles.resultText}>
        {recipes.length} recettes dans le menu {urlParams.menuName} :
      </Text>
      <ScrollView style={styles.recipesList}>
        {recipesDisplay}
        <View style={styles.emptyBox}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    backgroundColor: Colors.LIGHT_GREEN,
  },
  header: {
    width: "100%",
    height: "8%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    borderBottomColor: Colors.WHITE,
    borderBottomWidth: 1,
  },
  backButtn: {
    flexDirection: "row",
    width: "20%",
    height: 30,
    backgroundColor: "rgba(54 94 50 / 0.6)",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 25,
    marginLeft: 15,
  },
  backIcon: {
    marginLeft: 5,
  },
  backText: {
    color: "white",
    marginRight: 5,
  },
  h1: {
    fontWeight: "600",
    color: "white",
    paddingLeft: 50,
  },
  resultText: {
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 15,
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  recipesList: {
    backgroundColor: Colors.LIGHT_GREEN,
    paddingTop: 5,
    paddingBottom: 30,
  },
  emptyBox: {
    height: 30,
    backgroundColor: Colors.LIGHT_GREEN,
  },

  recipeCont: {
    flexDirection: "row",
    marginTop: 15,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#365E32",
    height: 70,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    width: "90%",
  },
  recipeImage: {
    height: 75,
    width: 75,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  menuTxt: {
    color: "#E7D37F",
    fontSize: 18,
    fontWeight: "700",
  },
  menuListInfo: {
    marginRight: 20,
  },
});
