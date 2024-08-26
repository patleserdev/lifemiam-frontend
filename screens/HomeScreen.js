import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Onboarding from "../components/Onboarding";
import { useState } from "react";
import Colors from "../utilities/color";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const [displayComponent, setDisplayComponent] = useState(null);

  const handleGoBack = () => {
    setDisplayComponent(null);
  };

  handleGo = () => {
    navigation.navigate("TabNavigator", { screen: "Search" });
  };

  const isOnBoarding = (value) => {
    if (value) {
      setDisplayComponent("onboarding");
    }
  };

  const displayNull = (
    <View style={styles.homeContainer}>
      <Text style={styles.siteTitle}>LIFE MIAM</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.buttonPlain}
          onPress={() => {
            setDisplayComponent("signup");
          }}
        >
          <Text style={styles.buttonPlainText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonEmpty}
          onPress={() => {
            setDisplayComponent("signin");
          }}
        >
          <Text style={styles.buttonEmptyText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  //j'ai ajouté un bouton ARROW RIGHT de sagouin pour skip le signin/up
  return (
    <SafeAreaView style={styles.container}>
      
        {displayComponent == "signin" && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleGoBack()}
          >
            <FontAwesome name={"arrow-left"} style={styles.icon} size={40} />
          </TouchableOpacity>
        )}
        {displayComponent == "signup" && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleGoBack()}
          >
            <FontAwesome name={"arrow-left"} style={styles.icon} size={40} />
          </TouchableOpacity>
        )}
      

      {displayComponent !== "onboarding" && (
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImg}
            source={require("../assets/logo.png")}
          />
        </View>
      )}

      {!displayComponent && displayNull}
      {displayComponent == "signin" && <Signin navigation={navigation} />}
      {displayComponent == "signup" && (
        <Signup onboarding={isOnBoarding} page="onboarding" />
      )}
      {displayComponent == "onboarding" && (
        <Onboarding navigation={navigation} page="onboarding" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    height: "50%",
  },
  siteTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.DARK_GREEN,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "10%",
    width: "100%",
    position:'relative'
    
  },

  backButton: {
    position:'absolute',
    top:20,
    left:0,
    padding: 20,
  },
  icon: {
    color: Colors.DARK_GREEN,
  },

  go: {
    backgroundColor: Colors.LIGHT_GREEN,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    height: "30%",
    width: "100%",
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  textButt: {
    color: "white",
  },
  textButt: {
    color: "white",
  },
  test: {
    height: 100,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  logoContainer: {
    height: "30%",
    width: "100%",
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  buttonGroup: {
    height: "60%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPlain: {
    backgroundColor: Colors.DARK_GREEN,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: "60%",
    marginVertical: 20,
  },
  buttonPlainText: {
    color: Colors.YELLOW,
  },
  buttonEmpty: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: "60%",
    marginVertical: 20,
  },

  buttonEmptyText: {
    color: Colors.DARK_GREEN,
  },
});
