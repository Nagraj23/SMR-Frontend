
import React,{useRef,useState}from"react";
import{View,FlatList,Image,Dimensions,StyleSheet,Text,TouchableOpacity}from"react-native";

const{width,height}=Dimensions.get("window");

const images=[
{id:"1",uri:require("../assets/safetyr.png"),title:"Your Safety, Our Priority.",description:"Travel confidently with tools designed to keep you safe, informed, and connected."},
{id:"2",uri:require("../assets/sos.png"),title:"Travel Together, Travel Safer.",description:"Find trusted rides, connect with verified users, and travel with confidence."},
{id:"3",uri:require("../assets/SAFETYT.png"),title:"Smart Travel Starts Here.",description:"Discover safer rides and stay connected throughout your journey."}
];

const Star=({navigation})=>{
const flatListRef=useRef(null);
const[activeIndex,setActiveIndex]=useState(0);

const onViewableItemsChanged=({viewableItems})=>{
if(viewableItems.length>0&&viewableItems[0].index!==null)
setActiveIndex(viewableItems[0].index);
};

const handleGetStarted=()=>{
if(activeIndex<images.length-1)
flatListRef.current?.scrollToIndex({
index:activeIndex+1,
animated:true
});
else navigation.navigate("Auth");
};

return(
<View style={styles.container}>

<FlatList
ref={flatListRef}
data={images}
horizontal
pagingEnabled
showsHorizontalScrollIndicator={false}
keyExtractor={item=>item.id}
renderItem={({item})=>(
<View style={styles.slide}>

<View style={styles.card}>

<Text style={styles.logo}>SMR</Text>

<Text style={styles.title}>
{item.title}
</Text>

<Image
source={item.uri}
style={styles.image}
/>

<Text style={styles.description}>
{item.description}
</Text>

</View>

</View>
)}
onViewableItemsChanged={onViewableItemsChanged}
viewabilityConfig={{viewAreaCoveragePercentThreshold:50}}
/>

<View style={styles.dotsContainer}>
{images.map((_,index)=>(
<View
key={index}
style={[
styles.dot,
activeIndex===index&&styles.activeDot
]}
/>
))}
</View>

<View style={styles.buttonContainer}>

<TouchableOpacity
style={styles.skipButton}
onPress={()=>navigation.navigate("Register")}
activeOpacity={0.8}
>
<Text style={styles.skipText}>Skip</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.nextButton}
onPress={handleGetStarted}
activeOpacity={0.8}
>
<Text style={styles.nextText}>
{activeIndex===images.length-1?"Start":"Next →"}
</Text>
</TouchableOpacity>

</View>

</View>
);
};

const styles=StyleSheet.create({
container:{
flex:1,
backgroundColor:"#F6F4EF"
},

slide:{
width,
alignItems:"center",
justifyContent:"center",
paddingHorizontal:20
},

card:{
width:"100%",
backgroundColor:"#FFFFFF",
borderRadius:26,
paddingHorizontal:20,
paddingVertical:25,
alignItems:"center",
borderWidth:1,
borderColor:"#E5E1D8",
shadowColor:"#252522",
shadowOffset:{width:0,height:5},
shadowOpacity:0.08,
shadowRadius:12,
elevation:4
},

logo:{
fontSize:32,
fontWeight:"800",
color:"#252522",
letterSpacing:2,
marginBottom:15
},

title:{
fontSize:28,
fontWeight:"800",
color:"#252522",
textAlign:"center",
marginBottom:15
},

image:{
width:width*.78,
height:height*.38,
resizeMode:"contain",
marginBottom:15
},

description:{
fontSize:16,
lineHeight:25,
color:"#77736A",
textAlign:"center",
paddingHorizontal:15
},

dotsContainer:{
flexDirection:"row",
justifyContent:"center",
alignItems:"center",
marginBottom:20
},

dot:{
width:8,
height:8,
borderRadius:4,
backgroundColor:"#D8D4CB",
marginHorizontal:4
},

activeDot:{
width:22,
backgroundColor:"#B8892D"
},

buttonContainer:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingHorizontal:35,
marginBottom:30
},

skipButton:{
backgroundColor:"#FFFFFF",
borderColor:"#E5E1D8",
borderWidth:1,
paddingVertical:11,
paddingHorizontal:22,
borderRadius:20
},

skipText:{
color:"#252522",
fontSize:16,
fontWeight:"600"
},

nextButton:{
backgroundColor:"#252522",
paddingVertical:11,
paddingHorizontal:24,
borderRadius:20
},

nextText:{
color:"#FFFFFF",
fontSize:16,
fontWeight:"700"
}
});

export default Star;

