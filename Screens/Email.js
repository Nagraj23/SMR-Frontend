
import React,{useState}from"react";
import{
View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,StatusBar,
ScrollView,KeyboardAvoidingView,Platform,ActivityIndicator
}from"react-native";
import{AUTH_URL}from"../constants/api";

const Email=({navigation})=>{
const[email,setEmail]=useState("");
const[loading,setLoading]=useState(false);

/*
const handleSendOtp=async()=>{

if(!email||email.trim()===""){
Alert.alert(
"Validation Error",
"Please enter your registered email address."
);
return;
}

const emailRegex=
/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

if(!emailRegex.test(email.trim())){
Alert.alert(
"Validation Error",
"Please enter a valid email address."
);
return;
}

setLoading(true);

try{

const targetEmail=email.trim();

const response=await fetch(
`${AUTH_URL}/auth/forgot-password`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},
body:JSON.stringify({
email:targetEmail
})
}
);

const responseText=await response.text();

let responseData={};

try{
if(responseText&&responseText.trim()!==""){
responseData=JSON.parse(responseText);
}
}catch(parseError){
responseData={
message:responseText
};
}

if(response.ok){

Alert.alert(
"OTP Transmitted",
responseData.message||
"A verification code has been dispatched to your inbox."
);

navigation.navigate(
"OTP",
{email:targetEmail}
);

}else{

Alert.alert(
"Authentication Failure",
responseData.message||
`Server returned status code: ${response.status}`
);

}

}catch(error){

console.error(
"❌ Forgot Password API pipeline crash:",
error
);

Alert.alert(
"Network Timeout",
"Failed to establish handshake connection with ShieldX security servers."
);

}finally{

loadingStatusReset();

}
};

const loadingStatusReset=()=>{
setLoading(false);
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
Forgot Password?
</Text>

<Text style={styles.cardSubtitle}>
Enter your registered email address and we'll
help you recover your account.
</Text>

<View style={styles.fieldGroup}>

<Text style={styles.label}>
Registered Email
</Text>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="you@example.com"
placeholderTextColor="#A5A198"
keyboardType="email-address"
value={email}
onChangeText={setEmail}
autoCapitalize="none"
autoCorrect={false}
editable={!loading}
/>

</View>

</View>

<TouchableOpacity
style={[
styles.primaryBtn,
loading&&styles.primaryBtnDisabled
]}
disabled={loading}
activeOpacity={0.85}
onPress={()=>{

/*
handleSendOtp();
*/

navigation.navigate(
"OTP",
{email:email.trim()}
);

}}
>

{loading?
<ActivityIndicator
color="#FFF"
size="small"
/>
:
<Text style={styles.primaryBtnText}>
Send OTP
</Text>
}

</TouchableOpacity>

<View style={styles.footerRow}>

<TouchableOpacity
onPress={()=>navigation.goBack()}
activeOpacity={0.6}
>

<Text style={styles.footerLink}>
Back to Login
</Text>

</TouchableOpacity>

</View>

</View>

</ScrollView>

</KeyboardAvoidingView>
);
};

export default Email;

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
fontSize:30,
fontWeight:"800",
color:"#252522",
marginBottom:7
},

cardSubtitle:{
fontSize:15,
lineHeight:22,
color:"#77736A",
marginBottom:27
},

fieldGroup:{
marginBottom:20
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

primaryBtn:{
backgroundColor:"#252522",
borderRadius:14,
height:55,
alignItems:"center",
justifyContent:"center",
marginTop:6,
marginBottom:18
},

primaryBtnDisabled:{
opacity:0.7
},

primaryBtnText:{
color:"#FFFFFF",
fontSize:17,
fontWeight:"700"
},

footerRow:{
flexDirection:"row",
justifyContent:"center",
marginTop:5
},

footerLink:{
fontSize:14,
color:"#B8892D",
fontWeight:"700"
}

});

