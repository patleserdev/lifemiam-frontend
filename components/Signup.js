import { View,Image,StyleSheet ,Text,TextInput,SafeAreaView,KeyboardAvoidingView, TouchableOpacity,Platform} from "react-native";
import Colors from '../utilities/color'
import { useState ,useEffect} from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { token } from '../reducers/user';
function Signup({onboarding}) {

  const dispatch = useDispatch();

  const [displaySignedUp, setDisplaySignedUp] = useState(null);
  const [displayError, setDisplayError] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const URL = "https://lifemiam-backend.vercel.app";
  // const URL = 'http://192.168.0.53:3000'

  useEffect(() => {
    setDisplayError(null);
    setDisplaySignedUp(null);
  }, [email, username, password]);

  const handeleToSignUp = () => {
    setDisplayError(null);
    console.log(username, email, password);

    fetch(`${URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result == true) {
          setDisplaySignedUp("Vous êtes inscrit et avez un token ! ");

          dispatch(token(data.token));
          onboarding(true);
          setEmail(null);
          setUsername(null);
          setPassword(null);
        }

        if (data.result == false) {
          onboarding = false;
          setDisplayError(data.error);
          setEmail(null);
          setUsername(null);
          setPassword(null);
        }
      })
      .catch((error) => {
        console.error("Erreur dans l'inscription:", error);
        setDisplayError(error);
        setEmail(null);
        setUsername(null);
        setPassword(null);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.textContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>S'inscrire avec mon email</Text>
      <Text style={styles.description}></Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse email</Text>
        <TextInput
          style={styles.input}
          label={"Adresse email"}
          onChangeText={(e) => setEmail(e)}
          keyboardType="email-address"
          value={email}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          label={"Nom d'utilisateur"}
          onChangeText={(e) => setUsername(e)}
          value={username}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          label={"Mot de passe"}
          secureTextEntry={showPassword ? false : true}
          onChangeText={(e) => setPassword(e)}
          value={showPassword ? password : password}
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

      <TouchableOpacity
        style={styles.signupbutton}
        activeOpacity={0.8}
        onPress={() => {
          handeleToSignUp();
        }}
      >
        <Text style={styles.signupbuttonText}>S'inscrire</Text>
      </TouchableOpacity>

      {displayError && <Text style={styles.error}>{displayError}</Text>}
      {displaySignedUp && <Text style={styles.valid}>{displaySignedUp}</Text>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    width: "90%",
    height: "50%",
  },
  title: {
    fontSize: 36,
    fontWeight: "500",
    color: Colors.DARK_GREEN,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.DARK_GREEN,
    marginVertical: 5,
  },
  inputContainer: {
    position: "relative",
    marginTop: 15,
    marginBottom: 15,
    width: "80%",
    alignSelf: "center",
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
    borderColor: Colors.DARK_GREEN,
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
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
  signupbutton: {
    marginTop: 30,
    alignSelf: "center",
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    width: "80%",
    backgroundColor: Colors.DARK_GREEN,
  },
  signupbuttonText: {
    textAlign: "center",
    color: Colors.YELLOW,
    fontSize: 16,
  },
  error: {
    marginTop: 10,

    textAlign: "center",
    width: "100%",
    color: "red",
  },
  valid: {
    marginTop: 10,
    textAlign: "center",
    width: "100%",
    color: "green",
  },
});

export default Signup;
