import { useState, useEffect } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";

import Colors from "../utilities/color";
import { useDispatch, useSelector } from "react-redux";
import { addRegime, removeRegime } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function Onboarding({ navigation, page }) {
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.value.token);
  //const token = "0T_J7O73PtSOoUiD5Ntm_PNoFKKH5iOf";
  const userRegime = useSelector((state) => state.user.value.regime);
  console.log(userRegime);
  const URL = "https://lifemiam-backend.vercel.app";

  const regimeList = [
    { name: "sans gluten", src: require("../assets/gluten_free.png") },
    { name: "végétalien", src: require("../assets/vegan.png") },
    { name: "végétarien", src: require("../assets/vegetarian.png") },
    { name: "halal", src: require("../assets/halal.png") },
    { name: "sans lactose", src: require("../assets/lactose_free.png") },
  ];

  const regimeVignettes = regimeList.map((vi, i) => {
    const isSelected = userRegime.includes(vi.name);
    return (
      <Pressable
        key={i}
        disabled={false}
        onPress={() => handlePress(vi.name)}
        style={[styles.TagVignette, isSelected && styles.TagVignetteSelected]}
      >
        <Text style={styles.TxtVignette}>{vi.name}</Text>
        <View style={styles.ImgVignette}>
          <Image style={styles.icon} source={vi.src} />
        </View>
      </Pressable>
    );
  });

  useEffect(() => {
    if (page == "profile") {
      handleGo();
    }
  }, [userRegime]);

  let disabledButton = {
    backgroundColor: Colors.LIGHT_GREEN,
    opacity: 0.6,
    borderColor: Colors.LIGHT_GREEN,
  };
  let enabledButton = { backgroundColor: Colors.DARK_GREEN };

  const handlePress = (name) => {
    const found = userRegime.some((element) => element === name);
    found ? dispatch(removeRegime(name)) : dispatch(addRegime(name));
  };

  const handleSkip = () => {
    navigation.navigate("TabNavigator", { screen: "Search" });
  };

  const handleGo = () => {
    console.log("userRegime", userRegime);
    if (userRegime.length >= 0) {
      // const regime = userRegime.map((e) => e.replace(" ", "-"));
      fetch(`${URL}/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken, regime: userRegime }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);

          if (page == "onboarding") {
            data.result &&
              navigation.navigate("TabNavigator", { screen: "Search" });
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {page == "onboarding" && (
        <>
          <Text style={styles.title}>Complète ton profil</Text>
          <Text style={styles.question}>
            As-tu des restrictions alimentaires ?
          </Text>
          <Text style={styles.subtitle}>
            Ces restrictions pourront être prises en compte pendant la
            découverte de recettes
          </Text>
        </>
      )}
      {page == "profile" && (
        <>
          <Text style={styles.title}>Modifier ton profil</Text>
          <Text style={styles.question}>
            Vos restrictions alimentaires ({userRegime.length})
          </Text>
          <Text style={styles.subtitle}>
            Ces restrictions sont prises en compte pendant la découverte de
            recettes
          </Text>
        </>
      )}

      <View style={styles.vignetteContainer}>{regimeVignettes}</View>
      {page == "onboarding" && (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.skip} onPress={() => handleSkip()}>
            <Text style={styles.skipText}>Passer &gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.go,
              !userRegime.length ? disabledButton : enabledButton,
            ]}
            onPress={() => handleGo()}
          >
            <Text style={styles.goText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: windowWidth,
    height: windowHeight,
    marginVertical: 30,
  },

  title: {
    color: Colors.DARK_GREEN,
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 25,
    paddingBottom: 10,
  },
  question: {
    color: Colors.DARK_GREEN,
    fontSize: 20,
    paddingLeft: 25,
    fontWeight: "600",
  },
  subtitle: { color: "black", fontSize: 14, paddingLeft: 25 },
  vignetteContainer: {
    marginTop: 50,
    width: (windowWidth / 5) * 4,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
  },

  TagVignette: {
    marginTop: 40,
    marginHorizontal: 5,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: 50,
    minWidth: 125,
    height: 40,
  },
  TagVignetteSelected: {
    backgroundColor: Colors.DARK_GREEN,
  },

  TxtVignette: {
    color: "white",
    fontWeight: "600",
    minWidth: 80,
    paddingLeft: 5,
    paddingRight: 5,
  },
  ImgVignette: {
    backgroundColor: "white",
    borderRadius: 100,
    width: 25,
    aspectRatio: 1 / 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 15, height: 15 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  go: {
    // backgroundColor: Colors.DARK_GREEN,
    width: 128,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  skip: {
    backgroundColor: Colors.WHITE,
    width: 85,
    height: 30,
    paddingTop: 7,
    margin: 50,
  },
  goText: {
    color: Colors.YELLOW,
    fontSize: 20,
  },
  skipText: {
    color: Colors.DARK_GREEN,
    textDecorationLine: "underline",
    fontSize: 20,
  },
});
