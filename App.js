import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import lists from "./reducers/lists";

import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import RecipeScreen from "./screens/RecipeScreen"; //je les mets dans le doute
import ListScreen from "./screens/ListScreen"; //je les mets dans le doute
import ModalScreen from "./screens/ModalScreen";

const store = configureStore({
  reducer: { user,lists },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Menu") {
            iconName = "./assets/menu.png"; //L'icone n'est pas trouvée
            return <Image source={require("./assets/menu.png")} />;
          } else if (route.name === "Search") {
            iconName = "./assets/search.png"; //L'icone n'est pas trouvée
            return <Image source={require("./assets/search.png")} />;
          } else if (route.name === "Profile") {
            iconName = "./assets/profile.png";
            return <Image source={require("./assets/profile.png")} />;
          }
        },
        tabBarActiveTintColor: "#E7D37F",
        tabBarInactiveTintColor: "#81A263",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#365E32",
          height: 75,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ tabBarLabel: "Menus" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: "Recettes" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Recipe" component={RecipeScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="RecipesModal" component={ModalScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
