
import React,{useRef,useState}from"react";
import{
View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,StatusBar,
ScrollView,KeyboardAvoidingView,Platform,ActivityIndicator
}from"react-native";
import{AUTH_URL}from"../constants/api";

const OTP=({route,navigation})=>{
const{email}=route.params;

const[otp,setOtp]=useState(["","","",""]);
const[verified,setVerified]=useState(false);
const[loading,setLoading]=useState(false);

const inputs=[
useRef(),
useRef(),
useRef(),
useRef()
];

const[focusedIndex,setFocusedField]=useState(0);

const handleChange=(text,idx)=>{
// if(/^\d?$/.test(text)){
// const newOtp=[...otp];
// newOtp[idx]=text;
// setOtp(newOtp);
//
// if(text&&idx<3)
// inputs[idx+1].current?.focus();
//
// if(!text&&idx>0)
// inputs[idx-1].current?.focus();
// }
};

const handleKeyPress=(e,idx)=>{
// if(
// e.nativeEvent.key==="Backspace"&&
// !otp[idx]&&
// idx>0
// ){
// inputs[idx-1].current?.focus();
// }
};

/*
const handleVerify=async()=>{
const fullOtp=otp.join("");

if(fullOtp.length!==4){
Alert.alert(
"Validation Error",
"Please enter all 4 digits of the verification code."
);
return;
}

setLoading(true);

try{

const response=await fetch(
`${AUTH_URL}/auth/verify-otp`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},
body:JSON.stringify({
email:email.trim(),
otp:fullOtp
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

setVerified(true);

Alert.alert(
"Success",
"OTP verified successfully!"
);

setTimeout(()=>{
navigation.navigate(
"Reset",
{
email:email.trim(),
otp:fullOtp
}
);
},800);

}else{

Alert.alert(
"Verification Failed",
responseData.message||
"Invalid security code entered."
);

}

}catch(err){

console.error(
"❌ OTP verification pipeline crash:",
err
);

Alert.alert(
"Network Error",
"Could not establish server authentication."
);

}finally{

setLoading(false);

}
};
*/

const handleVerify=()=>{
const fullOtp=otp.join("");
//
// if(fullOtp.length!==4){
// Alert.alert(
// "Validation Error",
// "Please enter all 4 digits."
// );
// return;
// }

navigation.navigate(
"Reset",
{
email:email.trim(),
otp:fullOtp
}
);
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
OTP Verification
</Text>

<Text style={styles.cardSubtitle}>
Enter the 4-digit verification code sent to your email.
</Text>

<Text style={styles.emailText}>
{email}
</Text>

<View style={styles.otpContainer}>

{otp.map((digit,idx)=>(
<TextInput
key={idx}
ref={inputs[idx]}
style={[
styles.otpInput,
focusedIndex===idx&&styles.focusBorder
]}
keyboardType="number-pad"
maxLength={1}
value={digit}
onFocus={()=>setFocusedField(idx)}
onChangeText={text=>handleChange(text,idx)}
onKeyPress={e=>handleKeyPress(e,idx)}
placeholder="-"
placeholderTextColor="#A5A198"
autoFocus={idx===0}
editable={!loading&&!verified}
/>
))}

</View>

<TouchableOpacity
style={[
styles.primaryBtn,
(loading||verified)&&styles.primaryBtnDisabled
]}
onPress={handleVerify}
disabled={loading||verified}
activeOpacity={0.85}
>

{loading?
<ActivityIndicator
color="#FFF"
size="small"
/>
:
<Text style={styles.primaryBtnText}>
{verified?"Verified":"Verify Code"}
</Text>
}

</TouchableOpacity>

{verified&&(
<Text style={styles.successText}>
Account verified successfully!
</Text>
)}

<View style={styles.footerRow}>

<TouchableOpacity
onPress={()=>navigation.goBack()}
activeOpacity={0.6}
>

<Text style={styles.footerLink}>
Change Email Address
</Text>

</TouchableOpacity>

</View>

</View>

</ScrollView>

</KeyboardAvoidingView>
);
};

export default OTP;

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
marginBottom:10
},

emailText:{
fontSize:14,
fontWeight:"700",
color:"#B8892D",
marginBottom:25
},

otpContainer:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:28,
width:"100%"
},

otpInput:{
width:58,
height:58,
borderRadius:14,
borderWidth:1,
borderColor:"#E5E1D8",
textAlign:"center",
fontSize:22,
fontWeight:"700",
color:"#252522",
backgroundColor:"#FFF"
},

focusBorder:{
borderColor:"#B8892D",
backgroundColor:"#FFF",
shadowColor:"#B8892D",
shadowOpacity:0.12,
shadowRadius:7,
elevation:2
},

primaryBtn:{
backgroundColor:"#252522",
borderRadius:14,
height:55,
alignItems:"center",
justifyContent:"center",
marginBottom:18
},

primaryBtnDisabled:{
opacity:0.65
},

primaryBtnText:{
color:"#FFFFFF",
fontSize:17,
fontWeight:"700"
},

successText:{
marginTop:2,
fontSize:14,
fontWeight:"600",
color:"#4F7A4F",
textAlign:"center"
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

