
import React,{useState,useEffect}from"react";
import{
View,Text,StyleSheet,KeyboardAvoidingView,TextInput,
TouchableOpacity,ScrollView,Platform,ToastAndroid,Alert,
StatusBar,ActivityIndicator
}from"react-native";
import AsyncStorage from"@react-native-async-storage/async-storage";
// import Checkbox from "./Checkbox";
import{AUTH_URL}from"../constants/api";
// import{useAuth}from"../Context/AuthContext";

export default function Login({navigation}){

// const{login}=useAuth();

const[email,setEmail]=useState("");
const[password,setPassword]=useState("");
const[rememberMe,setRememberMe]=useState(false);
const[loading,setLoading]=useState(false);
const[showPass,setShowPass]=useState(false);

/*
useEffect(()=>{
const loadCredentials=async()=>{
console.log("🔁 Loading saved credentials...");

const savedEmail=await AsyncStorage.getItem("savedEmail");
const savedPassword=await AsyncStorage.getItem("savedPassword");
const savedRememberMe=await AsyncStorage.getItem("rememberMe");

if(savedRememberMe==="true"){
setEmail(savedEmail||"");
setPassword(savedPassword||"");
setRememberMe(true);
console.log("✅ Credentials restored");
}
};

loadCredentials();
},[]);

const handleLogin=async()=>{
console.log("🚀 [LOGIN] Button pressed");

if(!email.trim()||!password.trim()){
Alert.alert("Validation Error","Email & Password required");
return;
}

setLoading(true);

try{

console.log(
"📤 Sending login request to backend:",
{email}
);

const response=await fetch(
`${AUTH_URL}/auth/login`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);

const data=await response.json();

console.log(
"📥 Login API response received:",
data
);

if(!response.ok){
Alert.alert(
"Login Failed",
data.message||"Invalid credentials"
);
return;
}

const token=data.token;
const userId=data.userId;

if(!token||!userId){
console.error(
"❌ Required auth parameters missing"
);

Alert.alert(
"Login Error",
"Authentication parameters missing."
);

return;
}

await login(token,userId);

if(rememberMe){

await AsyncStorage.setItem(
"savedEmail",
email
);

await AsyncStorage.setItem(
"savedPassword",
password
);

await AsyncStorage.setItem(
"rememberMe",
"true"
);

}else{

await AsyncStorage.removeItem(
"savedPassword"
);

await AsyncStorage.setItem(
"rememberMe",
"false"
);
}

if(Platform.OS==="android"){
ToastAndroid.show(
"Login successful 🚀",
ToastAndroid.LONG
);
}

navigation.navigate("Initial");

}catch(err){

console.error(
"❌ [LOGIN ERROR]:",
err
);

Alert.alert(
"Error",
"Unable to establish network connection to ShieldX core."
);

}finally{

setLoading(false);

console.log(
"🏁 [LOGIN] Cycle Finished"
);

}
};
*/

return(
<KeyboardAvoidingView
style={styles.container}
behavior={
Platform.OS==="ios"
?"padding"
:undefined
}
>

<StatusBar
barStyle="dark-content"
backgroundColor="#F6F4EF"
/>

<ScrollView
style={styles.container}
contentContainerStyle={styles.scrollContent}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<View style={styles.card}>

<Text style={styles.logo}>
SMR
</Text>

<Text style={styles.cardTitle}>
Welcome Back
</Text>

<Text style={styles.cardSubtitle}>
Sign in to continue your safe journey with SMR.
</Text>

<View style={styles.fieldGroup}>

<Text style={styles.label}>
Email Address
</Text>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="you@example.com"
placeholderTextColor="#A5A198"
value={email}
autoCapitalize="none"
keyboardType="email-address"
autoCorrect={false}
onChangeText={setEmail}
/>

</View>

</View>

<View style={styles.fieldGroup}>

<Text style={styles.label}>
Password
</Text>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="Enter password"
placeholderTextColor="#A5A198"
secureTextEntry={!showPass}
value={password}
onChangeText={setPassword}
/>

<TouchableOpacity
onPress={()=>setShowPass(!showPass)}
style={styles.showBtn}
>

<Text style={styles.showBtnText}>
{showPass?"Hide":"Show"}
</Text>

</TouchableOpacity>

</View>

</View>

<View style={styles.rememberMeContainer}>

<View style={styles.checkboxWrapper}>
{/* Remember Me can be added later */}
</View>

<TouchableOpacity
onPress={()=>navigation.navigate("Email")}
>

<Text style={styles.forgotPasswordText}>
Forgot Password?
</Text>

</TouchableOpacity>

</View>

<TouchableOpacity
style={styles.primaryBtn}
activeOpacity={0.85}
onPress={()=>{
/*
handleLogin();
*/
navigation.navigate("Initial");
}}
>

<Text style={styles.primaryBtnText}>
Login
</Text>

</TouchableOpacity>

<View style={styles.footerRow}>

<Text style={styles.footerText}>
Don't have an account?{" "}
</Text>

<TouchableOpacity
onPress={()=>navigation.navigate("Register")}
>

<Text style={styles.footerLink}>
Register
</Text>

</TouchableOpacity>

</View>

</View>

</ScrollView>

</KeyboardAvoidingView>
);
}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F6F4EF"
},

scrollContent:{
flexGrow:1,
justifyContent:"center",
padding:22,
paddingVertical:35
},

card:{
backgroundColor:"#FFFFFF",
marginHorizontal:0,
borderRadius:24,
padding:25,
borderWidth:1,
borderColor:"#E5E1D8",
elevation:4,
shadowColor:"#252522",
shadowOffset:{
width:0,
height:5
},
shadowOpacity:0.08,
shadowRadius:12
},

logo:{
fontSize:26,
fontWeight:"800",
color:"#252522",
letterSpacing:2,
marginBottom:18
},

cardTitle:{
fontSize:31,
fontWeight:"800",
color:"#252522",
marginBottom:6
},

cardSubtitle:{
fontSize:15,
lineHeight:22,
color:"#77736A",
marginBottom:27
},

fieldGroup:{
marginBottom:17
},

label:{
fontSize:14,
fontWeight:"600",
color:"#252522",
marginBottom:7,
marginLeft:3
},

inputRow:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#FFFFFF",
borderRadius:14,
borderWidth:1,
borderColor:"#E5E1D8",
paddingHorizontal:15,
height:55
},

input:{
flex:1,
fontSize:16,
color:"#252522"
},

showBtn:{
paddingLeft:10
},

showBtnText:{
fontSize:13,
color:"#B8892D",
fontWeight:"700"
},

rememberMeContainer:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
width:"100%",
marginBottom:20,
marginTop:2
},

checkboxWrapper:{
flex:1,
alignItems:"flex-start"
},

forgotPasswordText:{
color:"#B8892D",
fontSize:14,
fontWeight:"700"
},

primaryBtn:{
backgroundColor:"#252522",
borderRadius:14,
height:55,
alignItems:"center",
justifyContent:"center",
marginBottom:18
},

primaryBtnText:{
color:"#FFF",
fontSize:17,
fontWeight:"700"
},

footerRow:{
flexDirection:"row",
justifyContent:"center",
marginTop:5
},

footerText:{
fontSize:14,
color:"#77736A",
fontWeight:"500"
},

footerLink:{
fontSize:14,
color:"#B8892D",
fontWeight:"700"
}

});

