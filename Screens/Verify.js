import React,{useRef,useState,useEffect}from"react";
import{View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ToastAndroid,Platform,ActivityIndicator}from"react-native";
import axios from"axios";
import{AUTH_URL}from"../constants/api";

const OTP_LENGTH=4;

const Verify=({navigation,route})=>{
  const{email,type="VERIFICATION"}=route?.params||{};
  const[otp,setOtp]=useState(Array(OTP_LENGTH).fill(""));
  const[loading,setLoading]=useState(false);
  const[resending,setResending]=useState(false);

  const inputs=useRef([...Array(OTP_LENGTH)].map(()=>React.createRef()));
  const isOtpComplete=otp.every(d=>d!=="");

  useEffect(()=>{
    if(inputs.current[0]?.current){
      inputs.current[0].current.focus();
    }
  },[]);

  const handleChange=(value,index)=>{
    if(!/^\d?$/.test(value))return;
    const newOtp=[...otp];
    newOtp[index]=value;
    setOtp(newOtp);
    if(value&&index<OTP_LENGTH-1){
      inputs.current[index+1].current?.focus();
    }
    if(!value&&index>0){
      inputs.current[index-1].current?.focus();
    }
  };

  const handleVerify=async()=>{
    if(!isOtpComplete||loading)return;
    const otpCode=otp.join("");
    setLoading(true);
    try{
      const res=await axios.post(`${AUTH_URL}/api/auth/verify`,{
        email:email?.trim(),
        otp:otpCode,
        type:type
      });
      const data=res.data;
      if(Platform.OS==="android"){
        ToastAndroid.show("OTP Verified ✅",ToastAndroid.SHORT);
      }else{
        Alert.alert("Success","OTP Verified ✅");
      }
      if(type==="RESET"){
        navigation.navigate("ResetPassword",{email:email?.trim()});
      }else{
        navigation.replace("Login");
      }
    }catch(err){
      const message=typeof err.response?.data==="string"?err.response.data:err.response?.data?.message||"OTP verification failed";
      Alert.alert("Verification Failed",message);
    }finally{
      setLoading(false);
    }
  };

  const handleResend=async()=>{
    if(resending)return;
    setResending(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputs.current[0].current?.focus();
    try{
      await axios.post(`${AUTH_URL}/api/auth/forgot`,{email:email?.trim()});
      if(Platform.OS==="android"){
        ToastAndroid.show("OTP Resent 📩",ToastAndroid.SHORT);
      }else{
        Alert.alert("Success","OTP resent to your email");
      }
    }catch(err){
      const message=typeof err.response?.data==="string"?err.response.data:err.response?.data?.message||"Failed to resend OTP";
      Alert.alert("Error",message);
    }finally{
      setResending(false);
    }
  };

  return(
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logo}>SMR</Text>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent to {email||"your email"}</Text>
          <View style={styles.otpRow}>
            {otp.map((digit,i)=>(
                <TextInput
                    key={i}
                    ref={inputs.current[i]}
                    style={[styles.otpInput,digit&&styles.otpFilled]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={v=>handleChange(v,i)}
                />
            ))}
          </View>
          <TouchableOpacity
              style={[styles.button,(!isOtpComplete||loading)&&styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={!isOtpComplete||loading}
              activeOpacity={0.8}
          >
            {loading?<ActivityIndicator color="#0F172A"/>:<Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
            <Text style={styles.resendText}>{resending?"Resending...":"Resend OTP"}</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#F8FAFC",justifyContent:"center",paddingHorizontal:22},
  card:{backgroundColor:"#FFFFFF",borderRadius:24,padding:25,borderWidth:1,borderColor:"#E2E8F0",shadowColor:"#0F172A",shadowOffset:{width:0,height:5},shadowOpacity:0.08,shadowRadius:12,elevation:4},
  logo:{fontSize:26,fontWeight:"800",color:"#0F172A",letterSpacing:2,marginBottom:18},
  title:{fontSize:31,fontWeight:"800",color:"#0F172A",marginBottom:6},
  subtitle:{fontSize:15,lineHeight:22,color:"#64748B",marginBottom:27},
  otpRow:{flexDirection:"row",justifyContent:"space-between",marginBottom:30},
  otpInput:{width:58,height:60,borderRadius:14,borderWidth:1,borderColor:"#E2E8F0",textAlign:"center",fontSize:22,fontWeight:"700",backgroundColor:"#F8FAFC",color:"#0F172A"},
  otpFilled:{borderColor:"#91E612",backgroundColor:"#FFFFFF"},
  button:{backgroundColor:"#91E612",height:55,borderRadius:14,justifyContent:"center",alignItems:"center",marginTop:8},
  buttonDisabled:{opacity:0.65},
  buttonText:{color:"#0F172A",fontSize:17,fontWeight:"700"},
  resendBtn:{marginTop:22,alignItems:"center"},
  resendText:{color:"#10B981",fontSize:15,fontWeight:"700"}
});

export default Verify;