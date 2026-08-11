
import React,{useState}from"react";
import{
View,Text,Alert,ToastAndroid,StatusBar,StyleSheet,TextInput,
TouchableOpacity,ScrollView,Platform,ActivityIndicator,
KeyboardAvoidingView
}from"react-native";
import axios from"axios";
import{AUTH_URL}from"../constants/api";
import{useNavigation}from"@react-navigation/native";

const validateEmail=email=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register=()=>{
const navigation=useNavigation();

const[formData,setFormData]=useState({
name:"",
mail:"",
password:""
});
const[errors,setErrors]=useState({});
const[isLoading,setIsLoading]=useState(false);

const handleChange=(key,value)=>{
setFormData(prev=>({...prev,[key]:value}));
if(errors[key])setErrors(prev=>({...prev,[key]:null}));
};

const validateForm=()=>{
const e={};

if(!formData.name.trim())
e.name="Name required";

if(!validateEmail(formData.mail.trim()))
e.mail="Invalid email";

if(formData.password.length<6)
e.password="Minimum 6 characters";

setErrors(e);
return Object.keys(e).length===0;
};

const handleRegister=async()=>{
if(!validateForm())return;

setIsLoading(true);

try{
const payload={
name:formData.name.trim(),
mail:formData.mail.trim(),
password:formData.password
};

const res=await axios.post(
`${AUTH_URL}/auth/register`,
payload
);

const message=
typeof res.data==="string"
?res.data
:"Registration successful";

if(Platform.OS==="android"){
ToastAndroid.show(message,ToastAndroid.LONG);
navigation.navigate("Verify",{email:formData.mail});
}else{
Alert.alert(
"Registration Successful",
message,
[
{
text:"OK",
onPress:()=>navigation.navigate(
"Verify",
{email:formData.mail}
)
}
]
);
}

}catch(err){
console.log(
"[REGISTER]",
err.response?.data||err.message
);

const message=
typeof err.response?.data==="string"
?err.response.data
:err.response?.data?.message||
"Something went wrong. Please try again.";

Alert.alert("Registration Failed",message);

}finally{
setIsLoading(false);
}
};

const fields=[
{
label:"Full Name",
key:"name",
placeholder:"Enter your full name",
keyboardType:"default"
},
{
label:"Email Address",
key:"mail",
placeholder:"Enter your email",
keyboardType:"email-address"
},
{
label:"Password",
key:"password",
placeholder:"Create a password",
keyboardType:"default"
}
];

return(
<KeyboardAvoidingView
style={styles.container}
behavior={Platform.OS==="ios"?"padding":undefined}
>
<StatusBar
barStyle="dark-content"
backgroundColor="#F6F4EF"
/>

<ScrollView
contentContainerStyle={styles.scroll}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="handled"
>

<View style={styles.card}>

<Text style={styles.logo}>SMR</Text>

<Text style={styles.title}>Create Account</Text>

<Text style={styles.subtitle}>
Join SMR and travel with confidence.
</Text>

{fields.map(field=>(
<View
key={field.key}
style={styles.inputBlock}
>
<Text style={styles.label}>
{field.label}
</Text>

<View style={[
styles.inputBox,
errors[field.key]&&styles.errorBorder
]}>

<TextInput
style={styles.input}
placeholder={field.placeholder}
placeholderTextColor="#A5A198"
keyboardType={field.keyboardType}
secureTextEntry={field.key==="password"}
autoCapitalize={
field.key==="mail"?"none":"words"
}
autoCorrect={false}
value={formData[field.key]}
onChangeText={value=>
handleChange(field.key,value)
}
/>

</View>

{errors[field.key]&&(
<Text style={styles.errorText}>
{errors[field.key]}
</Text>
)}

</View>
))}

<TouchableOpacity
style={[
styles.button,
isLoading&&styles.buttonDisabled
]}
onPress={handleRegister}
disabled={isLoading}
activeOpacity={0.8}
>
{isLoading?
<ActivityIndicator color="#FFFFFF"/>:
<Text style={styles.buttonText}>
Create Account
</Text>
}
</TouchableOpacity>

<Text style={styles.loginText}>
Already have an account?{" "}
<Text
style={styles.loginLink}
onPress={()=>navigation.navigate("Login")}
>
Login
</Text>
</Text>

</View>

</ScrollView>
</KeyboardAvoidingView>
);
};

const styles=StyleSheet.create({
container:{
flex:1,
backgroundColor:"#F6F4EF"
},

scroll:{
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
shadowColor:"#252522",
shadowOffset:{width:0,height:5},
shadowOpacity:0.08,
shadowRadius:12,
elevation:4
},

logo:{
fontSize:26,
fontWeight:"800",
color:"#252522",
letterSpacing:2,
marginBottom:18
},

title:{
fontSize:31,
fontWeight:"800",
color:"#252522",
marginBottom:6
},

subtitle:{
fontSize:15,
lineHeight:22,
color:"#77736A",
marginBottom:27
},

inputBlock:{
marginBottom:16
},

label:{
fontSize:14,
fontWeight:"600",
color:"#252522",
marginBottom:7,
marginLeft:3
},

inputBox:{
height:55,
backgroundColor:"#FFF",
borderRadius:14,
borderWidth:1,
borderColor:"#E5E1D8",
paddingHorizontal:15,
justifyContent:"center"
},

input:{
flex:1,
fontSize:16,
color:"#252522"
},

errorBorder:{
borderColor:"#C0392B"
},

errorText:{
color:"#C0392B",
fontSize:12,
marginTop:5,
marginLeft:5
},

button:{
height:55,
backgroundColor:"#252522",
borderRadius:14,
justifyContent:"center",
alignItems:"center",
marginTop:8
},

buttonDisabled:{
opacity:0.65
},

buttonText:{
color:"#FFFFFF",
fontSize:17,
fontWeight:"700"
},

loginText:{
textAlign:"center",
marginTop:22,
fontSize:14,
color:"#77736A"
},

loginLink:{
color:"#B8892D",
fontWeight:"700"
}
});

export default Register;
