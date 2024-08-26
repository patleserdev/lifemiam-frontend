import {
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "../utilities/color";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { addRegime, token, initRegimes } from "../reducers/user";

function Signin({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const URL = "https://lifemiam-backend.vercel.app";
  const dispatch = useDispatch();
  //const [signin, setSignin] = useState(null);
  //const [password, SetPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [signin, setSignin] = useState("Victor");
  const [password, SetPassword] = useState("Victor");

  const handleSignin = () => {
    fetch(`${URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signin: signin, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.result === true) {
          dispatch(token(data.token));

          if (data.regime.length > 0) {
            for (let regime of data.regime) {
              dispatch(addRegime(regime));
            }
          }

          // .length > 0 && dispatch(initRegimes(regimes.regime,...data.regime));
          setSignin("");
          SetPassword("");

          navigation.navigate("TabNavigator", { screen: "Search" });
        } else {
          // Display an error
          console.log("Erreur avec la connexion");
          setDisplayError(data.error);
        }
      });
  };
  return (
    <KeyboardAvoidingView
      style={styles.textContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Se connecter</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse email ou nom d'utilisateur</Text>
        <TextInput
          label={"Adresse email ou nom d'utilisateur"}
          textContentType="email"
          keyboardType="email-address"
          style={styles.input}
          onChangeText={(e) => setSignin(e)}
          value={signin}
          maxLength={254}
        ></TextInput>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          label={"Mot de passe"}
          textContentType="password"
          secureTextEntry={showPassword ? false : true}
          style={styles.input}
          onChangeText={(e) => SetPassword(e)}
          value={showPassword ? password : password}
          maxLength={128}
        ></TextInput>
        <View style={styles.showpassword}>
          {!showPassword && (
            <FontAwesome
              name={"eye"}
              style={styles.icon}
              size={20}
              onPress={() => {
                setShowPassword(true);
              }}
            />
          )}
          {showPassword && (
            <FontAwesome
              name={"eye-slash"}
              style={styles.icon}
              size={20}
              onPress={() => {
                setShowPassword(false);
              }}
            />
          )}
        </View>
      </View>
      {displayError && (
        <View>
          <Text style={styles.error}>{displayError}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => handleSignin()}
      >
        <Text style={styles.signinButtonText}>Connexion</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
  },
  title: {
    fontSize: 36,
    fontWeight: "500",
    color: Colors.DARK_GREEN,
  },
  inputContainer: {
    position: "relative",
    // borderWidth: 1,
    width: "80%",
    marginTop: 15,
    marginBottom: 15,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: Colors.WHITE,
    color: Colors.LIGHT_GREEN,
    zIndex: 10,
    paddingHorizontal: 5,
    fontWeight: "500",
  },
  input: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.DARK_GREEN,
    paddingHorizontal: 10,
  },
  showpassword: {
    position: "absolute",
    right: 0,
    height: 50,
    width: "20%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  icon: {
    color: Colors.DARK_GREEN,
  },
  signinButton: {
    marginTop: 30,
    alignSelf: "center",
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    width: "80%",
    backgroundColor: Colors.DARK_GREEN,
  },
  signinButtonText: {
    textAlign: "center",
    color: Colors.YELLOW,
    fontSize: 16,
  },
  password: {
    color: "black",
  },
  error: {
    marginTop: 10,

    textAlign: "center",
    width: "100%",
    color: "red",
  },
});

export default Signin;
