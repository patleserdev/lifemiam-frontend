import {
  View,
  Keyboard,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenu, clearMenu } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";

function Resume({ update }) {
  const URL = "https://lifemiam-backend.vercel.app";
  const userToken = useSelector((state) => state.user.value.token);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isMenuListVisible, setIsMenuListVisible] = useState(false);
  const [menusResume, setMenusResume] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState([]);
  const [newMenuName, setNewMenuName] = useState("");
  const [RecipesDisplay, setRecipesDisplay] = useState(null)
  const currentMenu = useSelector((state) => state.user.value.menu);

  const animatedHeight = useRef(new Animated.Value(60)).current;
  const screenHeight = Dimensions.get("window").height;
  const MAX_HEIGHT = screenHeight * 0.7;

  //charger tous les menus d'un user
  useEffect(() => {
    fetch(`${URL}/menus/getMenus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setMenusResume(data);
      });
  }, [currentMenu]);

  //useEffect du clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Fonction à exécuter quand le clavier apparaît
        isMenuListVisible && handleMenuList();
      }
    );
    // Nettoyage des listeners quand le composant est démonté
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Ouvre le résumé du menu
  const handleMenuList = () => {
    const contentHeight =
      (visibleMenu.length === 0 ? 130 : 100) +
      (currentMenu ? visibleMenu.length * 60 : menusResume.length * 60);
    const newHeight = isMenuListVisible
      ? 60
      : Math.min(contentHeight, MAX_HEIGHT);

    Animated.timing(animatedHeight, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuListVisible(!isMenuListVisible);
  };

  //vide le reducer menu
  const backAddMenu = () => {
    !currentMenu
      ? handleCreateMenu()
      : (() => {
          dispatch(clearMenu());
          isMenuListVisible && handleMenuList();
        })();
  };

  const goToRecipe = (id) => {
    navigation.navigate("Recipe", { RecetteID: id });
  };

  //cliquer sur un menu pour le séléctionner
  const handleClickMenu = (menuId) => {
    fetch(`${URL}/menus/${menuId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMenu(data.menu));
        setVisibleMenu(data.menu.menu_recipes);
        isMenuListVisible && handleMenuList();
      });
  };

  //fetch à l'initialisation (faites pas ça chez vous
  // c'est pour le bien de la vidéo)
  useEffect(() => {
    currentMenu && handleClickMenu(currentMenu._id)
  }, [])


//fetch au click sur une recette(ça non plus faut pas le
// faire c'est honteux.)
  useEffect(() => {
    currentMenu && handleClickMenu(currentMenu._id)
  },[update])


  //créer un menu
  const handleCreateMenu = () => {
    if (newMenuName !== "") {
      fetch(`${URL}/menus/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken, name: newMenuName }),
      })
        .then((response) => response.json())
        .then((data) => {
          setNewMenuName("");
          handleClickMenu(data.menu._id);
          Keyboard.dismiss();
        });
    }
  };

  //Map les recettes d'un même menu pour les afficher en colonne
  useEffect(() => {
  function GenerateRecipesDisplay() {
    if (visibleMenu.length === 0) {
      return (
        <Text style={styles.errorMessage}>
          Vous n'avez pas de recette dans ce menu...
        </Text>
      );
    }
    return visibleMenu.map((data, i) => {
      return (
        <View key={i} style={styles.recipeCont}>
          <Text style={styles.menuTxt}>{`${data.recipe.name}`}</Text>
          <TouchableOpacity onPress={() => goToRecipe(data.recipe._id)}>
            <FontAwesome
              name={"info-circle"}
              style={styles.menuListInfo}
              size={25}
              color={"#E7D37F"}
            />
          </TouchableOpacity>
        </View>
      );
    });
  }
  setRecipesDisplay(GenerateRecipesDisplay());
}, [visibleMenu])

  // Map le menuResume pour afficher tous les menus dans le résumé
  const menusDisplay = menusResume ? (
    menusResume.map((data, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={styles.menuCont}
          onPress={() => handleClickMenu(data._id)}
        >
          <Text style={styles.menuTxt}>{`${data.name}`}</Text>
        </TouchableOpacity>
      );
    })
  ) : (
    <Text style={styles.errorMessage}>
          Vous n'avez pas de menus ...
        </Text>
  );

  //Modifie l'affichage de la modale
  const Container = (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
        },
      ]}
    >
      <View style={styles.align}>
        <TouchableOpacity style={styles.button} onPress={handleMenuList}>
          <FontAwesome
            name={isMenuListVisible ? "caret-down" : "caret-up"}
            style={styles.caret}
            size={25}
            color={"#E7D37F"}
          />
        </TouchableOpacity>
        {!currentMenu ? (
          <TextInput
            style={styles.inputTxt}
            placeholder="Créer un menu..."
            value={newMenuName}
            onChangeText={(e) => setNewMenuName(e)}
            placeholderTextColor={"white"}
          ></TextInput>
        ) : (
          <Text style={styles.resumeText}>{currentMenu.name}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={() => backAddMenu()}>
          <FontAwesome
            name={currentMenu ? "arrow-left" : "plus"}
            size={25}
            color={"#E7D37F"}
          />
        </TouchableOpacity>
      </View>
      {!currentMenu ? (
        <ScrollView
          style={styles.ScrollView}
          contentContainerStyle={styles.menusDisplay}
        >
          {menusDisplay}
          <View style={{ height: 25 }}></View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.ScrollView}
          contentContainerStyle={styles.recipesDisplay}
        >
          {RecipesDisplay}
          <View style={{ height: 25 }}></View>
        </ScrollView>
      )}
    </Animated.View>
  );

  return <KeyboardAvoidingView style={styles.mainCont}>{Container}</KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  mainCont: {
    width: "100%",
  },
  ScrollView: {
    width: "100%",
    marginTop: 15,
  },
  container: {
    alignItems: "flex-start",
    backgroundColor: "#81A263",
    width: "100%",
    marginBottom: 2,
    overflow: "hidden",
  },
  align: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#365E32",
    borderRadius: 10,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    margin: "2%",
  },
  resumeText: {
    width: "65%",
    height: "100%",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },
  inputTxt: {
    width: "65%",
    height: "70%",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "bottom",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  menusDisplay: {
    width: "100%",
    height: "auto",
    marginTop: 15,
    alignItems: "center",
  },
  menuCont: {
    flexDirection: "row",
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: "#365E32",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  recipesDisplay: {
    width: "100%",
    height: "auto",
    marginTop: 15,
    alignItems: "flex-start",
  },
  recipeCont: {
    flexDirection: "row",
    marginTop: 5,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#365E32",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    width: "80%",
  },
  menuTxt: {
    color: "#E7D37F",
    fontSize: 18,
    fontWeight: "700",
  },
  errorMessage:{
    marginLeft: '5%',
    color: "#E7D37F",
    fontSize: 18,
    fontWeight: "700",
  },
  menuListInfo: {
    marginRight: 20,
  },
});

export default Resume;
