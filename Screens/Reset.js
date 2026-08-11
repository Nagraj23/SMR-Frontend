
import React,{useState,useEffect}from"react";
import{
View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,StatusBar,
ScrollView,KeyboardAvoidingView,Platform,ActivityIndicator
}from"react-native";
import{AUTH_URL}from"../constants/api";

const ResetPassword=({route,navigation})=>{

const{email,otp}=route.params;

const[newPassword,setNewPassword]=useState("");
const[confirmPassword,setConfirmPassword]=useState("");
const[loading,setLoading]=useState(false);
const[showNewPass,setShowNewPass]=useState(false);
const[showConfirmPass,setShowConfirmPass]=useState(false);

useEffect(()=>{
console.log("📥 Verification Target Route State Bindings:");
console.log("Email target:",email);
console.log("OTP payload context:",otp);
},[]);

/*
const handleReset=async()=>{

if(!newPassword||!confirmPassword){
Alert.alert(
"Validation Error",
"Please fill in all security parameter fields."
);
return;
}

if(newPassword.length<6){
Alert.alert(
"Validation Error",
"Password must be at least 6 characters long."
);
return;
}

if(newPassword!==confirmPassword){
Alert.alert(
"Validation Error",
"The entered passwords do not match."
);
return;
}

setLoading(true);

try{

const response=await fetch(
`${AUTH_URL}/auth/reset-password`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},
body:JSON.stringify({
email:email.trim(),
otp:otp.trim(),
newPassword:newPassword
})
}
);

const responseText=await response.text();

let responseData={};

try{
if(
responseText&&
responseText.trim()!==""
){
responseData=JSON.parse(responseText);
}
}catch(e){
responseData={
message:responseText
};
}

if(response.ok){

Alert.alert(
"Success",
responseData.message||
"Your password has been successfully updated!"
);

navigation.navigate("Login");

}else{

Alert.alert(
"Error",
responseData.message||
"Failed to update account password."
);

}

}catch(error){

console.error(
"❌ Reset password API pipeline error:",
error
);

Alert.alert(
"Network Timeout",
"Failed to communicate with ShieldX security cluster gateways."
);

}finally{

setLoading(false);

}

};
*/

const handleReset=()=>{

if(!newPassword||!confirmPassword){
Alert.alert(
"Validation Error",
"Please enter both passwords."
);
return;
}

if(newPassword!==confirmPassword){
Alert.alert(
"Validation Error",
"Passwords do not match."
);
return;
}

navigation.navigate("Login");

};

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
Create New Password
</Text>

<Text style={styles.cardSubtitle}>
Your account has been verified. Create a new secure password to continue.
</Text>

<View style={styles.successBadgeContainer}>

<Text style={styles.successText}>
✓ Account Verified
</Text>

</View>

<View style={styles.fieldGroup}>

<Text style={styles.label}>
New Password
</Text>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="Enter new password"
placeholderTextColor="#A5A198"
secureTextEntry={!showNewPass}
value={newPassword}
onChangeText={setNewPassword}
autoCapitalize="none"
autoCorrect={false}
editable={!loading}
/>

<TouchableOpacity
onPress={()=>setShowNewPass(!showNewPass)}
style={styles.showBtn}
activeOpacity={0.6}
>

<Text style={styles.showBtnText}>
{showNewPass?"Hide":"Show"}
</Text>

</TouchableOpacity>

</View>

</View>

<View style={styles.fieldGroup}>

<Text style={styles.label}>
Confirm Password
</Text>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="Confirm new password"
placeholderTextColor="#A5A198"
secureTextEntry={!showConfirmPass}
value={confirmPassword}
onChangeText={setConfirmPassword}
autoCapitalize="none"
autoCorrect={false}
editable={!loading}
/>

<TouchableOpacity
onPress={()=>setShowConfirmPass(!showConfirmPass)}
style={styles.showBtn}
activeOpacity={0.6}
>

<Text style={styles.showBtnText}>
{showConfirmPass?"Hide":"Show"}
</Text>

</TouchableOpacity>

</View>

</View>

<TouchableOpacity
style={[
styles.primaryBtn,
loading&&styles.primaryBtnDisabled
]}
onPress={handleReset}
disabled={loading}
activeOpacity={0.85}
>

{loading?
<ActivityIndicator
color="#FFF"
size="small"
/>
:
<Text style={styles.primaryBtnText}>
Reset Password
</Text>
}

</TouchableOpacity>

</View>

</ScrollView>

</KeyboardAvoidingView>
);
};

export default ResetPassword;

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
marginBottom:22
},

successBadgeContainer:{
backgroundColor:"#F7F3E8",
borderColor:"#E8D9B8",
borderWidth:1,
paddingVertical:11,
paddingHorizontal:15,
borderRadius:14,
alignItems:"center",
marginBottom:24
},

successText:{
fontSize:14,
fontWeight:"700",
color:"#8A6828"
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
paddingLeft:8
},

showBtnText:{
fontSize:12,
color:"#B8892D",
fontWeight:"700"
},

primaryBtn:{
backgroundColor:"#252522",
borderRadius:14,
height:55,
alignItems:"center",
justifyContent:"center",
marginTop:8,
marginBottom:5
},

primaryBtnDisabled:{
opacity:0.7
},

primaryBtnText:{
color:"#FFFFFF",
fontSize:17,
fontWeight:"700"
}

});

