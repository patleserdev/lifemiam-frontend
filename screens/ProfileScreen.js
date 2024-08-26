import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { token, initRegimes } from "../reducers/user";
import Onboarding from "../components/Onboarding";
import Colors from "../utilities/color";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(token({ token: "" }));
    dispatch(initRegimes([]));
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding page="profile" />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleSignout()}
        >
          <Text style={styles.backButtonText}>Se déconnecter ?</Text>
          <FontAwesome
            name={"sign-out"}
            style={styles.backButtonIcon}
            size={50}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  backButton: {
    alignItems: "center",
    padding: 20,
  },
  backButtonText: {
    color: Colors.LIGHT_GREEN,
  },
  backButtonIcon: {
    color: Colors.LIGHT_GREEN,
  },
});
